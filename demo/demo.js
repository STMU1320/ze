
function getRandomNum (min, max) {
  if (!max) {
    max = min;
    min = 0;
  }
  return Math.round(Math.random() * (max - min) + min);
}

const canvas = new ZE.Canvas('container', {
  width: 600,
  height: 600
});

const layer = canvas.addLayer({
  attrs: {
    fillStyle: 'red'
  },
  zIndex: -2
});

for (let i = 0; i < 50; i++) {
  const rect = canvas.addShape('rect', {
    attrs: {
      x: 0,
      y: 5 * i,
      w: 5,
      h: 3
    }
  });
  layer.addShape('rect', {
    attrs: {
      x: 5 * i,
      y: 0,
      w: 3,
      h: getRandomNum(20, 500)
    }
  });
  rect.animate({ w: getRandomNum(20, 500) }, getRandomNum(500, 2000), 'easeInCubic');
  // rects.push(rect);
}

// rect.animate({ h: 500 }, 600);
// layer.animate({ x: 500 }, 1000);
canvas.draw();
console.log(canvas);