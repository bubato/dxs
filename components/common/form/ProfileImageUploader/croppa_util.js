import CanvasExifOrientation from 'canvas-exif-orientation'

export default {
  onePointCoord(point, vm) {
    const { canvas, quality } = vm
    const rect = canvas.getBoundingClientRect()
    const clientX = point.clientX
    const clientY = point.clientY
    return {
      x: (clientX - rect.left) * quality,
      y: (clientY - rect.top) * quality,
    }
  },

  getPointerCoords(evt, vm) {
    let pointer
    if (evt.touches && evt.touches[0]) {
      pointer = evt.touches[0]
    } else if (evt.changedTouches && evt.changedTouches[0]) {
      pointer = evt.changedTouches[0]
    } else {
      pointer = evt
    }
    return this.onePointCoord(pointer, vm)
  },

  getPinchDistance(evt, vm) {
    const pointer1 = evt.touches[0]
    const pointer2 = evt.touches[1]
    const coord1 = this.onePointCoord(pointer1, vm)
    const coord2 = this.onePointCoord(pointer2, vm)

    return Math.sqrt(
      Math.pow(coord1.x - coord2.x, 2) + Math.pow(coord1.y - coord2.y, 2)
    )
  },

  getPinchCenterCoord(evt, vm) {
    const pointer1 = evt.touches[0]
    const pointer2 = evt.touches[1]
    const coord1 = this.onePointCoord(pointer1, vm)
    const coord2 = this.onePointCoord(pointer2, vm)

    return {
      x: (coord1.x + coord2.x) / 2,
      y: (coord1.y + coord2.y) / 2,
    }
  },

  imageLoaded(img) {
    return img.complete && img.naturalWidth !== 0
  },

  rAFPolyfill() {
    // rAF polyfill
    if (typeof document === 'undefined' || typeof window === 'undefined') return
    let lastTime = 0
    const vendors = ['webkit', 'moz']
    for (let x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
      window.requestAnimationFrame =
        window[vendors[x] + 'RequestAnimationFrame']
      window.cancelAnimationFrame =
        window[vendors[x] + 'CancelAnimationFrame'] || // Webkit中此取消方法的名字变了
        window[vendors[x] + 'CancelRequestAnimationFrame']
    }

    if (!window.requestAnimationFrame) {
      window.requestAnimationFrame = function (callback) {
        const currTime = new Date().getTime()
        const timeToCall = Math.max(0, 16.7 - (currTime - lastTime))
        const id = window.setTimeout(function () {
          const arg = currTime + timeToCall
          callback(arg)
        }, timeToCall)
        lastTime = currTime + timeToCall
        return id
      }
    }
    if (!window.cancelAnimationFrame) {
      window.cancelAnimationFrame = function (id) {
        clearTimeout(id)
      }
    }

    Array.isArray = function (arg) {
      return Object.prototype.toString.call(arg) === '[object Array]'
    }
  },

  toBlobPolyfill() {
    if (
      typeof document === 'undefined' ||
      typeof window === 'undefined' ||
      !HTMLCanvasElement
    )
      return
    let binStr, len, arr
    if (!HTMLCanvasElement.prototype.toBlob) {
      Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
        value(callback, type, quality) {
          binStr = atob(this.toDataURL(type, quality).split(',')[1])
          len = binStr.length
          arr = new Uint8Array(len)

          for (let i = 0; i < len; i++) {
            arr[i] = binStr.charCodeAt(i)
          }

          callback(new Blob([arr], { type: type || 'image/png' }))
        },
      })
    }
  },

  eventHasFile(evt) {
    const dt = evt.dataTransfer || evt.originalEvent.dataTransfer
    if (dt.types) {
      for (let i = 0, len = dt.types.length; i < len; i++) {
        if (dt.types[i] === 'Files') {
          return true
        }
      }
    }

    return false
  },

  getFileOrientation(arrayBuffer) {
    const view = new DataView(arrayBuffer)
    // eslint-disable-next-line unicorn/number-literal-case
    if (view.getUint16(0, false) !== 0xffd8) return -2
    const length = view.byteLength
    let offset = 2
    while (offset < length) {
      const marker = view.getUint16(offset, false)
      offset += 2
      // eslint-disable-next-line unicorn/number-literal-case
      if (marker === 0xffe1) {
        if (view.getUint32((offset += 2), false) !== 0x45786966) return -1
        const little = view.getUint16((offset += 6), false) === 0x4949
        offset += view.getUint32(offset + 4, little)
        const tags = view.getUint16(offset, little)
        offset += 2
        for (let i = 0; i < tags; i++) {
          if (view.getUint16(offset + i * 12, little) === 0x0112) {
            return view.getUint16(offset + i * 12 + 8, little)
          }
        }
      }
      // eslint-disable-next-line unicorn/number-literal-case
      else if ((marker & 0xff00) !== 0xff00) break
      else offset += view.getUint16(offset, false)
    }
    return -1
  },

  parseDataUrl(url) {
    const reg = /^data:([^;]+)?(;base64)?,(.*)/gim
    return reg.exec(url)[3]
  },

  base64ToArrayBuffer(base64) {
    const binaryString = atob(base64)
    const len = binaryString.length
    const bytes = new Uint8Array(len)
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }
    return bytes.buffer
  },

  getRotatedImage(img, orientation) {
    const _canvas = CanvasExifOrientation.drawImage(img, orientation)
    const _img = new Image()
    _img.src = _canvas.toDataURL()
    return _img
  },

  flipX(ori) {
    if (ori % 2 === 0) {
      return ori - 1
    }

    return ori + 1
  },

  flipY(ori) {
    const map = {
      1: 4,
      4: 1,
      2: 3,
      3: 2,
      5: 8,
      8: 5,
      6: 7,
      7: 6,
    }

    return map[ori]
  },

  rotate90(ori) {
    const map = {
      1: 6,
      2: 7,
      3: 8,
      4: 5,
      5: 2,
      6: 3,
      7: 4,
      8: 1,
    }

    return map[ori]
  },

  numberValid(n) {
    return typeof n === 'number' && !isNaN(n)
  },
}
