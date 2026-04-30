'use client'

import { useState, Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase/client'
import { Mail, Lock } from 'lucide-react'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const err = searchParams.get('error')
    if (err) setError(err)
  }, [searchParams])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/dashboard')
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
    <div className="w-full max-w-md bg-white/80 backdrop-blur-xl border shadow-2xl rounded-2xl p-8">
      
      {/* LOGO */}
      <div className="text-center mb-6">
        <div className="text-3xl font-bold text-purple-600">
          NexoraTech
        </div>
        <p className="text-sm text-gray-500">Welcome back 👋</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-2 rounded mb-3 text-sm">
          {error}
        </div>
      )}

      {/* OAuth */}
      <div className="space-y-2 mb-4">
        <button
          onClick={() => handleOAuth('google')}
          className="w-full border py-2 rounded-lg hover:bg-gray-50 transition"
        >
          Continue with Google
        </button>

        <button
          onClick={() => handleOAuth('github')}
          className="w-full border py-2 rounded-lg hover:bg-gray-50 transition"
        >
          Continue with GitHub
        </button>
      </div>

      <div className="text-center text-xs text-gray-400 mb-4">OR</div>

      {/* FORM */}
      <form onSubmit={handleLogin} className="space-y-3">
        <div className="relative">
          <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <Input
            className="pl-9"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <Input
            type="password"
            className="pl-9"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <Button className="w-full" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </form>

      <p className="text-center text-sm mt-4">
        No account?{' '}
        <Link className="text-purple-600 font-medium" href="/auth/signup">
          Sign up
        </Link>
      </p>
    </div>
  )
}

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-white to-blue-100">
      <Suspense fallback={<div>Loading...</div>}>
        <LoginForm />
      </Suspense>
    </main>
  )
}