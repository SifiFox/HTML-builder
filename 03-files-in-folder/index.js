const path = require('path');
const fsPromises = require('fs/promises');

async function getFilesStats() {
  try {
    const files = await fsPromises.readdir(path.join(__dirname, 'secret-folder'), {
      withFileTypes: true,
    });

    for (const file of files) {
      if (file.isFile()) {
        const filePath = path.join(__dirname, `secret-folder/${file.name}`);
        const fileStats = await fsPromises.stat(filePath);
        const fileExt = path.extname(filePath);
        const fileName = path.parse(filePath).name;
        console.log(
          `${fileName} - ${fileExt.slice(1)} - ${Math.ceil(
            fileStats.size / 1024,
          )}kb`,
        );
      }
    }
  } catch (err) {
    console.log(err);
  }
}

getFilesStats();
