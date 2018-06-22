export default class Canvas {
  constructor (ele, cfg) {
    if (!ele) {
      ele = document.body;
    } else if ( typeof ele === 'object' && !(ele instanceof HTMLElement)) {
      ele = document.body;
      cfg = ele;
    }
    this._getCanvas(ele);
  }

  _getCanvas (container) {
    let canvas;
    if (typeof container === 'string') {
      container = document.getElementById(container);
    }
    if (container instanceof HTMLCanvasElement) {
      canvas = container;
      container = container.parentElement;
    } else if (container instanceof HTMLElement) {
      canvas = document.createElement('canvas');
      container.appendChild(canvas);
    }
    if (!canvas) {
      throw 'get canvas element failed!'
    }
    this.canvas = canvas;
    this.container = container;
  }
}

