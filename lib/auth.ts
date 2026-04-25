import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { getSupabaseServer } from './supabase-server'
import { generateUserID } from './generate-user-id'

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-change-in-production'

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

/**
 * Compare a plain password with a hash
 */
export async function verifyPassword(
  plainPassword: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(plainPassword, hash)
}

/**
 * Create a JWT token
 */
export function createToken(
  userId: string,
  userEmail: string,
  role: string,
  expiresIn: string = '7d'
) {
  return jwt.sign(
    {
      userId,
      email: userEmail,
      role,
    },
    JWT_SECRET,
    { expiresIn }
  )
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as {
      userId: string
      email: string
      role: string
    }
  } catch (error) {
    console.error('[v0] Token verification failed:', error)
    return null
  }
}

/**
 * Generate a 6-digit verification code
 */
export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

/**
 * Authenticate user and return user data with token
 */
export async function authenticateUser(email: string, password: string) {
  const supabase = getSupabaseServer()

  // Get user from database
  const { data: users, error: selectError } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single()

  if (selectError || !users) {
    return {
      success: false,
      error: 'Invalid email or password',
    }
  }

  // Verify password
  const passwordValid = await verifyPassword(password, users.password_hash)

  if (!passwordValid) {
    return {
      success: false,
      error: 'Invalid email or password',
    }
  }

  // Check if user is active
  if (users.status !== 'active') {
    return {
      success: false,
      error: 'Account is inactive',
    }
  }

  // Create token
  const token = createToken(users.user_id, users.email, users.role)

  return {
    success: true,
    user: {
      id: users.id,
      userId: users.user_id,
      email: users.email,
      fullName: users.full_name,
      role: users.role,
    },
    token,
  }
}

/**
 * Create a new user
 */
export async function createUser(
  email: string,
  password: string,
  fullName: string,
  phone?: string
) {
  const supabase = getSupabaseServer()

  // Check if user already exists
  const { data: existingUser } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single()

  if (existingUser) {
    return {
      success: false,
      error: 'Email already registered',
    }
  }

  // Hash password
  const passwordHash = await hashPassword(password)

  // Generate user ID
  const userId = generateUserID()

  // Create user
  const { data: user, error } = await supabase
    .from('users')
    .insert({
      user_id: userId,
      email,
      password_hash: passwordHash,
      full_name: fullName,
      phone,
      role: 'member',
      status: 'active',
    })
    .select()
    .single()

  if (error) {
    console.error('[v0] Error creating user:', error)
    return {
      success: false,
      error: error.message || 'Failed to create user',
    }
  }

  return {
    success: true,
    user: {
      id: user.id,
      userId: user.user_id,
      email: user.email,
      fullName: user.full_name,
    },
  }
}

/**
 * Request password reset
 */
export async function requestPasswordReset(email: string) {
  const supabase = getSupabaseServer()

  // Get user
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single()

  if (userError || !user) {
    // Don't reveal if email exists for security
    return {
      success: true,
      message: 'If an account exists, a reset code will be sent',
    }
  }

  // Generate reset code
  const code = generateVerificationCode()

  // Create reset token (expires in 15 minutes)
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString()

  const { error: insertError } = await supabase
    .from('reset_tokens')
    .insert({
      user_id: user.id,
      code,
      expires_at: expiresAt,
    })

  if (insertError) {
    console.error('[v0] Error creating reset token:', insertError)
    return {
      success: false,
      error: 'Failed to generate reset code',
    }
  }

  // In a real app, send email with code
  // For now, just log it for development
  console.log('[v0] Reset code for', email, ':', code)

  return {
    success: true,
    message: 'Reset code sent to email',
    // For development only - remove in production
    code,
  }
}

/**
 * Verify reset code and reset password
 */
export async function verifyAndResetPassword(
  email: string,
  code: string,
  newPassword: string
) {
  const supabase = getSupabaseServer()

  // Get user
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single()

  if (userError || !user) {
    return {
      success: false,
      error: 'User not found',
    }
  }

  // Get reset token
  const { data: resetToken, error: tokenError } = await supabase
    .from('reset_tokens')
    .select('*')
    .eq('user_id', user.id)
    .eq('code', code)
    .is('used_at', null)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (tokenError || !resetToken) {
    return {
      success: false,
      error: 'Invalid reset code',
    }
  }

  // Check if token is expired
  if (new Date(resetToken.expires_at) < new Date()) {
    return {
      success: false,
      error: 'Reset code has expired',
    }
  }

  // Hash new password
  const passwordHash = await hashPassword(newPassword)

  // Update user password
  const { error: updateError } = await supabase
    .from('users')
    .update({ password_hash: passwordHash })
    .eq('id', user.id)

  if (updateError) {
    console.error('[v0] Error resetting password:', updateError)
    return {
      success: false,
      error: 'Failed to reset password',
    }
  }

  // Mark token as used
  await supabase
    .from('reset_tokens')
    .update({ used_at: new Date().toISOString() })
    .eq('id', resetToken.id)

  return {
    success: true,
    message: 'Password reset successfully',
  }
}
