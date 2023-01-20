import { Particle } from './particle';

export class Empty extends Particle {
  static baseColor = '#000000';

  constructor() {
    super({ color: Empty.baseColor, empty: true });
  }
}
