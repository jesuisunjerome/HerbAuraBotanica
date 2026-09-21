const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const dirPath = path.join(__dirname, 'public', 'images');

async function processDirectory(directory) {
  const files = fs.readdirSync(directory);

  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      await processDirectory(fullPath);
    } else {
      const ext = path.extname(fullPath).toLowerCase();
      if (ext === '.png' || ext === '.jpg' || ext === '.jpeg') {
        const nameWithoutExt = path.basename(fullPath, ext);
        const webpPath = path.join(directory, `${nameWithoutExt}.webp`);

        console.log(`Converting ${fullPath} to WebP...`);
        try {
          await sharp(fullPath)
            .webp({ quality: 80 })
            .toFile(webpPath);
          console.log(`✅ Converted and saved: ${webpPath}`);
          
          // Borrar el original
          fs.unlinkSync(fullPath);
          console.log(`🗑️ Deleted original: ${fullPath}`);
        } catch (err) {
          console.error(`❌ Error converting ${fullPath}:`, err);
        }
      }
    }
  }
}

processDirectory(dirPath)
  .then(() => console.log('🎉 Todas las imágenes han sido optimizadas a WebP!'))
  .catch(err => console.error(err));
