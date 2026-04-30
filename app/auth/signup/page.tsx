'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Check, X, Eye, EyeOff, Globe } from 'lucide-react'
import Link from 'next/link'

function SignupForm() {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  
  const requirements = [
    { label: 'Minimum 8 characters', met: password.length >= 8 },
    { label: 'Include a numeric value', met: /[0-9]/.test(password) },
    { label: 'Special symbol required', met: /[^A-Za-z0-9]/.test(password) },
  ]

  return (
    <div className="w-full max-w-lg p-8 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-purple-600 mb-2">
          <Globe size={20} />
          <span className="font-bold text-sm tracking-widest uppercase">Member Registration</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">Join the ICT Community</h1>
        <p className="text-zinc-500 mt-2 text-sm font-medium">Build, Innovate, and Collaborate with NJBS students.</p>
      </div>

      <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5 md:col-span-2">
          <label className="text-xs font-bold uppercase text-zinc-400">Full Name</label>
          <Input className="rounded-lg dark:bg-zinc-900" placeholder="Sangam Kunwar" />
        </div>

        <div className="space-y-1.5 md:col-span-2">
          <label className="text-xs font-bold uppercase text-zinc-400">Official Email</label>
          <Input className="rounded-lg dark:bg-zinc-900" type="email" placeholder="sangam@example.com" />
        </div>

        <div className="space-y-1.5 md:col-span-2 relative">
          <label className="text-xs font-bold uppercase text-zinc-400">Secure Password</label>
          <div className="relative">
            <Input 
              type={showPassword ? "text" : "password"}
              className="rounded-lg dark:bg-zinc-900 pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="mt-4 p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-100 dark:border-zinc-800">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Security Checklist</h4>
            <div className="grid grid-cols-1 gap-2">
              {requirements.map((req, i) => (
                <div key={i} className="flex items-center gap-2 text-[13px]">
                  <div className={`p-0.5 rounded-full ${req.met ? "bg-green-500/10" : "bg-zinc-200 dark:bg-zinc-800"}`}>
                    {req.met ? <Check size={12} className="text-green-500" /> : <X size={12} className="text-zinc-400" />}
                  </div>
                  <span className={req.met ? "text-green-600 font-medium" : "text-zinc-500"}>{req.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Button className="md:col-span-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-7 rounded-xl text-lg mt-2 shadow-lg shadow-purple-500/10">
          Create Member Account
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-zinc-500">
        Already registered? <Link href="/auth/login" className="text-purple-600 font-bold hover:underline">Login here</Link>
      </p>
    </div>
  )
}

export default function SignupPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-900 p-6">
      <SignupForm />
    </main>
  )
}