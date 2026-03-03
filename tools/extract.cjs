/**
 * Combined: extract cumulative GIF frames + crop to map area in one pass.
 * Uses gif-frames (cumulative) + sharp for tightly cropped output.
 */
const gifFrames = require('./node_modules/gif-frames');
const sharp = require('./node_modules/sharp');

const fs = require('fs');
const path = require('path');
const { Readable } = require('stream');

const gifPath = path.resolve(__dirname, '../src/assets/maps/Habitat_Changes.gif');
const outDir = path.resolve(__dirname, '../src/assets/maps');

const years = [1950, 1967, 1973, 1978, 1983, 1987, 1993, 1997, 2002, 2007, 2012, 2017, 2023];

// From visual inspection of frame 56 (first non-blank frame):
// The map overlay appears at roughly:
// - In the 1920x1080 canvas, the map thumbnail is at around x=90, y=145
// - It spans roughly 350 wide x 195 tall
// These params give us a tight crop just around the map + small border
const CROP = { left: 80, top: 100, width: 450, height: 260 };

gifFrames({ url: gifPath, frames: 'all', outputType: 'png', cumulative: true })
    .then(async function (frameData) {
        const total = frameData.length;
        console.log(`Total cumulative frames: ${total}`);
        const segmentLength = total / years.length;

        for (let i = 0; i < years.length; i++) {
            const year = years[i];
            const frameIdx = Math.min(Math.floor(i * segmentLength + segmentLength * 0.25), total - 1);
            const match = frameData[frameIdx];
            if (!match) continue;

            const outPath = path.join(outDir, `habitat_${year}.png`);

            // Collect the PNG stream data into a buffer
            const chunks = [];
            const stream = match.getImage();

            await new Promise((resolve, reject) => {
                stream.on('data', chunk => chunks.push(chunk));
                stream.on('end', async () => {
                    try {
                        const buf = Buffer.concat(chunks);
                        const meta = await sharp(buf).metadata();

                        const left = Math.min(CROP.left, meta.width - 1);
                        const top = Math.min(CROP.top, meta.height - 1);
                        const width = Math.min(CROP.width, meta.width - left);
                        const height = Math.min(CROP.height, meta.height - top);

                        await sharp(buf)
                            .extract({ left, top, width, height })
                            .resize(1400, 700, { fit: 'fill' })
                            .toFile(outPath);

                        console.log(`Saved frame ${frameIdx} -> habitat_${year}.png (cropped ${left},${top} ${width}x${height})`);
                        resolve();
                    } catch (e) {
                        console.error(`Error processing year ${year}: ${e.message}`);
                        resolve();
                    }
                });
                stream.on('error', reject);
            });
        }

        console.log('All frames extracted and cropped!');
    })
    .catch(console.error);
