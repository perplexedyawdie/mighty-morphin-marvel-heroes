const { createFFmpeg, fetchFile } = require('@ffmpeg/ffmpeg');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

function toPNG(files) {
    return new Promise((resolve, reject) => {
        fs.readFile(files.file.path, function (err, data) {

            const ffmpeg = createFFmpeg({ log: true });
            // ffmpeg -i files.file.path -preset ultrafast path.join(process.cwd(), 'routes', 'files.file.name.png')
            // path.join(process.cwd(), 'routes', 'test.avi')
            let date = new Date();
            const rawFileName = files.file.name;
            const splitFileName = `${files.file.name.split('.')[0]}_${uuidv4()}.png`
            try {
              (async () => {
                await ffmpeg.load();
                ffmpeg.FS('writeFile', rawFileName, await fetchFile(data));
                await ffmpeg.run('-i', rawFileName, splitFileName);
                await fs.promises.writeFile(path.join(process.cwd(), 'face-morpher', 'images', splitFileName), ffmpeg.FS('readFile', splitFileName));
                resolve(splitFileName)
                // process.exit(0);
              })();
            } catch (error) {
              console.log(error)
              reject(error)
            }
      
          });
    })
    
    
}

module.exports = toPNG;