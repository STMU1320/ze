
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

const layer = canvas.addLayer({zIndex: -2});

function callback (shape) {
  shape.destroy();
};

function addShape (count = 1000) {
  const { shapeLength } = canvas.computed;
  if (shapeLength < count) {
    for (let i = 0; i < count - shapeLength; i++) {
      canvas.addShape('text', {
        attrs: {
          x: 1000,
          y: getRandomNum(800),
          text: i
        },
        style: {
          fillStyle: ['#fff', 'blue', 'green', 'red'][ i % 4],
          fontSize: getRandomNum(16, 32)
        },
        animate: {
          attrs: {
            x: -50
          },
          duration: getRandomNum(10000, 20000),
          callback,
          delay: getRandomNum(20000),
          // repeat: true
        },
        event: {
          click (e) {
            console.log(e);
          }
        }
      });
    }
  }
}

layer.addShape('image', {
  attrs: {
    x: 0,
    y: 0,
    w: canvas.width,
    h: canvas.height,
    img: 'http://pic1.win4000.com/wallpaper/9/58cb92c57b28f.jpg',
  }
});

 const ctx = canvas.getContext();
 ctx.canvas.style.background = '#333';

 addShape();

 setInterval(addShape, 10000);
canvas.draw();
