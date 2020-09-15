import p5 from "p5";
import "../css/style.scss";

type Point = {
  x: number;
  y: number;
};

type Speed = Point;
type Position = Point;
type Edge = {
  x: {
    start: number;
    end: number;
  };
  y: {
    start: number;
    end: number;
  };
};

document.addEventListener("contextmenu", (event) => event.preventDefault());

const colorPallets = [
  ["#12c2e9", "#c471ed", "#f64f59"], // 0 - JShine
  ["#0F2027", "#203A43", "#f64f59"], // 1 - Moonlit Asteroid
  ["#a8c0ff", "#3f2b96"], // 2 - Slight Ocean View
  ["#34e89e", "#0f3443"], // 3 - Pacific Dream
  ["#24C6DC", "#514A9D"], // 4 - Mantle
  ["#e1eec3", "#f05053"], // 5 - Velvet Sun
  ["#5C258D", "#4389A2"], // 6 - Shroom Haze
  ["#614385", "#516395"], // 7 - Kashmir
  ["#1FA2FF", "#12D8FA", "#A6FFCB"], // 8 - Stripe
  ["#77A1D3", "#79CBCA", "#E684AE"], // 9 - Hazel
];

let started = false;

let balls: Ball[], edge: Edge, colors: Colors, speedDisplay: p5.Element, speedSlider: p5.Element;
const ballSize = 50;
let speedMultiplier = 1;

class Colors {
  p: p5;
  colorsArray: string[];
  startColor: p5.Color;
  newColor: p5.Color;
  amt: number;
  nextIndex: number;

  constructor(p: p5, palletIndex: number) {
    this.p = p;
    this.colorsArray = colorPallets[palletIndex];
    this.startColor = p.color(this.colorsArray[0]);
    this.newColor = p.color(this.colorsArray[1]);
    this.nextIndex = 2;
    this.amt = 0;
  }
  update() {
    const _color = this.p.lerpColor(this.startColor, this.newColor, this.amt);
    _color.setAlpha(255);
    this.p.fill(_color);
    this.amt += 0.01 * Math.abs(speedMultiplier);
    if (this.amt >= 1) {
      this.amt = 0.0;
      this.nextIndex++;
      if (this.nextIndex >= this.colorsArray.length) this.nextIndex = 0;
      this.startColor = this.newColor;
      this.newColor = this.p.color(this.colorsArray[this.nextIndex]);
    }
  }
}

class Ball {
  p: p5;
  position: Position;
  edge: Edge;
  speed: Speed;
  size: number;
  index: number;

  constructor(p: p5, position: Position, speed: Speed, size: number, index: number) {
    this.p = p;
    this.position = position;
    this.speed = speed;
    this.size = size;
    this.index = index;
  }

  move() {
    if (this.position.x > edge.x.end - this.size / 2 || this.position.x < edge.x.start + this.size / 2)
      this.speed.x *= -1;
    if (this.position.y > edge.y.end - this.size / 2 || this.position.y < edge.y.start + this.size / 2)
      this.speed.y *= -1;
    this.position.x += this.speed.x * speedMultiplier;
    this.position.y += this.speed.y * speedMultiplier;
  }

  draw() {
    this.p.ellipse(this.position.x, this.position.y, this.size);
  }

  update() {
    this.move();
    this.draw();
  }
}

function drawWelcome(p: p5) {
  p.fill(0).textSize(48).textStyle(p.BOLD).textAlign(p.LEFT);
  p.text("🎨 Trails.js", 100, 200);
  const lineSpacing = 40;
  const content = [
    "👋 Welcome to trails.js!",
    "",
    "Controls:",
    "MouseWheel: Increase/Decrease Speed",
    "Left/Right Click: Spawn Trail",
    "0-9: Select Color Pallet",
    "Enter: Save as jpg",
    "Backspace/Delete: Delete objects leaving trails",
    "Space: Toggle Trails",
  ];
  p.fill(0).textSize(24);
  for (const c in content) {
    p.text(content[c], 100, 300 + Number(c) * lineSpacing);
  }
}

function initEdge(p: p5) {
  edge = {
    x: {
      start: 25,
      end: p.width - 25,
    },
    y: {
      start: 25,
      end: p.height - 25,
    },
  };
}

