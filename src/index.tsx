import React from "react"
import useCanvas, { TInteractiveImagesProps } from "./useCanvas"

export default function Interactive3D({ className, ...props }: TInteractiveImagesProps) {
  const canvasTarget = useCanvas(props)
  return (
    <canvas className={className} ref={canvasTarget} style={{width: "100%"}}/>
  )
}