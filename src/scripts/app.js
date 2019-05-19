import * as p5 from 'p5';
import constants from './constants';
import Satellite from './satellite';

let fps = 60;
let t = math.bignumber(0);
let multiplier = math.bignumber(5000);

const width = window.innerWidth;
const height = window.innerHeight;
const earthSize = 30;

const ratio = math.divide(earthSize/2, constants.earthRadius);

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
let receiver = new Satellite(constants.earthRadius, constants.earthRadius, math.bignumber((24*60*60))) //Simule la rotation de la terre

window.setup = function () {
  createCanvas(width,height);
  background(0);
  frameRate(fps);
}
let receiverPos = receiver.getNextPosition(0);
window.draw = function () {
  let dt = frameRate() == math.bignumber(0) ? 0 : math.multiply(math.bignumber(1/frameRate()), multiplier) // Little fix to take in account the changing rate
  t =  math.add(t, dt) 
  background(0);
  ellipse(width/2, height/2, math.number(math.multiply(2, math.multiply(a, ratio))), math.number(math.multiply(2, math.multiply(b, ratio))));
  ellipse(math.add(width/2, math.multiply(c, ratio))*1, height/2, earthSize, earthSize);
  let satellitePos = satellite.getNextPosition(dt);
  ellipse(math.multiply(satellitePos.x,ratio)*1+width/2, -math.multiply(satellitePos.y,ratio)*1+height/2, earthSize/3, earthSize/3);
  let receiverPos = receiver.getNextPosition(dt);
  ellipse(math.multiply(receiverPos.x,ratio)*1+width/2+math.multiply(c, ratio)*1, -math.multiply(receiverPos.y,ratio)*1+height/2, earthSize/5, earthSize/5);
  fill(255);
  let satelliteSpeed = vectorizeSpeeds(satellitePos.v, satellitePos.theta)
  text(`
    fps: ${Math.round(frameRate())},
    Vsttelite = ${math.round(satellitePos.v)} m/s,
    r = ${math.round(satellitePos.r)} m,
    t (x${multiplier}) = ${math.round(t)} s,
    Décalage lié à l'effet Einstein depuis le début : ${calcEinsteinEffect(constants.earthRadius, satellitePos.r, t)*1} s,
    Décalage lié à l'effet Dopler (Simplifié: celui pris en compte par les sattellite) depuis le début : ${calcSimplifiedDoplerEffect(receiver.v, t)*1} s,
    Correction liée à l'excentricité : ${periodicalComponent(toECEF(satellitePos.x, satellitePos.y, math.subtract(satellitePos.theta, receiverPos.theta)), toECEF(satelliteSpeed[0], satelliteSpeed[1], math.subtract(satellitePos.theta, receiverPos.theta)))}
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

function calcSimplifiedDoplerEffect(Vsat, t) {
  return math.eval('( (- Vsat ^ 2 ) / (2 * ( c ^ 2 ) ) ) * t', {
    Vsat,
    c: constants.c,
    t
  })
}

function vectorizeSpeeds(v, theta) {
  const vx = math.eval('v * cos( theta )', {
    v,
    theta
  })
  const vy = math.eval('v * sin( theta )', {
    v,
    theta
  })
  return [vx, vy]
}

function toECEF(x, y, theta) {
  return [
    math.eval('x * cos( theta ) + y * sin( theta )', {
      c,
      x,
      y,
      theta
    }),
    math.eval('- x * sin( theta ) + y * cos( theta )', {
      x,
      y,
      theta
    })
  ]
}

function periodicalComponent(Rsat, Vsat) {
  return math.multiply(math.bignumber(-2), math.divide(math.dot(Rsat, Vsat), math.multiply(constants.c, constants.c)))
}

//console.log(math.add(calcEinsteinEffect(constants.earthRadius, perigee, math.bignumber(24 * 60 * 60)), calcSimplifiedDoplerEffect(3873,  math.bignumber(24 * 60 * 60)))*1)