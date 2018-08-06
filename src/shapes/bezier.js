import Shape from '../core/shape';
import Utils from 'utils';
import Inside from './utils/inside';

export default class Bezier extends Shape {
  // 可提取一个Point对象 { x, y }

  static ATTRS = {
    p: [
      {
        x: 0,
        y: 10
      },
      {
        x: 10,
        y: 20
      },
      {
        x: 20,
        y: 10
      },
      {
        x: 20,
        y: 0
      }
    ],
    type: 'quadratic', // quadratic 二次方贝塞尔 cubic 三次方贝塞尔
    hasFill: false,
    hasStroke: true,
  }

  constructor (cfg, container) {
    const defaultCfg = Utils.assign({}, { attrs: Bezier.ATTRS } ,cfg);
    super('Bezier', defaultCfg, container);
  }

  includes (clientX, clientY) {
    const { p, type } = this.attrs;
    const lineWidth = this._getLineWidth();
    if (type === 'quadratic') {
      return Inside.quadraticline(
        p[0].x, p[0].y,
        p[1].x, p[1].y,
        p[2].x, p[2].y,
        lineWidth,
        clientX, clientY);
    } else if (type === 'cubic') {
      return Inside.cubicline(
        p[0].x, p[0].y,
        p[1].x, p[1].y,
        p[2].x, p[2].y,
        p[3].x, p[3].y,
        lineWidth,
        clientX, clientY);
    }
    return false;
  }
  
  _createPath (ctx) {
    const { p, type } = this.attrs;
    ctx.beginPath();
    ctx.moveTo(p[0].x, p[0].y);
    if (type === 'quadratic') {
      if (p.length < 3) {
        throw '二次贝塞尔曲线必须有三个坐标点';
      }
      ctx.quadraticCurveTo(p[1].x, p[1].y, p[2].x, p[2].y);
    } else if ('cubic') {
      if (p.length < 4) {
        throw '三次贝塞尔曲线必须有四个坐标点';
      }
      ctx.bezierCurveTo(p[1].x, p[1].y, p[2].x, p[2].y, p[3].x, p[3].y);
    }
  }
}         
