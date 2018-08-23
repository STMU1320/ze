// 此处代码为生成Html元素
(function (sendBtnClick) {

  let selectedColor = 'white';

  function colorOptionClick (e) {
    const li = e.target;
    const ul = e.currentTarget;
    Array.from(ul.getElementsByTagName('li')).forEach(ele => {
      ele.style.borderColor = '#ccc';
    });
    const color = li.dataset.color;
    li.style.borderColor = color;
    selectedColor = color;
  }
  
  function btnClick () {
    const textarea = document.getElementById('danmu');
    const text = textarea.value.trim();
    if (!text) {
      return ;
    }
    sendBtnClick && sendBtnClick(text, selectedColor);
  }

  function generateColorBox (colors) {
    if (!colors) {
      return;
    }
    const ul = document.createElement('ul');
    ul.className = 'color-wrap';
    ul.addEventListener('click', colorOptionClick);
    colors.forEach((color, index) => {
      const li = document.createElement('li');
      li.className = 'color-item';
      li.style.color = color;
      li.innerText = '■';
      li.setAttribute('data-color', color);
      if (index === 0) {
        selectedColor = color;
        li.style.borderColor = color;
      }
      ul.appendChild(li);
    });
    
    return ul;
  }

  function generateInputArea () {
    const input = document.createElement('textarea');
    const btn = document.createElement('button');
    const div = document.createElement('div');
    input.id = 'danmu';
    btn.className = 'btn-send';
    btn.innerText = '发送';
    btn.addEventListener('click', btnClick);
    div.className = 'input-wrap';
    div.appendChild(input);
    div.appendChild(btn);
    return div;
  }

  function generateStyle () {
    const head = document.getElementsByTagName('head')[0];
    const style = document.createElement('style');
    style.innerHTML = `
    .color-wrap {
      display: flex;
      list-style: none;
      padding: 0;
      margin: 15px 0;
    }
    .color-item {
      position: relative;
      display: block;
      width: 16px;
      height: 16px;
      margin-right: 15px;
      font-size: 20px;
      text-align: center;
      line-height: 10px;
      border: 1px solid #ccc;
      cursor: pointer;
    }
    .btn-send {
      padding: 3px 8px;
      margin-left: 15px;
      border-radius: 5px;
      border: none;
      background-color: #1890FF;
      color: white;
      text-align: center;
      cursor: pointer;
    }
    .input-wrap {
      display: flex;
      align-items: flex-end;
    }
    #danmu {
      width: 260px;
      height: 60px;
    }`;
    head.appendChild(style);
  }

  generateStyle();

  const colors = ['red', 'blue', 'green', 'Aqua', 'Crimson', 'Fuchsia', 'Gold', 'PaleGreen'];

  const div = document.createElement('div');
  const container = document.getElementById('content') || document.body;
  const ul = generateColorBox(colors);
  const inputArea = generateInputArea();
  div.appendChild(ul);
  div.appendChild(inputArea);

  container.appendChild(div);

})(addText);

// 生成Html结束，以下为弹幕系统代码

function getRandomNum (min, max) {
  if (!max) {
    max = min;
    min = 0;
  }
  return Math.round(Math.random() * (max - min) + min);
}

function callback (shape) {
  shape.destroy();
};

let canvas = new ZE.Canvas('container', {
  width: 1000,
  height: 600,
  style: {
    fillStyle: '#fff',
  }
});

function addText (text, color, delay = 0) {
  const fontSize = getRandomNum(16, 32);
  canvas.addShape('text', {
    attrs: {
      x: 1000,
      y: getRandomNum(600 - fontSize),
      text
    },
    style: {
      fillStyle: color,
      fontSize,
      textBaseline: 'top'
    },
    animate: {
      props: {
        x: -50
      },
      duration: getRandomNum(10000, 20000),
      callback,
      delay,
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
      addText(i, ['#fff', 'blue', 'green', 'red'][ i % 4], getRandomNum(20000));
    }
  }
}


const layer = canvas.addLayer({zIndex: -2});

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
