'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/hooks/useUser'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Download, Copy, LogOut, Loader2 } from 'lucide-react'

interface UserProfile {
  _id: string
  email: string
  full_name: string
  avatar?: string
  oauthProvider: 'email' | 'google' | 'github'
  qrCode?: string
  userId?: string
  role: 'member' | 'organizer' | 'admin'
}

export default function ProfilePage() {
  const router = useRouter()
  const { user, loading } = useUser()

  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [message, setMessage] = useState({ text: '', type: '' })
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // If auth loading is done and no user exists, redirect
    if (!loading && !user) {
      router.push('/auth/login')
      return
    }

    if (user) {
      fetchProfile()
    }
  }, [user, loading, router])

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/auth/me')
      if (res.ok) {
        const data = await res.json()
        setProfile(data)
      } else {
        router.push('/auth/login')
      }
    } catch (error) {
      console.error('Error loading profile:', error)
      setMessage({ text: 'Error loading profile', type: 'error' })
    } finally {
      setLoadingProfile(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/auth/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const handleDownloadQR = () => {
    if (!profile?.qrCode) return
    const link = document.createElement('a')
    link.href = profile.qrCode
    link.download = `${profile?.full_name || 'user'}-qrcode.png`
    link.click()
  }

  const handleCopyQRData = () => {
    if (!profile?.userId) return
    navigator.clipboard.writeText(profile.userId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getProviderLabel = () => {
    const labels = {
      email: 'Email',
      google: 'Google',
      github: 'GitHub',
    }
    return labels[profile?.oauthProvider || 'email'] || 'Email'
  }

  // Improved Loading State
  if (loading || loadingProfile) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
          <Loader2 className="animate-spin text-blue-600" size={40} />
          <p className="text-slate-600 font-medium">Loading your profile...</p>
        </div>
        <Footer />
      </>
    )
  }

  // Security Check: If profile failed to load or user is gone
  if (!user || !profile) {
    return null // useEffect will handle the redirect
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen pt-24 pb-10 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-5xl mx-auto px-4">

          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-slate-900">My Profile</h1>
            <Button
              onClick={handleLogout}
              variant="destructive"
              className="flex items-center gap-2"
            >
              <LogOut size={16} />
              Logout
            </Button>
          </div>

          {message.text && (
            <Card
              className={`p-4 mb-6 ${
                message.type === 'error' ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
              }`}
            >
              <p className={message.type === 'error' ? 'text-red-700' : 'text-green-700'}>
                {message.text}
              </p>
            </Card>
          )}

          <div className="grid lg:grid-cols-3 gap-6">

            {/* QR Code Section */}
            <Card className="p-6 bg-white shadow-lg border border-slate-200">
              <h2 className="text-xl font-bold mb-4 text-slate-900">Attendance QR Code</h2>

              {profile.qrCode ? (
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg border-2 border-slate-200 flex items-center justify-center">
                    <img
                      src={profile.qrCode}
                      alt="User QR Code"
                      className="w-full h-auto max-w-xs rounded-lg shadow-sm"
                    />
                  </div>

                  <p className="text-xs text-slate-500 text-center break-all">
                    ID: {profile.userId || 'N/A'}
                  </p>

                  <div className="space-y-2">
                    <Button
                      onClick={handleDownloadQR}
                      className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700"
                    >
                      <Download size={16} />
                      Download QR Code
                    </Button>

                    <Button
                      onClick={handleCopyQRData}
                      variant="outline"
                      className="w-full flex items-center justify-center gap-2"
                    >
                      <Copy size={16} />
                      {copied ? 'Copied!' : 'Copy ID'}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-100 rounded-lg p-8 text-center">
                  <p className="text-slate-600 text-sm">QR code not available</p>
                </div>
              )}
            </Card>

            {/* Profile Information */}
            <Card className="lg:col-span-2 p-6 bg-white shadow-lg border border-slate-200">
              <h2 className="text-xl font-bold mb-6 text-slate-900">Account Information</h2>

              <div className="space-y-5">

                {/* Avatar Section - FIXED LINE BELOW */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Avatar
                  </label>
                  {profile.avatar ? (
                    <img
                      src={profile.avatar}
                      alt="Avatar"
                      className="w-16 h-16 rounded-lg object-cover border border-slate-200"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-blue-100 flex items-center justify-center border border-blue-200">
                      <span className="text-2xl font-bold text-blue-600">
                        {/* SAFE ACCESS WITH OPTIONAL CHAINING */}
                        {profile?.full_name?.charAt(0).toUpperCase() || "U"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Full Name
                  </label>
                  <Input
                    value={profile.full_name || ''}
                    readOnly
                    className="bg-slate-50 text-slate-600 cursor-not-allowed"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email
                  </label>
                  <Input
                    value={profile.email || ''}
                    readOnly
                    className="bg-slate-50 text-slate-600 cursor-not-allowed"
                  />
                </div>

                {/* Auth Provider */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Sign-in Method
                  </label>
                  <div className="px-4 py-2 bg-slate-50 rounded-lg border border-slate-200 text-slate-700 font-medium">
                    {getProviderLabel()}
                  </div>
                </div>

                {/* Role */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Role
                  </label>
                  <div className="px-4 py-2 bg-slate-50 rounded-lg border border-slate-200 text-slate-700 font-medium capitalize">
                    {profile.role || 'Member'}
                  </div>
                </div>

                {/* Account Details */}
                <div className="pt-4 border-t border-slate-200">
                  <p className="text-xs text-slate-400">
                    Database ID: {profile._id}
                  </p>
                </div>

              </div>
            </Card>

          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}