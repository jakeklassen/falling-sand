interface ParticleOptions {
  color: string;
  empty?: boolean;
}

export class Particle {
  public color: string;
  public empty: boolean;
  public modified = false;

  constructor(options: ParticleOptions) {
    this.color = options.color;
    this.empty = options.empty ?? false;
  }
}
