const path = require('path');
const fsPromises = require('fs/promises');

async function copyDirectory() {
  const sourceDir = path.join(__dirname, 'files');
  const targetDir = path.join(__dirname, 'files-copy');
  await fsPromises.mkdir(targetDir, {
    recursive: true,
  });

  const targetFiles = await fsPromises.readdir(targetDir);
  for (let file of targetFiles) {
    await fsPromises.rm(path.join(targetDir, file));
  }

  const sourceFiles = await fsPromises.readdir(sourceDir);
  for (let file of sourceFiles) {
    await fsPromises.copyFile(
      path.join(sourceDir, file),
      path.join(targetDir, file),
    );
  }
}

copyDirectory();
