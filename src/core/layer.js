import Shape from './shape';
import Element from './element';
import Utils from '../utils';

export default class Layer extends Element {
  constructor (container, cfg) {
    super(container);
    this.attrs = Object.assign({}, cfg);
    this.shapes = [];
  }

  addShape (type, options = {}) {
    const shapeType = Utils.upperFirst(type);
    const shape = new Shape(shapeType, options, this);
    this.shapes.push(shape);
    return shape;
  }

  draw (ctx) {
    const shapes = this.shapes;
    const context = ctx || this.getContext();
    shapes.forEach(shape => {
      shape.draw(context);
    });
  }
}