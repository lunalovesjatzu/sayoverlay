# Directo de Sayler

- `index.html` – panel con pestañas (Overlays, Bebé pelón, Ruleta, Enlaces y respaldo) y dock desplegable del bebé.
- `overlay.html`, `bebe.html`, `ruleta.html` – cada página funciona sola y tiene su enlace.
- `shared.js` – temporizadores en segundo plano, modo transparente y respaldo.
- `config/respaldo.json` – (opcional) tu configuración exportada desde la pestaña «Enlaces y respaldo».

## GitHub Pages
1. Sube todos los archivos a un repo (manteniendo la carpeta `config/`).
2. Settings → Pages → Deploy from branch → `main` / root.
3. Abre `https://TU-USUARIO.github.io/TU-REPO/` y copia los enlaces de la pestaña «Enlaces y respaldo».

## Enlace fijo (novedad)
En «Overlays», bajo el botón de copiar, está la casilla **🔗 Enlace fijo**. Con ella:
- El enlace queda corto: `overlay.html#o=metas&s=sayler-xxxxxxxx`. Lo copias **una sola vez** en OBS / TikTok LIVE Studio.
- Cuando cambias algo en el panel (diseño, metas, tiempos, progreso a mano…), el enlace se actualiza solo, sin volver a copiarlo. Hay que tener el panel abierto mientras haces el cambio.
- La configuración pasa unas horas por ntfy.sh (el mismo servicio que usas para Ko-fi). Quien tenga el enlace podría verla. Al abrir el panel se vuelve a publicar, así que el enlace sigue funcionando días después.
- El enlace guarda su última copia en el propio OBS/TikTok: si no hay internet, muestra lo último que recibió.
- Si desmarcas la casilla, el enlace vuelve a llevar toda la configuración dentro (y hay que copiarlo de nuevo cada vez).

## Metas
- Cada meta tiene **✋ A mano**: progreso que ya llevaba (con botones −100, +10, +100, +1000 y 0). Cuenta como conseguido y las monedas nuevas llenan lo que falte. Se guarda con tu configuración.
- La vista previa muestra el progreso REAL de tu directo (también si el overlay corre en OBS o TikTok, con el enlace fijo; tarda unos segundos en reflejar cambios). Debajo de cada meta aparece «En el directo lleva X / Y».
- La vista previa tiene ◀ ▶ para cambiar de página, «Que cambien solas» y un deslizador «Probar cuánto se llenan».

## Que no se borre nada
- El progreso se guarda en cada evento y al cerrar la ventana.
- Solo se reinicia con el botón ♻ (ahora pide confirmación). Un enlace viejo ya no reinicia el progreso.
- `config/respaldo.json` solo se importa en navegadores donde no has editado nada; nunca pisa tus cambios en silencio.

## Enlaces transparentes
`bebe.html#live`, `ruleta.html#live` y los enlaces de cada overlay (`overlay.html#o=metas`, `#o=barra`, `#o=cont`, `#o=time`, `#o=ev`) no llevan fondo verde.
`#directo` es la ventana espejo para captura de ventana (con chroma).

## Tu configuración
Se guarda en el navegador con las mismas claves de antes. Para llevarla a GitHub/OBS/otra PC: Exportar respaldo → súbelo como `config/respaldo.json`.
Si el repo es público, ese archivo (códigos de Ko-fi/ntfy, imágenes) lo puede ver cualquiera.
