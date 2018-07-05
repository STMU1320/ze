import Shape from './shape';
import Element from './element';
import Utils from '../utils';

export default class Layer extends Element {

  static ATTRS = {
    x: 0,
    y: 0,
    opacity: 1
  }

  constructor (cfg = {}, container) {
    super(container, 'Layer', cfg);
    this.attrs = Object.assign({}, Layer.ATTRS ,cfg.attrs);
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
    this.palette.width = canvas.width;
    this.palette.height = canvas.height;
    this._initBrush();
  }

  _initBrush () {
    const brush = this.palette.getContext('2d');
    const { attrs, drawStyle } = this;
    const { opacity } = attrs;
    const parentBrush = this.getContext();
    const parentBrushStyle = {};
    Element.DRAW_STYLE_KEYS.forEach((attr) => {
      parentBrushStyle[attr] = parentBrush[attr];
    });
    const brushStyle = Object.assign(parentBrushStyle, drawStyle);
    brushStyle.globalAlpha = Utils.clamp(brushStyle.globalAlpha * opacity, 0, 1);
    Object.keys(brushStyle).forEach(attr => {
      brush[attr] = brushStyle[attr];
    });
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
    Object.assign(this.computed, { offsetX, offsetY });
  }

  _draw (ctx) {
    const { shapes, brush, palette, computed } = this;
    const { offsetX, offsetY } = computed;
    const context = ctx;
    const status = this.getStatus();
    if (!status.drawn || status.dirty) {
      brush.clearRect(0, 0, palette.width, palette.height);
      brush.translate(offsetX, offsetY);
      shapes.forEach(shape => {
        shape._draw(brush);
      });
    }
    context.drawImage(palette, 0, 0, palette.width, palette.height);
    this.setStatus({ drawn: true });
    brush.translate(-offsetX, -offsetY);
  }

  getContext () {
    const { container } = this;
    if (container.type === 'Layer') {
      return container.brush;
    }
    return container.getContext();
  }

  setShapeAttrs (attrs) {
    Object.assign(this.attrs, attrs);
    this._setOffset();
    super.setShapeAttrs();
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
    const shape = new Shape(shapeType, options, this);
    this._insertElement(shape, options.zIndex);
    return shape;
  }

  addLayer (options = {}) {
    const newLayer = new Layer(options, this);
    this._insertElement(newLayer, options.zIndex);
    return newLayer; 
  }

}