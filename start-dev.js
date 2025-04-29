
#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

// Path to node_modules/.bin directory
const binPath = path.resolve(__dirname, 'node_modules', '.bin');
const viteBin = path.join(binPath, 'vite');

console.log('Attempting to start dev server with Vite from:', viteBin);

// Start Vite with explicit path
const child = spawn(viteBin, [], { 
  stdio: 'inherit',
  env: { ...process.env, PATH: `${binPath}:${process.env.PATH}` }
});

child.on('error', (err) => {
  console.error('Failed to start Vite:', err);
  console.log('\nTroubleshooting steps:');
  console.log('1. Try reinstalling dependencies: npm install or yarn');
  console.log('2. Check if vite is installed: ls -la node_modules/.bin/vite');
  console.log('3. Try running vite directly: ./node_modules/.bin/vite');
});
