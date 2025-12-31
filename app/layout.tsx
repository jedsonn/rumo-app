import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Rumo - Set Your Direction',
  description: 'Premium goal-tracking app for personal and professional growth',
  icons: {
    icon: '/favicon.svg',
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
