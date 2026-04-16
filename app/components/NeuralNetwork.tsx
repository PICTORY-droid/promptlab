'use client'

import { useEffect, useRef } from 'react'

export default function NeuralNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    let mouseX = 0
    let mouseY = 0
    let animId: number

    interface Node {
      x: number
      y: number
      vx: number
      vy: number
      radius: number
      pulse: number
      pulseSpeed: number
    }

    const nodes: Node[] = []
    const nodeCount = 60

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.02 + 0.01,
      })
    }

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    const onTouch = (e: TouchEvent) => {
      mouseX = e.touches[0].clientX
      mouseY = e.touches[0].clientY
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      nodes.forEach((node) => {
        node.x += node.vx
        node.y += node.vy
        node.pulse += node.pulseSpeed

        if (node.x < 0 || node.x > canvas.width) node.vx *= -1
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1

        const distToMouse = Math.sqrt((node.x - mouseX) ** 2 + (node.y - mouseY) ** 2)
        if (distToMouse < 150) {
          const force = (150 - distToMouse) / 150
          node.vx += (node.x - mouseX) * force * 0.002
          node.vy += (node.y - mouseY) * force * 0.002
        }

        const speed = Math.sqrt(node.vx ** 2 + node.vy ** 2)
        if (speed > 2) {
          node.vx = (node.vx / speed) * 2
          node.vy = (node.vy / speed) * 2
        }
      })

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          const maxDist = 120

          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.5
            const midX = (nodes[i].x + nodes[j].x) / 2
            const midY = (nodes[i].y + nodes[j].y) / 2
            const distToMouse = Math.sqrt((midX - mouseX) ** 2 + (midY - mouseY) ** 2)
            const activated = distToMouse < 200

            const gradient = ctx.createLinearGradient(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y)
            if (activated) {
              gradient.addColorStop(0, `rgba(88, 166, 255, ${alpha * 2})`)
              gradient.addColorStop(0.5, `rgba(188, 140, 255, ${alpha * 3})`)
              gradient.addColorStop(1, `rgba(63, 185, 80, ${alpha * 2})`)
            } else {
              gradient.addColorStop(0, `rgba(63, 185, 80, ${alpha * 0.4})`)
              gradient.addColorStop(1, `rgba(88, 166, 255, ${alpha * 0.4})`)
            }

            ctx.beginPath()
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.strokeStyle = gradient
            ctx.lineWidth = activated ? 1.5 : 0.5
            ctx.stroke()

            if (activated && Math.random() < 0.02) {
              ctx.beginPath()
              ctx.arc(midX, midY, 2, 0, Math.PI * 2)
              ctx.fillStyle = `rgba(188, 140, 255, 0.8)`
              ctx.fill()
            }
          }
        }
      }

      nodes.forEach((node) => {
        const distToMouse = Math.sqrt((node.x - mouseX) ** 2 + (node.y - mouseY) ** 2)
        const activated = distToMouse < 200
        const pulseSize = Math.sin(node.pulse) * 0.5 + 1

        if (activated) {
          ctx.beginPath()
          ctx.arc(node.x, node.y, node.radius * pulseSize * 3, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(188, 140, 255, 0.15)`
          ctx.fill()
        }

        ctx.beginPath()
        ctx.arc(node.x, node.y, node.radius * pulseSize, 0, Math.PI * 2)
        ctx.fillStyle = activated ? `rgba(188, 140, 255, 0.9)` : `rgba(63, 185, 80, 0.6)`
        ctx.shadowBlur = activated ? 10 : 4
        ctx.shadowColor = activated ? '#bc8cff' : '#3fb950'
        ctx.fill()
        ctx.shadowBlur = 0
      })

      animId = requestAnimationFrame(draw)
    }

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('touchmove', onTouch)
    window.addEventListener('resize', handleResize)
    draw()

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('touchmove', onTouch)
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 0,
        pointerEvents: 'none',
        opacity: 0.4,
      }}
    />
  )
}