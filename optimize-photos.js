import path from "node:path";
import fs from "node:fs";
import sharp from "sharp";


const TARGET = path.resolve(import.meta.dirname, './assets/Fotos/optimized');
const OUTPUT = path.resolve(import.meta.dirname, './assets/Fotos/ultra-optimized');


async function optimizeImages(opt = {}) {
    
    const {folder, output, recursive, ext = ['.webp', '.webp', '.webp']} = opt;

    const files = await fs.promises.readdir(folder);

    for (const file of files) {

        const filePath = path.resolve(folder, file);

        const isDirectory = (await fs.promises.stat(filePath)).isDirectory();

        if(isDirectory && recursive){

            await optimizeImages({...opt, folder: filePath, output: path.join(output, file)});
        }
        else {

            const extname = path.extname(filePath);
            const filename = path.basename(filePath, extname);
            const outfilepath = path.join(output, `${filename}.webp`);

            if(ext.includes(extname)){

                console.log('Process:', filePath);

                if(!fs.existsSync(output)){

                    await fs.promises.mkdir(output, {recursive: true});
                }
                
                await sharp(filePath, {})
                    .webp({quality: 50})
                    .toFile(outfilepath);

                console.log('Complete:', outfilepath);
            }
        }
    }
}


await optimizeImages({folder: TARGET, output: OUTPUT, recursive: true});