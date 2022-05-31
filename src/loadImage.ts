import TokenAbortImage from "./TokenAbortImage"

export type TLoadImageError = {
  abort: boolean,
  message: string,
  url: string
}
export default function LoadImage(url: string, token: TokenAbortImage) {
  return new Promise<HTMLImageElement>((resolve, reject: (reason: TLoadImageError) => void) => {
    const image = new Image()
    
    image.onload = function onLoadImage() {
      token.remove(image);
      resolve(image)
    }
    image.onerror = function onError() {
      const ret = { url, message: "", abort: false }
      if (image.dataset.abort) {
        ret.message = `Image load interrupted: ${url}`
        ret.abort = true
      } else {
        ret.message = `Error on load image: ${url}`
      }
      reject(ret)
    }
    image.src = url

    token.push(image)
  })
}