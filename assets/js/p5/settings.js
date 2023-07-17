export default class Settings {
  constructor(p5) {
    this.p5 = p5;

    // canvas
    this.canvas = new CanvasSize(p5.width/2, p5.height/2, -p5.width/2, -p5.height/2);

    this.canvas.addCordinate(this.canvas.left, this.canvas.top);

    // text
    this.textSize = p5.height/8;

    // texture
    this.pg = p5.createGraphics(p5.width/2, p5.height/2);
    p5.rectMode(p5.RADIUS);  
  }

  setTextConfig(font) {
    this.font = font;
    // text
    this.p5.textFont(this.font);
    this.p5.textSize(this.textSize);
    this.p5.textAlign(this.p5.CENTER, this.p5.CENTER);    
  }
}

class CanvasSize {
  constructor(xMax, yMax, xMin, yMin) {
    this.resize(xMax, yMax, xMin, yMin);
    this.cordinates = [];

    this.addCordinate(0, 0);
  }

  addCordinate(xInit, yInit) {
    if(this.cordinates) {
      this.cordinates.push(new Cordinate(xInit, yInit, this.left, this.top, this.right, this.bottom));
    } else {
      throw Error(`[CanvasSize] cordinates >> ${this.cordinates}`);
    }
  }

  resize(xMax, yMax, xMin, yMin) {
    this.left = xMin;
    this.top = yMin;
    this.right = xMax;
    this.bottom = yMax; 
    this.textSize = (yMax*2/10)
    if(this.cordinates) {
      this.cordinates.forEach(c => {
        c.left = this.left;
        c.top = this.top;
        c.right = this.right;
        c.bottom = this.bottom; 
      })
    }
  }
}

// x,y座標
class Cordinate{
  constructor(xInit, yInit, left, top, right, bottom, speedX, speedY) {
    this.x = xInit;
    this.y = yInit;
    this.left = left;
    this.top = top;
    this.right = right;
    this.bottom = bottom;
    this.speedX = speedX || 3;
    this.speedY = speedY || 3;
  }

  checkCollision() {
    if(this.x > this.right || this.x < this.left) {
      this.speedX = -this.speedX;
    }

    if(this.y > this.bottom || this.y < this.top) {
      this.speedY = -this.speedY;
    }

  }

  start() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.checkCollision();
  }
}