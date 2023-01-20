import { varyColor } from '../color';
import { Particle } from './particle';

export class Sand extends Particle {
  static baseColor = '#dcb159';
  public maxSpeed = 8;
  public acceleration = 0.4;
  public velocity = 0;

  constructor() {
    super({ color: varyColor(Sand.baseColor).toString() });
  }

  updateVelocity() {
    let newVelocity = this.velocity + this.acceleration;

    if (Math.abs(newVelocity) > this.maxSpeed) {
      newVelocity = Math.sign(newVelocity) * this.maxSpeed;
    }

    this.velocity = newVelocity;
  }

  resetVelocity() {
    this.velocity = 0;
  }

  update() {
    if ((this.maxSpeed ?? 0) === 0) {
      this.modified = false;

      return;
    }

    this.updateVelocity();
    this.modified = this.velocity !== 0;
  }

  getUpdateCount() {
    const abs = Math.abs(this.velocity);
    const floored = Math.floor(abs);
    const mod = abs - floored;

    // Treat a remainder (e.g. 0.5) as a random chance to update
    return floored + (Math.random() < mod ? 1 : 0);
  }
}
