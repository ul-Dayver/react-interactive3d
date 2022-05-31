/**
 * @jest-environment jsdom
 */
import { renderHook } from '@testing-library/react-hooks'
import useLoader from "../src/useLoader"

test("useLoader: onError", done => {
  const src = "test2"
  global.Image = class extends window.Image {
    constructor() {
      super()
      setTimeout(() => {
        const _src = this.src.replace(this.baseURI, "").trim()
        if (_src === src)
        this && this.onerror && this.onerror({} as Event);
      }, 10);
    }
  }
  
  const onError = (error: {abort: boolean, message: string, url: string}) => {
    expect(error.url).toEqual(src)
    expect(error.message).toEqual(`Error on load image: ${src}`)
    expect(error.abort).toEqual(false)
    
    done()
  }

  renderHook(() => useLoader({urls: ["test1", "test2"], onError}))
})

test("useLoader: onProgress and onLoad", async () => {
  const length = 3
  global.Image = class extends window.Image {
    constructor() {
      super()
      setTimeout(() => {
        this && this.onload && this.onload({} as Event)
      }, 0);
    }
  }
  
  let lastProgress: number | undefined = undefined;
  let onLoadValue: HTMLImageElement[] = [];

  const onProgress = (progress: number) => {
    lastProgress = progress
  }
  const onLoad = (images: HTMLImageElement[]) => {
    onLoadValue = images
  }
  
  let urls = new Array(length).fill("test").map((el, i) => el + i);

  const { result, waitForValueToChange } = renderHook(() => useLoader({urls, onProgress, onLoad, onError: () => {}}))
  await waitForValueToChange(() => result.current, { timeout: 2000 })
  
  const images = result.current

  expect(lastProgress).toBe(100)
  expect(onLoadValue).toStrictEqual(images)
  expect(images.length).toBe(length)
  images.forEach((image, i) => {
    const src = image.src.replace(image.baseURI, "").trim()
    expect(src).toBe(`test${i}`)
  })

})
