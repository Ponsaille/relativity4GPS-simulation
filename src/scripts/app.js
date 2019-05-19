import * as p5 from 'p5';
import constants from './constants';
import Satellite from './satellite';

let fps = 60;
let t = math.bignumber(0);
let multiplier = math.bignumber(100);

const width = window.innerWidth;
const height = window.innerHeight;
const earthSize = 20;

const ratio = math.divide(earthSize, constants.earthRadius);

// Les variables initiales
let perigee = math.add(math.bignumber('20180000'), constants.earthRadius);
//let apogee = perigee;
let apogee = math.add(perigee, math.bignumber('201800000'));


// Les variables initiales déduites
let a = math.divide(math.add(perigee, apogee), 2);  
let c = math.subtract(a, perigee);
let e = math.divide(c, a);
let b = math.sqrt(math.subtract(math.multiply(a, a), math.multiply(c,c)))


let satellite = new Satellite(perigee, apogee, math.bignumber((11*60 + 58)*60));

window.setup = function () {
  createCanvas(width,height);
  background(0);
  frameRate(fps);
}

window.draw = function () {
  let dt = frameRate() == math.bignumber(0) ? 0 : math.multiply(math.bignumber(1/frameRate()), multiplier) // Little fix to take in account the changing rate
  t =  math.add(t, dt) 
  background(0);
  ellipse(width/2, height/2, math.number(math.multiply(2, math.multiply(a, ratio))), math.number(math.multiply(2, math.multiply(b, ratio))));
  ellipse(width/2-math.multiply(c, ratio), height/2, earthSize, earthSize);
  let satellitePos = satellite.getNextPosition(dt);
  ellipse(math.multiply(satellitePos.x,ratio)*1+width/2, math.multiply(satellitePos.y,ratio)*1+height/2, earthSize, earthSize);
  fill(255);
  text(`
    fps: ${Math.round(frameRate())},
    Vsttelite = ${math.round(satellitePos.v)} m/s,
    r = ${math.round(satellitePos.r)} m,
    t (x${multiplier}) = ${math.round(t)} s,
    Décalage lié à l'effet Einstein depuis le début : ${calcEinsteinEffect(constants.earthRadius, satellitePos.r, t)*1}
  `, 10, 10);
}

function calcEinsteinEffect(Rsol, Rsat, t) {
  return math.eval('( ( ( G * M ) / (c ^ 2) ) * ( ( 1 / Rsol ) - ( 1 / Rsat ) ) ) * t', {
    G: constants.G,
    M: constants.earthMass,
    c: constants.c,
    Rsol,
    Rsat,
    t
  })
}

console.log(calcEinsteinEffect(constants.earthRadius, perigee, math.bignumber(24 * 60 * 60))*1)