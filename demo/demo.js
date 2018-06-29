

const canvas = new ZE.Canvas('container', {
  width: 600,
  height: 600
});

const line = canvas.addShape('line', {
  attrs: {
    x1: 10,
    y1: 10,
    x2: 100,
    y2: 100,
    lineWidth: 10,
    strokeStyle: 'red',
    lineCap: 'round'
  }
});

canvas.addShape('line', {
  attrs: {
    x1: 100,
    y1: 100,
    x2: 200,
    y2: 10,
    lineWidth: 10,
    strokeStyle: 'red',
    lineCap: 'round'
  }
});


const layer = canvas.addLayer({
 attrs: {
  x: 100,
  y: 0
 }
});

layer.addShape('rect', {
  attrs: {
    x: 0,
    y: 10,
    w: 50,
    h: 60,
    fillStyle: 'blue'
  },
  zIndex: 2
});

const layer2 = layer.addLayer({
  attrs: {
    x: 0,
    y: 0
  }
});

layer2.addShape('rect', {
  attrs: {
    x: 10,
    y: 20,
    w: 100,
    h: 60,
    fillStyle: 'green'
  },
  zIndex: 3
});

layer2.addShape('rect', {
  attrs: {
    x: 20,
    y: 30,
    w: 100,
    h: 60,
    fillStyle: 'yellow'
  },
  zIndex: 9
});

canvas.draw();
line.on('click', (e) => { console.log(e); });
layer.on('click', (e) => { console.log(e); });

console.log(canvas);
