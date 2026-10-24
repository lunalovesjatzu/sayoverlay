# Directo de Sayler

- `index.html` – panel con pestañas (Overlays, Bebé pelón, Ruleta, Enlaces y respaldo) y dock desplegable del bebé.
- `overlay.html`, `bebe.html`, `ruleta.html` – cada página funciona sola y tiene su enlace.
- `shared.js` – temporizadores en segundo plano, modo transparente y respaldo.
- `config/respaldo.json` – (opcional) tu configuración exportada desde la pestaña «Enlaces y respaldo».

## GitHub Pages
1. Sube todos los archivos a un repo (manteniendo la carpeta `config/`).
2. Settings → Pages → Deploy from branch → `main` / root.
3. Abre `https://TU-USUARIO.github.io/TU-REPO/` y copia los enlaces de la pestaña «Enlaces y respaldo».

## Enlaces transparentes
`bebe.html#live`, `ruleta.html#live` y los enlaces de cada overlay (`overlay.html#o=metas`, `#o=barra`, `#o=cont`, `#o=time`, `#o=ev`) no llevan fondo verde.
`#directo` es la ventana espejo para captura de ventana (con chroma).

## Tu configuración
Se guarda en el navegador con las mismas claves de antes. Para llevarla a GitHub/OBS/otra PC: Exportar respaldo → súbelo como `config/respaldo.json`.
Si el repo es público, ese archivo (códigos de Ko-fi/ntfy, imágenes) lo puede ver cualquiera.
