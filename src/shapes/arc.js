import Shape from '../core/shape';
import Utils from 'utils';
import Inside from './utils/inside';

export default class Arc extends Shape {

  static ATTRS = {
    x: 0,
    y: 0,
    r: 10,
    start: 0,
    angle: 0
  }

  constructor (cfg, container) {
    const defaultCfg = Utils.assign({}, { attrs: Arc.ATTRS } ,cfg);
    super('Arc', defaultCfg, container);
  }

  includes (clientX, clientY) {
    const { x, y, r, start, angle } = this.attrs;
    const cw  = angle < 0;
    const lineWidth = this._getLineWidth();
    let startAngle = Utils.translateToPi(start);
    let endAngle = Utils.translateToPi(start + angle);
    if (Math.abs(angle) >= 360) {
      startAngle = 0;
      endAngle = Math.PI * 2;
    }
    return Inside.arcline(x, y, r, startAngle, endAngle, cw, lineWidth, clientX, clientY);
  }
  
  _createPath (ctx) {
    const { x, y, r, start, angle } = this.attrs;
    const cw  = angle < 0;
    let startAngle = Utils.translateToPi(start);
    let endAngle = Utils.translateToPi(start + angle);
    if (Math.abs(angle) >= 360) {
      startAngle = 0;
      endAngle = Math.PI * 2;
    }
    ctx.beginPath();
    ctx.arc(x, y, r, startAngle, endAngle, cw);
}
}         
