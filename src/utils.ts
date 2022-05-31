export function draw (target: HTMLCanvasElement, image : HTMLImageElement) {
  image.height = target.offsetHeight
  image.width = target.offsetWidth
  
  const context = target.getContext("2d");
  if (context) {
    context.clearRect(0, 0, target.offsetWidth, target.offsetHeight),
    context.drawImage(image, 0, 0, image.width, image.height)
  }
}

interface IEventTarget extends EventTarget {
    attachEvent ?: (event: string, listener: EventListener) => boolean;
    detachEvent ?: (event: string, listener: EventListener) => void;
}

export function addEvent(el: IEventTarget, event: string, handler: EventListener, inputOptions?: boolean | Record<string, unknown>): void {
  if (!el) return;
  if (el.addEventListener) {
    el.addEventListener(event, handler, typeof inputOptions === "boolean" ? inputOptions : {capture: true, ...inputOptions});
  } else if (el.attachEvent) {
    el.attachEvent('on' + event, handler);
  } else {
    // @ts-ignore: Unreachable code error
    el['on' + event] = handler;
  }
}

export function removeEvent(el: IEventTarget, event: string, handler: EventListener, inputOptions?: boolean | Record<string, unknown>): void {
  if (!el) return;
  if (el.removeEventListener) {
    el.removeEventListener(event, handler, typeof inputOptions === "boolean" ? inputOptions : {capture: true, ...inputOptions});
  } else if (el.detachEvent) {
    el.detachEvent('on' + event, handler);
  } else {
    // @ts-ignore: Unreachable code error
    el['on' + event] = null;
  }
}

export function removeAttribute (el: Element, name: string) {
  if (el.removeAttribute) {
    el.removeAttribute(name)
  } else {
    const attr = el.getAttributeNode(name)
    if (attr) {
      el.removeAttributeNode(attr)
    }
  }
}