import Link from "next/link"
import { AuthForm } from "@/components/auth/auth-form"
import { Music2 } from "lucide-react"

export default function RegisterPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full space-y-8 sm:max-w-md">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center space-x-2">
            <Music2 className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">Concert Community</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            Create an account
          </h1>
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <AuthForm mode="register" />
        </div>
      </div>
    </div>
  )
}