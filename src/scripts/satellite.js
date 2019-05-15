class Satellite {
  constructor(theta, perigee, apogee, P) {
    this.theta = theta;
    this.perigee = perigee;
    this.apogee = apogee
    this.a = math.divide(math.add(perigee, apogee), 2);  
    this.c = math.subtract(this.a, perigee);
    this.e = math.divide(this.c, this.a);
    this.b = math.sqrt(math.subtract(math.multiply(this.a, this.a), math.multiply(this.c,this.c)));
    this.p = math.multiply(this.perigee, math.sum(1, this.e));
    this.r = this.perigee;
    this.P = P;
    this.n = math.divide(math.multiply(math.bignumber(2), math.bignumber(Math.PI)), this.P);
  }

  update() {
    this.dtheta = math.eval('a * b * n * t / ( r * r )', {
      a: this.a,
      b: this.b,
      n: this.n,
      r: this.r,
      t: math.bignumber(1/30)
    })
    
    this.theta = math.sum(this.theta, this.dtheta);
    this.r = math.divide(this.p, math.add(math.bignumber(1), math.multiply(this.e, math.cos(this.theta))));
  }

  getPosition() {
    this.update();
    let x = math.multiply(math.sum(this.r), math.subtract(0,math.cos(this.theta)));
    let y = math.multiply(this.r, math.sin(this.theta));
    return {
      x,
      y
    }
  }

} 

export default Satellite;