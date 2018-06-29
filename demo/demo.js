

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

const layer = canvas.addLayer({
  attrs: {
    x: 100,
    y: 100,
    opacity: 0.5
  }
});

const inner = layer.addLayer({
  attrs: {
    x: 50,
    y: 50
  }
});

const r2 = inner.addShape('rect', {
  attrs: {
    x: 10,
    y: 10,
    w: 100,
    h: 100
  }
});

layer.addShape('line', {
  attrs: {
    x1: 100,
    y1: 100,
    x2: 150,
    y2: 50,
    lineWidth: 5,
    strokeStyle: 'red'
  }
});

const rect = layer.addShape('rect', {
  attrs: {
    x: 0,
    y: 10,
    w: 50,
    h: 60,
    fillStyle: 'blue'
  }
});

canvas.draw();
line.on('click', (e) => { console.log(e); });
rect.on('click', (e) => { console.log(e); });
r2.on('click', (e) => { console.log(e); });
inner.on('click', (e) => { console.log(e); });

console.log(canvas);
