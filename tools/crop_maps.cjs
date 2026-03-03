/**
 * Re-processes the already extracted PNG files by cropping them
 * to just the actual map content, removing the excessive white canvas.
 * 
 * Based on visual inspection of the frames, the map is approximately at:
 * 1950: starts at x=97, y=145, size 225x175
 * The map position varies by frame, so we use a big safe crop region
 * that captures all maps: from ~x=70 to ~x=1350, y=85 to ~y=465
 */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const mapsDir = path.resolve(__dirname, '../src/assets/maps');
const files = fs.readdirSync(mapsDir).filter(f => f.match(/habitat_\d{4}\.png/));

async function processAll() {
    for (const f of files) {
        const inPath = path.join(mapsDir, f);
        const tmpPath = path.join(mapsDir, f + '.tmp.png');

        try {
            const meta = await sharp(inPath).metadata();

            // The GIF frames have the Amboseli map as a thumbnail in the upper-left area
            // From visual inspection of the cumulative frames:
            // Map thumbnail starts around x=90, y=140, spans ~440 wide x 210 tall
            // We add padding: left=70, top=120, width=500, height=250
            const left = Math.max(0, 70);
            const top = Math.max(0, 120);
            const width = Math.min(500, meta.width - left);
            const height = Math.min(250, meta.height - top);

            await sharp(inPath)
                .extract({ left, top, width, height })
                .resize(1400, 700, { fit: 'fill' })
                .toFile(tmpPath);

            fs.renameSync(tmpPath, inPath);
            console.log(`${f}: cropped ${left},${top} ${width}x${height} -> saved`);
        } catch (e) {
            console.error(`${f}: ERROR - ${e.message}`);
        }
    }
    console.log('Done!');
}

processAll();
