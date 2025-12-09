'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft, Button, PlusCircleOutline, Typography } from '@/shared/ui'
import s from './CroppingStep.module.css'

type ImageThumbnail = {
  id: string
  url: string
  isCurrent: boolean
}

type Props = {
  imageUrl: string
  onBack: () => void
  onNext: (blob: Blob) => void
  onDeleteImage?: (index: number) => void // Теперь принимает индекс изображения
  onAddPhotos: () => void // Теперь обязательный проп
  index?: number
  total?: number
  allImages?: ImageThumbnail[]
  onSelectImage?: (index: number) => void
}

export const CroppingStep: React.FC<Props> = ({
  imageUrl,
  onBack,
  onNext,
  onDeleteImage,
  onAddPhotos,
  index = 0,
  total = 0,
  allImages = [],
  onSelectImage
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

  // Инициализация изображения с центрированием
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
      // Центрируем изображение: позиция = центр контейнера минус половина размера изображения
      setPos({
        x: node.clientWidth / 2 - (img.naturalWidth * fit) / 2,
        y: node.clientHeight / 2 - (img.naturalHeight * fit) / 2
      })
    }
  }, [imageUrl])

  // Ограничение позиции с учетом центрирования
  const clampPos = (p: { x: number; y: number }, s = scaleRef.current) => {
    const node = containerRef.current
    if (!node || !natural.w || !natural.h) return p
    const cw = node.clientWidth
    const ch = node.clientHeight
    const dispW = natural.w * s
    const dispH = natural.h * s

    // Если изображение меньше контейнера - центрируем
    if (dispW <= cw && dispH <= ch) {
      return {
        x: cw / 2 - dispW / 2,
        y: ch / 2 - dispH / 2
      }
    }

    // Если больше - ограничиваем движение
    return {
      x: Math.max(cw / 2 - dispW, Math.min(p.x, cw / 2)),
      y: Math.max(ch / 2 - dispH, Math.min(p.y, ch / 2))
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

  // Зум с центрированием относительно центра контейнера
  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const delta = -e.deltaY * 0.0025
    setScale((prev) => {
      const next = Math.min(Math.max(0.1, prev + delta), 4)
      const node = containerRef.current
      if (!node || !natural.w || !natural.h) return next

      const cw = node.clientWidth
      const ch = node.clientHeight
      const factor = next / prev
      const prevPos = posRef.current

      // Масштабируем относительно центра контейнера
      const newX = cw / 2 - (cw / 2 - prevPos.x) * factor
      const newY = ch / 2 - (ch / 2 - prevPos.y) * factor

      setPos(clampPos({ x: newX, y: newY }, next))
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

  // Обработчик добавления фото через плюс
  const handleAddPhoto = useCallback(() => {
    onAddPhotos()
  }, [onAddPhotos])

  return (
    <div className={s.wrapper}>
      <div className={s.header}>
        <Button style={{ padding: '0' }} variant="textButton" onClick={onBack} aria-label="Back">
          <ArrowLeft />
        </Button>
        <Typography variant="h1">Cropping</Typography>
        <Button onClick={doCrop} variant="outlined" aria-label="Next">
          <Typography variant="h3">Next</Typography>
        </Button>
      </div>

      {/* Основной контейнер для обрезки с центрированием */}
      <div ref={containerRef} className={s.cropContainer} onWheel={onWheel}>
        <img
          ref={imgRef}
          src={imageUrl}
          alt="Crop preview"
          className={s.cropImage}
          style={{
            transform: `translate(${pos.x}px,${pos.y}px) scale(${scale})`,
            transformOrigin: 'top left'
          }}
          draggable={false}
        />
        {/* Затемнение области вне выделения */}
        <div className={s.darkOverlay}>
          {/* Верхняя полоса затемнения */}
          <div
            className={s.darkTop}
            style={{
              height: `calc(50% - ${frame.h / 2}px)`
            }}
          />
          {/* Нижняя полоса затемнения */}
          <div
            className={s.darkBottom}
            style={{
              height: `calc(50% - ${frame.h / 2}px)`
            }}
          />
          {/* Левая полоса затемнения */}
          <div
            className={s.darkLeft}
            style={{
              width: `calc(50% - ${frame.w / 2}px)`,
              top: `calc(50% - ${frame.h / 2}px)`,
              height: frame.h
            }}
          />
          {/* Правая полоса затемнения */}
          <div
            className={s.darkRight}
            style={{
              width: `calc(50% - ${frame.w / 2}px)`,
              top: `calc(50% - ${frame.h / 2}px)`,
              height: frame.h
            }}
          />
        </div>
        {/* Рамка выделения */}
        <div
          className={s.overlay}
          style={{
            width: frame.w,
            height: frame.h
          }}
        />
      </div>

      {/* Контролы для аспекта и зума */}
      <div className={s.controls}>
        <div className={s.aspect}>
          {/*<Button onClick={() => setAspect(null)} variant="outlined">*/}
          {/*  Free*/}
          {/*</Button>*/}
          <Button className={s.btnScale} onClick={() => setAspect(1)} variant="outlined">
            1:1
          </Button>
          <Button className={s.btnScale} onClick={() => setAspect(4 / 5)} variant="outlined">
            4:5
          </Button>
          <Button className={s.btnScale} onClick={() => setAspect(16 / 9)} variant="outlined">
            16:9
          </Button>
        </div>
        <div className={s.zoom}>
          <Button className={s.btnScale} onClick={zoomOut} variant="outlined" aria-label="Zoom out">
            -
          </Button>
          <Typography variant="small">{scale.toFixed(2)}x</Typography>
          <Button className={s.btnScale} onClick={zoomIn} variant="outlined" aria-label="Zoom in">
            +
          </Button>
        </div>
      </div>

      {/* Миниатюры с плюсом для добавления */}
      {allImages.length > 0 && (
        <div className={s.thumbnails}>
          <div className={s.thumbnailsList}>
            {allImages.map((img, idx) => (
              <button
                key={img.id}
                className={`${s.thumbnail} ${img.isCurrent ? s.thumbnailActive : ''}`}
                onClick={() => onSelectImage?.(idx)}
                type="button"
                aria-label={`Select image ${idx + 1}`}
              >
                <img src={img.url} alt={`Thumbnail ${idx + 1}`} />
                {onDeleteImage && (
                  <button
                    className={s.thumbnailDelete}
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeleteImage(idx)
                    }}
                    type="button"
                    aria-label={`Delete image ${idx + 1}`}
                  >
                    ×
                  </button>
                )}
              </button>
            ))}
            {total < 10 && (
              // <button className={s.thumbnailAdd} onClick={handleAddPhoto} type="button" aria-label="Add photo">
              //   <span>+</span>
              // </button>
              <PlusCircleOutline className={s.plusCircleOutline} onClick={handleAddPhoto} />
            )}
          </div>
        </div>
      )}
    </div>
  )
}
