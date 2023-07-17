export class Char {
  constructor(char, x, y, size, color, language="ja") {
    this.char = char;
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
    this.speed = 1;
    this.direction = -1;
    this.angle = 0.0;
    this.scalar = 1;
    this.row = 1;
    this.language = language;
  }

  draw(p5) {
    p5.push(); 
    p5.textSize(this.size);
    p5.stroke(p5.color(0,0,0));
    p5.strokeWeight(13);
    p5.fill(this.color);
    p5.text(this.char, this.x, this.y);
    p5.pop();
  }

  move(p5, index) {
    if(this.language == 'en') {
      this.x -= this.speed * 10;
    } else {
      this.x = this.x + p5.cos(this.angle) * this.row * this.size/15;
      this.angle += 0.05;
    }

    // this.y = this.y - p5.sin(this.angle) * this.scalar;
    this.y += (this.size/15 + this.speed) * this.direction;
    if (this.y <= -p5.height/2) {
      this.direction *= -1;
      this.row = index % 2;      
      this.color = p5.color(100, 50, 50);
      this.scalar +=1;
    } else {
      this.row = index % 4;
    }
  }
}