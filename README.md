# MCU Torrents

Página web moderna para gestionar y descargar torrents de películas y series del Universo Cinematográfico de Marvel.

## Características

✨ **Diseño Glassmorphic** - Interfaz moderna con efectos de vidrio  
🌓 **Tema Claro/Oscuro** - Toggle persistente de temas  
🧲 **Links Magnet** - Descarga directa con magnet links  
⬇️ **Descarga de Torrents** - Descargar archivos .magnet  
🔐 **Admin Panel Protegido** - Contraseña para proteger el panel
💾 **Sincronización con Repo** - Carga torrents desde data/torrents.json  
🔍 **Búsqueda Avanzada** - Filtros por tipo, búsqueda por texto  

## Estructura

```
mcu-torrents/
├── index.html              # Estructura HTML
├── styles.css              # Glassmorphism + temas
├── app.js                  # Lógica principal
├── manifest.json           # Metadata PWA
├── generate-magnets.js     # Script para generar magnets
├── data/
│   └── torrents.json       # Base de datos de torrents
├── torrents/               # Archivos .torrent (opcional)
│   ├── thor.torrent
│   └── ...
└── README.md               # Este archivo
```

## Uso

### Admin Panel

1. Haz click en el botón **⚙️ Admin**
2. Ingresa contraseña: `admin123`
3. Completa el formulario con los datos del torrent
4. Haz click en **Agregar Torrent**

**Los torrents se guardan en localStorage localmente** para testing.

### Descargar

- **Botón Magnet (🧲)**: Abre el cliente torrent predeterminado
- **Botón Descargar (⬇)**: Descarga el archivo .magnet

### Búsqueda y Filtros

- **Filtros**: Todos, Películas, Series, Especiales
- **Búsqueda**: Busca por título o descripción en tiempo real

## Integración con GitHub

### Paso 1: Estructura de datos

Edita `data/torrents.json` manualmente o con el script:

```json
[
  {
    "id": 1,
    "title": "Thor (2011)",
    "type": "movie",
    "year": "2011",
    "quality": "1080p",
    "poster": "https://image.tmdb.org/t/p/w500/poster.jpg",
    "description": "Un príncipe arrogante es desterrado a la Tierra.",
    "torrentFile": "https://raw.githubusercontent.com/usuario/mcu-torrents/main/torrents/thor.torrent",
    "magnet": "magnet:?xt=urn:btih:abc123..."
  }
]
```

### Paso 2: Generar Magnets (opcional)

Si tienes archivos .torrent, automatiza la conversión:

```bash
npm install parse-torrent
node generate-magnets.js
```

Esto genera automáticamente los magnet links en `data/torrents.json`.

### Paso 3: Subir a GitHub

```bash
git add .
git commit -m "Agregar torrents"
git push origin main
```

La app cargará automáticamente desde `data/torrents.json`.

## Almacenamiento

- **GitHub**: Los torrents se cargan desde `data/torrents.json`
- **Local (dev)**: Se usan también en localStorage para testing
- **Fallback**: Si `data/torrents.json` no existe, usa localStorage

## Tema Claro/Oscuro

El tema se guarda en `localStorage` como `mcu-torrents-theme` y persiste entre sesiones.

## Seguridad

- **Admin Password**: `admin123` (personalizable en `app.js`)
- **Sesión**: Usa `sessionStorage`, se borra al cerrar la pestaña
- **Logout**: Botón 🚪 disponible cuando estés logueado

## Personalización

### Cambiar contraseña admin

En `app.js`, línea:
```javascript
const ADMIN_PASSWORD = 'tu-nueva-contraseña';
```

### Cambiar color principal (rojo)

En `styles.css`:
```css
--red: #ff3232;  /* Cambiar aquí */
```

### URL del repositorio de torrents

En `app.js`, función `loadTorrents()`:
```javascript
const response = await fetch('data/torrents.json');
// O remoto:
// const response = await fetch('https://raw.githubusercontent.com/usuario/mcu-torrents/main/data/torrents.json');
```

## Deployment en GitHub Pages

1. Crear repositorio `mcu-torrents` en GitHub
2. Subir los archivos a la rama `main`
3. Settings → Pages → Branch: main
4. La URL será: `https://tu-usuario.github.io/mcu-torrents/`

## ⚠️ Disclaimer Legal

Este proyecto es solo una herramienta para organizar torrents. El usuario es responsable del contenido que descarga y debe respetar las leyes de copyright de su jurisdicción.

MCU Torrents es un proyecto independiente y no está afiliado con Marvel, Disney o cualquier otra entidad relacionada.

## License

MIT - Proyecto fan-made
