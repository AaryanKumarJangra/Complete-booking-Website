import { readFileSync, writeFileSync, renameSync, existsSync } from 'fs';
import { execSync } from 'child_process';
import { join, dirname } from 'path';

// Get all TS/TSX files
const files = execSync('find src -name "*.tsx" -o -name "*.ts"', { encoding: 'utf-8' })
  .split('\n')
  .filter(Boolean);

console.log(`Found ${files.length} TypeScript files to convert`);

files.forEach((file, index) => {
  try {
    const content = readFileSync(file, 'utf-8');
    
    // Remove type annotations and interfaces
    let jsContent = content
      // Remove type imports
      .replace(/import\s+type\s+\{[^}]+\}\s+from\s+['"][^'"]+['"]\s*;?\n?/g, '')
      .replace(/import\s+\{[^}]*type\s+[^}]*\}\s+from\s+['"][^'"]+['"]\s*;?\n?/g, (match) => {
        // Keep non-type imports
        const cleaned = match.replace(/,?\s*type\s+\w+\s*,?/g, '');
        return cleaned.includes('{}') ? '' : cleaned;
      })
      // Remove type annotations from function parameters
      .replace(/\(([^)]*):[\s\w\[\]<>,|&{}]+\)/g, '($1)')
      // Remove type annotations from variables
      .replace(/:\s*[\w<>\[\]|&{}]+(\s*[=,;)])/g, '$1')
      // Remove generic type parameters
      .replace(/<[\w\s,<>]+>(?=\()/g, '')
      // Remove interface declarations
      .replace(/interface\s+\w+\s*\{[^}]*\}\n*/g, '')
      // Remove type declarations
      .replace(/type\s+\w+\s*=\s*[^;]+;\n*/g, '')
      // Remove 'as' type assertions
      .replace(/\s+as\s+[\w<>\[\]|&{}]+/g, '')
      // Remove React.FC and similar
      .replace(/:\s*React\.\w+(<[^>]+>)?/g, '')
      // Clean up export type
      .replace(/export\s+type\s+/g, 'export ')
      // Remove return type annotations
      .replace(/\):\s*[\w<>\[\]|&{}]+\s*=>/g, ') =>')
      .replace(/\):\s*[\w<>\[\]|&{}]+\s*\{/g, ') {');
    
    // Determine new filename
    const newFile = file.replace(/\.tsx?$/, file.endsWith('.tsx') ? '.jsx' : '.js');
    
    // Write the converted content
    writeFileSync(newFile, jsContent, 'utf-8');
    console.log(`✓ Converted: ${file} → ${newFile}`);
    
  } catch (error) {
    console.error(`✗ Error converting ${file}:`, error.message);
  }
});

console.log('\n✅ Batch conversion completed!');
