import * as p5 from 'p5';
import constants from './constants';
import Satellite from './satellite';


// Time variables
let fps = 30;
let t = math.bignumber(0);
let multiplier = math.bignumber(1000);

// Graphical variables
const width = window.innerWidth;
const height = window.innerHeight;
const earthSize = 30;

const ratio = math.divide(earthSize/2, constants.earthRadius); // Ratio allowing a good range of heights

// Initial variables
let perigee = math.add(math.bignumber('20180000'), constants.earthRadius);
let apogee = perigee;

let revolutionPeriod = math.bignumber((11*60 + 58)*60)


// Formular gestion
const form = document.getElementById("inputs")
const perigeeInput = document.getElementById("perigee")
const apogeeInput = document.getElementById("apogee")
const periodInput = document.getElementById("period")
const multiplierInput = document.getElementById("multiplier")
perigeeInput.value = perigee;
apogeeInput.value = apogee-perigee;
periodInput.value = revolutionPeriod;
multiplierInput.value = multiplier;

form.addEventListener("submit", function(e) {
  e.preventDefault();
  perigee = math.bignumber(perigeeInput.value);
  apogee = math.add(math.bignumber(apogeeInput.value), perigee);
  revolutionPeriod = math.bignumber(periodInput.value);
  multiplier = math.bignumber(multiplierInput.value);
  a = math.bignumber(math.divide(math.add(perigee, apogee), 2));  
  c = math.bignumber(math.subtract(a, perigee));
  e = math.bignumber(math.divide(c, a));
  b = math.bignumber(math.sqrt(math.subtract(math.multiply(a, a), math.multiply(c,c))))
  satellite = new Satellite(perigee, apogee, revolutionPeriod);
  receiver = new Satellite(constants.earthRadius, constants.earthRadius, math.bignumber(86400))
  t = 0;
})


//Variables deducted from the initial
let a = math.divide(math.add(perigee, apogee), 2); // Demi-grand axe 
let c = math.subtract(a, perigee); // Distance entre le centre de l'éllipse et un des foyers
let e = math.divide(c, a); // Exentricity
let b = math.sqrt(math.subtract(math.multiply(a, a), math.multiply(c,c)))


let satellite = new Satellite(perigee, apogee, revolutionPeriod); // Satellite's definition
let receiver = new Satellite(constants.earthRadius, constants.earthRadius, math.bignumber(24*60*60)) // Simulate earth's rotation


// Make the annimation full screen and fluid
window.setup = function () {
  createCanvas(width,height);
  background(0);
  frameRate(fps);
}

window.draw = function () {
  // Going to the next position in time and fixing fps variability
  const dt = frameRate() == math.bignumber(0) ? 0 : math.multiply(math.bignumber(1/frameRate()), multiplier)
  t =  math.add(t, dt) 

  background(0);

  // Draw ellipse
  ellipse(width/2, height/2, math.number(math.multiply(2, math.multiply(a, ratio))), math.number(math.multiply(2, math.multiply(b, ratio))));
  
  // Draw earth
  ellipse(math.add(width/2, math.multiply(c, ratio))*1, height/2, earthSize, earthSize);

  // Getting data on the satellite at t+dt and drawing it
  const satellitePos = satellite.getNextPosition(dt);
  ellipse(math.multiply(satellitePos.x,ratio)*1+width/2, -math.multiply(satellitePos.y,ratio)*1+height/2, earthSize/3, earthSize/3);

  // Getting data on the receiver at t+dt and drawing it
  const receiverPos = receiver.getNextPosition(dt);
  ellipse(math.multiply(receiverPos.x,ratio)*1+width/2+math.multiply(c, ratio)*1, -math.multiply(receiverPos.y,ratio)*1+height/2, earthSize/5, earthSize/5);
  
  fill(255);

  //Speed vectors
  const satelliteSpeed = [satellitePos.vx, satellitePos.vy]
  const Vre = [receiverPos.v, receiverPos.theta];

  // Draw speed
  stroke(255);
  line(satellitePos.x*ratio+width/2, -satellitePos.y*ratio+height/2, math.add(satellitePos.x, math.multiply(satellitePos.vx,10000))*ratio+width/2, -math.add(satellitePos.y, math.multiply(satellitePos.vy,10000))*ratio+height/2)
  stroke(0);

  // Compute the resultat speed
  const vlin = math.eval('sqrt( ( Vsatx - Vrex ) ^ 2 + ( Vsaty - Vrey ) ^ 2 )', {
    Vsatx: satelliteSpeed[0],
    Vsaty: satelliteSpeed[1],
    Vrex: Vre[0],
    Vrey: Vre[1]
  });

  // Theta between the two 
  //const relativeTheta = math.subtract(satellitePos.theta, receiverPos.theta);

  // Compute the diferent effects
  const einstein = math.multiply(calcEinsteinEffect(constants.earthRadius, satellitePos.r, t), math.bignumber('1e+9'));
  const doppler = math.multiply(calcSimplifiedDoplerEffect(vlin, t), math.bignumber('1e+9'))
  const corrExentr = math.multiply(periodicalComponent([satellitePos.x, satellitePos.y], satelliteSpeed), math.bignumber('1e+9'))
  
  
  text(
`fps: ${Math.round(frameRate())},
Vsttelite = ${math.round(satellitePos.v)} m/s,
r = ${math.round(satellitePos.r)} m,
t (x${multiplier}) = ${math.round(t)} s,
Désynchronisation gravitationnelle depuis le début : ${einstein.toFixed(10)} ns,
Désynchronisation cinématique (Simplifié: celui pris en compte par les sattellite) depuis le début : ${doppler.toFixed(10)} ns,
Correction liée à l'excentricité : ${corrExentr.toFixed(10)} ns
Somme: ${math.sum(einstein, doppler).toFixed(10)} ns
  `, 10, 10, width-10, height-10);
}


/**
 * Compute the einstein effect
 * @param {math.BigNumber} Rsol : distance between earth center and the receiver
 * @param {math.BigNumber} Rsat : distance between earth center and the satellite
 * @param {math.BigNumber} t : delta t since the beginning of the equation
 */
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

/**
 * Compute the simplified doppler effect
 * @param {math.BigNumber} V : Resultant speed (linear)
 * @param {math.BigNumber} t : delta t since the beginning of the equation
 */
function calcSimplifiedDoplerEffect(V, t) {
  return math.eval('( (- V ^ 2 ) / (2 * ( c ^ 2 ) ) ) * t', {
    V,
    c: constants.c,
    t
  })
}

/**
 * Computing the speed vector
 * @param {math.BigNumber} v : Linear speed
 * @param {math.BigNumber} theta : Angle - pi (or angle of the satellite)
 */
function vectorizeSpeeds(v, theta) {
  const vx = math.eval('v * cos( theta )', {
    v,
    theta: math.add(theta, math.bignumber(Math.PI/2))
  })
  const vy = math.eval('v * sin( theta )', {
    v,
    theta:  math.add(theta, math.bignumber(Math.PI/2))
  })
  return [vx, vy]
}

/**
 * Changing for the plan space to the Earth Centered and Earth Fixed space
 * @param {math.BigNumber} x 
 * @param {math.BigNumber} y 
 * @param {math.BigNumber} theta 
 */
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

/**
 * Compute the correction linked to the exentricity of the orbit
 * @param {math.BigNumber} Rsat 
 * @param {math.BigNumber} Vsat 
 */
function periodicalComponent(Rsat, Vsat) {
  return math.multiply(math.bignumber(-2), math.divide(math.dot(Rsat, Vsat), math.multiply(constants.c, constants.c)))
}
