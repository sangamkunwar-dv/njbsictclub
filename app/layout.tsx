import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/contexts/theme-context'
import CookieBanner from '@/components/CookieBanner'
import './globals.css'

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://njbsictclub.vercel.app'),
  title: 'ICT Club of NJBS | Tech Community',
  description: 'Innovation, Creativity, and Technology Club - Join our community of tech enthusiasts',
  generator: 'ICT Club NJBS',
  icons: {
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
      suppressHydrationWarning 
      className={`${geist.variable} ${geistMono.variable}`}
    >
      <head>
        <link rel="icon" href="/ictclubNJBS.jpg" />
        
        {/* 
          ✅ FIX: Using standard <script> instead of <Script /> for AdSense.
          This prevents the "data-nscript" warning because Next.js won't manage this tag.
        */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
          crossOrigin="anonymous"
        ></script>
      </head>

      <body 
        className="font-sans antialiased bg-background text-foreground"
        // ✅ Keeps the DOM stable even if extensions modify it
        suppressHydrationWarning={true}
      >
        <ThemeProvider>
          {children}
          <CookieBanner />
          {process.env.NODE_ENV === 'production' && <Analytics />}
        </ThemeProvider>
      </body>
    </html>
  )
}