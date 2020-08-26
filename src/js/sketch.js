import p5 from 'p5';
import '../css/style.scss';

const sketch = p => {
  let canvas;
  let logo;
  let logoWidth = 250;
  let logoHeight = 114;

  p.preload = () => {
    logo = p.loadImage("assets/p5js.svg");
  };

  p.setup = () => {
    canvas = p.createCanvas(p.windowWidth, p.windowHeight);
    p.image(logo, p.windowWidth/2 - logoWidth/2, p.windowHeight/2 - logoHeight/2);
  };

  p.draw = () => {
    let colorX = p.map(p.mouseX, 0, p.width, 0, 255);
    let colorY = p.map(p.mouseY, 0, p.height, 0, 255)
    if (p.mouseIsPressed) {
      p.fill(colorX, 200, 200);
      p.stroke(200, colorY, 200);
      p.strokeWeight(4);
  
    }
    p.ellipse(p.mouseX, p.mouseY, 30, 30);
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    p.image(logo, p.windowWidth/2 - logoWidth/2, p.windowHeight/2 - logoHeight/2);
  };

  p.keyPressed = () => {
  };

};

new p5(sketch);
