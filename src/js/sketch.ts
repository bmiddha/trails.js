import p5 from "p5";
import "../css/style.scss";
import { colorPallets } from "./colorPallets";

let amt: number, startColor: p5.Color, newColor: p5.Color;

const colors = colorPallets[Math.floor(Math.random() * colorPallets.length)];
let nextIndex = 0;

type Point = {
  x: number;
  y: number;
};

document.addEventListener('contextmenu', event => event.preventDefault());

const randomFloat =  (min: number, max: number) => (Math.random() * (min - max) + max);

class Ball {
  public size: number;
  public pos: Point;
  public speed: Point;
  constructor(x: number, y: number) {
    this.pos = {
      x,y
    };
    this.speed = {
      x: randomFloat(-3, 3),
      y: randomFloat(-3, 3),
    };
    this.size = randomFloat(5, 11);
  }
  static spawnBall(x: number, y: number) {
    Ball.balls.push(new Ball(x, y))
  }
  static balls: Ball[] = [];
}
let speedMultiplier = 1;

const sketch = (p: p5) => {
  for (let i = 0; i < 10; i++) {
    Ball.spawnBall(randomFloat(0, p.windowWidth), randomFloat(0, p.windowHeight))
  }
  let canvas;
  let enableFreeze: boolean = false;
  let enableTrails: boolean = true;

  p.preload = () => {};

  p.setup = () => {
    canvas = p.createCanvas(p.windowWidth, p.windowHeight);
    p.angleMode(p.DEGREES);
    p.background(255);
    p.noStroke();
    p.ellipseMode(p.RADIUS);
    startColor = p.color(255, 255, 255);
    newColor = p.color(colors[0]);
    amt = 0;
  };

  p.draw = () => {
    if (!enableTrails) {
      p.background(255);
    }

    Ball.balls.forEach((ball) => {
      if (!enableFreeze) {
        p.fill(p.lerpColor(startColor, newColor, amt));
        ball.pos.x += ball.speed.x * speedMultiplier;
        ball.pos.y += ball.speed.y * speedMultiplier;
        if (ball.pos.x > p.windowWidth || ball.pos.x < 0) ball.speed.x *= -1;
        if (ball.pos.y > p.windowHeight || ball.pos.y < 0) ball.speed.y *= -1;
      }
      p.ellipse(ball.pos.x, ball.pos.y, ball.size, ball.size);
    });

    if (!enableFreeze) {
      amt += 0.01;
      if (amt >= 1) {
        amt = 0.0;
        nextIndex++;
        if (nextIndex >= colors.length) nextIndex = 0
        startColor = newColor;
        newColor = p.color(colors[nextIndex]);
      }
    }
  };

  p.keyPressed = () => {
    // enter
    if (p.keyCode == 13) {
      enableFreeze = !enableFreeze;
    }
    // space
    if (p.keyCode == 32) {
      enableTrails = !enableTrails;
    }
    // delete
    if (p.keyCode == 46) {
      Ball.balls = []
    }
  };

  p.mousePressed = (event: any) => {
    if (p.mouseButton == p.LEFT) {
      Ball.spawnBall(event.clientX, event.clientY);
    }
    if (p.mouseButton == p.RIGHT) {
    }
  };

  p.mouseWheel = (event: any) => {
    if (event) speedMultiplier += event.delta * 0.0001;
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
};

new p5(sketch);
