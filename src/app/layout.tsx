import { Inter } from "next/font/google"
import { AuthProvider } from "@/components/providers/auth-provider"
import { ToastProvider } from "@/components/providers/toast-provider"
import { Header } from "@/components/layout/header"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ToastProvider />
          <Header />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  )
}