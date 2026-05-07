'use client'

import { useEffect } from 'react'

export default function HologramCard() {
  useEffect(() => {
    if (window.innerWidth < 768) return

    let rafId: number | null = null
    let pendingEvent: MouseEvent | null = null

    const processMove = () => {
      rafId = null
      if (!pendingEvent) return
      const e = pendingEvent
      pendingEvent = null

      const cards = document.querySelectorAll('.prompt-card')
      cards.forEach((card) => {
        const el = card as HTMLElement
        const rect = el.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const inner = el.querySelector('.rounded-xl') as HTMLElement | null
        if (!inner) return

        if (x < 0 || x > rect.width || y < 0 || y > rect.height) {
          inner.style.transform = ''
          inner.style.background = '#161b22'
          inner.style.backgroundImage = 'none'
          return
        }

        const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -12
        const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 12
        const percentX = (x / rect.width) * 100
        const percentY = (y / rect.height) * 100

        inner.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`
        inner.style.transition = 'transform 0.1s ease'
        inner.style.backgroundImage = `
          radial-gradient(circle at ${percentX}% ${percentY}%,
            rgba(188, 140, 255, 0.15) 0%,
            rgba(88, 166, 255, 0.08) 30%,
            rgba(63, 185, 80, 0.05) 60%,
            transparent 100%
          ),
          linear-gradient(${rotateY * 3}deg,
            rgba(88, 166, 255, 0.03) 0%,
            rgba(188, 140, 255, 0.06) 50%,
            rgba(63, 185, 80, 0.03) 100%
          )
        `
        inner.style.boxShadow = `
          0 0 20px rgba(188, 140, 255, 0.15),
          0 0 40px rgba(88, 166, 255, 0.08),
          inset 0 0 20px rgba(188, 140, 255, 0.05)
        `
      })
    }

    const handleMouseMove = (e: MouseEvent) => {
      pendingEvent = e
      if (!rafId) rafId = requestAnimationFrame(processMove)
    }

    // event delegation: mouseout bubbles, relatedTarget check prevents inner→parent false triggers
    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const card = target.closest('.prompt-card')
      if (!card) return
      if (card.contains(e.relatedTarget as Node | null)) return

      const inner = card.querySelector('.rounded-xl') as HTMLElement | null
      if (inner) {
        inner.style.transform = ''
        inner.style.transition = 'transform 0.5s ease, background 0.5s ease, box-shadow 0.5s ease'
        inner.style.backgroundImage = 'none'
        inner.style.background = '#161b22'
        inner.style.boxShadow = 'none'
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseout', handleMouseOut)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseout', handleMouseOut)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  return null
}
