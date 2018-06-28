import Shape from './shape';
import Element from './element';
import Utils from '../utils';

export default class Layer extends Element {
  constructor (container, cfg) {
    super(container, 'layer');
    this.attrs = Object.assign({}, cfg);
    this.shapes = [];
  }

  includes (x, y) {
    const shapes = this.shapes;
    if (shapes.length > 0) {
      return shapes.some(shape => shape.includes(x, y));
    }

    return false;
  }

  addShape (type, options = {}) {
    const shapeType = Utils.upperFirst(type);
    const shape = new Shape(shapeType, options, this);
    this.shapes.push(shape);
    return shape;
  }

  addLayer (options) {
    const newLayer = new Layer(this.container, options);
    this.shapes.push(newLayer);
    return newLayer; 
  }

  draw (ctx) {
    const shapes = this.shapes;
    const context = ctx || this.getContext();
    shapes.forEach(shape => {
      shape.draw(context);
    });
  }
}