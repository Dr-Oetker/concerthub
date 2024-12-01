'use client'

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface LoadMoreButtonProps {
  currentPage: number
}

export function LoadMoreButton({ currentPage }: LoadMoreButtonProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)

  const handleLoadMore = async () => {
    setIsLoading(true)
    const nextPage = currentPage + 1
    
    // Get current scroll position
    const currentPosition = window.scrollY

    // Create new URLSearchParams using existing params
    const params = new URLSearchParams()
    // Copy over existing params
    searchParams.forEach((value, key) => {
      params.set(key, value)
    })
    // Set the new page number
    params.set('page', nextPage.toString())
    
    try {
      // Replace state and refresh in sequence
      router.replace(`/?${params.toString()}`)
      await router.refresh()

      // Restore scroll position
      window.scrollTo(0, currentPosition)
    } catch (error) {
      console.error('Error loading more concerts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button 
      variant="outline" 
      onClick={handleLoadMore}
      disabled={isLoading}
      className="min-w-[200px]"
    >
      {isLoading ? 'Loading...' : 'Load More Concerts'}
    </Button>
  )
}