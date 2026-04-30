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
      // ✅ suppressHydrationWarning is needed here because of ThemeProvider (dark/light mode)
      suppressHydrationWarning 
      className={`${geist.variable} ${geistMono.variable}`}
    >
      <head>
        {/* Favicon fallback */}
        <link rel="icon" href="/ictclubNJBS.jpg" />
        
        {/* 
          ✅ PRO TIP: For AdSense, placing it in head with standard tags is best.
          Change ca-pub-XXXXXXXXXXXXXXXX to your actual ID.
        */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5849186110366340"
          crossOrigin="anonymous"
        />
      </head>

      <body 
        className="font-sans antialiased bg-background text-foreground"
        // ✅ CRITICAL: Using true here helps with browser extensions like Grammarly or Dark Reader
        suppressHydrationWarning={true}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <CookieBanner />
          {/* Only load analytics in production to save quota */}
          {process.env.NODE_ENV === 'production' && <Analytics />}
        </ThemeProvider>
      </body>
    </html>
  )
}