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
    return Inside.line(x1, y1, x2, y2, lineWidth, x, y);
  }
  
  _createPath (ctx) {
    const { x1, y1, x2, y2 } = this.attrs;
    const { lineWidth } = this.style;
    if ((x1 === x2 && x1 % 1 === 0) || (y1 === y2 && y1 % 1 === 0)) {
      if (lineWidth === 1) {
        ctx.translate(-0.5, -0.5);
      }
    }
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
  }
}