import type React from "react"
import type { Metadata } from "next"
import { Ubuntu_Sans } from "next/font/google"
import "./globals.css"

const ubuntuSans = Ubuntu_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-ubuntu-sans",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
})

const ubuntuSansMono = Ubuntu_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-ubuntu-sans-mono",
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "ShopGPT",
  description: "Conversational AI for product recommendations and shopping assistance",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${ubuntuSans.variable} ${ubuntuSansMono.variable} antialiased`}>
      <body className="bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 min-h-screen">
        {children}
      </body>
    </html>
  )
}
