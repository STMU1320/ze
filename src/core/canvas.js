import EventBus from './eventBus';
import Layer from './layer';
import Utils from 'utils';

export default class Canvas extends EventBus {
  static ATTRS = {
    width: 300,
    height: 300,
  };
  constructor(ele, cfg) {
    super();
    if (!ele) {
      ele = document.body;
    } else if (typeof ele === 'object' && !(ele instanceof HTMLElement)) {
      cfg = ele;
      ele = document.body;
    }
    const defaultCfg = Utils.assign({}, Canvas.ATTRS, cfg);
    const {width, height, style} = defaultCfg;
    this.timer = null;
    this.width = width;
    this.height = height;
    this.style = style;
    this.layers = [];
    this.computed = {shapeLength: 0, layerLength: 0, animate: 0};
    this._heritage = { style };
    this._status = {drawn: false, dirty: false};
    this._initElement(ele);
    this._initEvent();
    this._initBackground();
    this._initDrawInfo();
  }

  _initElement(container) {
    const {width, height, style} = this;
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
    this.element = canvas;
    this.element.width = width;
    this.element.height = height;
    this.container = container;
    this.context = canvas.getContext('2d');
    if (style) {
      Object.keys(style).forEach(key => {
        this.context[key] = style[key];
      });
    }
  }

  _initBackground() {
    const background = new Layer({zIndex: -1}, this);
    this._background = background;
    this.layers.unshift(background);
    this.emit('@@change', 'layer', 1);
  }

  _initEvent() {
    this.element.addEventListener('click', this._eventHandle, false);
    this.element.addEventListener('dblclick', this._eventHandle, false);
    this.element.addEventListener('mousedown', this._eventHandle, false);
    this.element.addEventListener('mouseup', this._eventHandle, false);
    this.element.addEventListener('mousemove', this._eventHandle, false);
    // this.on('@@update', this.update);
    this.on('@@change', this._contentChange);
    this.on('@@clear', this._clearEventAsync);
  }

  _initDrawInfo() {
    this.drawInfo = {
      drawTime: null,
      fps: 0,
    };
  }

  _updateDrawInfo() {
    const {drawTime} = this.drawInfo;
    const now = Date.now();
    const fps = drawTime ? ~~(1000 / (now - drawTime) + 0.5) : 0;
    Utils.assign(this.drawInfo, {fps, drawTime: now});
  }

  _eventHandle = e => {
    const {x, y} = this._canvasPoint(e.clientX, e.clientY);
    const eventType = e.type;
    const subscribers = this.registeredElements[eventType];

    const listenerIter = (arr) => {
      let out = [];
      if (!Array.isArray(arr)) {
        return;
      }
      arr.forEach(element => {
        let layerX = x, layerY = y;
        if (element.container.type === 'Layer') {
          layerX -= element.container.computed.offsetX;
          layerY -= element.container.computed.offsetY;
        }
        if (element.includes(layerX, layerY)) {
          const position = { x, y, layerX, layerY };
          const eventData = this._createEventData(eventType, element, position, e);
          out.push({ element, eventData });
        }
      });
      return out;
    };

    const trigger = listenerIter(subscribers);

    if (eventType === 'mousemove') {
      const iterate = (item) => item.element;
      const lastTrigger = this._lastTrigger;
      const outListener = this.registeredElements['mouseout'] || [];
      const enterListener = this.registeredElements['mouseenter'] || [];
      const all = [...outListener, ...enterListener];
      const validTrigger = listenerIter(all);
      
      const out = Utils.differenceBy(lastTrigger, validTrigger, iterate);
      const enter = Utils.differenceBy(validTrigger, lastTrigger, iterate);
      // console.log('enter', enter);
      // console.log(validTrigger);
      if (!Utils.isEmpty(enter)) {
        this.emit('mouseenter', enter);
      }
      if (!Utils.isEmpty(out)) {
        this.emit('mouseout', out);
      }
      this._lastTrigger = validTrigger;
    }
    if (!Utils.isEmpty(trigger)) {
      this.emit(eventType, trigger);
    }
  };

  _setComputed(obj) {
    Utils.assign(this.computed, obj);
  }

  _contentChange(type, changeNum) {
    const {shapeLength, layerLength} = this.computed;
    if (type === 'layer') {
      this._setComputed({layerLength: layerLength + changeNum});
    } else {
      this._setComputed({shapeLength: shapeLength + changeNum});
    }
  }

  _clearEventAsync({shapes}) {
    this._clearEvent(shapes);
    // setTimeout(() => {
    // }, 100);
  }

  _canvasPoint(clientX, clientY) {
    const canvas = this.element;
    const canvasBox = canvas.getBoundingClientRect();
    const width = canvasBox.right - canvasBox.left;
    const height = canvasBox.bottom - canvasBox.top;
    return {
      x: (clientX - canvasBox.left) * (canvas.width / width),
      y: (clientY - canvasBox.top) * (canvas.height / height),
    };
  }

  _setStatus(status) {
    Object.assign(this._status, status);
  }

  
  _setHeritage (heritage) {
    Object.assign(this._heritage, heritage);
  }
  
  getHeritage () {
    return this._heritage;
  }

  getStatus() {
    return this._status;
  }

  getContext() {
    return this.context;
  }

  getCanvas() {
    return this;
  }

  addShape(type, options) {
    const shape = this._background.addShape(type, options);
    this.emit('@@change', 'shape', 1);
    return shape;
  }

  addLayer(options, _ops) {
    // let newLayer;
    if (options instanceof Layer) {
      let animate = options.getOriginal('animate');
      if (animate) {
        options.animate = animate;
      }
      options = Utils.assign({}, options, _ops);
    }
    const newLayer = new Layer(options, this);
    const zIndex = newLayer.zIndex || 0;
    const insertIndex = Utils.findLastIndex(
      this.layers,
      layer => layer.zIndex <= zIndex
    );
    newLayer._weight = (insertIndex + 1);
    if (insertIndex === -1) {
      this.layers.unshift(newLayer);
    } else {
      this.layers.splice(insertIndex + 1, 0, newLayer);
    }
    this.emit('@@change', 'layer', 1);
    return newLayer;
  }

  remove(...shapes) {
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
      this.emit('@@clearEvent', {shapes: rml});
    }

    return removed;
  }

  clear() {
    const {element} = this;
    this.context.clearRect(0, 0, element.width, element.height);
  }

  update() {
    const { drawn } = this.getStatus();
    if (drawn) {
      this.draw();
    }
  }

  _draw = () => {
    const ctx = this.context;
    const layers = this.layers;
    const status = this.getStatus();
    this._updateDrawInfo();
    this.clear();
    layers.forEach(layer => {
      layer._draw(ctx);
    });

    if (!status.drawn) {
      this._setStatus({drawn: true});
      this.emit('@@play');
    }
    if (this.computed.animate > 0) {
      this.timer = requestAnimationFrame(this._draw);
    } else {
      this.timer = null;
    }
  }
  draw() {
    if (this.timer) {
      cancelAnimationFrame(this.timer);
    }
    this.timer = requestAnimationFrame(this._draw);
  }
}
