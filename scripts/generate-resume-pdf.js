#!/usr/bin/env node
const { execSync } = require('child_process');
const path = require('path');

const root = path.resolve(__dirname, '..');
const input = path.join(root, 'assets/pdfs/Hildebrand_Ligtas_Resume.html');
const output = path.join(root, 'assets/pdfs/Hildebrand_Ligtas_Resume.pdf');

const cmd = [
  'chromium-browser',
  '--headless',
  '--disable-gpu',
  '--no-sandbox',
  '--print-to-pdf-no-header',
  '--paper-width=8.267',
  '--paper-height=11.693',
  '--run-all-compositor-stages-before-draw',
  '--virtual-time-budget=5000',
  `--print-to-pdf="${output}"`,
  `"file://${input}"`,
].join(' ');

try {
  execSync(cmd, { stdio: 'inherit' });
  console.log(`PDF saved: assets/pdfs/Hildebrand_Ligtas_Resume.pdf`);
} catch (e) {
  console.error('Failed to generate PDF:', e.message);
  process.exit(1);
}
