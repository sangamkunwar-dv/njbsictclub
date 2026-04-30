'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Check, Eye, EyeOff, ShieldCheck } from 'lucide-react'
import Link from 'next/link'

function SignupForm() {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  
  const requirements = [
    { label: '8+ Characters', met: password.length >= 8 },
    { label: 'Numeric Value', met: /[0-9]/.test(password) },
    { label: 'Special Symbol', met: /[^A-Za-z0-9]/.test(password) },
  ]

  return (
    <div className="w-full max-w-[450px] p-8 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-xl transition-all">
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tighter text-zinc-900 dark:text-zinc-50">Join ICT Club</h1>
        <p className="text-zinc-500 dark:text-zinc-400 font-medium mt-1">Start your journey into tech innovation.</p>
      </div>

      <form className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Full Name</label>
          <Input className="rounded-xl h-12 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800" placeholder="e.g. Sangam Kunwar" />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Email Address</label>
          <Input className="rounded-xl h-12 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800" type="email" placeholder="sangam@ict.com" />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Create Password</label>
          <div className="relative">
            <Input 
              type={showPassword ? "text" : "password"}
              className="rounded-xl h-12 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 pr-11"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400">
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Real-time Requirement Tracker */}
          <div className="mt-4 grid grid-cols-3 gap-2">
            {requirements.map((req, i) => (
              <div 
                key={i} 
                className={`flex items-center justify-center gap-1.5 p-2 rounded-lg border text-[10px] font-bold transition-all ${
                  req.met 
                  ? "bg-green-500/10 border-green-500/20 text-green-600" 
                  : "bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-400"
                }`}
              >
                {req.met && <Check size={12} />}
                {req.label}
              </div>
            ))}
          </div>
        </div>

        <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-black py-7 rounded-2xl text-lg mt-4 shadow-xl shadow-purple-500/20 active:scale-[0.97]">
          Create My Account
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
        Already registered? <Link href="/auth/login" className="text-purple-600 font-bold hover:underline">Sign In</Link>
      </p>
    </div>
  )
}

export default function SignupPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-[#09090b] p-4 transition-colors">
      <SignupForm />
    </main>
  )
}