import * as p5 from 'p5';

window.setup = function () {
  createCanvas(window.innerWidth,window.innerHeight);
}

window.draw = function () {
  ellipse(50, 50, 80, 80);
}