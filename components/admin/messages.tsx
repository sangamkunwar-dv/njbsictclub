'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trash2, Mail, CheckCircle2 } from 'lucide-react'

interface ContactMessage {
  _id: string
  name: string
  email: string
  subject: string
  message: string
  status: 'new' | 'read' | 'replied'
  createdAt: string
}

export default function AdminMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    setLoading(true)

    try {
      const res = await fetch('/api/admin/messages')
      if (res.ok) {
        const data = await res.json()
        setMessages(data)
      }
    } catch (error) {
      console.error('Fetch error:', error)
    }

    setLoading(false)
  }

  // ✅ MARK AS READ
  const handleMarkAsRead = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'read' }),
      })

      if (res.ok) {
        setMessages((prev) =>
          prev.map((m) => (m._id === id ? { ...m, status: 'read' } : m))
        )
      }
    } catch (error) {
      console.error('Update error:', error)
    }
  }

  // ✅ DELETE MESSAGE
  const handleDelete = async (id: string) => {
    if (!confirm('Delete this message?')) return

    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m._id !== id))
        setSelectedId(null)
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('Error deleting message')
    }
  }

  const selectedMessage = messages.find(m => m.id === selectedId)

  // ✅ LOADING STATE
  if (loading) {
    return <div className="text-center py-8">Loading messages...</div>
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

      {/* LEFT: LIST */}
      <div className="lg:col-span-1 space-y-2 max-h-[600px] overflow-y-auto">
        {messages.length === 0 ? (
          <div className="text-center py-8 text-foreground/60">
            No messages
          </div>
        ) : (
          messages.map((msg) => (
            <Card
              key={msg._id}
              className={`p-4 cursor-pointer transition ${
                selectedId === msg._id
                  ? 'bg-primary/20 border-primary'
                  : 'bg-card/50 hover:bg-card/70'
              } ${msg.status === 'new' ? 'border-l-4 border-l-accent' : ''}`}
              onClick={() => {
                setSelectedId(msg._id)
                if (msg.status === 'new') handleMarkAsRead(msg._id)
              }}
            >
              <p className="font-semibold text-sm">{msg.name}</p>
              <p className="text-xs text-muted-foreground truncate">
                {msg.subject}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {msg.createdAt
                  ? new Date(msg.createdAt).toLocaleDateString()
                  : 'No date'}
              </p>
            </Card>
          ))
        )}
      </div>

      {/* RIGHT: DETAILS */}
      <div className="lg:col-span-2">
        {selectedMessage ? (
          <Card className="p-6 flex flex-col h-full">

            <h3 className="text-lg font-semibold">
              {selectedMessage.subject}
            </h3>

            <p className="text-muted-foreground">
              {selectedMessage.name} • {selectedMessage.email}
            </p>

            <div className="bg-muted p-4 rounded mt-4 flex-grow">
              <p className="text-sm whitespace-pre-wrap">
                {selectedMessage.message}
              </p>
            </div>

            <p className="text-xs text-muted-foreground mt-2">
              {selectedMessage.createdAt
                ? new Date(selectedMessage.createdAt).toLocaleString()
                : ''}
            </p>

            <div className="flex gap-2 mt-4">
              <Button
                onClick={() => handleMarkAsRead(selectedMessage._id)}
                className="flex-1"
              >
                <CheckCircle2 size={16} className="mr-2" />
                Mark as Read
              </Button>

              <Button
                onClick={() => handleDelete(selectedMessage._id)}
                variant="destructive"
              >
                <Trash2 size={16} />
              </Button>
            </div>

          </Card>
        ) : (
          <Card className="p-6 flex items-center justify-center h-full">
            <div className="text-center text-muted-foreground">
              <Mail size={40} className="mx-auto mb-3 opacity-40" />
              Select a message
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
