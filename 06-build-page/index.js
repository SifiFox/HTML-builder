const path = require('path');
const fs = require('fs');
const fsPromises = require('fs/promises');
const bundle = 'project-dist';
async function build() {
    const bundlePath = path.join(__dirname, bundle);
    const assets = path.join(__dirname, "assets");
    const styles = path.join(__dirname, "styles")
    await createFolder(bundlePath);
    await compareStyles(styles, bundlePath)
    await compareAssets(assets, bundlePath)
    await compareMarkup(bundlePath)
}
async function createFolder(folder){
    try{
        await fsPromises.mkdir(folder, {recursive: true})
    }catch (err){
        console.log(err);
    }
}
async function compareStyles(folder, bundle){
    const targetStylesPath = path.join(bundle, "style.css");
    const files = await fsPromises.readdir(folder, {
        encoding: 'utf-8',
        withFileTypes: true,
    });
    const stylesWriteStream = fs.createWriteStream(targetStylesPath, 'utf-8');
    for (let file of files) {
        const filePath = path.join(file.path, file.name);
        const fileExt = path.extname(filePath);
        if (file.isFile() && fileExt === '.css') {
            const readStream = fs.createReadStream(filePath, 'utf-8');
            readStream.on('data', (data) => {
                stylesWriteStream.write(data);
            });
        }
    }
}
async function compareMarkup(bundle){
    const templatePath = path.join(__dirname, 'template.html');
    const componentsPath = path.join(__dirname, 'components');
    const targetMarkupPath = path.join(bundle, 'index.html');
    const templateContent = await fsPromises.readFile(templatePath);
    await fsPromises.writeFile(targetMarkupPath, templateContent);
    const components = await fsPromises.readdir(componentsPath,{
        encoding: 'utf-8',
        withFileTypes: true,
    });

    let targetMarkupContent = await fsPromises.readFile(targetMarkupPath);
    for (let component of components){
        const componentPath = path.join(componentsPath, component.name)
        const componentName = component.name.split('.').slice(0, -1).join('.')
        const componentExt = path.extname(componentPath);
        if (component.isFile() && componentExt === '.html') {
            const componentContent = await fsPromises.readFile(componentPath);
            targetMarkupContent =  targetMarkupContent.toString().replace(`{{${componentName}}}`, componentContent.toString());
        }
    }
    await fsPromises.writeFile(targetMarkupPath, targetMarkupContent);
}
async function compareAssets(folder, bundle){
    const assetsBundlePath = path.join(bundle, 'assets');
    try{
        await fsPromises.mkdir(assetsBundlePath, {
            recursive: true,
        });
        await cloneData(folder, bundle, assetsBundlePath);
    }catch (err){
        console.log(err);
    }
}
async function cloneData(folder, bundle, assetsBundlePath){
    const sourceFiles = await fsPromises.readdir(folder);
    for (let file of sourceFiles) {
        const filePath = path.join(folder, file)
        if((await fsPromises.lstat(filePath)).isDirectory()){
            const folderPath = path.join(bundle, "assets", file)
            await fsPromises.mkdir(folderPath, {recursive: true})
            await cloneData(filePath, bundle, assetsBundlePath);
        }else{
            const attachments = folder.split('\\');
            const dirName = attachments[attachments.length - 1]
            await fsPromises.copyFile(
                filePath,
                path.join(assetsBundlePath, dirName, file),
            )
        }
    }
}
build();