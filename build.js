const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log("Executing monorepo Vercel build...");
const frontendDir = path.join(__dirname, 'frontend');

console.log("Running npm install in frontend...");
execSync('npm install', { cwd: frontendDir, stdio: 'inherit' });

console.log("Running npm run build in frontend...");
execSync('npm run build', { cwd: frontendDir, stdio: 'inherit' });

const srcDist = path.join(frontendDir, 'dist');
const targetDist = path.join(__dirname, 'dist');

if (fs.existsSync(targetDist)) {
  fs.rmSync(targetDist, { recursive: true, force: true });
}

fs.cpSync(srcDist, targetDist, { recursive: true });
console.log("Build complete! Dist copied to root dist directory.");
