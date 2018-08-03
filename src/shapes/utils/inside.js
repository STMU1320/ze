const Line = require('../math/line');
const Quadratic = require('../math/quadratic');
const Cubic = require('../math/cubic');
const Arc = require('../math/arc');
const Vec = require('../math/vec');

export default {
  line(x1, y1, x2, y2, lineWidth, x, y) {
    if (lineWidth <= 0) {
      return false;
    }
    // debugger;
    const box = Line.box(x1, y1, x2, y2, lineWidth);
    if (!this.box(box.minX, box.minY, box.maxX, box.maxY, x, y)) {
      return false;
    }
    const d = Line.pointDistance(x1, y1, x2, y2, x, y);
    if (isNaN(d)) {
      return false;
    }
    return d <= lineWidth / 2;
  },
  polyline(points, lineWidth, x, y) {
    const l = points.length - 1;
    if (l < 1) {
      return false;
    }
    for (let i = 0; i < l; i++) {
      const x1 = points[i][0];
      const y1 = points[i][1];
      const x2 = points[i + 1][0];
      const y2 = points[i + 1][1];

      if (this.line(x1, y1, x2, y2, lineWidth, x, y)) {
        return true;
      }
    }

    return false;
  },
  cubicline(x1, y1, x2, y2, x3, y3, x4, y4, lineWidth, x, y) {
    return Cubic.pointDistance(x1, y1, x2, y2, x3, y3, x4, y4, x, y) <= lineWidth / 2;
  },
  quadraticline(x1, y1, x2, y2, x3, y3, lineWidth, x, y) {
    return Quadratic.pointDistance(x1, y1, x2, y2, x3, y3, x, y) <= lineWidth / 2;
  },
  arcline(cx, cy, r, startAngle, endAngle, clockwise, lineWidth, x, y) {
    if (lineWidth === 0) {
      return false;
    }
    return Arc.pointDistance(cx, cy, r, startAngle, endAngle, clockwise, x, y) <= lineWidth / 2;
  },
  rect(rx, ry, width, height, x, y) {
    return rx <= x && x <= rx + width && ry <= y && y <= ry + height;
  },
  circle(cx, cy, r, x, y) {
    return Math.pow(x - cx, 2) + Math.pow(y - cy, 2) <= Math.pow(r, 2);
  },
  ring (cx, cy, ir, or, startAngle, diffAngle, x, y) {
    const pi = Math.PI;
    const cw = diffAngle > 0 ? 1 : -1;
    let negation = false;
    if (Math.abs(diffAngle) > pi) {
      diffAngle = diffAngle + 2 * pi * -1 * cw;
      negation = true;
    }
    const endAngle = startAngle + diffAngle;
    const l = Math.sqrt(Math.pow(x - cx, 2) + Math.pow(y - cy, 2));
    const less = l <= or;
    const more = l >= ir;
    const v1 = [or * Math.cos(startAngle), or * Math.sin(startAngle)];
    const v2 = [or * Math.cos(endAngle), or * Math.sin(endAngle)];
    const v = [ x - cx, y - cy ];
    const p1 = 0 | Vec.product(v1, v);
    const p2 = 0 | Vec.product(v2, v);
    const inRing = less && more;
    let inAngle = false;
    // console.log(p1, p2);
    if (diffAngle === pi * 2) {
      return inRing;
    } else if (diffAngle > 0) {
      inAngle =  p1 >= 0 && p2 <= 0;
    } else {
      inAngle =  p1 <= 0 && p2 >= 0;
    }

    if (negation) {
      return inRing && !inAngle;
    }
    return inRing && inAngle;
  }, 
  box(minX, minY, maxX, maxY, x, y) {
    return minX <= x && x <= maxX && minY <= y && y <= maxY;
  }
};
