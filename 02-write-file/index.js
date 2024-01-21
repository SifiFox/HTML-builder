const fs = require('fs');
const path = require('path');
const process = require('process');

const { stdin, stdout } = process;
const filePath = path.join(__dirname, 'write.txt');
const output = fs.createWriteStream(filePath);

stdout.write('Enter your message: ');
stdin.on('data', (e) => {
  if (e.includes('exit')) bye();
  process.on('SIGINT', () => {bye()});
  output.write(e);
});

function bye() {
  console.log('good bye');
  process.exit();
}
