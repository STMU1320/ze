

const canvas = new ZE.Canvas('container', {
  width: 600,
  height: 600
});

const line = canvas.addShape('line', {
  attrs: {
    x1: 50,
    y1: 50,
    x2: 100,
    y2: 100,
    lineWidth: 3,
    strokeStyle: 'blank'
  }
});

const line2 = canvas.addShape('line', {
  attrs: {
    x1: 100,
    y1: 100,
    x2: 150,
    y2: 50,
    lineWidth: 3,
    strokeStyle: 'red'
  }
});

canvas.draw();
line.on('click', (e) => { console.log(e); });
canvas.emit('click', [line, line2], 'test');
