#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const os = require("os");

function printHelp() {
  console.log(`flutter-code-standards-skills

Install the flutter-code-standards skill package into a Codex-compatible skills directory.

Usage:
  npx flutter-code-standards-skills install [--dest <dir>] [--force] [--dry-run]
  npx flutter-code-standards-skills --help

Options:
  --dest <dir>  Install into a specific skills directory.
  --force       Overwrite existing skill directories.
  --dry-run     Print planned operations without copying files.
  --help        Show this help text.

Default destination:
  Windows: %CODEX_HOME%\\skills, otherwise %USERPROFILE%\\.agents\\skills
  macOS/Linux: $CODEX_HOME/skills, otherwise $HOME/.agents/skills
`);
}

function parseArgs(argv) {
  const args = argv.slice(2);
  let command = "install";
  let dest;
  let force = false;
  let dryRun = false;

  if (args[0] && !args[0].startsWith("-")) {
    command = args.shift();
  }

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === "--dest") {
      dest = args[i + 1];
      i += 1;
    } else if (arg === "--force") {
      force = true;
    } else if (arg === "--dry-run") {
      dryRun = true;
    } else if (arg === "--help" || arg === "-h") {
      command = "help";
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return { command, dest, force, dryRun };
}

function resolveDefaultDest() {
  if (process.env.CODEX_HOME) {
    return path.join(process.env.CODEX_HOME, "skills");
  }
  return path.join(os.homedir(), ".agents", "skills");
}

function ensureDir(dir, dryRun) {
  if (dryRun) {
    console.log(`[dry-run] mkdir -p ${dir}`);
    return;
  }
  fs.mkdirSync(dir, { recursive: true });
}

function copyDir(src, dest, force, dryRun) {
  if (fs.existsSync(dest)) {
    if (!force) {
      throw new Error(`Target already exists: ${dest}. Re-run with --force to overwrite.`);
    }
    if (dryRun) {
      console.log(`[dry-run] remove ${dest}`);
    } else {
      fs.rmSync(dest, { recursive: true, force: true });
    }
  }

  if (dryRun) {
    console.log(`[dry-run] copy ${src} -> ${dest}`);
    return;
  }

  fs.cpSync(src, dest, { recursive: true });
}

function main() {
  let parsed;
  try {
    parsed = parseArgs(process.argv);
  } catch (error) {
    console.error(error.message);
    printHelp();
    process.exit(1);
  }

  if (parsed.command === "help") {
    printHelp();
    return;
  }

  if (parsed.command !== "install") {
    console.error(`Unsupported command: ${parsed.command}`);
    printHelp();
    process.exit(1);
  }

  const repoRoot = path.resolve(__dirname, "..");
  const skillsRoot = path.join(repoRoot, "skills");
  const skillNames = fs
    .readdirSync(skillsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  const destRoot = path.resolve(parsed.dest || resolveDefaultDest());
  ensureDir(destRoot, parsed.dryRun);

  for (const skillName of skillNames) {
    copyDir(
      path.join(skillsRoot, skillName),
      path.join(destRoot, skillName),
      parsed.force,
      parsed.dryRun
    );
  }

  console.log(`Installed ${skillNames.length} skills into: ${destRoot}`);
  console.log("Restart Codex to pick up new skills.");
}

main();
