'use client'

import { useState, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

function SignupForm() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    if (data.user) {
      router.push('/dashboard')
    }
  }

  const handleOAuth = async (provider: 'google' | 'github') => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  return (
    <div className="bg-white p-8 rounded-xl shadow-xl">
      <h1 className="text-2xl font-bold mb-4">Signup</h1>

      {error && <p className="text-red-500">{error}</p>}

      {/* OAuth FIXED */}
      <button onClick={() => handleOAuth('google')}>
        Continue with Google
      </button>

      <button onClick={() => handleOAuth('github')}>
        Continue with GitHub
      </button>

      <form onSubmit={handleSignup} className="space-y-3 mt-4">
        <Input
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

        <Input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Account'}
        </Button>
      </form>

      <p className="mt-4">
        Already have account? <Link href="/auth/login">Login</Link>
      </p>
    </div>
  )
}

export default function SignupPage() {
  return (
    <main className="flex justify-center items-center min-h-screen">
      <Suspense fallback={<div>Loading...</div>}>
        <SignupForm />
      </Suspense>
    </main>
  )
}