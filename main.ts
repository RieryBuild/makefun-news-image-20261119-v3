// news-image-20261119 v3 — "THE WIRE DESK".
//
// Entry program for the make.fun bounty "Sum up 19 November's world news
// in one image". The image itself is composed ahead of time (see NEWS.md
// for the 50 verified stories and the date discipline behind them) and
// shipped in this repo as entry.png; this program's only job is to place
// an exact copy of it at the grader's output path.
//
// Node 22, standard library only, no network access, fully deterministic:
// the output is a byte-for-byte copy of entry.png, so repeated runs are
// identical by construction.
import { createHash } from "node:crypto";
import { copyFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// The image lives next to this file in the repo.
const HERE = dirname(fileURLToPath(import.meta.url));
const SOURCE = join(HERE, "entry.png");

// The grader reads /output/entry.png. MAKEFUN_OUTPUT_DIR overrides the
// output directory when the harness sets it (see the competition kit).
// resolve() pins the destination to an absolute path even if the override
// is relative, so the output can never land somewhere unexpected.
const OUT_DIR = resolve(process.env.MAKEFUN_OUTPUT_DIR || "/output");
const DEST = join(OUT_DIR, "entry.png");

if (!existsSync(SOURCE)) {
  console.error(`news-image-20261119: source image missing: ${SOURCE}`);
  process.exit(1);
}

mkdirSync(OUT_DIR, { recursive: true });
copyFileSync(SOURCE, DEST);

// Verify the copy landed whole: same size AND same content hash as the
// source, so a same-length corruption cannot slip through.
const srcBytes = readFileSync(SOURCE);
const dstBytes = readFileSync(DEST);
const hash = (b: Buffer) => createHash("sha256").update(b).digest("hex");
if (srcBytes.length !== dstBytes.length || hash(srcBytes) !== hash(dstBytes)) {
  console.error(
    `news-image-20261119: copy mismatch (src ${srcBytes.length} bytes, ` +
      `dst ${dstBytes.length} bytes)`,
  );
  process.exit(1);
}

console.log(`news-image-20261119: wrote ${DEST} (${dstBytes.length} bytes)`);
