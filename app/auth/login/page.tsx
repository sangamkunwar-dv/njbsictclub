'use client'

import { useState, Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase/client'

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
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }
    router.push('/dashboard')
  }

  return (
    <div className="w-full max-w-sm px-4">
      {/* Spotify-style Logo Header */}
      <div className="flex justify-center mb-10">
        <div className="text-3xl font-black tracking-tighter text-black dark:text-white">
          Nexora<span className="text-[#1DB954]">.</span>
        </div>
      </div>

      <h1 className="text-3xl font-bold text-center mb-8 tracking-tight text-black dark:text-white">
        Log in to Nexora
      </h1>

      {error && (
        <div className="bg-red-500 text-white p-3 rounded-sm mb-4 text-sm font-semibold text-center">
          {error}
        </div>
      )}

      {/* OAuth Section */}
      <div className="space-y-3 mb-6">
        <Button 
          variant="outline" 
          onClick={() => supabase.auth.signInWithOAuth({ provider: 'google' })}
          className="w-full rounded-full border-gray-400 py-6 font-bold hover:border-black dark:hover:border-white transition-all bg-transparent"
        >
          Continue with Google
        </Button>
        <Button 
          variant="outline"
          onClick={() => supabase.auth.signInWithOAuth({ provider: 'github' })}
          className="w-full rounded-full border-gray-400 py-6 font-bold hover:border-black dark:hover:border-white transition-all bg-transparent"
        >
          Continue with GitHub
        </Button>
      </div>

      <hr className="border-gray-200 dark:border-zinc-800 mb-8" />

      {/* Form Section */}
      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label className="text-sm font-bold mb-2 block text-black dark:text-white">Email address</label>
          <Input
            className="rounded-md border-gray-400 dark:bg-zinc-900 dark:border-zinc-700 focus:ring-2 focus:ring-white"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-bold mb-2 block text-black dark:text-white">Password</label>
          <Input
            type="password"
            className="rounded-md border-gray-400 dark:bg-zinc-900 dark:border-zinc-700"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <Button 
          className="w-full bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold py-6 rounded-full mt-4" 
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Log In'}
        </Button>
      </form>

      <p className="text-center text-sm mt-8 text-gray-500 font-medium">
        Don't have an account?{' '}
        <Link className="text-black dark:text-white underline hover:text-[#1DB954] transition-colors" href="/auth/signup">
          Sign up for Nexora
        </Link>
      </p>
    </div>
  )
}

export default function LoginPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-black text-black dark:text-white">
      <Suspense fallback={<div>Loading...</div>}>
        <LoginForm />
      </Suspense>
    </main>
  )
}