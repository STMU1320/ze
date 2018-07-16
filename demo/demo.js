
function getRandomNum (min, max) {
  if (!max) {
    max = min;
    min = 0;
  }
  return Math.round(Math.random() * (max - min) + min);
}

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

function addText (text, color) {
  canvas.addShape('text', {
    attrs: {
      x: 1000,
      y: getRandomNum(800),
      text
    },
    style: {
      fillStyle: color,
      fontSize: getRandomNum(16, 32)
    },
    animate: {
      props: {
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

function addShape (count = 500) {
  const { shapeLength } = canvas.computed;
  if (shapeLength < count) {
    for (let i = 0; i < count - shapeLength; i++) {
      addText(i, ['#fff', 'blue', 'green', 'red'][ i % 4]);
    }
  }
}

layer.addShape('video', {
  attrs: {
    x: 0,
    y: 0,
    w: canvas.width,
    h: canvas.height,
    video: 'https://video-dev.github.io/streams/x36xhzz/x36xhzz.m3u8',
  }
});

 const ctx = canvas.getContext();
 ctx.canvas.style.background = '#333';

 addShape();

 setInterval(addShape, 10000);
canvas.draw();
