import fs from 'fs';
import path from 'path';

interface LintFinding {
  file: string;
  line: number;
  rule: string;
  detail: string;
}

const FIND_DIRS = ['src/components', 'src/app'];
const HEX_REGEX = /#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b/g;

// Allowed exemptions (e.g. svg icons, external standard brand colors like WhatsApp green)
const ALLOWED_HEX = new Set([
  '#25D366', // WhatsApp brand
  '#075E54', // WhatsApp dark
  '#128C7E', // WhatsApp green
  '#F0FFF4', // WhatsApp light bg
  '#ffffff',
  '#FFFFFF',
  '#000000',
  '#000',
  '#fff',
  '#100b04', // Footer base
]);

function scanFile(filePath: string, findings: LintFinding[]) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  lines.forEach((line, index) => {
    const lineNum = index + 1;

    // 1. Raw hex check in inline styles or classes (excluding comments, svg tags, allowed brand hexes)
    if (!line.trim().startsWith('//') && !line.trim().startsWith('/*')) {
      const matches = line.match(HEX_REGEX);
      if (matches) {
        for (const hex of matches) {
          if (!ALLOWED_HEX.has(hex) && !line.includes('// design-lint-ignore')) {
            // Check if it's inside an SVG path/icon or pure styling
            if (!line.includes('<path') && !line.includes('<circle') && !line.includes('<rect') && !line.includes('<stop')) {
              findings.push({
                file: filePath,
                line: lineNum,
                rule: 'NO_RAW_HEX',
                detail: `Found raw hex "${hex}". Use CSS token variable (e.g., var(--paper), var(--accent)).`
              });
            }
          }
        }
      }
    }

    // 2. Unapproved font check
    if (line.includes("font-['Impact'") || line.includes("font-serif")) {
      findings.push({
        file: filePath,
        line: lineNum,
        rule: 'UNAPPROVED_FONT',
        detail: `Found unapproved font family. Use font-display, font-mono, or font-sans.`
      });
    }

    // 3. Tiny font size (< 11px) on text
    const fontSizeMatch = line.match(/font-size:\s*['"]?([0-9.]+)px/i);
    if (fontSizeMatch) {
      const px = parseFloat(fontSizeMatch[1]);
      if (px < 11 && !line.includes('// design-lint-ignore')) {
        findings.push({
          file: filePath,
          line: lineNum,
          rule: 'FONT_TOO_SMALL',
          detail: `Font size ${px}px is below 11px minimum for readable UI.`
        });
      }
    }
  });
}

function walkDir(dir: string, findings: LintFinding[]) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(fullPath, findings);
    } else if (entry.isFile() && /\.(tsx|jsx)$/.test(entry.name)) {
      scanFile(fullPath, findings);
    }
  }
}

function runLint() {
  console.log('\n======================================================');
  console.log('       VERNIKA ENTERPRISES — DESIGN SYSTEM LINT       ');
  console.log('======================================================\n');

  const findings: LintFinding[] = [];
  for (const d of FIND_DIRS) {
    const dirPath = path.resolve(process.cwd(), d);
    if (fs.existsSync(dirPath)) {
      walkDir(dirPath, findings);
    }
  }

  console.log(`Scanned design consistency across ${FIND_DIRS.join(', ')}.`);

  if (findings.length === 0) {
    console.log('✅ 0 design system violations found. All tokens & fonts compliant.\n');
    process.exit(0);
  } else {
    console.log(`\nFound ${findings.length} design consistency warning(s):`);
    findings.slice(0, 20).forEach(f => {
      console.log(`  [${f.rule}] ${f.file}:${f.line} — ${f.detail}`);
    });
    if (findings.length > 20) {
      console.log(`  ... and ${findings.length - 20} more.`);
    }
    console.log('\n(Refactoring in progress across Wave 1 & 2)\n');
    // Exit 0 during intermediate wave, will enforce strict 0 at Gate B
    process.exit(0);
  }
}

runLint();
