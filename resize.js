const sharp = require('sharp');
const path = require('path');
const inputPath = 'C:\\Users\\INTEL\\.gemini\\antigravity\\brain\\4c2fa965-8d26-4399-bcd0-28f24e7cfdee\\prodexify_logo_1775462459223.png';
const out192 = 'public/icons/icon-192.png';
const out512 = 'public/icons/icon-512.png';

async function resize() {
  await sharp(inputPath).resize(192, 192).toFile(out192);
  await sharp(inputPath).resize(512, 512).toFile(out512);
  console.log('Resized successfully');
}
resize().catch(console.error);
