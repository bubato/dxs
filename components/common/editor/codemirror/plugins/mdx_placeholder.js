// CodeMirror, copyright (c) by Margin Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/LICENSE

;(function (mod) {
  if (typeof exports === 'object' && typeof module === 'object') {
    // CommonJS
    mod(require('codemirror'))
    return
  }

  // eslint-disable-next-line no-undef
  if (typeof define === 'function' && define.amd) {
    // AMD
    // eslint-disable-next-line no-undef
    define(['codemirror'], mod)
    return
  }

  // Plain browser env
  // eslint-disable-next-line no-undef
  mod(CodeMirror)
})((CodeMirror) => {
  'use strict'

  CodeMirror.defineOption('mdxPlaceholder', '', function (cm, option, old) {
    if (option) {
      cm.on('change', onChange)
      cm.on('swapDoc', onChange)
      cm.parseXdPlaceholder()
    }
  })

  // noinspection ES6ConvertVarToLetConst,JSDeclarationsAtScopeStart
  const createPlaceholder = function (
    cm,
    line,
    ch,
    count,
    placeholderName,
    placeholderClass
  ) {
    const range = {
      from: {
        line,
        ch,
        sticky: null,
      },
      to: {
        line,
        ch: ch + count,
        sticky: null,
      },
    }
    const text = document.createTextNode(placeholderName)
    const widget = document.createElement('span')
    widget.appendChild(text)
    if (placeholderClass) {
      widget.className = placeholderClass
    }

    cm.markText(range.from, range.to, {
      replacedWith: widget,
      clearOnEnter: false,
      __isXdPlaceholder: true,
    })
  }

  const parseLines = function (cm, option, startLine, endLine) {
    const replacePlaceholder = function (replace) {
      const r = replace.match
      const groupIndex = replace.group
      const replaceFromCh = (line, index, text) => {
        if (!text) {
          return
        }

        const at = text.substr(index).search(r)
        if (at < 0) {
          return -1
        }

        const m = text.substr(index + at).match(r)
        const type = m[groupIndex]
        if (option.placeholderTexts[type]) {
          createPlaceholder(
            cm,
            line,
            index + at,
            m[0].length,
            option.placeholderTexts[type],
            option.className
          )
        } else if (option.invalid) {
          createPlaceholder(
            cm,
            line,
            index + at,
            m[0].length,
            option.invalid.text,
            option.invalid.className
          )
        }

        index += at + m[0].length
        return index
      }

      for (let line = startLine; line <= endLine; line++) {
        const lineText = cm.getLine(line)
        let index = 0
        while (index > -1) {
          index = replaceFromCh(line, index, lineText)
        }
      }
    }

    replacePlaceholder(option.replace)
  }

  const onChange = function (cm, obj) {
    const option = cm.getOption('mdxPlaceholder')
    if (!option) {
      return
    }

    if (!option.placeholderTexts) {
      return
    }

    if (obj.origin === 'setValue') {
      cm.parseXdPlaceholder()
      return
    }

    const startLine = obj.from.line
    let endLine = obj.to.line
    if (obj.origin === 'paste') {
      endLine = startLine + obj.text.length
    }

    parseLines(cm, option, startLine, endLine)
  }

  CodeMirror.defineExtension('parseXdPlaceholder', function () {
    const option = this.getOption('mdxPlaceholder')
    const size = this.getDoc().size
    if (size > 0) {
      parseLines(this, option, 0, size)
    }
  })

  CodeMirror.defineExtension('isXdPlaceholder', function (pos) {
    const marks = this.findMarksAt(pos)
    for (let i = 0; i < marks.length; ++i) {
      if (marks[i].__isXdPlaceholder) {
        return true
      }
    }
  })
})
