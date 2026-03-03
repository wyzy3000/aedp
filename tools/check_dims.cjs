const fs = require('fs');
const path = require('path');

// Read PNG dimensions manually by parsing the PNG IHDR chunk
function getPngDimensions(filePath) {
    const buf = fs.readFileSync(filePath);
    // PNG signature is 8 bytes, IHDR chunk starts at byte 8
    // IHDR: 4 bytes length, 4 bytes "IHDR", 4 bytes width, 4 bytes height
    const width = buf.readUInt32BE(16);
    const height = buf.readUInt32BE(20);
    return { width, height };
}

const mapsDir = path.resolve(__dirname, '../src/assets/maps');
const files = fs.readdirSync(mapsDir).filter(f => f.endsWith('.png'));

files.forEach(f => {
    try {
        const dims = getPngDimensions(path.join(mapsDir, f));
        const sizeMB = (fs.statSync(path.join(mapsDir, f)).size / 1024 / 1024).toFixed(2);
        console.log(`${f}: ${dims.width}x${dims.height} (${sizeMB} MB)`);
    } catch (e) {
        console.log(`${f}: ERROR - ${e.message}`);
    }
});
