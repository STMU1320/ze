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
    this.computed = { shapeLength: 0, layerLength: 0 };
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
    this._background = null;
    this.layers = [];
    this._status = { drawn: true };
    this._initEvent();
    this._initDrawInfo();
  }

  _initBackground () {
    const background = new Layer({ zIndex: -1 }, this);
    this._background = background;
    this.layers.unshift(background);
    this.emit('@@change', 'layer', 1);
  }

  _initEvent () {
    this.canvas.addEventListener('click', this._eventHandle, false);
    this.on('@@update', this.update);
    this.on('@@change', this._contentChange);
    this.on('@@clear', this._clearEventAsync);
  }

  _initDrawInfo () {
    this.drawInfo = {
      drawTime: Date.now(),
      fps: 0
    };
  }

  _updateDrawInfo () {
    const { drawTime } = this.drawInfo;
    const now = Date.now();
    const fps = ~~(1000 / (now - drawTime) + 0.5);
    this.drawInfo.fps = fps;
    this.drawInfo.drawTime = now;
  }

  _eventHandle = (e) => {
    const { x, y } = this.getPointInCanvas(e.clientX, e.clientY);
    const eventType = e.type;
    const subscribers = this.registeredElements[eventType];
    if (subscribers) {
      let triggerElements = [];
      subscribers.forEach(element => {
        if (element.includes(x, y)) {
          triggerElements.push(element);
        }
      });
      this.emit(eventType, triggerElements, e);
    }
  }

  _getCanvasInstance = () => {
    return this;
  }
  _setComputed (obj) {
    Object.assign(this.computed, obj);
  }

  _contentChange (type, changeNum) {
    const { shapeLength, layerLength } = this.computed;
    if (type === 'layer') {
      this._setComputed({ layerLength: layerLength + changeNum });
    } else {
      this._setComputed({ shapeLength: shapeLength + changeNum });
    }
  }

  _clearEventAsync ({ elements }) {
    // console.log(elements);
    setTimeout( () => {
      this._clearEvent(elements);
    }, 100);
  }

  getStatus () {
    return { ...this._status };
  }

  setStatus (status) {
    Object.assign(this._status, status);
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
    if (!this._background) {
      this._initBackground();
    }
    const shape = this._background.addShape(type, options);
    this.emit('@@change', 'shape', 1);
    return shape;
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
    this.emit('@@change', 'layer', 1);
    return newLayer;
  }

  remove (...shapes) {
    const shape = [];
    const layer = [];
    let removed = [];
    shapes.forEach(s => {
      if (s.type === 'Layer') {
        layer.push(s);
      } else {
        shape.push(s);
      }
    });
    if (shape.length > 0) {
      // 图层的remove方法会自动触发清除事件
      removed = this._background.remove(...shape);
      this.emit('@@change', 'shape', -removed.length);
    }
    if (layer.length > 0) {
      const rml = Utils.remove(this.layers, l => layer.includes(l));
      removed = removed.concat(rml);
      this.emit('@@change', 'layer', -rml.length);
      this.emit('@@clearEvent', { elements: rml });
    }

    return removed;
  }

  clear () {
    const { width, height } = this.attrs;
    this.context.clearRect(0, 0, width, height);
  }

  update (auto) {
    const { drawTime } = this.drawInfo;
    const now = Date.now();
    // 判断一下是动画自动的更新还是手动触发的更新
    if (auto === 'auto') {
      if (now - drawTime > 16) {
        this.draw();
      }
    } else {
      this.draw();
    }
  }

  draw () {
    const ctx = this.context;
    const layers = this.layers;
    const status = this.getStatus();
    this._updateDrawInfo();
    this.clear();
    layers.forEach(layer => {
      layer._draw(ctx);
    });

    if (!status.drawn) {
      this.setStatus({ drawn: true });
      this.emit('@@play');
    }
  }
}

