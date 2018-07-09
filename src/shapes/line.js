import Shape from '../core/shape';
import Utils from 'utils';
import Inside from './utils/inside';

export default class Line extends Shape {

  static ATTRS = {
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 10,
  }

  constructor (cfg, container) {
    const defaultCfg = Utils.assign({}, { attrs: Line.ATTRS, style: { lineWidth: 1 } } ,cfg);
    super('Line', defaultCfg, container);
  }

  includes (x, y) {
    const { x1, y1, x2, y2, lineWidth } = this.attrs;
    const { computed: { offsetX, offsetY } } = this.container;
    return Inside.line(x1, y1, x2, y2, lineWidth, x - offsetX, y - offsetY);
  }
  
  _createPath (ctx) {
    const { x1, y1, x2, y2 } = this.attrs;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
  }
}