'use client'

import { useEffect } from 'react'

export default function GravityEffect() {
  useEffect(() => {
    if (window.innerWidth < 768) return

    let rafId: number | null = null
    let pendingEvent: MouseEvent | null = null
    let cachedCards: { el: HTMLElement; rect: DOMRect }[] = []
    let rectsDirty = true

    const refreshRects = () => {
      cachedCards = Array.from(document.querySelectorAll('.prompt-card')).map(el => ({
        el: el as HTMLElement,
        rect: (el as HTMLElement).getBoundingClientRect(),
      }))
      rectsDirty = false
    }

    const processMove = () => {
      rafId = null
      if (!pendingEvent) return
      const e = pendingEvent
      pendingEvent = null

      if (rectsDirty || cachedCards.length === 0) refreshRects()

      const maxDist = 300
      const maxDistSq = maxDist * maxDist

      cachedCards.forEach(({ el, rect }) => {
        const cardCenterX = rect.left + rect.width / 2
        const cardCenterY = rect.top + rect.height / 2
        const distX = e.clientX - cardCenterX
        const distY = e.clientY - cardCenterY
        const distSq = distX * distX + distY * distY

        if (distSq < maxDistSq) {
          const dist = Math.sqrt(distSq)
          const force = (maxDist - dist) / maxDist
          const moveX = distX * force * 0.08
          const moveY = distY * force * 0.08
          el.style.transform = `translate(${moveX}px, ${moveY}px) scale(${1 + force * 0.03})`
          el.style.transition = 'transform 0.1s ease'
          el.style.boxShadow = `0 0 ${force * 30}px rgba(88, 166, 255, ${force * 0.4})`
        } else {
          el.style.transform = 'translate(0, 0) scale(1)'
          el.style.transition = 'transform 0.5s ease'
          el.style.boxShadow = 'none'
        }
      })
    }

    const handleMouseMove = (e: MouseEvent) => {
      pendingEvent = e
      if (!rafId) rafId = requestAnimationFrame(processMove)
    }

    const handleMouseLeave = () => {
      cachedCards.forEach(({ el }) => {
        el.style.transform = 'translate(0, 0) scale(1)'
        el.style.transition = 'transform 0.5s ease'
        el.style.boxShadow = 'none'
      })
    }

    const markDirty = () => { rectsDirty = true }

    const observer = new MutationObserver(markDirty)
    observer.observe(document.body, { childList: true, subtree: true })

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)
    window.addEventListener('scroll', markDirty, { passive: true })
    window.addEventListener('resize', markDirty)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('scroll', markDirty)
      window.removeEventListener('resize', markDirty)
      observer.disconnect()
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  return null
}
