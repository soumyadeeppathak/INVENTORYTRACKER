import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ToastProvider } from '@/src/components/ui/toast'
import { OfflineIndicator } from '@/src/components/pwa/offline-indicator'
import { InstallPrompt } from '@/src/components/pwa/install-prompt'
import { ServiceWorkerUpdate } from '@/src/components/pwa/service-worker-update'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'InventoryTracker',
  description: 'Track your belongings across locations with friends and family',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Inventory',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#6366F1',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icons/icon-192.svg" />
        <link rel="apple-touch-icon" href="/icons/icon-192.svg" />
      </head>
      <body className={inter.className}>
        <ToastProvider>
          <OfflineIndicator />
          {children}
          <InstallPrompt />
          <ServiceWorkerUpdate />
        </ToastProvider>
      </body>
    </html>
  )
}

