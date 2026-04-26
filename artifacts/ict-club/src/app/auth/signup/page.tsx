
import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from '@/lib/next-shim'
import { Link } from 'wouter'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { User, Mail, Lock, AlertCircle, Eye, EyeOff, Check, X, ArrowRight } from 'lucide-react'

function SignupForm() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [nameError, setNameError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [agreed, setAgreed] = useState(false)

  useEffect(() => {
    const errorParam = searchParams.get('error')
    if (errorParam) {
      setError(`OAuth error: ${errorParam}`)
    }
  }, [searchParams])

  const getPasswordRequirements = () => {
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*]/.test(password),
    }
  }

  const checkPasswordStrength = (pwd: string) => {
    let strength = 0
    if (pwd.length >= 8) strength++
    if (/[A-Z]/.test(pwd)) strength++
    if (/[0-9]/.test(pwd)) strength++
    if (/[!@#$%^&*]/.test(pwd)) strength++
    setPasswordStrength(strength)
  }

  const validateForm = () => {
    let isValid = true
    setNameError('')
    setEmailError('')
    setPasswordError('')
    setError('')

    if (!fullName.trim()) {
      setNameError('Full name is required')
      isValid = false
    } else if (fullName.trim().length < 2) {
      setNameError('Full name must be at least 2 characters')
      isValid = false
    }

    if (!email.trim()) {
      setEmailError('Email is required')
      isValid = false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Please enter a valid email')
      isValid = false
    }

    if (!password) {
      setPasswordError('Password is required')
      isValid = false
    } else if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters')
      isValid = false
    }

    if (!agreed) {
      setError('You must agree to the terms and conditions')
      isValid = false
    }

    return isValid
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, fullName }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Signup failed')
      }

      // Show success state before redirecting
      setLoading(false)
      await new Promise(resolve => setTimeout(resolve, 500))

      const redirectUrl = data.user.role === 'admin' ? '/admin' : '/dashboard'
      router.push(redirectUrl)
    } catch (err: any) {
      console.error('[v0] Signup error:', err)
      setError(err.message || 'Signup failed. Please try again.')
      setLoading(false)
    }
  }

  const handleGoogleSignup = () => {
    const params = new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
      redirect_uri: `${window.location.origin}/api/auth/callback/google`,
      response_type: 'code',
      scope: 'openid email profile',
    })
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  }

  const handleGitHubSignup = () => {
    const params = new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID || '',
      redirect_uri: `${window.location.origin}/api/auth/callback/github`,
      scope: 'user:email',
    })
    window.location.href = `https://github.com/login/oauth/authorize?${params.toString()}`
  }

  const requirements = getPasswordRequirements()

  return (
    <div className="w-full">
      <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-gray-100">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl mb-4 shadow-lg">
            <User className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Join the Club</h1>
          <p className="text-gray-600 text-base">Create your ICT Club account in seconds</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3 animate-shake">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* OAuth Buttons */}
        <div className="space-y-3 mb-6">
          <button 
            onClick={handleGoogleSignup} 
            type="button" 
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border-2 border-gray-200 rounded-xl hover:border-green-400 hover:bg-green-50 transition-all duration-200 font-medium text-gray-700 hover:text-gray-900"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Sign up with Google
          </button>
          <button 
            onClick={handleGitHubSignup} 
            type="button" 
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all duration-200 font-medium hover:shadow-lg"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            Sign up with GitHub
          </button>
        </div>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-white text-gray-500 font-medium">Or sign up with email</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSignup} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <Input 
                id="name"
                placeholder="John Doe" 
                value={fullName} 
                onChange={(e) => { setFullName(e.target.value); setNameError('') }} 
                className="pl-10 py-3 border-2 border-gray-200 focus:border-green-500 focus:outline-none transition-colors"
                required 
              />
            </div>
            {nameError && <p className="text-sm text-red-600 mt-2 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{nameError}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <Input 
                id="email"
                type="email" 
                placeholder="name@example.com" 
                value={email} 
                onChange={(e) => { setEmail(e.target.value); setEmailError('') }} 
                className="pl-10 py-3 border-2 border-gray-200 focus:border-green-500 focus:outline-none transition-colors"
                required 
              />
            </div>
            {emailError && <p className="text-sm text-red-600 mt-2 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{emailError}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <Input 
                id="password"
                type={showPassword ? 'text' : 'password'} 
                placeholder="Create a strong password" 
                value={password} 
                onChange={(e) => { 
                  setPassword(e.target.value)
                  checkPasswordStrength(e.target.value)
                  setPasswordError('') 
                }} 
                className="pl-10 pr-12 py-3 border-2 border-gray-200 focus:border-green-500 focus:outline-none transition-colors"
                required 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {passwordError && <p className="text-sm text-red-600 mt-2 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{passwordError}</p>}
            
            {/* Password Strength Indicator */}
            {password && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex gap-1 mb-3">
                  {[1, 2, 3, 4].map((level) => (
                    <div 
                      key={level} 
                      className={`flex-1 h-2 rounded-full transition-all ${
                        level <= passwordStrength 
                          ? level === 1 ? 'bg-red-500' : level === 2 ? 'bg-yellow-500' : level === 3 ? 'bg-blue-500' : 'bg-green-500'
                          : 'bg-gray-200'
                      }`} 
                    />
                  ))}
                </div>
                <p className="text-xs font-medium text-gray-700 mb-2">
                  {passwordStrength === 1 && 'Weak - Add more characters'}
                  {passwordStrength === 2 && 'Fair - Add uppercase or numbers'}
                  {passwordStrength === 3 && 'Good - Add special characters'}
                  {passwordStrength === 4 && 'Strong password!'}
                  {passwordStrength === 0 && 'Password strength'}
                </p>
                
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    {requirements.length ? <Check className="w-4 h-4 text-green-500" /> : <X className="w-4 h-4 text-gray-300" />}
                    <span className={requirements.length ? 'text-green-700' : 'text-gray-500'}>At least 8 characters</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {requirements.uppercase ? <Check className="w-4 h-4 text-green-500" /> : <X className="w-4 h-4 text-gray-300" />}
                    <span className={requirements.uppercase ? 'text-green-700' : 'text-gray-500'}>One uppercase letter</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {requirements.number ? <Check className="w-4 h-4 text-green-500" /> : <X className="w-4 h-4 text-gray-300" />}
                    <span className={requirements.number ? 'text-green-700' : 'text-gray-500'}>One number</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {requirements.special ? <Check className="w-4 h-4 text-green-500" /> : <X className="w-4 h-4 text-gray-300" />}
                    <span className={requirements.special ? 'text-green-700' : 'text-gray-500'}>One special character (!@#$%)</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <label className="flex items-start gap-3 cursor-pointer mt-6">
            <input 
              type="checkbox" 
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="w-4 h-4 rounded border-2 border-gray-300 accent-green-500 mt-1 flex-shrink-0" 
            />
            <span className="text-gray-600 text-sm">
              I agree to the <a href="#" className="text-green-600 hover:text-green-700 font-medium">Terms of Service</a> and <a href="#" className="text-green-600 hover:text-green-700 font-medium">Privacy Policy</a>
            </span>
          </label>

          <Button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Creating account...</span>
              </>
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </form>

        {/* Footer */}
        <p className="text-center mt-6 text-gray-600 text-sm">
          Already have an account?{' '}
          <Link 
            href="/auth/login" 
            className="text-green-600 hover:text-green-700 font-semibold transition-colors"
          >
            Sign in here
          </Link>
        </p>
      </div>

      {/* Decorative elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-200 rounded-full blur-3xl opacity-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-200 rounded-full blur-3xl opacity-10"></div>
      </div>
    </div>
  )
}

export default function SignupPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50 p-4 relative">
      <div className="w-full max-w-md">
        <Suspense fallback={
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 flex items-center justify-center min-h-[600px]">
            <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
          </div>
        }>
          <SignupForm />
        </Suspense>
      </div>
    </main>
  )
}
