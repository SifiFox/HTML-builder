const path = require('path');
const fs = require('fs');
const fsPromises = require('fs/promises');

const bundlePath = path.join(__dirname, 'project-dist/bundle.css');

const bundle = fs.createWriteStream(bundlePath, 'utf-8');

const stylesPath = path.join(__dirname, 'styles');

async function mergeStyles(cssPath) {
  const files = await fsPromises.readdir(cssPath, {
    encoding: 'utf-8',
    withFileTypes: true,
  });

  for (let file of files) {
    const filePath = path.join(file.path, file.name);
    const fileExt = path.extname(filePath);
    if (file.isFile() && fileExt === '.css') {
      const readStream = fs.createReadStream(filePath, 'utf-8');
      readStream.on('data', (data) => {
        bundle.write(data);
      });
    }
  }
}

mergeStyles(stylesPath);
