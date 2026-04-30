'use client'

import { useState, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase/client'

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
    setError('')
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }
    router.push('/dashboard')
  }

  return (
    <div className="w-full max-w-sm px-4">
      <div className="flex justify-center mb-10">
        <div className="text-3xl font-black tracking-tighter">
          Nexora<span className="text-[#1DB954]">.</span>
        </div>
      </div>

      <h1 className="text-4xl font-bold text-center mb-10 tracking-tighter">
        Sign up to start listening
      </h1>

      <form onSubmit={handleSignup} className="space-y-6">
        <div>
          <label className="text-sm font-bold mb-2 block">What's your email?</label>
          <Input
            className="rounded-md border-gray-400 dark:bg-zinc-900 dark:border-zinc-700"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-bold mb-2 block">Create a password</label>
          <Input
            type="password"
            className="rounded-md border-gray-400 dark:bg-zinc-900 dark:border-zinc-700"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-bold mb-2 block">What should we call you?</label>
          <Input
            className="rounded-md border-gray-400 dark:bg-zinc-900 dark:border-zinc-700"
            placeholder="Enter a profile name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <p className="text-xs text-gray-500 mt-2">This appears on your profile.</p>
        </div>

        <Button 
          className="w-full bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold py-7 rounded-full text-lg" 
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Sign Up'}
        </Button>
      </form>

      <div className="relative my-10">
        <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-300 dark:border-zinc-800"></span></div>
        <div className="relative flex justify-center text-xs uppercase"><span className="bg-white dark:bg-black px-2 text-gray-500">or</span></div>
      </div>

      <p className="text-center text-sm text-gray-500">
        Already have an account?{' '}
        <Link className="text-black dark:text-white underline hover:text-[#1DB954]" href="/auth/login">
          Log in
        </Link>
      </p>
    </div>
  )
}

export default function SignupPage() {
  return (
    <main className="min-h-screen py-12 flex flex-col items-center bg-white dark:bg-black text-black dark:text-white">
      <Suspense fallback={<div>Loading...</div>}>
        <SignupForm />
      </Suspense>
    </main>
  )
}