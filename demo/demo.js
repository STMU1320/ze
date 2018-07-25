const canvas = new ZE.Canvas('container', {
  width: 1000,
  height: 800,
  style: {
    fillStyle: '#fff',
  }
});

canvas.addShape('polygon', {
  attrs: {
    regular: true,
    vertices: 3,
    r: 150,
    x: 300,
    y: 300
  },
  event: {
    // mouseenter: (e) => { console.log('enter', e); },
    click: (e) => {
      console.log('3', e);
    },
    // mouseout: (e) => console.log('out', e)
  }
});
canvas.addShape('polygon', {
  attrs: {
    regular: true,
    vertices: 4,
    r: 100,
    x: 300,
    y: 300
  },
  style: {
    fillStyle: 'red'
  },
  event: {
    // mouseenter: (e) => { console.log('enter', e); },
    click: (e) => {
      console.log('4', e);
      e.stopPropagation();
    },
    // mouseout: (e) => console.log('out', e)
  }
});

canvas.addShape('polygon', {
  attrs: {
    regular: true,
    vertices: 5,
    r: 50,
    x: 300,
    y: 300,
    opacity: 0.6
  },
  style: {
    fillStyle: 'blue'
  },
  event: {
    // mouseenter: (e) => { console.log('enter', e); },
    click: (e) => {
      console.log('5', e);
      // e.stopPropagation();
    },
    // mouseout: (e) => console.log('out', e)
  }
});

const ctx = canvas.getContext();
ctx.canvas.style.background = '#333';

canvas.draw();
