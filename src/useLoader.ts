import React, { useRef } from "react";
import LoadImage, { TLoadImageError } from "./loadImage"
import TokenAbortImage from "./TokenAbortImage"

export type THandlerLoadImageError = (err: TLoadImageError) => void
export type THandlerLoadImageSuccess = (list: HTMLImageElement[]) => void

type TPropsLoader = {
  urls: string[],
  onProgress ?: (progress: number, counter?: number) => void,
  onLoad ?: THandlerLoadImageSuccess,
  onError: undefined | THandlerLoadImageError
}

export default function useLoader({urls, onError, onLoad, onProgress}: TPropsLoader) {
  const [images, dispatch] = React.useState([] as HTMLImageElement[])
  const counter = useRef<number | undefined>()
  const handleError = useRef(onError)
  const handlerProgress = useRef(onProgress)
  const handlerOnLoad = useRef(onLoad)
  
  React.useEffect(() => {
    const token = new TokenAbortImage;
    
    if (urls.length) {
      handlerProgress.current && handlerProgress.current(0, 0);
      
      const onProgress = () => {
        const i = counter.current = counter.current === undefined ? 1 : counter.current + 1
        if (handlerProgress.current && i !== null && urls.length) {
          const progress = i * 100 / urls.length
          handlerProgress.current(progress, i)
        }
      }
  
      const loading = urls.map(url => LoadImage(url, token).then(image => {
        onProgress();
        return image
      }))

      if (loading.length) {
        Promise.all(loading)
        .then((list) => {
          counter.current = undefined
          dispatch(list);
          handlerOnLoad.current && handlerOnLoad.current(list)
        })
        .catch((error) => {
          if (handleError.current) handleError.current(error)
          token.abort();
        })
      }
    }

    return () => { token.abort() }
  }, [urls])

  return images
}