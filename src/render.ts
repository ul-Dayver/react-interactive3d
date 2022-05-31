import {addEvent, removeEvent, draw } from "./utils"

export enum DirectionRotate { toLeft = -1, toRight = 1 }

type TProps = {
  target: HTMLCanvasElement,
  images: HTMLImageElement[],
  animationDelay: number,
  autoplay: boolean,
  stepTouchRotate: number,
  directionRotate: DirectionRotate
}
export default function Render ({target, images, animationDelay, autoplay, directionRotate, stepTouchRotate}: TProps) {

  let animationStart: DOMHighResTimeStamp | null = null
  let animation: number | null = null
  let step = 0
  let position: number | null = null
  
  const image = images[step]
  
  const animate = (timestamp: DOMHighResTimeStamp) => {
    if (!animationStart) animationStart = timestamp
    const progress = timestamp - animationStart
  
    if (progress > animationDelay) {
      handleStep(directionRotate)
      draw(target, images[step])
      animationStart = timestamp
    }
    animation = window.requestAnimationFrame(animate);
  }

  const zoom = (image.height / image.width)
  const handleResize = () => {
    target.height = target.offsetWidth * zoom
    target.width = target.offsetWidth
    draw(target, images[step])
  }
  handleResize()

  draw(target, image)
  if (autoplay) animation = window.requestAnimationFrame(animate)
  
  const handleStep = (delta?: number) => {
    step = (step += delta = delta || 1) >= images.length ? 0 : step < 0 ? images.length - 1 : step
  }
  const handleStop = (event: Event) => {
    animation !== null && window.cancelAnimationFrame(animation);
    animation = null
    const e = event as MouseEvent | TouchEvent
    if ("touches" in e) {
        position = e.touches[0].clientX
    } else if ("clientX" in e) {
        position = e.clientX
    }
  }
  const handleStart = () => {
    position = null
    if (!animation && autoplay) {
      animation = window.requestAnimationFrame(animate)
    }
  }
  const handleMove = (event: Event) => {
    if (position !== null) {
      const e = event as MouseEvent | TouchEvent
      const p = "touches" in e ? e.touches[0].clientX : e.clientX;
      if (position === p) return;
      handleStep(stepTouchRotate * (p < position ? -1 : 1))
      position = p
      draw(target, images[step])
    }
  }

  addEvent(target, 'mousedown', handleStop)
  addEvent(target, 'touchstart', handleStop)
  
  addEvent(target, 'mousemove', handleMove)
  addEvent(target, 'touchmove', handleMove)

  addEvent(target, 'mouseup', handleStart)
  addEvent(target, 'touchend', handleStart)
  addEvent(target, 'mouseout', handleStart)
  addEvent(target, 'touchcancel', handleStart)

  addEvent(window, 'resize', handleResize)

  return () => {
    animation !== null && window.cancelAnimationFrame(animation);
    animation = null

    removeEvent(target, 'mousedown', handleStop)
    removeEvent(target, 'touchstart', handleStop)
    
    removeEvent(target, 'mousemove', handleMove)
    removeEvent(target, 'touchmove', handleMove)
  
    removeEvent(target, 'mouseup', handleStart)
    removeEvent(target, 'touchend', handleStart)
    removeEvent(target, 'mouseout', handleStart)
    removeEvent(target, 'touchcancel', handleStart)
    removeEvent(window, 'resize', handleResize)
    const context = target.getContext("2d")
    if (context) {
      context.clearRect(0, 0, target.offsetWidth, target.offsetHeight)
    }
  }
}