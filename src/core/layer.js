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
    // offset 图层相对于canvas坐标原点的偏移量
    this._setOffset();
  }

  _insertElement (ele, zIndex = 0) {
    const index = Utils.findLastIndex(this.shapes, (shape) => shape.zIndex <= zIndex);
    if (index === -1 ) {
      this.shapes.unshift(ele);
    } else {
      this.shapes.splice(index + 1, 0, ele);
    }
  }

  _setOffset () {
    const { attrs, container } = this;
    let offsetX = attrs.x,
        offsetY = attrs.y;
    if (container instanceof Layer) {
      offsetX = container.computed.offsetX + attrs.x;
      offsetY = container.computed.offsetY + attrs.y;
    }
    Object.assign(this.computed, { offsetX, offsetY });
  }

  setShapeAttrs (attrs) {
    Object.assign(this.attrs, attrs);
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
    const shape = new Shape(shapeType, options, this);
    this._insertElement(shape, options.zIndex);
    return shape;
  }

  addLayer (options = {}) {
    const newLayer = new Layer(options, this);
    this._insertElement(newLayer, options.zIndex);
    return newLayer; 
  }

  draw (ctx) {
    const shapes = this.shapes;
    const { x, y, opacity } = this.attrs;
    const context = ctx || this.getContext();
    const ga = context.globalAlpha;
    context.globalAlpha = Utils.clamp(ga * opacity, 0, 1);
    context.translate(x, y);
    context.save();
    Object.keys(this.drawAttrs).forEach(attr => {
      ctx[attr] = this.drawAttrs[attr];
    });
    shapes.forEach(shape => {
      shape.draw(context);
    });
    context.restore();
    context.translate(-x, -y);
    context.globalAlpha = ga;
  }
}