import { readdirSync } from 'node:fs';
import { join, relative } from 'node:path';

interface EmbeddedFile {
  path: string;
  content: string;
}

async function getAllFiles(dir: string, base: string): Promise<EmbeddedFile[]> {
  const files: EmbeddedFile[] = [];

  try {
    const entries = readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      const relativePath = relative(base, fullPath);

      if (entry.isDirectory()) {
        // Recursively get files from subdirectory
        files.push(...(await getAllFiles(fullPath, base)));
      } else if (entry.isFile()) {
        // Read file content using Bun file API
        const file = Bun.file(fullPath);
        const content = await file.text();
        files.push({ path: relativePath, content });
      }
    }
  } catch (_error) {
    // Directory doesn't exist, return empty array
  }

  return files;
}

async function generateEmbeddedFiles() {
  // Get the project root directory
  const projectRoot = import.meta.dir;

  // Embed files
  const embeddedFiles: Record<string, EmbeddedFile[]> = {};

  // Embed CLAUDE.md
  try {
    const claudeMdFile = Bun.file(join(projectRoot, 'CLAUDE.md'));
    const claudeMdContent = await claudeMdFile.text();
    embeddedFiles['CLAUDE.md'] = [
      { path: 'CLAUDE.md', content: claudeMdContent },
    ];
  } catch (_error) {
    embeddedFiles['CLAUDE.md'] = [];
  }

  // Embed .claude directory
  embeddedFiles['.claude'] = await getAllFiles(
    join(projectRoot, '.claude'),
    join(projectRoot, '.claude')
  );

  // Embed .cursor directory
  embeddedFiles['.cursor'] = await getAllFiles(
    join(projectRoot, '.cursor'),
    join(projectRoot, '.cursor')
  );

  // Generate the embedded files module with proper TypeScript types
  const output = `// This file is auto-generated. Do not edit manually.

export interface EmbeddedFile {
  path: string;
  content: string;
}

export const EMBEDDED_FILES: Record<string, EmbeddedFile[]> = ${JSON.stringify(embeddedFiles, null, 2)};
`;

  await Bun.write(
    join(projectRoot, 'src', 'embedded-files.generated.ts'),
    output
  );
  console.log('✓ Generated embedded files');
}

// Run the generation
generateEmbeddedFiles();
