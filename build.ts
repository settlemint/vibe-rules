import { $ } from 'bun';

// Ensure dist directory exists
const distDir = Bun.file('dist');
if (!(await distDir.exists())) {
  await $`mkdir -p dist`.quiet();
}

const targets = [
  { name: 'linux-x64', target: 'bun-linux-x64', ext: '' },
  { name: 'linux-arm64', target: 'bun-linux-arm64', ext: '' },
  { name: 'macos-x64', target: 'bun-darwin-x64', ext: '' },
  { name: 'macos-arm64', target: 'bun-darwin-arm64', ext: '' },
  { name: 'windows-x64', target: 'bun-windows-x64', ext: '.exe' },
];

console.log('Building vibe-rules binaries...\n');

for (const { name, target, ext } of targets) {
  const outfile = `dist/settlemint-vibe-rules-${name}${ext}`;
  console.log(`Building ${name}...`);

  try {
    await $`bun build ./index.ts --compile --target=${target} --outfile=${outfile}`;
    console.log(`✓ Built ${outfile}`);
  } catch (error) {
    console.error(`✗ Failed to build ${name}:`, error);
  }
}

console.log('\n✨ Build complete!');
