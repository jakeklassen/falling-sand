import { varyColor } from './color';

export class Grid {
  #cleared = false;
  #width: number;
  #height: number;
  #grid: Array<string | 0> = [];
  #modifiedIndices: Set<number> = new Set();
  #rowCount: number;

  constructor(width: number, height: number) {
    this.#width = width;
    this.#height = height;
    this.#grid = new Array(width * height).fill(0);
    this.#rowCount = Math.floor(this.#grid.length / width);
  }

  update() {
    this.#cleared = false;

    for (let row = this.#rowCount - 1; row >= 0; row--) {
      const rowOffset = row * this.#width;
      const leftToRight = Math.random() > 0.5;

      for (let i = 0; i < this.#width; i++) {
        const index = leftToRight ? rowOffset + i : rowOffset + this.#width - i;

        if (this.isEmpty(index)) {
          continue;
        }

        const below = index + this.#width;
        const belowLeft = below - 1;
        const belowRight = below + 1;
        const column = index % this.#width;

        if (this.isEmpty(below)) {
          this.swap(index, below);
        } else if (
          this.isEmpty(belowLeft) &&
          belowLeft % this.#width < column
        ) {
          this.swap(index, belowLeft);
        } else if (
          this.isEmpty(belowRight) &&
          belowRight % this.#width > column
        ) {
          this.swap(index, belowRight);
        }
      }
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    if (this.#cleared) {
      ctx.clearRect(0, 0, this.#width, this.#height);
    }

    for (const index of this.#modifiedIndices) {
      const x = index % this.#width;
      const y = Math.floor(index / this.#width);
      const color = this.#grid[index];

      if (color === 0) {
        ctx.fillStyle = 'black';
        ctx.fillRect(x, y, 1, 1);
      } else {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, 1, 1);
      }
    }

    this.#modifiedIndices.clear();
  }

  clear() {
    this.#grid.fill(0);
    this.#modifiedIndices.clear();
    this.#cleared = true;
  }

  index(x: number, y: number) {
    return x + y * this.#width;
  }

  set(x: number, y: number, color: string) {
    const index = this.index(x, y);

    // Ignore out of bounds
    if (x < 0 || x >= this.#width) return;
    if (y < 0 || y >= this.#height) return;

    this.setIndex(index, color);
  }

  setIndex(index: number, color: string) {
    this.#grid[index] = color;
    this.#modifiedIndices.add(index);
  }

  setWithinCircle(x: number, y: number, radius = 2, probability = 1) {
    let radiusSq = radius * radius;

    for (let y1 = -radius; y1 <= radius; y1++) {
      for (let x1 = -radius; x1 <= radius; x1++) {
        if (x1 * x1 + y1 * y1 <= radiusSq && Math.random() < probability) {
          this.set(x + x1, y + y1, varyColor('#dcb159').toString());
        }
      }
    }
  }

  get(x: number, y: number) {
    return this.#grid[x + y * this.#width];
  }

  swap(a: number, b: number) {
    if (this.isEmpty(a) && this.isEmpty(b)) {
      return;
    }

    [this.#grid[a], this.#grid[b]] = [this.#grid[b], this.#grid[a]];
    this.#modifiedIndices.add(a);
    this.#modifiedIndices.add(b);
  }

  isEmpty(index: number) {
    return this.#grid[index] === 0;
  }
}
