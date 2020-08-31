import p5 from "p5";
import "../css/style.scss";

let amt: number, startColor: p5.Color, newColor: p5.Color;

type Point = {
  x: number;
  y: number;
};

const sketch = (p: p5) => {
  class Ball {
    public size = 10;
    public pos: Point;
    public speed: Point;
    constructor() {
      this.pos.x = p.random(0, p.windowWidth);
      this.pos.y = p.random(0, p.windowHeight);
      this.size = p.random(5, 11);
      this.speed.x = p.random(-3, 3);
      this.speed.y = p.random(-3, 3);
    }
  }

  let speedMultiplier = 1;
  let balls: Ball[] = [];
  for (let i = 0; i < 10; i++) {
    balls.push(new Ball());
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
    newColor = p.color(p.random(255), p.random(255), p.random(255));
    amt = 0;
  };

  p.draw = () => {
    if (!enableTrails) {
      p.background(255);
    }

    if (p.mouseIsPressed) {
      let ball = new Ball();
      ball.pos.x = p.mouseX;
      ball.pos.y = p.mouseY;
      balls.push(ball);
    }

    balls.forEach((ball) => {
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
        startColor = newColor;
        newColor = p.color(p.random(255), p.random(255), p.random(255));
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
    return false;
  };

  p.mouseWheel = (event: any) => {
    if (event) speedMultiplier += event.delta * 0.001;
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
};

new p5(sketch);
