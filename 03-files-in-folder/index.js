const { readdirSync, statSync } = require('fs');
const path = require('path');

function getFilesStats() {
  try {
    const files = readdirSync(path.join(__dirname, 'secret-folder'), {
      withFileTypes: true,
    });

    for (const file of files) {
      if (file.isFile()) {
        const filePath = path.join(__dirname, `secret-folder/${file.name}`);
        const fileStats = statSync(filePath);
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
