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
    event: {
      mouseenter (e) {
        const target = e.target;
        target.animate({
          props: {
            fillStyle: 'red',
            r: 60,
            angle: 360
          },
          duration: 800,
          effect: 'easeOut',
          // loop: true
        });
      },
      mouseout (e) {
        const target = e.target;
        const { passTime } = target.animateCfg;
        target.animate({
          props: {
            fillStyle: 'white',
            r: 50,
            angle: 0
          },
          duration: passTime,
          effect: 'easeIn'
        });
      }
    }
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
      click: (e) => console.log(e.target.attrs.text)
    }
  });
}

const ctx = canvas.getContext();
ctx.canvas.style.background = '#333';

canvas.draw();
