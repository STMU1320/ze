import EventBus from './eventBus';
import Layer from './layer';

export default class Canvas extends EventBus {

  constructor (ele, cfg) {
    super();
    if (!ele) {
      ele = document.body;
    } else if ( typeof ele === 'object' && !(ele instanceof HTMLElement)) {
      cfg = ele;
      ele = document.body;
    }
    this.attrs = Object.assign({
      width: 300,
      height: 300
    }, cfg);
    this._getCanvas(ele);
    this._init(this.attrs);
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
    this._eventHandle = this._eventHandle.bind(this);
    this._initEvent();
  }

  _initEvent () {
    this.canvas.addEventListener('click', this._eventHandle, false);
  }

  _eventHandle (e) {
    this.emit(e.type, e);
  }

  getContext () {
    return this.context;
  }

  getCanvas () {
    return this.canvas;
  }

  _getCanvasInstance () {
    return this;
  }

  addShape (type, options) {
    return this.background.addShape(type, options);
  }

  draw () {
    const ctx = this.context;
    const layers = this.layers;
    layers.forEach(layer => {
      layer.draw(ctx);
    });
  }
}

