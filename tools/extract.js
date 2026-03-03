const gifFrames = require('gif-frames');
const fs = require('fs');
const path = require('path');

const gifPath = path.resolve(__dirname, '../src/assets/maps/Habitat_Changes.gif');
const outDir = path.resolve(__dirname, '../src/assets/maps');

gifFrames({ url: gifPath, frames: 'all', outputType: 'png' })
    .then(function (frameData) {
        const total = frameData.length;
        console.log(`Extracting ${total} frames...`);

        // The user has 4 datasets: 2018, 2020, 2022, 2024.
        // If the GIF has exactly 4 frames, map them directly. 
        // Otherwise, we calculate the index to distribute them evenly.
        const targets = [
            { name: 'habitat_2018.png', idx: 0 },
            { name: 'habitat_2020.png', idx: Math.floor((total - 1) * 0.33) },
            { name: 'habitat_2022.png', idx: Math.floor((total - 1) * 0.66) },
            { name: 'habitat_2024.png', idx: total - 1 },
        ]

        targets.forEach(t => {
            const match = frameData[t.idx];
            if (match) {
                const outPath = path.join(outDir, t.name);
                match.getImage().pipe(fs.createWriteStream(outPath));
                console.log(`Saved frame ${t.idx} -> ${t.name}`);
            }
        });
    })
    .catch(console.error);
