import p5 from 'p5';
import '../css/style.scss';

const sketch = (p: p5) => {
  let canvas;
  let logo: p5.Image;
  let imageWidth = 864;
  let imageHeight = 864;
  p.preload = () => {
    logo = p.loadImage("assets/frog.svg");
  };

  p.setup = () => {
    canvas = p.createCanvas(p.windowWidth, p.windowHeight);
    p.background(255);
    p.image(logo, p.windowWidth/2 - imageWidth/2, p.windowHeight/2 - imageHeight/2);
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
    p.image(logo, p.windowWidth/2 - imageWidth/2, p.windowHeight/2 - imageHeight/2);
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    p.image(logo, p.windowWidth/2 - imageWidth/2, p.windowHeight/2 - imageHeight/2);
  };

  p.keyPressed = () => {
  };

};

new p5(sketch);
