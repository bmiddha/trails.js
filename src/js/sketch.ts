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

let balls: Ball[], edge: Edge, colors: Colors;
const ballSize = 50;
let speedMultiplier = 1;
const padding = 50;

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
    this.amt += 0.01;
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
  p.fill(0).textSize(24).textStyle(p.BOLD).textAlign(p.CENTER);
  const lineSpacing = 40;
  const content = [
    "scroll to change speed",
    "left click anywhere to create ball",
    "press 0-9 to change color pallets",
    "enter to save",
    "backspace/delete to delete balls",
    "space to toggle trails",
  ];
  for (const c in content) {
    p.text(content[c], p.width / 2, p.height / 2 - (content.length / 2) * lineSpacing + Number(c) * lineSpacing);
  }
}

function drawStats(p: p5) {
  p.fill(255);
  p.rect(0, p.height - 40, p.width, 40);
  p.fill(0).textSize(16).textStyle(p.BOLD).textAlign(p.RIGHT);
  p.text(`Colors: ${colors.colorsArray} Speed: ${speedMultiplier.toFixed(2)}`, p.width - 20, p.height - 20);
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
    canvas = p.createCanvas(p.windowWidth, p.windowHeight);
    p.background(255);
    p.noStroke();
    balls = [];
    edge = {
      x: {
        start: padding,
        end: p.width - padding,
      },
      y: {
        start: padding,
        end: p.height - padding,
      },
    };
    drawWelcome(p);
  };

  p.draw = () => {
    if (!enableTrails) {
      p.background(255);
    }
    colors.update();
    balls.forEach((ball: Ball) => ball.update());
    balls = balls.filter(
      (ball: Ball) =>
        ball.position.x < edge.x.end &&
        ball.position.y < edge.y.end &&
        ball.position.x > edge.x.start &&
        ball.position.y > edge.y.start
    );
    drawStats(p);
  };

  p.keyPressed = () => {
    // enter
    if (p.keyCode === 13 && started) {
      p.saveCanvas(`BALLS-${new Date().toISOString()}`, "jpg");
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
    if (p.mouseButton == p.LEFT) {
      if (!started) {
        p.background(255);
        p.loop();
        started = true;
      }
      const i = balls.length;
      const ballPos = {
        x: event.clientX,
        y: event.clientY,
      };
      balls.push(new Ball(p, ballPos, getRandomSpeed(), ballSize, i));
    }
    if (p.mouseButton == p.RIGHT) {
    }
  };

  p.mouseWheel = (event: any) => {
    if (event) speedMultiplier += event.delta * 0.0001;
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    edge = {
      x: {
        start: padding,
        end: p.width - padding,
      },
      y: {
        start: padding,
        end: p.height - padding,
      },
    };
  };
};

new p5(sketch);
