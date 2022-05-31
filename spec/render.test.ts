/**
 * @jest-environment jsdom
 */

import render, { DirectionRotate } from "../src/render"

global.Image = class extends window.Image {
  constructor() {
    super()
    setTimeout(() => {
      this && this.onload && this.onload({} as Event)
    }, 0);
  }
}

test("render", (done) => {
  const target = document.createElement('canvas')
  const context = target.getContext('2d');
  const frame1Image = new Image;  
  const frame2Image = new Image;
  frame1Image.src = "frame1"
  frame2Image.src = "frame2"

  const clear = render({
    target,
    images: [frame1Image, frame2Image],
    animationDelay: 0,
    autoplay: false,
    directionRotate: DirectionRotate.toRight,
    stepTouchRotate: 1
  })

  const getCurrentImage = () => {
    // @ts-ignore
    let events = context.__getEvents();
    return events[events.length-1].props.img.src
  }
  
  expect(getCurrentImage()).toBe(frame1Image.src);

  target.dispatchEvent(new MouseEvent("mousedown", { clientX: 0 }))
  target.dispatchEvent(new MouseEvent("mousemove", { clientX: 1}))
  
  expect(getCurrentImage()).toBe(frame2Image.src);

  clear()

  render({
    target,
    images: [frame1Image, frame2Image],
    animationDelay: 100,
    autoplay: true,
    directionRotate: DirectionRotate.toRight,
    stepTouchRotate: 1
  })

  expect(getCurrentImage()).toBe(frame1Image.src);

  setTimeout(() => {
    expect(getCurrentImage()).toBe(frame2Image.src);
    done()
  }, 150)

  setTimeout(() => {
    expect(getCurrentImage()).toBe(frame1Image.src);
    done()
  }, 250)

})