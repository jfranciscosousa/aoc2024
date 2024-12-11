import { chain } from "lodash";
import { readInputContent } from "../utils/files.ts";

type Disk = (number | undefined)[];

async function buildDisk(inputPath: string) {
  const blockinfo = await readInputContent(inputPath)
    .then((v) => v.split(""))
    .then((v) => v.map(Number));
  const disk: (number | undefined)[] = [];

  let id = 0;
  for (let i = 0; i < blockinfo.length; i++) {
    let content: number | undefined;
    if (i % 2 === 0) {
      // is file
      content = id;
      id++;
    } else {
      // is free space
      content = undefined;
    }

    for (let j = 0; j < blockinfo[i]; j++) {
      disk.push(content);
    }
  }

  return disk;
}

function defragDiskBlocks(blocks: Disk): Disk {
  let l = 0;
  let r = blocks.length - 1;

  while (l < r) {
    // Move 'l' forward until we find an undefined block or surpass 'r'
    while (l < r && blocks[l] !== undefined) {
      l++;
    }

    // Move 'r' backward until we find a defined block or pass 'l'
    while (r > l && blocks[r] === undefined) {
      r--;
    }

    // If 'l' is still less than 'r', we have a pair to swap
    if (l < r) {
      blocks[l] = blocks[r];
      blocks[r] = undefined;
      l++;
      r--;
    }
  }

  return blocks;
}

function checksum(blocks: Disk): number {
  return blocks.reduce<number>((memo, currentValue, currentIndex) => {
    return (
      memo + (currentValue !== undefined ? currentIndex * currentValue : 0)
    );
  }, 0);
}

interface FileInfo {
  id: number;
  start: number;
  end: number;
  length: number;
}

interface FreeSegment {
  start: number;
  end: number;
  length: number;
}

function findFiles(disk: Disk): FileInfo[] {
  const files: FileInfo[] = [];
  let currentId: number | undefined = undefined;
  let start = -1;

  for (let i = 0; i < disk.length; i++) {
    const val = disk[i];
    if (val !== undefined) {
      if (currentId === undefined) {
        currentId = val;
        start = i;
      } else if (val !== currentId) {
        files.push({ id: currentId, start, end: i - 1, length: i - start });

        currentId = val;
        start = i;
      }
    } else {
      if (currentId !== undefined) {
        files.push({ id: currentId, start, end: i - 1, length: i - start });
        currentId = undefined;
      }
    }
  }

  if (currentId !== undefined) {
    files.push({
      id: currentId,
      start,
      end: disk.length - 1,
      length: disk.length - start,
    });
  }

  return files;
}

function findFreeSegments(disk: Disk): FreeSegment[] {
  const segments: FreeSegment[] = [];
  let start = -1;
  for (let i = 0; i < disk.length; i++) {
    if (disk[i] === undefined) {
      if (start === -1) start = i;
    } else {
      if (start !== -1) {
        segments.push({ start, end: i - 1, length: i - start });
        start = -1;
      }
    }
  }
  if (start !== -1) {
    segments.push({ start, end: disk.length - 1, length: disk.length - start });
  }
  return segments;
}

function mergeFreeSegments(segments: FreeSegment[]): FreeSegment[] {
  if (segments.length <= 1) return segments.slice();
  segments.sort((a, b) => a.start - b.start);
  const merged: FreeSegment[] = [];
  let current = segments[0];

  for (let i = 1; i < segments.length; i++) {
    const next = segments[i];
    if (next.start === current.end + 1) {
      current = {
        start: current.start,
        end: next.end,
        length: current.length + next.length,
      };
    } else {
      merged.push(current);
      current = next;
    }
  }
  merged.push(current);
  return merged;
}

function updateFreeSegmentsAfterMove(
  segments: FreeSegment[],
  oldFile: FileInfo,
  newStart: number
): FreeSegment[] {
  segments.push({
    start: oldFile.start,
    end: oldFile.end,
    length: oldFile.length,
  });

  segments = mergeFreeSegments(segments);

  const occupiedStart = newStart;
  const occupiedEnd = newStart + oldFile.length - 1;

  const updated: FreeSegment[] = [];
  for (const seg of segments) {
    if (seg.end < occupiedStart || seg.start > occupiedEnd) {
      updated.push(seg);
    } else {
      // Overlaps with occupied area
      if (seg.start < occupiedStart && seg.end > occupiedEnd) {
        updated.push({
          start: seg.start,
          end: occupiedStart - 1,
          length: occupiedStart - seg.start,
        });
        updated.push({
          start: occupiedEnd + 1,
          end: seg.end,
          length: seg.end - (occupiedEnd + 1) + 1,
        });
      } else if (
        seg.start < occupiedStart &&
        seg.end >= occupiedStart &&
        seg.end <= occupiedEnd
      ) {
        const newEnd = occupiedStart - 1;
        if (newEnd >= seg.start) {
          updated.push({
            start: seg.start,
            end: newEnd,
            length: newEnd - seg.start + 1,
          });
        }
      } else if (
        seg.start >= occupiedStart &&
        seg.start <= occupiedEnd &&
        seg.end > occupiedEnd
      ) {
        const newStart = occupiedEnd + 1;
        if (newStart <= seg.end) {
          updated.push({
            start: newStart,
            end: seg.end,
            length: seg.end - newStart + 1,
          });
        }
      }
    }
  }
  return mergeFreeSegments(updated);
}

function moveFileIfPossible(
  disk: Disk,
  file: FileInfo,
  segments: FreeSegment[]
): { moved: boolean; segments: FreeSegment[] } {
  const candidates = segments.filter(
    (seg) => seg.end < file.start && seg.length >= file.length
  );
  if (candidates.length === 0) return { moved: false, segments };

  candidates.sort((a, b) => a.start - b.start);
  const chosen = candidates[0];
  const newStart = chosen.start;

  let idx = 0;
  for (let pos = file.start; pos <= file.end; pos++) {
    const val = disk[pos]!;
    disk[newStart + idx] = val;
    idx++;
  }

  for (let pos = file.start; pos <= file.end; pos++) {
    disk[pos] = undefined;
  }

  const updatedSegments = updateFreeSegmentsAfterMove(segments, file, newStart);
  return { moved: true, segments: updatedSegments };
}

function defragByFiles(disk: Disk): Disk {
  // Identify files and free segments
  const files = findFiles(disk);
  let segments = findFreeSegments(disk);

  // Sort files by descending file ID
  files.sort((a, b) => b.id - a.id);

  // Attempt to move each file once
  for (const file of files) {
    const result = moveFileIfPossible(disk, file, segments);
    segments = result.segments;
  }

  return disk;
}

export async function part1(inputPath: string): Promise<number> {
  return chain(await buildDisk(inputPath))
    .thru(defragDiskBlocks)
    .thru(checksum)
    .value();
}

export async function part2(inputPath: string): Promise<number> {
  return chain(await buildDisk(inputPath))
    .thru(defragByFiles)
    .thru(checksum)
    .value();
}
