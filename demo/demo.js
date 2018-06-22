

const canvas = new ZE.Canvas('container', {
  width: 600,
  height: 600
});

canvas.addShape('line', {
  attrs: {
    x1: 0,
    y1: 0,
    x2: 200,
    y2: 300,
    lineWidth: 3,
    stroke: 'blank'
  }
});

canvas.draw();
