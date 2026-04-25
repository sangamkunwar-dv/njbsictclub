'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Edit2, Trash2, Plus, Save, AlertCircle, CheckCircle, X } from 'lucide-react'

interface TeamMember {
  _id: string
  name: string
  position: string
  email?: string
  phone?: string
  bio?: string
  image_url?: string
  skills?: string[]
}

export default function TeamComponent() {
  const [team, setTeam] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [message, setMessage] = useState<{ text: string; type: string }>({ text: '', type: '' })
  const [formLoading, setFormLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState<Partial<TeamMember>>({
    name: '',
    position: '',
    email: '',
    phone: '',
    bio: '',
    image_url: '',
    skills: [],
  })

  useEffect(() => {
    fetchTeam()
    // Auto-clear message after 5 seconds
    if (message.text) {
      const timer = setTimeout(() => setMessage({ text: '', type: '' }), 5000)
      return () => clearTimeout(timer)
    }
  }, [message.text])

  const fetchTeam = async () => {
    try {
      const res = await fetch('/api/admin/team')
      const data = await res.json()
      setTeam(data)
    } catch (error) {
      setMessage({ text: 'Failed to fetch team', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const filteredTeam = team.filter((member) =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.position.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleEdit = (member: TeamMember) => {
    setFormData(member)
    setEditingId(member._id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this team member? This action cannot be undone.')) return

    setDeleteLoading(id)
    try {
      const res = await fetch(`/api/admin/team/${id}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        throw new Error('Failed to delete team member')
      }

      setTeam(team.filter((m) => m._id !== id))
      setMessage({ text: 'Team member removed successfully', type: 'success' })
    } catch (error: any) {
      setMessage({ text: error.message || 'Failed to delete team member', type: 'error' })
    } finally {
      setDeleteLoading(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.name?.trim()) {
      setMessage({ text: 'Name is required', type: 'error' })
      return
    }

    if (!formData.position?.trim()) {
      setMessage({ text: 'Position is required', type: 'error' })
      return
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setMessage({ text: 'Please enter a valid email address', type: 'error' })
      return
    }

    setFormLoading(true)
    try {
      if (editingId) {
        const res = await fetch(`/api/admin/team/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })

        if (!res.ok) {
          throw new Error('Failed to update team member')
        }

        const updated = await res.json()
        setTeam(team.map((m) => (m._id === editingId ? updated : m)))
        setMessage({ text: 'Team member updated successfully', type: 'success' })
      } else {
        const res = await fetch('/api/admin/team', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })

        if (!res.ok) {
          throw new Error('Failed to create team member')
        }

        const created = await res.json()
        setTeam([created, ...team])
        setMessage({ text: 'Team member added successfully', type: 'success' })
      }

      setShowForm(false)
      setEditingId(null)
      setFormData({
        name: '',
        position: '',
        email: '',
        phone: '',
        bio: '',
        image_url: '',
        skills: [],
      })
    } catch (error: any) {
      setMessage({ text: error.message || 'Failed to save team member', type: 'error' })
    } finally {
      setFormLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Team Members</h2>
        <Button
          onClick={() => {
            setShowForm(true)
            setEditingId(null)
            setFormData({
              name: '',
              position: '',
              email: '',
              phone: '',
              bio: '',
              image_url: '',
              skills: [],
            })
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus size={16} className="mr-2" />
          Add Team Member
        </Button>
      </div>

      <Input
        placeholder="Search by name or position..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />

      {message.text && (
        <div
          className={`p-4 rounded-lg border flex items-start gap-3 ${
            message.type === 'error'
              ? 'bg-red-50 border-red-200 text-red-700'
              : 'bg-green-50 border-green-200 text-green-700'
          }`}
        >
          {message.type === 'error' ? (
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          ) : (
            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          )}
          <p className="flex-1 font-medium">{message.text}</p>
          <button
            onClick={() => setMessage({ text: '', type: '' })}
            className="hover:opacity-70 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {showForm && (
        <Card className="p-6 bg-slate-50 border-2 border-slate-200">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-bold">
              {editingId ? 'Edit Team Member' : 'Add New Team Member'}
            </h4>
            <button
              onClick={() => {
                setShowForm(false)
                setEditingId(null)
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Name *
              </label>
              <Input
                placeholder="Full name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Position *
              </label>
              <Input
                placeholder="e.g., Lead Developer, Designer"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Phone
                </label>
                <Input
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Bio
              </label>
              <textarea
                placeholder="Brief bio or description"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg min-h-20 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Image URL
              </label>
              <Input
                placeholder="https://example.com/image.jpg"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={formLoading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
              >
                {formLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </span>
                ) : (
                  <>
                    <Save size={16} className="mr-2" />
                    {editingId ? 'Update' : 'Add'} Member
                  </>
                )}
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setEditingId(null)
                }}
                className="flex-1 bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading team members...</p>
        </div>
      ) : filteredTeam.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-gray-500 text-lg">No team members found</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredTeam.map((member) => (
            <Card
              key={member._id}
              className="p-4 flex justify-between items-center hover:shadow-md transition"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  {member.image_url && (
                    <img
                      src={member.image_url}
                      alt={member.name}
                      className="w-12 h-12 rounded-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  )}
                  <div>
                    <p className="font-semibold text-gray-900">{member.name}</p>
                    <p className="text-sm text-gray-600">{member.position}</p>
                    {member.email && (
                      <p className="text-xs text-gray-500">{member.email}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => handleEdit(member)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  size="sm"
                >
                  <Edit2 size={14} className="mr-1" />
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(member._id)}
                  disabled={deleteLoading === member._id}
                  className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
                  size="sm"
                >
                  {deleteLoading === member._id ? (
                    <span className="flex items-center gap-1">
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </span>
                  ) : (
                    <>
                      <Trash2 size={14} className="mr-1" />
                      Remove
                    </>
                  )}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
