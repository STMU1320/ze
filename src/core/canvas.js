import EventBus from './eventBus';
import Layer from './layer';
import Utils from 'utils';

export default class Canvas extends EventBus {
  static ATTRS = {
    width: 300,
    height: 300
  }
  constructor (ele, cfg) {
    super();
    if (!ele) {
      ele = document.body;
    } else if ( typeof ele === 'object' && !(ele instanceof HTMLElement)) {
      cfg = ele;
      ele = document.body;
    }
    this.attrs = Object.assign({}, Canvas.ATTRS, cfg);
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
    const background = new Layer({ zIndex: -1 }, this);
    this.background = background;
    this.layers = [background];
    this._eventHandle = this._eventHandle.bind(this);
    this._initEvent();
  }

  _initEvent () {
    this.canvas.addEventListener('click', this._eventHandle, false);
  }

  _eventHandle (e) {
    const { x, y } = this.getPointInCanvas(e.clientX, e.clientY);
    const eventType = e.type;
    const subscribers = this.registeredElements[eventType];
    let triggerElements = [];
    subscribers.forEach(element => {
      if (element.includes(x, y)) {
        triggerElements.push(element);
      }
    });
    this.emit(eventType, triggerElements, e);
  }

  _getCanvasInstance () {
    return this;
  }

  getContext () {
    return this.context;
  }

  getCanvas () {
    return this.canvas;
  }

  getPointInCanvas (clientX, clientY) {
    const canvas = this.canvas;
    const canvasBox = canvas.getBoundingClientRect();
    const width = canvasBox.right - canvasBox.left;
    const height = canvasBox.bottom - canvasBox.top;
    return {
      x: (clientX - canvasBox.left) * (canvas.width / width),
      y: (clientY - canvasBox.top) * (canvas.height / height)
    };
  }


  addShape (type, options) {
    return this.background.addShape(type, options);
  }

  addLayer (options) {
    const newLayer = new Layer(options, this);
    let zIndex = 0;
    if (options && options.zIndex) {
      zIndex = options.zIndex;
    }
    const insertIndex = Utils.findLastIndex(this.layers, (layer) => layer.zIndex <= zIndex);
    if (insertIndex === -1) {
      this.layers.unshift(newLayer);
    } else {
      this.layers.splice(insertIndex + 1, 0, newLayer);
    }
    return newLayer;
  }

  draw () {
    const ctx = this.context;
    const layers = this.layers;
    layers.forEach(layer => {
      layer.draw(ctx);
    });
  }
}

