class Multiset<T> {
  private map: Map<T, bigint>;

  constructor() {
    this.map = new Map<T, bigint>();
  }

  /**
   * Add multiple elements from an array
   */
  static fromArray<T>(arr: T[]): Multiset<T> {
    const multiset = new Multiset<T>()
    for (const item of arr) {
      multiset.add(item);
    }
    return multiset;
  }

  /**
   * Add an element to the multiset
   */
  add(value: T, count: bigint | number = 1): void {
    const addCount = BigInt(count);
    if (addCount <= 0n) return;

    const currentCount = this.map.get(value) || 0n;
    this.map.set(value, currentCount + addCount);
  }

  /**
   * Remove an element or decrease its count
   */
  remove(value: T, count: bigint | number = 1): boolean {
    const removeCount = BigInt(count);
    const currentCount = this.map.get(value);
    if (currentCount === undefined || currentCount <= 0n) return false;

    if (currentCount <= removeCount) {
      this.map.delete(value); // Remove completely
    } else {
      this.map.set(value, currentCount - removeCount); // Decrease count
    }

    return true;
  }

  /**
   * Get the count of an element
   */
  count(value: T): bigint {
    return this.map.get(value) || 0n;
  }

  /**
   * Check if an element exists in the multiset
   */
  has(value: T): boolean {
    return this.map.has(value);
  }

  /**
   * Get the size (total number of elements, including duplicates)
   */
  size(): bigint {
    let total = 0n;
    for (const count of this.map.values()) {
      total += count;
    }
    return total;
  }

  /**
   * Clear the multiset
   */
  clear(): void {
    this.map.clear();
  }

  /**
   * Make the multiset iterable
   */
  *[Symbol.iterator](): IterableIterator<[T, bigint]> {
    for (const entry of this.map.entries()) {
      yield entry;
    }
  }
}

export { Multiset };
