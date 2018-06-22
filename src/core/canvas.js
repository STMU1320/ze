import Layer from './layer';

export default class Canvas {

  constructor (ele, cfg) {
    if (!ele) {
      ele = document.body;
    } else if ( typeof ele === 'object' && !(ele instanceof HTMLElement)) {
      cfg = ele;
      ele = document.body;
    }
    this.__cfg = Object.assign({
      width: 300,
      height: 300
    }, cfg);
    this._getCanvas(ele);
    this._init(this.__cfg);
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
      throw 'get canvas element failed!';
    }
    this.canvas = canvas;
    this.container = container;
  }

  _init (cfg) {
    this.canvas.width = cfg.width;
    this.canvas.height = cfg.height;
    this.context = this.canvas.getContext('2d');
    const background = new Layer(this);
    this.background = background;
    this.layers = [background];
  }

  getContext () {
    return this.context;
  }

  addShape (type, options) {
    this.background.addShape(type, options);
  }

  draw () {
    const ctx = this.context;
    const layers = this.layers;
    layers.forEach(layer => {
      layer.draw(ctx);
    });
  }
}

