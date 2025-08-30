#!/usr/bin/env node

/**
 * Build script for @transparency-ai/utils package
 * Copies source files to dist directory for distribution
 */

const fs = require('fs');
const path = require('path');

// Create dist directory if it doesn't exist
const distDir = path.join(__dirname, '../dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Copy source files to dist
const srcDir = path.join(__dirname, '../src');
const files = fs.readdirSync(srcDir);

files.forEach(file => {
  if (file.endsWith('.js')) {
    const srcPath = path.join(srcDir, file);
    const destPath = path.join(distDir, file);
    fs.copyFileSync(srcPath, destPath);
    console.log(`✓ Copied ${file} to dist/`);
  }
});

console.log('✅ Utils package built successfully!');
