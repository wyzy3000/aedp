const sharp = require('sharp');
const path = require('path');

const filePath = process.argv[2];
sharp(filePath).metadata().then(meta => {
    console.log(JSON.stringify(meta, null, 2));
}).catch(err => {
    console.error(err);
});
