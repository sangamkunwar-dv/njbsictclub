'use client'

import { useState, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase/client'
import { Eye, EyeOff, ShieldCheck } from 'lucide-react'

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
    <div className="w-full max-w-md p-8 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm">
      <div className="flex flex-col items-center mb-10">
        <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4 shadow-lg shadow-purple-500/20">
          <ShieldCheck className="text-white" size={28} />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          ICT Club Portal
        </h1>
        <p className="text-sm text-zinc-500 mt-1">Sign in to manage your digital projects</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 ml-1">Email Address</label>
          <Input 
            type="email"
            placeholder="name@njbsict.com"
            className="rounded-lg border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 focus:ring-purple-500" 
            value={email} onChange={(e) => setEmail(e.target.value)} 
          />
        </div>

        <div className="space-y-1.5 relative">
          <div className="flex justify-between items-center px-1">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Password</label>
            <Link href="#" className="text-xs text-purple-600 hover:underline">Forgot password?</Link>
          </div>
          <div className="relative">
            <Input 
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="rounded-lg dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 pr-10"
              value={password} onChange={(e) => setPassword(e.target.value)}
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-6 rounded-lg transition-all">
          Sign In to Dashboard
        </Button>
      </form>

      <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800 text-center">
        <p className="text-sm text-zinc-500">
          Not a member yet? <Link href="/auth/signup" className="text-purple-600 font-bold hover:underline">Apply for Membership</Link>
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-900 p-6">
      <Suspense><LoginForm /></Suspense>
    </main>
  )
}