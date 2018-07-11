
function getRandomNum (min, max) {
  if (!max) {
    max = min;
    min = 0;
  }
  return Math.round(Math.random() * (max - min) + min);
}

// const bgImg = document.getElementById('bgImg');
// const bgctx = bgImg.getContext('2d');
// bgctx.fillRect(10, 10, 50, 50);


const canvas = new ZE.Canvas('container', {
  width: 1000,
  height: 800,
  style: {
    fillStyle: '#fff',
  }
});

canvas.addShape('text', {
  attrs: {
    text: 'test',
    x: 300,
    y: 500
  },
  event: {
    click () {
      console.log('click text');
    }
  }
});

const layer = canvas.addLayer({
  zIndex: -2,
  attrs: {
    x: 100,
    y: 20
  }
}).addLayer({
  attrs: {
    x: 200,
    y: 20
  }
});
layer.addShape('rect', {
  attrs: {
    x: 0,
    y: 0,
    w: 50,
    h: 50
  },
  event: {
    click () {
      console.log('click rect');
    }
  }
});

 const ctx = canvas.getContext();
 ctx.canvas.style.background = '#333';


canvas.draw();

console.log(canvas);