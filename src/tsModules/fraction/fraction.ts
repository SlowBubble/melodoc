
type Int = number;
type PositiveInt = number;

export function fromInt(numer: Int) {
  return new Frac({numer: numer, denom: 1});
}

export function makeFrac(numer: Int, denom: Int) {
  return new Frac({numer: numer, denom: denom});
}

export function fromString(str: string) {
  const [numerStr, denomStr] = str.split('/');
  const numer = parseInt(numerStr);
  const denom = parseInt(denomStr);
  if (isNaN(numer) || isNaN(denom)) {
    throw new Error('Unable to parse this as fraction: ' + str);
  }
  return makeFrac(numer, denom);
}

export class Frac {
  numer: Int;
  denom: PositiveInt;
  constructor({numer = 0, denom = 1}) {
    if (denom == 0) {
      throw new Error("denominator must be non-zero.");
    }
    // Obtaining a unique rep.
    if (denom < 0) {
      numer = -numer;
      denom = -denom;
    }
    const gcd = computeGcd(numer, denom);
    this.numer = numer / gcd;
    this.denom = denom / gcd;
  }

  getDenom() {
    return this.denom;
  }

  getNumer() {
    return this.numer;
  }

  isWhole() {
    return this.denom === 1;
  }

  plus(f2: Frac) {
    const f1 = this;
    return new Frac({
      numer: f1.numer * f2.denom + f2.numer * f1.denom,
      denom: f1.denom * f2.denom,
    });
  }

  minus(f2: Frac) {
    const f1 = this;
    return f1.plus(f2.negative());
  }

  times(f2: Frac) {
    const f1 = this;
    return new Frac({
      numer: f1.numer * f2.numer,
      denom: f1.denom * f2.denom,
    });
  }

  over(f2: Frac) {
    const f1 = this;
    return new Frac({
      numer: f1.numer * f2.denom,
      denom: f1.denom * f2.numer,
    });
  }

  negative() {
    return new Frac({
      numer: -this.numer,
      denom: this.denom,
    });
  }

  toString() {
    return `${this.numer}/${this.denom}`;
  }

  toFloat() {
    return this.numer / this.denom;
  }

  equals(frac2: Frac) {
    return this.numer === frac2.numer && this.denom === frac2.denom;
  }

  lessThan(frac2: Frac) {
    // Assumes that denom is > 0 always.
    return this.numer * frac2.denom < frac2.numer * this.denom;
  }
  leq(frac2: Frac) {
    return this.lessThan(frac2) || this.equals(frac2);
  }

  geq(frac2: Frac) {
    return !this.lessThan(frac2);
  }

  greaterThan(frac2: Frac) {
    return !this.leq(frac2);
  }

  weaklyInside(left: Frac, right: Frac) {
    return left.leq(this) && this.leq(right);
  }

  strictlyInside(left: Frac, right: Frac) {
    return left.lessThan(this) && this.lessThan(right);
  }

  fractionalPart() {
    return this.minus(fromInt(this.wholePart()));
  }

  wholePart() {
    return Math.floor(this.toFloat());
  }
}

function computeGcd(x: number, y: number) {
  x = Math.abs(x);
  y = Math.abs(y);
  while(y) {
    var t = y;
    y = x % y;
    x = t;
  }
  return x;
}