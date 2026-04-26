
import { useEffect, useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

type Event = {
  _id: string
  title: string
  description: string
  date: string
  location?: string
  capacity?: number
  type?: string
  image_url?: string
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('/api/events')
        const data = await res.json()
        setEvents(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 bg-background">
        <div className="max-w-6xl mx-auto p-6">
          <h1 className="text-3xl font-bold mb-6">Events</h1>

          {loading ? (
            <p>Loading...</p>
          ) : (
            events.map((event) => (
              <div key={event._id} className="border p-4 rounded mb-4">
                <h2 className="text-xl font-bold">{event.title}</h2>
                <p>{event.description}</p>
                <p>{new Date(event.date).toDateString()}</p>
              </div>
            ))
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}