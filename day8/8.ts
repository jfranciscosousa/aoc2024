async function getMap(inputPath: string): Promise<string[][]> {
  const fileContent = await Deno.readTextFile(inputPath);

  return fileContent
    .trim()
    .split("\n")
    .map((l) => l.split(""));
}

function getAntennas(map: string[][]) {
  const antennas = new Map<string, Set<string>>();

  // Store antenna locations
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      const curr = map[y][x];
      const pos = `${y},${x}`;

      if (curr !== ".") {
        const existing = antennas.get(curr);

        if (existing) antennas.set(curr, existing.add(pos));
        else antennas.set(curr, new Set<string>().add(pos));
      }
    }
  }

  return antennas;
}

function distanceBetweenPoints(y1: number, x1: number, y2: number, x2: number) {
  const deltaY = y2 - y1;
  const deltaX = x2 - x1;

  return [deltaY, deltaX];
}

function countAntinodes(
  map: string[][],
  coordinates: number[][],
  currentIndex = 0,
  antinodes = new Set<string>()
) {
  // Stop condition
  if (currentIndex > coordinates.length - 1) return antinodes;

  const restOfCoordinates = coordinates.toSpliced(currentIndex, 1);

  // Find the distance between the start coordinate and the rest
  restOfCoordinates.forEach((restCoordinate) => {
    const currentCoordinate = coordinates[currentIndex];
    const distance = distanceBetweenPoints(
      currentCoordinate[0],
      currentCoordinate[1],
      restCoordinate[0],
      restCoordinate[1]
    );

    // To view a possible antinode, just "add" the distance to the other coordinate
    const newy = restCoordinate[0] + distance[0];
    const newx = +restCoordinate[1] + distance[1];

    // Add it to the antinodes set, remember, we only want unique positions
    if (map[newy]?.[newx]) antinodes.add(`${newy},${newx}`);
  });

  return countAntinodes(map, coordinates, currentIndex + 1, antinodes);
}

export async function part1(inputPath: string): Promise<number> {
  const map = await getMap(inputPath);
  const antennas = getAntennas(map);

  let antinodes = new Set<string>();

  antennas.values().forEach((coordinates) => {
    const parsedCoordinates = Array.from(coordinates.values()).map((c) =>
      c.split(",").map(Number)
    );

    antinodes = countAntinodes(map, parsedCoordinates, 0, antinodes);
  });

  return antinodes.size;
}

function countAntinodes2(
  map: string[][],
  coordinates: number[][],
  currentIndex = 0,
  antinodes = new Set<string>()
) {
  // Stop condition
  if (currentIndex > coordinates.length - 1) return antinodes;

  const restOfCoordinates = coordinates.toSpliced(currentIndex, 1);

  // Find the distance between the start coordinate and the rest
  restOfCoordinates.forEach((restCoordinate) => {
    const currentCoordinate = coordinates[currentIndex];
    const distance = distanceBetweenPoints(
      currentCoordinate[0],
      currentCoordinate[1],
      restCoordinate[0],
      restCoordinate[1]
    );

    let done = false;
    let newy = restCoordinate[0];
    let newx = restCoordinate[1];
    while (!done) {
      // To view a possible antinode, just "add" the distance to the other coordinate
      newy -= distance[0];
      newx -= distance[1];

      // Add it to the antinodes set, remember, we only want unique positions
      if (map[newy]?.[newx]) antinodes.add(`${newy},${newx}`);
      else done = true;
    }
  });

  return countAntinodes2(map, coordinates, currentIndex + 1, antinodes);
}

export async function part2(inputPath: string): Promise<number> {
  const map = await getMap(inputPath);
  const antennas = getAntennas(map);

  let antinodes = new Set<string>();

  antennas.values().forEach((coordinates) => {
    const parsedCoordinates = Array.from(coordinates.values()).map((c) =>
      c.split(",").map(Number)
    );

    antinodes = countAntinodes2(map, parsedCoordinates, 0, antinodes);
  });

  return antinodes.size;
}
