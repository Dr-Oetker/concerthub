"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Music2 } from "lucide-react"

export function Header() {
  const { data: session } = useSession()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <Music2 className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold">Concert Community</span>
        </Link>

        <div className="flex items-center gap-4">
          {session ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                Hello, {session.user?.name || 'User'}
              </span>
              <Button
                onClick={() => signOut({ callbackUrl: "/" })}
                variant="outline"
                className="shadow-sm"
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="flex gap-4">
              <Link href="/login">
                <Button variant="ghost" className="shadow-sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button className="shadow-sm">Register</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}