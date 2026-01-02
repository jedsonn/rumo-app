import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MyResolve - Achieve Your Resolutions',
  description: 'Premium goal-tracking app for personal and professional growth',
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    title: 'MyResolve',
    statusBarStyle: 'default',
  },
  openGraph: {
    title: 'MyResolve - Achieve Your Resolutions',
    description: 'Premium goal-tracking app for personal and professional growth',
    siteName: 'MyResolve',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
