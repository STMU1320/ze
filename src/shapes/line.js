import Shape from '../core/shape';
import Utils from 'utils';
import Inside from './utils/inside';

export default class Line extends Shape {

  static ATTRS = {
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 10,
    hasFill: false,
    hasStroke: true,
    // dash: null
  }

  constructor (cfg, container) {
    const defaultCfg = Utils.assign({}, { attrs: Line.ATTRS } ,cfg);
    super('Line', defaultCfg, container);
  }

  includes (x, y) {
    const { x1, y1, x2, y2 } = this.attrs;
    const lineWidth = this._getLineWidth();
    return Inside.line(x1, y1, x2, y2, lineWidth, x, y);
  }
  
  _createPath (ctx) {
    const { x1, y1, x2, y2 } = this.attrs;
    const lineWidth = this._getLineWidth();
    if ((x1 === x2 && x1 % 1 === 0) || (y1 === y2 && y1 % 1 === 0)) {
      if ( lineWidth === 1) {
        ctx.translate(-0.5, -0.5);
      }
    }
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    // 改用原生Api實現
    // let rel = 0, vir = 0; 
    // if (Array.isArray(dash)) {
    //   rel = dash[0];
    //   vir = dash[1] || rel;
    // } else if (typeof dash === 'number') {
    //   rel = vir = dash;
    // }
    // if (rel !== 0 && vir !== 0) {
    //   const span = rel + vir;
    //   const l = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    //   const angle = Math.asin((y2 - y1) / l);
    //   const mod = l % span;
    //   const dirX = x2 - x1 > 0 ? 1 : -1;
    //   const points = [[x1, y1]];
    //   const count = 0|(l / span);
    //   const stepX = rel * Math.cos(angle) * dirX;
    //   const stepY = rel * Math.sin(angle);
    //   const stepSpanX = span * Math.cos(angle) * dirX;
    //   const stepSpanY = span * Math.sin(angle);
    //   for (let i=1; i<= count; i++) {
    //     points[i] = [x1 + stepSpanX * i, y1 + stepSpanY * i];
    //     ctx.lineTo(points[i - 1][0] + stepX , points[i-1][1] + stepY);
    //     ctx.moveTo(points[i][0], points[i][1]);
    //   }
    //   switch (true) {
    //     case mod > rel:
    //       const nextX =  points[count][0] + stepX;
    //       const nextY =  points[count][1] + stepY;
    //       ctx.lineTo(nextX, nextY);
    //       ctx.moveTo(x2, y2);
    //       break;
    //     case mod <= rel:
    //       ctx.lineTo(x2, y2);
    //       break;
    //   }

    // } else {
    //   ctx.lineTo(x2, y2);
    // }
  }
}