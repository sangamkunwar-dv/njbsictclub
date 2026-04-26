'use client'

import { useEffect, useState } from 'react'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch('/api/me')
        const data = await res.json()

        setUser(data.user || null)
      } catch (err) {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    getUser()
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">

        <h1 className="text-2xl font-bold">
          Dashboard ✅
        </h1>

        {loading ? (
          <p className="mt-2">Loading...</p>
        ) : user ? (
          <p className="mt-2">Welcome, {user.email}</p>
        ) : (
          <p className="mt-2 text-red-500">Not logged in</p>
        )}

      </div>
    </div>
  )
}