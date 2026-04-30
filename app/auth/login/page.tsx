'use client'

import { useState, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase/client'
import { Eye, EyeOff } from 'lucide-react'

function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false); return }
    router.push('/dashboard')
  }

  return (
    <div className="w-full max-w-sm px-6 py-10 bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xl">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-black italic tracking-tighter text-fuchsia-600 dark:text-fuchsia-500 uppercase">
          Club<span className="text-black dark:text-white">Nex</span>
        </h2>
        <p className="text-sm font-bold text-zinc-500 mt-2">Back to the beats.</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="text-xs font-black uppercase tracking-widest mb-1 block">Email</label>
          <Input 
            className="dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 focus:border-fuchsia-500" 
            value={email} onChange={(e) => setEmail(e.target.value)} 
          />
        </div>

        <div className="relative">
          <label className="text-xs font-black uppercase tracking-widest mb-1 block">Password</label>
          <Input 
            type={showPassword ? "text" : "password"}
            className="dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700"
            value={password} onChange={(e) => setPassword(e.target.value)}
          />
          <button 
            type="button" 
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-8 text-zinc-500 hover:text-fuchsia-500"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <Button className="w-full bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-black py-6 rounded-full uppercase tracking-widest shadow-lg shadow-fuchsia-500/20">
          Enter the Club
        </Button>
      </form>

      <p className="mt-8 text-center text-sm font-medium">
        Not on the list? <Link href="/auth/signup" className="text-fuchsia-600 underline">Join Now</Link>
      </p>
    </div>
  )
}

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black p-4">
      <Suspense><LoginForm /></Suspense>
    </main>
  )
}