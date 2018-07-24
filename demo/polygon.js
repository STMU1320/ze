const canvas = new ZE.Canvas('container', {
  width: 1000,
  height: 800,
  style: {
    fillStyle: '#fff',
  }
});

for (let i = 0; i < 20; i++) {
  const row = 0 | (i / 5);
  const col = i % 5;
  canvas.addShape('polygon', {
    attrs: {
      regular: true,
      vertices: 3 + i,
      r: 50,
      x: 180 + col * 160,
      y: 100 + row * 180
    },
  });
  canvas.addShape('text', {
    attrs: {
      text: `${3 + i} vertex`,
      x: 180 + col * 160,
      y: 170 + row * 180
    },
    style: {
      textAlign: 'center'
    },
    event: {
      click: () => console.log('click')
    }
  });
}

const ctx = canvas.getContext();
ctx.canvas.style.background = '#333';

canvas.draw();
