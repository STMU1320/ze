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
    this._status = Utils.assign(this._status, { styleChanged: true });
    this.shapes = [];
    // 计算图层相对于canvas坐标原点的偏移量
    this._updateComputed();
    this._initPalette();
  }

  _insertElement (ele, zIndex = 0) {
    const index = Utils.findLastIndex(this.shapes, (shape) => shape.zIndex <= zIndex);
    if (index === -1 ) {
      this.shapes.unshift(ele);
    } else {
      this.shapes.splice(index + 1, 0, ele);
    }
  }

  _initPalette () {
    const canvas = this.container.getCanvas();
    this.palette = document.createElement('canvas');
    this.palette.width = canvas.element.width;
    this.palette.height = canvas.element.height;
    const brush = this.palette.getContext('2d');
    this.brush = brush;
    // this._initBrush();
  }

  _initBrush () {
    const { attrs, style, brush } = this;
    const { opacity } = attrs;
    const parentCtx = this.container.getContext();
    Object.keys(style).forEach(attr => {
      brush[attr] = style[attr];
    });
    if (opacity !== 1) {
      brush.globalAlpha = Utils.clamp(parentCtx.globalAlpha * opacity, 0, 1);
    } else {
      brush.globalAlpha = parentCtx.globalAlpha;
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
    const { shapes, brush, palette, attrs } = this;
    const { x, y } = attrs;
    const status = this.getStatus();
    if (status.styleChanged) {
      this._initBrush();
    }
    if (!status.drawn || status.dirty) {
      brush.clearRect(0, 0, palette.width, palette.height);
      shapes.forEach(shape => {
        shape._draw(brush);
      });
    }
    ctx.drawImage(palette, x, y, palette.width, palette.height);
    this.setStatus({ drawn: true, dirty: false, styleChanged: false });
  }

  getContext () {
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
    this._insertElement(shape, options.zIndex);
    return shape;
  }

  addLayer (options = {}) {
    const newLayer = new Layer(options, this);
    this._insertElement(newLayer, options.zIndex);
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