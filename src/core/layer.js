import Shape from './shape';
import Element from './element';
import Utils from '../utils';

export default class Layer extends Element {

  static ATTRS = {
    x: 0,
    y: 0,
    opacity: 1
  }

  constructor (container, cfg = {}) {
    super(container, 'Layer', cfg);
    this.attrs = Object.assign({}, Layer.ATTRS ,cfg.attrs);
    // offset 图层相对于canvas坐标原点的偏移量
    let offsetX = this.attrs.x,
        offsetY = this.attrs.y;
    if (container instanceof Layer) {
      offsetX = container.computed.offsetX + this.attrs.x;
      offsetY = container.computed.offsetY + this.attrs.y;
    }
    this.computed = Object.assign(this.computed, { offsetX, offsetY });
    this.shapes = [];
  }

  _insertElement (ele, zIndex = 0) {
    const index = Utils.findLastIndex(this.shapes, (shape) => shape.zIndex <= zIndex);
    if (index === -1 ) {
      this.shapes.unshift(ele);
    } else {
      this.shapes.splice(index + 1, 0, ele);
    }
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
    const newLayer = new Layer(this, options);
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
    Object.keys(this.canvasAttrs).forEach(attr => {
      ctx[attr] = this.canvasAttrs[attr];
    });
    shapes.forEach(shape => {
      shape.draw(context);
    });
    context.restore();
    context.translate(-x, -y);
    context.globalAlpha = ga;
  }
}