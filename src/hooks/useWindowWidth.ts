"use client"

import { useState, useEffect } from "react"

export function useWindowWidth(): number | undefined {
  const [width, setWidth] = useState<number | undefined>(undefined)

  useEffect(() => {
    if (typeof window === "undefined") return

    function handleResize() {
      setWidth(window.innerWidth)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return width
}
