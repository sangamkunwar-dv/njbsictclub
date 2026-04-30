'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Check, X, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'

function SignupForm() {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  
  // Password Logic
  const requirements = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'Contains a number', met: /[0-9]/.test(password) },
    { label: 'Special character (@$!%*)', met: /[^A-Za-z0-9]/.test(password) },
  ]

  return (
    <div className="w-full max-w-md px-6 py-10 bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800">
      <div className="mb-8">
        <h1 className="text-3xl font-black uppercase italic tracking-tighter">
          Join the <span className="text-fuchsia-600">Circle</span>
        </h1>
        <p className="text-zinc-500 font-bold">Create your VIP access pass.</p>
      </div>

      <form className="space-y-5">
        <div>
          <label className="text-xs font-black uppercase tracking-widest mb-1 block">Full Name</label>
          <Input className="dark:bg-zinc-900" placeholder="John Doe" />
        </div>

        <div>
          <label className="text-xs font-black uppercase tracking-widest mb-1 block">Email</label>
          <Input className="dark:bg-zinc-900" type="email" />
        </div>

        <div className="relative">
          <label className="text-xs font-black uppercase tracking-widest mb-1 block">Create Password</label>
          <div className="relative">
            <Input 
              type={showPassword ? "text" : "password"}
              className="dark:bg-zinc-900 pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Password Strength Guide */}
          <div className="mt-3 p-3 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg space-y-2">
            <p className="text-[10px] font-black uppercase text-zinc-400 mb-1">Security Standards</p>
            {requirements.map((req, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                {req.met ? (
                  <Check size={14} className="text-green-500" />
                ) : (
                  <X size={14} className="text-zinc-400 dark:text-zinc-600" />
                )}
                <span className={req.met ? "text-green-500 font-medium" : "text-zinc-500"}>
                  {req.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <Button className="w-full bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-black py-7 rounded-full uppercase tracking-tighter text-lg">
          Get My Invite
        </Button>
      </form>

      <p className="mt-6 text-center text-sm font-medium">
        Already a member? <Link href="/auth/login" className="text-fuchsia-600 font-bold">Log in</Link>
      </p>
    </div>
  )
}

export default function SignupPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black p-4">
      <SignupForm />
    </main>
  )
}