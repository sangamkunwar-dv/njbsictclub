import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import Script from 'next/script' // Use Next.js Script component
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

// ✅ Metadata
export const metadata: Metadata = {
  metadataBase: new URL('https://njbsictclub.vercel.app'),
  title: 'ICT Club of NJBS | Tech Community',
  description:
    'Innovation, Creativity, and Technology Club - Join our community of tech enthusiasts',
  generator: 'ICT Club NJBS',
  icons: {
    // Standard icon path
    icon: '/ictclubNJBS.jpg', 
    shortcut: '/ictclubNJBS.jpg',
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
      // ✅ Helps prevent hydration errors from extensions/themes
      suppressHydrationWarning 
      className={`${geist.variable} ${geistMono.variable}`}
    >
      <head>
        {/* ✅ Fixes the 404 favicon error by explicitly pointing to your file */}
        <link rel="icon" href="/ictclubNJBS.jpg" />
      </head>

      <body 
        className="font-sans antialiased bg-background text-foreground"
        // ✅ CRITICAL: Prevents the "removeChild" crash caused by browser extensions or translation
        suppressHydrationWarning={true}
      >
        {/* ✅ Better way to load AdSense in Next.js */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

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