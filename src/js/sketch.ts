import p5 from 'p5';
import '../css/style.scss';

let amt:number, startColor: p5.Color, newColor: p5.Color;

const sketch = (p: p5) => {

  class Ball {
    public size = 10;
    public pos = {
      x: p.windowWidth/2,
      y: 20
    }
    public speed = {
      x: 0,
      y: 3
    }
  }

  let speedMultiplier = 1;
  let balls: Ball[] = [];
  let canvas;

  p.preload = () => {
  };

  p.setup = () => {
    canvas = p.createCanvas(p.windowWidth, p.windowHeight);
    p.angleMode(p.DEGREES);
    p.background(255);
    p.noStroke();
    p.frameRate(30);
    p.ellipseMode(p.RADIUS);
    startColor = p.color(255, 255, 255);
    newColor = p.color(p.random(255), p.random(255), p.random(255));
    amt = 0;
  };

  p.draw = () => {
    if (p.keyIsPressed && p.keyCode == 32) {
      p.background(255);
    }

    if (p.mouseIsPressed) {
      let ball = new Ball();
      ball.pos.x = p.mouseX;
      ball.pos.y = p.mouseY;
      ball.size = p.random(7,14);
      ball.speed.x = p.random(-3, 3);
      ball.speed.y = p.random(-3, 3);
      balls.push(ball)
    }

    balls.forEach((ball) => {
      p.fill(p.lerpColor(startColor, newColor, amt));
      ball.pos.x += ball.speed.x * speedMultiplier;
      ball.pos.y += ball.speed.y * speedMultiplier;
      if(ball.pos.x > p.windowWidth || ball.pos.x < 0) ball.speed.x *= -1;
      if(ball.pos.y > p.windowHeight || ball.pos.y < 0) ball.speed.y *= -1;
      p.ellipse(ball.pos.x, ball.pos.y, ball.size, ball.size);
    })

    amt += 0.01;
    if (amt >= 1) {
      amt = 0.0;
      startColor = newColor;
      newColor = p.color(p.random(255), p.random(255), p.random(255));
    }
  }
  
  p.mouseWheel = (event) => {
    if (event)
      speedMultiplier += event.delta * 0.001
  }

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };

  p.keyPressed = () => {
  };

};

new p5(sketch);
