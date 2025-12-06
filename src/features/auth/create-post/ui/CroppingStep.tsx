'use client'

import React, { useEffect, useRef, useState, useMemo } from 'react'
import { Button, ArrowLeft, Typography } from '@/shared/ui'
import s from './CroppingStep.module.css'

type Props = {
  imageUrl: string
  onBack: () => void
  onNext: (blob: Blob) => void
  onPrevImage?: () => void
  onNextImage?: () => void
  onDeleteImage?: () => void
  onAddPhotos?: () => void
  canPrev?: boolean
  canNext?: boolean
  index?: number
  total?: number
}

export const CroppingStep: React.FC<Props> = ({
  imageUrl,
  onBack,
  onNext,
  onPrevImage,
  onNextImage,
  onDeleteImage,
  onAddPhotos,
  canPrev = false,
  canNext = false,
  index = 0,
  total = 0
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const imgRef = useRef<HTMLImageElement | null>(null)

  const [natural, setNatural] = useState({ w: 0, h: 0 })
  const [container, setContainer] = useState({ w: 0, h: 0 })
  const [scale, setScale] = useState(1)
  const [pos, setPos] = useState({ x: 0, y: 0 })

  const posRef = useRef(pos)
  posRef.current = pos
  const scaleRef = useRef(scale)
  scaleRef.current = scale

  const [isPointerDown, setIsPointerDown] = useState(false)
  const pointerStart = useRef({ x: 0, y: 0 })
  const posStart = useRef({ x: 0, y: 0 })
  const [aspect, setAspect] = useState<number | null>(null)

  useEffect(() => {
    const node = containerRef.current
    if (!node) return
    const update = () => setContainer({ w: node.clientWidth, h: node.clientHeight })
    update()
    const ro = new ResizeObserver(update)
    ro.observe(node)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (!imageUrl) return
    const img = new Image()
    img.src = imageUrl
    img.onload = () => {
      setNatural({ w: img.naturalWidth, h: img.naturalHeight })
      const node = containerRef.current
      if (!node) return
      const fit = Math.min(node.clientWidth / img.naturalWidth, node.clientHeight / img.naturalHeight)
      setScale(fit)
      setPos({
        x: (node.clientWidth - img.naturalWidth * fit) / 2,
        y: (node.clientHeight - img.naturalHeight * fit) / 2
      })
    }
  }, [imageUrl])

  const clampPos = (p: { x: number; y: number }, s = scaleRef.current) => {
    const node = containerRef.current
    if (!node || !natural.w || !natural.h) return p
    const cw = node.clientWidth
    const ch = node.clientHeight
    const dispW = natural.w * s
    const dispH = natural.h * s
    return {
      x: dispW <= cw ? (cw - dispW) / 2 : Math.max(Math.min(p.x, 0), cw - dispW),
      y: dispH <= ch ? (ch - dispH) / 2 : Math.max(Math.min(p.y, 0), ch - dispH)
    }
  }

  useEffect(() => setPos((p) => clampPos(p, scale)), [scale, container, natural])

  useEffect(() => {
    const node = containerRef.current
    if (!node) return
    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return
      node.setPointerCapture(e.pointerId)
      setIsPointerDown(true)
      pointerStart.current = { x: e.clientX, y: e.clientY }
      posStart.current = { ...posRef.current }
    }
    const onPointerMove = (e: PointerEvent) => {
      if (!isPointerDown) return
      const dx = e.clientX - pointerStart.current.x
      const dy = e.clientY - pointerStart.current.y
      setPos(clampPos({ x: posStart.current.x + dx, y: posStart.current.y + dy }))
    }
    const onPointerUp = (e: PointerEvent) => {
      try {
        node.releasePointerCapture(e.pointerId)
      } catch {}
      setIsPointerDown(false)
    }
    node.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    return () => {
      node.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
    }
  }, [isPointerDown])

  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const delta = -e.deltaY * 0.0025
    setScale((prev) => {
      const next = Math.min(Math.max(0.1, prev + delta), 4)
      const node = containerRef.current
      if (!node) return next
      const rect = node.getBoundingClientRect()
      const cx = rect.width / 2
      const cy = rect.height / 2
      const prevPos = posRef.current
      const factor = next / prev
      setPos(clampPos({ x: prevPos.x * factor + (1 - factor) * cx, y: prevPos.y * factor + (1 - factor) * cy }, next))
      return next
    })
  }

  const zoomIn = () =>
    setScale((s) => {
      const next = Math.min(4, s + 0.1)
      setPos(clampPos(pos, next))
      return next
    })
  const zoomOut = () =>
    setScale((s) => {
      const next = Math.max(0.1, s - 0.1)
      setPos(clampPos(pos, next))
      return next
    })

  const frame = useMemo(() => {
    const cw = container.w
    const ch = container.h
    if (!cw || !ch) return { w: 0, h: 0 }
    if (!aspect) return { w: cw, h: ch }
    let fw = Math.min(cw * 0.94, cw)
    let fh = fw / aspect
    if (fh > ch * 0.94) {
      fh = ch * 0.94
      fw = fh * aspect
    }
    return { w: Math.round(fw), h: Math.round(fh) }
  }, [container, aspect])

  const doCrop = () => {
    if (!containerRef.current || !imgRef.current || !natural.w) return
    const canvas = document.createElement('canvas')
    canvas.width = frame.w
    canvas.height = frame.h
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const sx = ((container.w - frame.w) / 2 - pos.x) / scale
    const sy = ((container.h - frame.h) / 2 - pos.y) / scale
    ctx.drawImage(imgRef.current, sx, sy, frame.w / scale, frame.h / scale, 0, 0, frame.w, frame.h)
    canvas.toBlob(
      (b) => {
        if (b) onNext(b)
      },
      'image/jpeg',
      0.92
    )
  }

  return (
    <div className={s.wrapper}>
      <div className={s.header}>
        <Button variant="textButton" onClick={onBack}>
          <ArrowLeft />
        </Button>
        <Typography variant="h1">Cropping</Typography>
        <Button onClick={doCrop} variant="outlined">
          <Typography variant="h3">Next</Typography>
        </Button>
      </div>
      <div className={s.subHeader}>
        <div className={s.nav}>
          <Button onClick={onPrevImage} disabled={!canPrev} variant="outlined">
            Prev
          </Button>
          <Typography>
            {index + 1} / {total}
          </Typography>
          <Button onClick={onNextImage} disabled={!canNext} variant="outlined">
            Next
          </Button>
        </div>
        <div className={s.actions}>
          <Button onClick={onAddPhotos} variant="outlined">
            Add photos
          </Button>
          <Button onClick={onDeleteImage} variant="outlined">
            Delete
          </Button>
        </div>
      </div>
      <div ref={containerRef} className={s.cropContainer} onWheel={onWheel}>
        <img
          ref={imgRef}
          src={imageUrl}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            transform: `translate(${pos.x}px,${pos.y}px) scale(${scale})`,
            opacity: 1
          }}
          draggable={false}
        />
        <div className={s.overlay} style={{ width: frame.w, height: frame.h }} />
      </div>
      <div className={s.controls}>
        <div className={s.aspect}>
          <Button onClick={() => setAspect(null)}>Free</Button>
          <Button onClick={() => setAspect(1)}>1:1</Button>
          <Button onClick={() => setAspect(4 / 5)}>4:5</Button>
          <Button onClick={() => setAspect(16 / 9)}>16:9</Button>
        </div>
        <div className={s.zoom}>
          <Button onClick={zoomOut}>-</Button>
          <Typography>{scale.toFixed(2)}x</Typography>
          <Button onClick={zoomIn}>+</Button>
        </div>
      </div>
    </div>
  )
}
