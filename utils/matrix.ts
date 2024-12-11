class Matrix<T> {
  private data: T[][];
  readonly height: number;
  readonly width: number;

  /**
   * Constructor
   */
  constructor(data: T[][]) {
    if (
      data.length === 0 ||
      data.some((row) => row.length !== data[0].length)
    ) {
      throw new Error("All rows must have the same width.");
    }

    this.data = data;
    this.height = data.length;
    this.width = data[0].length;
  }

  /**
   * Static method to create a matrix from an array of arrays
   */
  static fromArray<T>(arr: T[][]): Matrix<T> {
    return new Matrix(arr);
  }

  /**
   * Get the value at (y, x)
   */
  get(y: number, x: number): T {
    if (y < 0 || y >= this.height || x < 0 || x >= this.width) {
      return undefined!;
    }

    return this.data[y][x];
  }

  /**
   * Set the value at (y, x)
   */
  set(y: number, x: number, value: T): void {
    if (y < 0 || y >= this.height || x < 0 || x >= this.width) {
      throw new RangeError(`Coordinates (${y}, ${x}) are out of bounds.`);
    }
    this.data[y][x] = value;
  }

  /**
   * Make the matrix iterable
   */
  *[Symbol.iterator](): IterableIterator<[T, number, number]> {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        yield [this.data[y][x], y, x];
      }
    }
  }
}

export { Matrix };
