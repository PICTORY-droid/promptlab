'use client'

import { useEffect } from 'react'

export default function HologramCard() {
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const cards = document.querySelectorAll('.prompt-card')
      cards.forEach((card) => {
        const el = card as HTMLElement
        const rect = el.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        if (x < 0 || x > rect.width || y < 0 || y > rect.height) {
          el.style.background = ''
          el.style.setProperty('--rotateX', '0deg')
          el.style.setProperty('--rotateY', '0deg')
          const inner = el.querySelector('.rounded-xl') as HTMLElement
          if (inner) {
            inner.style.transform = ''
            inner.style.background = '#161b22'
            inner.style.backgroundImage = 'none'
          }
          return
        }

        const centerX = rect.width / 2
        const centerY = rect.height / 2
        const rotateX = ((y - centerY) / centerY) * -12
        const rotateY = ((x - centerX) / centerX) * 12

        const percentX = (x / rect.width) * 100
        const percentY = (y / rect.height) * 100

        const inner = el.querySelector('.rounded-xl') as HTMLElement
        if (inner) {
          inner.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`
          inner.style.transition = 'transform 0.1s ease'
          inner.style.backgroundImage = `
            radial-gradient(circle at ${percentX}% ${percentY}%, 
              rgba(188, 140, 255, 0.15) 0%, 
              rgba(88, 166, 255, 0.08) 30%, 
              rgba(63, 185, 80, 0.05) 60%,
              transparent 100%
            ),
            linear-gradient(
              ${rotateY * 3}deg,
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
        }
      })
    }

    const handleMouseLeave = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('.prompt-card')
      if (!target) return
      const inner = target.querySelector('.rounded-xl') as HTMLElement
      if (inner) {
        inner.style.transform = ''
        inner.style.transition = 'transform 0.5s ease, background 0.5s ease, box-shadow 0.5s ease'
        inner.style.backgroundImage = 'none'
        inner.style.background = '#161b22'
        inner.style.boxShadow = 'none'
      }
    }

    const cards = document.querySelectorAll('.prompt-card')
    cards.forEach((card) => {
      card.addEventListener('mouseleave', handleMouseLeave as EventListener)
    })

    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      cards.forEach((card) => {
        card.removeEventListener('mouseleave', handleMouseLeave as EventListener)
      })
    }
  }, [])

  return null
}