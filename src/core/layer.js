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
    this.shapes = [];
    this.deep = container instanceof Layer ? container.deep + 1 : 0;
    // offset 图层相对于canvas坐标原点的偏移量
    this._setOffset();
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
    this._initBrush();
  }

  _initBrush () {
    const brush = this.palette.getContext('2d');
    const { attrs, style } = this;
    const { opacity } = attrs;
    Object.keys(style).forEach(attr => {
      brush[attr] = style[attr];
    });
    brush.globalAlpha = Utils.clamp(brush.globalAlpha * opacity, 0, 1);
    this.brush = brush;
  }

  _setOffset () {
    const { attrs, container } = this;
    let offsetX = attrs.x,
        offsetY = attrs.y;
    if (container.type === 'Layer') {
      offsetX = container.computed.offsetX + attrs.x;
      offsetY = container.computed.offsetY + attrs.y;
    }
    Utils.assign(this.computed, { offsetX, offsetY });
  }

  _draw (ctx) {
    const { shapes, brush, palette, attrs } = this;
    const { x, y } = attrs;
    const status = this.getStatus();
    if (!status.drawn || status.dirty) {
      brush.clearRect(0, 0, palette.width, palette.height);
      shapes.forEach(shape => {
        shape._draw(brush);
      });
    }
    ctx.drawImage(palette, x, y, palette.width, palette.height);
    this.setStatus({ drawn: true, dirty: false });
  }

  getContext () {
    return this.brush;
  }

  setAttrs (attrs) {
    super.setAttrs(attrs);
    this._setOffset();
    
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
    const shapeType = Utils.upperFirst(type);
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