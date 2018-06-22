import * as Shape from '../shape';
import Utils from '../utils';

export default class Layer {
  constructor (container, cfg) {
    this.attrs = Object.assign({}, cfg);
    this.container = container;
    this.shapes = [];
  }

  addShape (type, options = {}) {
    const shapeType = Utils.upperFirst(type);
    const shape = new Shape[shapeType](options, this);
    this.shapes.push(shape);
  }

  getContext () {
    return this.container.getContext();
  }

  draw (ctx) {
    const shapes = this.shapes;
    const context = ctx || this.getContext();
    shapes.forEach(shape => {
      shape.draw(context);
    });
  }
}