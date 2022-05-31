export default class TokenAbortImage {
  private _stack = [] as HTMLImageElement[]

  push(image: HTMLImageElement) {
    this._stack.push(image)
  }

  abort() {
    this._stack.forEach(img => {
      img.src = ""
      img.dataset.abort = "1"
    })

    this._stack.length = 0
  }

  remove(image: HTMLImageElement) {
    const index = this._stack.indexOf(image)
    if (index >= 0) {
      this._stack.splice(index, 1)
    }
  }
}