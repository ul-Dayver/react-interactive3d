/**
 * @jest-environment jsdom
 */
import LoadImage from "../src/loadImage"
import TokenAbortImage from "../src/TokenAbortImage"

global.Image = class extends window.Image {
  constructor() {
    super()
    setTimeout(() => {
      const event = {} as Event
      const src = this.src.replace(this.baseURI, "").trim()
      if (!src) {
        this && this.onerror && this.onerror(event)
      } else {
        this && this.onload && this.onload(event);
      }
      
    }, 100);
  }
}

test("load image", () => {
  const token = new TokenAbortImage
  const src = "test"
  const loading = LoadImage(src, token)
  return loading.then((image) => {
    expect(image.src.replace(image.baseURI, "").trim()).toEqual(src)
  })
});

test("abort load image", () => {
  
  const token = new TokenAbortImage
  const src = "test"
  const loading = LoadImage(src, token)
  token.abort();
  return loading.then((image) => {
    throw new Error(image.src)
  }).catch(error => {
    expect(error.url).toEqual(src)
    expect(error.message).toEqual(`Image load interrupted: ${src}`)
    expect(error.abort).toEqual(true)
  })
});