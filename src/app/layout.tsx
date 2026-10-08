import type { Metadata } from 'next'
import { Nunito, Geist_Mono } from 'next/font/google'
import './globals.css'

const nunito = Nunito({
  variable: '--font-nunito',
  subsets: ['latin'],
  weight: ['400', '600', '800'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'CustBot',
  description: 'A Discord bot for translations, timestamps and paying Custard.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${nunito.variable} ${geistMono.variable} antialiased`}>{children}</body>
    </html>
  )
}
