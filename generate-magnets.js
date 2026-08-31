const fs = require('fs');
const path = require('path');

// Nota: Este script se usa para generar magnets desde archivos .torrent
// Requiere: npm install parse-torrent

// Ejemplo de uso (después de tener parse-torrent instalado):
// node generate-magnets.js

// Para uso manual, aquí van los magnets generados:
const torrents = [
  // Ejemplo:
  // {
  //   "id": 1,
  //   "title": "Thor (2011)",
  //   "type": "movie",
  //   "year": "2011",
  //   "quality": "1080p",
  //   "poster": "https://image.tmdb.org/t/p/w500/prSZX8JxjGkucJj0KIg241ipE1t.jpg",
  //   "description": "Un príncipe arrogante es desterrado a la Tierra.",
  //   "torrentFile": "https://raw.githubusercontent.com/usuario/mcu-torrents/main/torrents/thor.torrent",
  //   "magnet": "magnet:?xt=urn:btih:..."
  // }
];

// Guardar en data/torrents.json
const outputPath = path.join(__dirname, 'data', 'torrents.json');
fs.writeFileSync(outputPath, JSON.stringify(torrents, null, 2));
console.log('✓ Archivo data/torrents.json actualizado');

// ===== ALTERNATIVA: Si tienes archivos .torrent =====
// Descomenta esto y ejecuta: npm install parse-torrent
/*
const parseTorrent = require('parse-torrent');

const torrentsDir = path.join(__dirname, 'torrents');
const output = [];

if (fs.existsSync(torrentsDir)) {
  fs.readdirSync(torrentsDir).forEach(file => {
    if (file.endsWith('.torrent')) {
      try {
        const torrentPath = path.join(torrentsDir, file);
        const buf = fs.readFileSync(torrentPath);
        const torrent = parseTorrent(buf);
        
        const magnetLink = parseTorrent.toMagnetURI(torrent);
        
        output.push({
          id: output.length + 1,
          title: torrent.name,
          type: 'movie',
          year: new Date().getFullYear().toString(),
          quality: '1080p',
          poster: '',
          description: torrent.name,
          torrentFile: `https://raw.githubusercontent.com/usuario/mcu-torrents/main/torrents/${file}`,
          magnet: magnetLink
        });
        
        console.log(`✓ ${file} -> ${magnetLink.substring(0, 50)}...`);
      } catch (err) {
        console.error(`✗ Error con ${file}:`, err.message);
      }
    }
  });
  
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
  console.log(`\n✓ ${output.length} torrents procesados y guardados`);
}
*/
