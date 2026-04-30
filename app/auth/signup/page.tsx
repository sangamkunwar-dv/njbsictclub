'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Check, X, Eye, EyeOff, Globe, Github } from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'

function SignupForm() {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  
  const requirements = [
    { label: '8+ Characters', met: password.length >= 8 },
    { label: 'Has a Number', met: /[0-9]/.test(password) },
    { label: 'Special Symbol', met: /[^A-Za-z0-9]/.test(password) },
  ]

  const handleOAuth = (provider: 'google' | 'github') => {
    supabase.auth.signInWithOAuth({ provider })
  }

  return (
    <div className="w-full max-w-lg p-8 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight">Create Account</h1>
        <p className="text-zinc-500 text-sm mt-1">Join the NJBS ICT Club community.</p>
      </div>

      <div className="flex gap-3 mb-6">
        <Button variant="outline" className="flex-1 rounded-xl" onClick={() => handleOAuth('google')}>
          Google
        </Button>
        <Button variant="outline" className="flex-1 rounded-xl" onClick={() => handleOAuth('github')}>
          GitHub
        </Button>
      </div>

      <form className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-bold uppercase text-zinc-400">Full Name</label>
          <Input className="rounded-lg dark:bg-zinc-900" placeholder="Your name" />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold uppercase text-zinc-400">Email</label>
          <Input className="rounded-lg dark:bg-zinc-900" type="email" placeholder="official@ictclub.com" />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold uppercase text-zinc-400">Create Password</label>
          <div className="relative">
            <Input 
              type={showPassword ? "text" : "password"}
              className="rounded-lg dark:bg-zinc-900 pr-10 border-zinc-300 focus:border-purple-500 transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Password Guide */}
          <div className="mt-3 p-3 bg-zinc-50 dark:bg-zinc-900/40 rounded-lg border border-zinc-100 dark:border-zinc-800">
            <div className="flex gap-4">
              {requirements.map((req, i) => (
                <div key={i} className="flex items-center gap-1.5 text-[11px]">
                  {req.met ? <Check size={12} className="text-green-500" /> : <div className="w-3 h-3 rounded-full border border-zinc-300" />}
                  <span className={req.met ? "text-green-600 font-bold" : "text-zinc-400"}>{req.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-6 rounded-xl mt-4 shadow-lg shadow-purple-500/10 transition-transform active:scale-95">
          Join the Club
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-zinc-500">
        Already a member? <Link href="/auth/login" className="text-purple-600 font-bold">Login</Link>
      </p>
    </div>
  )
}

export default function SignupPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black p-6">
      <SignupForm />
    </main>
  )
}