import * as Shapes from '../shapes';
import Element from './element';
import Utils from '../utils';

export default class Layer extends Element {

  static ATTRS = {
    x: 0,
    y: 0,
    opacity: 1
  }

  constructor (cfg = {}, container) {
    const defaultCfg = Utils.assign({},  { attrs: Layer.ATTRS }, cfg);
    super(container, 'Layer', defaultCfg);
    this._status = Utils.assign(this._status);
    this.shapes = [];
    // 计算图层相对于canvas坐标原点的偏移量
    this._updateComputed();
    this._initPalette();
  }

  _insertElement (ele) {
    let zIndex = ele.zIndex || 0;
    const index = Utils.findLastIndex(this.shapes, (shape) => shape.zIndex <= zIndex);
    ele._weight = (ele._weight + index + 1);
    if (index === -1 ) {
      this.shapes.unshift(ele);
    } else {
      this.shapes.splice(index + 1, 0, ele);
    }
  }

  _initPalette () {
    if (!this.brush) {
      const canvas = this.container.getCanvas();
      this.palette = document.createElement('canvas');
      this.palette.width = canvas.element.width;
      this.palette.height = canvas.element.height;
      const brush = this.palette.getContext('2d');
      this.brush = brush;
      this._initBrush();
    }
  }

  _initBrush () {
    const { attrs, style, brush } = this;
    const { opacity } = attrs;
    const parentCtx = this.container.getContext();
    const heritage = this.container.getHeritage();
    const drawStyle = Object.assign({}, heritage.style, style);
    Object.keys(drawStyle).forEach(attr => {
      brush[attr] = drawStyle[attr];
    });
    if (opacity !== 1) {
      brush.globalAlpha = Utils.clamp(parentCtx.globalAlpha * opacity, 0, 1);
    } else {
      brush.globalAlpha = parentCtx.globalAlpha;
    }
    if (this._getFontSize(brush.font) < 12) {
      brush.font = brush.font.replace(/(^|\s)(\d{1,}px)(\s|$)/ig, ' 12px ');
    }
  }

  _updateComputed () {
    const { attrs, container, shapes } = this;
    let offsetX = attrs.x,
        offsetY = attrs.y;
    if (container.type === 'Layer') {
      offsetX = container.computed.offsetX + attrs.x;
      offsetY = container.computed.offsetY + attrs.y;
    }
    Utils.assign(this.computed, { offsetX, offsetY });
    // 更新图层的偏移量，应该有更好的实现机制
    shapes.forEach(shape => {
      if (shape.type === 'Layer') {
        shape._updateComputed();
      }
    });
  }

  _draw (ctx) {
    const { shapes, brush, palette, attrs, visible } = this;
    const { x, y } = attrs;
    const parentStatus = this.container.getStatus();
    if (parentStatus.styleChanged) {
      this._initBrush();
    }
    if (visible) {
      if (!status.drawn || status.dirty) {
        brush.clearRect(0, 0, palette.width, palette.height);
        shapes.forEach(shape => {
          shape._draw(brush);
        });
      }
      ctx.drawImage(palette, x, y, palette.width, palette.height);
      this.setStatus({ drawn: true, dirty: false, styleChanged: false });
    }
  }

  getContext () {
    if (!this.brush) {
      this._initPalette();
    }
    return this.brush;
  }

  includes (clientX, clientY) {
    const shapes = this.shapes;
    const { offsetX, offsetY } = this.computed;
    if (clientX >= offsetX && clientY >= offsetY) {
      if (shapes.length > 0) {
        return shapes.some(shape => shape.includes(clientX, clientY));
      }
    }

    return false;
  }

  addShape (type, options = {}) {
    // let shape;
    if (type instanceof Element) {
      let animate = type.getOriginal('animate');
      if (animate) {
        options.animate = animate;
      }
      options = Utils.assign({}, type, options);
      type = options.type;
      // shape.container = this;
    }
    let shapeType = Utils.upperFirst(type);
    if (shapeType === 'Image') {
      shapeType = 'ZImage';
    }
    if (shapeType === 'Video') {
      shapeType = 'ZVideo';
    }
    if (!Shapes[shapeType]) {
      throw `目前还不支持${shapeType}类型的图形`;
    }
    const shape = new Shapes[shapeType](options, this);
    this._insertElement(shape);
    return shape;
  }

  addLayer (options = {}, _ops) {
    // let newLayer;
    if ( options instanceof Layer ) {
      let animate = options.getOriginal('animate');
      if (animate) {
        options.animate = animate;
      }
      options = Utils.assign({}, options, _ops);
    }
    const newLayer = new Layer(options, this);
    this._insertElement(newLayer);
    return newLayer; 
  }

  remove (...shapes) {
    const rmShape = Utils.remove(this.shapes, s => shapes.includes(s));
    if (rmShape.length) {
      const canvas = this.getCanvas();
      // canvas.emit('@@update', 'auto');
      canvas.emit('@@clear', { shapes: rmShape });
    }
    return rmShape;
  }

}