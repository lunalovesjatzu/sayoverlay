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
- Cuando cambias algo en el panel (diseño, metas, tiempos, progreso…), el enlace se actualiza solo, sin volver a copiarlo. Hay que tener el panel abierto mientras haces el cambio.
- La configuración pasa unas horas por ntfy.sh (el mismo servicio que usas para Ko-fi). Quien tenga el enlace podría verla. Al abrir el panel se vuelve a publicar, así que el enlace sigue funcionando días después.
- El enlace guarda su última copia en el propio OBS/TikTok: si no hay internet, muestra lo último que recibió.
- Si desmarcas la casilla, el enlace vuelve a llevar toda la configuración dentro (y hay que copiarlo de nuevo cada vez).

## Enlace fijo del bebé y de la ruleta (novedad)
En la pestaña **Bebé** (zona del directo) y en la pestaña **Ruleta** (debajo de «Abrir en otra ventana») está la casilla **🔗 Enlace fijo**, igual que en los overlays.
- Copias el enlace **una sola vez** en OBS / TikTok LIVE Studio: `bebe.html#live&s=CODIGO` o `ruleta.html#live&s=CODIGO` (también salen en «Enlaces y respaldo»).
- Lo que cambies en el panel (textos, imágenes, regalos, sonidos, contadores…) le llega solo y se aplica sin recargar. Hay que tener el panel abierto mientras cambias.
- Las imágenes grandes viajan aparte y **una sola vez** cada una; el enlace las guarda en su navegador. Si una imagen pesa mucho (más de unos 220 KB) no viaja: el panel te avisa.
- No viaja el progreso de la ruleta (el enlace lleva el suyo) ni la biblioteca de audios guardados como archivo (viven en IndexedDB de cada navegador; los sonidos por enlace sí).
- El enlace siempre se conecta a TikFinity por su cuenta (en el panel puedes dejarlo apagado para que no cuente doble).
- El enlace guarda su última copia en el propio OBS/TikTok: si no hay internet, muestra lo último que recibió.
- La configuración pasa unas horas por ntfy.sh y quien tenga el enlace podría verla. Si desmarcas la casilla, el enlace vuelve a usar `config/respaldo.json`.

## Metas
- Cada meta tiene **su propia barra interactiva** con un contador al lado: arrástrala o escribe el número y la meta queda en ese progreso (se ve al instante en la vista previa y le llega a tu enlace de OBS/TikTok). **0** la deja vacía, **✓** la completa y **↺ Auto** quita el ajuste y vuelve a contar solo lo que llega de tu directo.
- Debajo de cada barra dice si hay ajuste manual y, si tu enlace está corriendo, «En tu directo (OBS/TikTok) lleva X / Y».
- Se quitó el sistema anterior «✋ A mano» (botones −100, +10, +100, +1000) y el deslizador «Probar cuánto se llenan»: las barras por meta hacen ambas cosas.

## Vista previa = tu enlace
- La zona del directo ahora es **el mismo overlay que el enlace** (misma página, mismas conexiones a TikFinity, mismos tiempos). Cada overlay tiene su propia vista previa que sigue corriendo aunque estés en otra pestaña.
- Casilla «👁 Que la vista previa se oculte…» (encendida = igual que el directo; apágala para editar con calma) y «🔊 Sonido en la vista previa».
- Los cambios llegan a la vista previa al instante y al enlace en 1–2 segundos (con «Enlace fijo»).

## Probar
- Botones rápidos bajo la vista previa (regalo, likes, seguidor, sub, donación, lluvia) y la pestaña 🧪 Probar. Llegan a la vista previa, a las ventanas abiertas **y a tu enlace de OBS/TikTok** (con «Enlace fijo» activado; viajan por ntfy.sh en el canal `CODIGO-cmd`).

## Temporizador
- **Siempre arranca en pausa** al abrir la página o la fuente de OBS/TikTok; se reanuda con ▶ Reanudar (también remoto, desde el panel).
- Control del tiempo: lectura en vivo, pausar/reanudar, sumar/restar rápido (±10 s … ±10 min), cantidad a mano con unidad (s/min/h), «Fijar» un tiempo exacto y reiniciar (queda en pausa).

## Ruleta
- «Cuando la ruleta está oculta»: el texto/contador se puede poner en 9 posiciones (arriba, abajo, derecha, abajo a la derecha, etc.).

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
