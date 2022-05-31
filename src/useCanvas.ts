import React from "react"
import useLoader, { THandlerLoadImageError } from "./useLoader"
import render, { DirectionRotate } from "./render"

export type TInteractiveImagesProps = {
  src: string[],
  className ?: string,
  speed?: number,
  rotate?: boolean,
  speedTochRotate ?: number,
  directionRotate?: DirectionRotate,
  onProgress?: (progress: number, counter?: number) => void,
  onLoad ?: (images: HTMLImageElement[]) => void,
  onError ?: THandlerLoadImageError
}

export default function useCanvas({
    src, speed, speedTochRotate, rotate, directionRotate, onError, onProgress, onLoad
  }: TInteractiveImagesProps) {
  const canvasTarget = React.useRef(null)
  const images = useLoader({urls: src, onError, onProgress, onLoad})

  React.useEffect(() => {
    let clear: () => void;
    if (canvasTarget.current && images.length) {
      clear = render({
        target: canvasTarget.current,
        images,
        animationDelay: !speed || speed < 0 ? 0 : speed,
        autoplay: !!rotate,
        stepTouchRotate: speedTochRotate || 1,
        directionRotate: directionRotate  || DirectionRotate.toLeft
      })
    }
    return () => {
      clear && clear()
    }
  }, [images, speed, speedTochRotate, rotate, directionRotate])

  return canvasTarget
}