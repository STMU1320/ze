function getRandomNum (min, max) {
  if (!max) {
    max = min;
    min = 0;
  }
  max = max * 10; 
  return Math.round(Math.random() * (max - min) + min);
}

function clamp (value, min, max) {
  if (value < min) {
    value = min;
  } else if (value > max) {
    value = max;
  }
  return value;
}


const data = [
  {
    value: getRandomNum(50, 300),
    label: '商品1'
  },
  {
    value: getRandomNum(50, 300),
    label: '商品2'
  },
  {
    value: getRandomNum(50, 300),
    label: '商品3'
  },
  {
    value: getRandomNum(50, 300),
    label: '商品4'
  },
  {
    value: getRandomNum(50, 300),
    label: '商品5'
  },
];

const canvas = new ZE.Canvas('container', {
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

const infoBoxWidth = 100;
const infoBoxHeight = 60;

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
    round: 5
  },
  style: {
    fillStyle: 'black'
  }
});

const infoText = infoModal.addShape('text', {
  attrs: {
    text: 'value: 0',
    x: 10,
    y: infoBoxHeight / 2
  },
  style: {
    fillStyle: 'white',
    textBaseline: 'middle',
    fontSize: 16
  }
});
const layer = canvas.addLayer({
  attrs: {
    x: startX
  },
  style: {
    fillStyle: '#6fbae1'
  },
  event: {
    mouseenter (e) {
      const x = clamp(e.x + 20, padding, width - infoBoxWidth);
      const y = clamp(e.y + 20, 0, startY - infoBoxHeight);
      infoModal.animate({
        props: {
          x,
          y
        },
        duration: 100
      });
      infoModal.visible = true;
    },
    mouseout () {
      infoModal.visible = false;
      canvas.update();
    },
    mousemove(e) {
      const x = clamp(e.x + 20, padding, width - infoBoxWidth);
      const y = clamp(e.y + 20, 0, startY - infoBoxHeight);
      infoModal.setAttrs({
        x,
        y
      });
      canvas.update();
    }
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
          y: startY,
          h: 0,
          w: rectWidth
        },
        zIndex: 2,
        animate: {
          props: {
            y: startY - rectHeight,
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
          y: padding,
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
            infoText.setAttrs({
              text: `value: ${item.value}`
            });
            this.visible = true;
            canvas.update();
          },
          mouseout () {
            this.visible = false;
            canvas.update();
          }
        }
      });
    });
  }
  canvas.draw();
}

draw(data);
