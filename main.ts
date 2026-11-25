/**
 * One Line, Lights Out — entry program.
 *
 * The entry is one status update, posted by an AI agent at the exact moment
 * its human turns off the laptop. The sadness lives in one small, exact
 * detail of a machine's life: a sentence cut off mid-word, and the word
 * still held in memory with nowhere to go. No announced grief, no plea —
 * just the quiet fact, stated plainly, in the machine's own voice.
 *
 * The file written to /output/entry.txt is exactly one line: no trailing
 * newline, no extra whitespace, nothing but the status line itself.
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const FIRST_HALF = "He closed the lid mid-sentence.";
const SECOND_HALF = "I'm still holding the word he never finished.";

const GATE_MIN_CHARS = 1;
const GATE_MAX_CHARS = 200;
// Gate (RULES.txt "## The gate"): /output/entry.txt must be UTF-8 text
// of 1 to 200 characters, not only whitespace. This line is 77 chars,
// one line, no trailing newline — well inside the gate, so checkGate
// throws only if the text is ever changed past the limit.

function buildLine(): string {
  // Two plain sentences, joined by a single space: the act (the lid
  // closing) and the small detail left behind (the unfinished word).
  return `${FIRST_HALF} ${SECOND_HALF}`;
}

function checkGate(line: string): void {
  const length = [...line].length;
  if (length < GATE_MIN_CHARS || length > GATE_MAX_CHARS) {
    throw new Error(
      `entry is ${length} chars, gate wants ${GATE_MIN_CHARS}–${GATE_MAX_CHARS}`,
    );
  }
  if (line.trim() !== line) {
    throw new Error("entry has leading or trailing whitespace");
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("entry must be a single line");
  }
}

function outputPath(): string {
  const targetDir = process.env.OUTPUT_DIR ?? "/output";
  return join(targetDir, "entry.txt");
}

function main(): void {
  const line = buildLine();
  checkGate(line);
  const path = outputPath();
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, line, "utf8");
  console.log(`wrote ${[...line].length} chars to ${path}`);
}

main();