function drawControls(p: p5) {
  const controlsWrapper = p.createDiv().addClass("controls-wrapper");
  speedSlider = p.createSlider(-15, 15, 1, 0.01).addClass("speed-slider").attribute("orient", "vertical");
  controlsWrapper.child(speedSlider);
  const palletWrapper = p.createDiv().addClass("pallet-btn-wrapper");
  speedDisplay = p.createSpan().addClass("speed");
  controlsWrapper.child(speedDisplay);
  const palletButtons = colorPallets.map((_, index) =>
    p
      .createButton(index.toString())
      .addClass("pallet-btn")
      .mouseClicked(() => (colors = new Colors(p, index)))
  );
  palletButtons.forEach((button, index) => {
    button.style(`border-color: ${colorPallets[index][0]}`);
    button.style(`background: linear-gradient(45deg, ${colorPallets[index].join(",")}`);
    palletWrapper.child(button);
  });
  controlsWrapper.child(palletWrapper);
  const saveButton = p
    .createButton("💾")
    .addClass("save-btn")
    .mouseClicked(() => save(p));
  controlsWrapper.child(saveButton);
}

function save(p: p5) {
  p.saveCanvas(`BALLS-${new Date().toISOString()}`, "jpg");
}

const sketch = (p: p5) => {
  let canvas;
  let enableTrails: boolean = true;
  colors = new Colors(p, 1);

  function getRandomSpeed() {
    return {
      x: p.random([-4, -2, 2, 4]),
      y: p.random([-4, -2, 2, 4]),
    };
  }

  p.preload = () => {};

  p.setup = () => {
    canvas = p.createCanvas(p.windowWidth - 70, p.windowHeight).addClass('p5-canvas');
    p.background(255);
    p.noStroke();
    balls = [];
    initEdge(p);
    drawControls(p);
    drawWelcome(p);
  };

  p.draw = () => {
    if (!enableTrails) {
      p.background(255);
    }
    colors.update();
    balls = balls.filter(
      (ball: Ball) =>
        ball.position.x <= edge.x.end + ballSize / 2 &&
        ball.position.y <= edge.y.end + ballSize / 2 &&
        ball.position.x >= edge.x.start - ballSize / 2 &&
        ball.position.y >= edge.y.start - ballSize / 2
    );
    balls.forEach((ball: Ball) => ball.update());
    speedMultiplier = Number(speedSlider.value());
    speedDisplay.html(speedMultiplier.toFixed(2));
  };

  p.keyPressed = () => {
    // enter
    if (p.keyCode === 13 && started) {
      save(p);
    }
    // space
    if (p.keyCode === 32) {
      enableTrails = !enableTrails;
    }
    // delete or backspace
    if (p.keyCode === 46 || p.keyCode === 8) {
      balls = [];
    }
    // 0-9
    if (p.keyCode >= 48 && p.keyCode <= 57) {
      colors = new Colors(p, p.keyCode - 48);
    }
    // numpad 0-9
    if (p.keyCode >= 96 && p.keyCode <= 105) {
      colors = new Colors(p, p.keyCode - 96);
    }
  };

  p.mousePressed = (event: any) => {
    if (p.mouseX < edge.x.end && p.mouseY < edge.y.end && p.mouseX > edge.x.start && p.mouseY > edge.y.start) {
      if (p.mouseButton == p.LEFT || p.mouseButton == p.RIGHT) {
        if (!started) {
          p.background(255);
          p.loop();
          started = true;
        }
        const i = balls.length;
        const ballPos = {
          x: p.mouseX,
          y: p.mouseY,
        };
        if (
          ballPos.x < edge.x.end - ballSize / 2 &&
          ballPos.y < edge.y.end - ballSize / 2 &&
          ballPos.x > edge.x.start + ballSize / 2 &&
          ballPos.y > edge.y.start + ballSize / 2
        )
          balls.push(new Ball(p, ballPos, getRandomSpeed(), ballSize, i));
      }
    }
  };

  p.mouseWheel = (event: any) => {
    if (event) {
      speedMultiplier += event.delta * 0.0001;
      speedSlider.value(speedMultiplier + event.delta * 0.0001);
    }
  };

  // p.windowResized = () => {
  //   p.resizeCanvas(p.windowWidth, p.windowHeight);
  //   initEdge(p);
  // };
};

new p5(sketch);
