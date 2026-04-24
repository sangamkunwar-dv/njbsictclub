import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/contexts/theme-context'
import CookieBanner from '@/components/CookieBanner'
import './globals.css'

// ✅ Fonts
const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
})

// ✅ Metadata (IMPORTANT for SEO + AdSense)
export const metadata: Metadata = {
  metadataBase: new URL('https://njbsictclub.vercel.app'),
  title: 'ICT Club of NJBS | Tech Community',
  description:
    'Innovation, Creativity, and Technology Club - Join our community of tech enthusiasts',
  generator: 'ICT Club NJBS',
  icons: {
    icon: [
      {
        url: '/ictclubNJBS.jpg',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/ictclubNJBS.jpg',
        media: '(prefers-color-scheme: dark)',
      },
    ],
    apple: '/ictclubNJBS.jpg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geist.variable} ${geistMono.variable}`}
    >
      <head>
        {/* ✅ Google AdSense Script */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
          crossOrigin="anonymous"
        ></script>
      </head>

      <body className="font-sans antialiased bg-background text-foreground">
        <ThemeProvider>
          {children}

          {/* ✅ Cookie Banner */}
          <CookieBanner />

          {/* ✅ Vercel Analytics */}
          {process.env.NODE_ENV === 'production' && <Analytics />}
        </ThemeProvider>
      </body>
    </html>
  )
}