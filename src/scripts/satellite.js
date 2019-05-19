class Satellite {
  constructor(perigee, apogee, P) {
    this.theta = math.bignumber(0);
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
    this.x = math.multiply(math.sum(this.r), math.subtract(0,math.cos(this.theta)));
    this.y = math.multiply(this.r, math.sin(this.theta));
    this.mu = math.eval('(4 * ( pi ^ 2 ) * ( a ^3 ) ) / ( P ^ 2 )', {
      P: this.P,
      pi: math.bignumber(Math.PI),
      a: this.a
    });
  }

  update(dt) {
    this.dtheta = math.eval('a * b * n * t / ( r * r )', {
      a: this.a,
      b: this.b,
      n: this.n,
      r: this.r,
      t: dt
    })
    
    this.theta = math.sum(this.theta, this.dtheta);
    this.r = math.divide(this.p, math.add(math.bignumber(1), math.multiply(this.e, math.cos(this.theta))));
    this.x = math.subtract(math.multiply(this.r, math.subtract(0,math.cos(this.theta))), this.c);
    this.y = math.multiply(this.r, math.sin(this.theta));
    this.v = math.eval('sqrt( mu * ( ( 2 / r ) - (1 / a ) ) )', {
      mu: this.mu,
      r: this.r,
      a: this.a
    });
    console.log(this.r*this.dtheta/dt);
  }

  getNextPosition(dt) {
    dt = math.bignumber(dt);
    let previousX = this.x;
    let previousY = this.y;
    this.update(dt);
     
    return {
      x: this.x,
      y: this.y,
      v: this.v
    }
  }

} 

export default Satellite;