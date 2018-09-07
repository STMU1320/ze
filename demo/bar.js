function getRandomNum (min, max) {
  if (!max) {
    max = min;
    min = 0;
  }
  return Math.round(Math.random() * (max - min) + min);
}

function getData (num) {
  const data = [];
  while (--num > 0) {
    data.unshift({
      value: getRandomNum(500, 3000),
    label: `商品${num}`
    });
  }
  return data;
}


const data = getData(getRandomNum(5, 10));
const { Canvas, Utils } = ZE;

const canvas = new Canvas('container', {
  width: 800,
  height: 600,
  style: {
    strokeStyle: 'black'
  }
});
const lineWidth = 1;
const padding = 40;
const width = canvas.width;
const height = canvas.height;
const innerWidth = width - padding * 2;
const innerHeight = height - padding * 2;
const startX = padding, startY = height - padding;

const infoBoxWidth = 120;
const infoBoxHeight = 80;

const getPosition = (e) => {
  let x = e.x + 20, y = e.y + 20;
  if (x > width - infoBoxWidth - padding) {
    x = e.x - infoBoxWidth - 20;
  }

  if (y > startY - infoBoxHeight) {
    y = e.y - infoBoxHeight - 20;
  }
  return { x, y };
};

const infoModal = canvas.addLayer({
  attrs: {
    x: 0,
    y: 0,
  },
  visible: false,
  zIndex: 9
});

infoModal.addShape('rect', {
  attrs: {
    x: 0,
    y: 0,
    w: infoBoxWidth,
    h: infoBoxHeight,
    opacity: 0.5,
    radius: 5
  },
  style: {
    fillStyle: 'black'
  }
});

const infoText = infoModal.addShape('text', {
  attrs: {
    text: ['商品： 未知', '数量: 0'],
    x: 10,
    y: 20
  },
  style: {
    fillStyle: 'white',
    fontSize: 16
  }
});
const layer = canvas.addLayer({
  attrs: {
    x: startX,
    y: padding,
    width: innerWidth,
    height: innerHeight
  },
  style: {
    fillStyle: '#6fbae1'
  },
  event: {
    mouseenter (e) {
      const { x, y } = getPosition(e);
      infoModal.animate({
        props: {
          x,
          y
        },
        duration: 100
      }).show();
    },
    mouseout () {
      infoModal.hide();
    },
    mousemove: Utils.throttle((e) => {
      const { x, y } = getPosition(e);
      infoModal.animate({
        props: {
          x,
          y
        },
        duration: 180,
        effect: 'easeOut'
      });
    }, 150)
  }
});

function draw (data) {
  const rows = 5;
  let max = -Infinity;
  let ratio = 1;
  let step = 10;
  const length = data.length;
  if (length) {
    const itemWidth = innerWidth / length;
    canvas.addShape('line', {
      attrs: {
        x1: padding - 5,
        y1: startY + lineWidth,
        x2: width - padding,
        y2: startY + lineWidth
      }
    });

    data.forEach((item, index) => {
      if (item.value > max) {
        max = item.value;
      }
      const positionX = startX + itemWidth / 2 + index * itemWidth;
      canvas.addShape('line', {
        attrs: {
          x1: positionX,
          y1: startY,
          x2: positionX,
          y2: startY + 5
        }
      });
      canvas.addShape('text', {
        attrs: {
          text: item.label,
          x: positionX,
          y: startY + 20,
        },
        style: {
          textAlign: 'center'
        }
      });
    });

    step = Math.ceil(max / (rows * 10)) * 10;
    ratio = innerHeight / max;
    canvas.addShape('line', {
      attrs: {
        x1: startX,
        y1: startY + 5,
        x2: startX,
        y2: padding - 5
      }
    });
    for (let j = 0; j <= rows; j++) {
      const positionY = startY - innerHeight / rows * j;
      if (j) {
        canvas.addShape('line', {
          attrs: {
            x1: startX,
            y1: positionY,
            x2: startX - 5,
            y2: positionY
          }
        });
        canvas.addShape('line', {
          attrs: {
            x1: startX,
            y1: positionY,
            x2: width - padding,
            y2: positionY
          },
          style: {
            strokeStyle: '#ccc'
          }
        });
      }
      canvas.addShape('text', {
        attrs: {
          text: j * step,
          x: startX - 10,
          y: positionY,
        },
        style: {
          textAlign: 'right'
        }
      });
    }

    data.forEach((item, index) => {
      const positionX = itemWidth / 2 + index * itemWidth;
      const rectWidth =  Math.max((0 | itemWidth * 0.6), 4);
      const rectHeight = 0| item.value * ratio;
      layer.addShape('rect', {
        attrs: {
          x: positionX - (rectWidth / 2),
          y: innerHeight,
          h: 0,
          w: rectWidth
        },
        zIndex: 2,
        animate: {
          props: {
            y: innerHeight - rectHeight,
            h: rectHeight
          },
          duration: 600,
          effect: 'easeOut'
        },
        event: {
          mouseenter () {
            canvas.element.style.cursor = 'pointer';
          },
          mouseout () {
            canvas.element.style.cursor = 'auto';
          }
        }
      });
      layer.addShape('rect', {
        attrs: {
          x: itemWidth * index,
          y: 0,
          h: innerHeight,
          w: itemWidth,
          opacity: 0.05
        },
        style: {
          fillStyle: 'black'
        },
        visible: false,
        event: {
          mouseenter () {
            this.show();
            infoText.setAttrs({
              text: [`商品： ${item.label}`, `数量: ${item.value}`]
            });
          },
          mouseout () {
            console.log('mask out');
            this.hide();
          }
        }
      });
    });
  }
  canvas.draw();
}

draw(data);
