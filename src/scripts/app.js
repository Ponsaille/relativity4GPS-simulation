import * as p5 from 'p5';
import constants from './constants';
import Satellite from './satellite';

const width = window.innerWidth;
const height = window.innerHeight;
const earthSize = 10;

const ratio = math.divide(earthSize, constants.earthRadius);

// Les variables initiales
let perigee = math.add(math.bignumber('20180000'), constants.earthRadius);
let apogee = math.add(perigee, math.bignumber('201800000'));


// Les variables initiales déduites
let a = math.divide(math.add(perigee, apogee), 2);  
let c = math.subtract(a, perigee);
let e = math.divide(c, a);
let b = math.sqrt(math.subtract(math.multiply(a, a), math.multiply(c,c)))


let satellite = new Satellite(math.bignumber(0), perigee, apogee, math.bignumber(60));

window.setup = function () {
  createCanvas(width,height);
  background(0);
  frameRate(30);
}

window.draw = function () {
  ellipse(width/2, height/2, math.number(math.multiply(2, math.multiply(a, ratio))), math.number(math.multiply(2, math.multiply(b, ratio))));
  ellipse(width/2-math.multiply(c, ratio), height/2, earthSize, earthSize);
  let satellitePos = satellite.getPosition();
  ellipse(math.multiply(satellitePos.x,ratio)*1+width/2-math.multiply(c, ratio), math.multiply(satellitePos.y,ratio)*1+height/2, earthSize, earthSize);
}