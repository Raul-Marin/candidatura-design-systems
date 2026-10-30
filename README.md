# Candidatura de design systems

Ejercicio de clase: un escritorio de tres pasos (Ofertas, CV, Seguimiento) y un agente de Cursor con tres skills. Los datos de ejemplo son de un perfil ficticio. El 4,5/8 es el score del CV original, no de un CV reescrito. No hay ninguna candidatura enviada.

## Sitio

https://raul-marin.github.io/candidatura-design-systems/

## Descargar

Clona el repo o descarga el zip desde GitHub:

```bash
git clone https://github.com/Raul-Marin/candidatura-design-systems.git
```

## Usar la web

Abre la URL de arriba, o en local:

```bash
cd trabajo
npm install
npm run dev
```

El desarrollo queda en http://127.0.0.1:4740/

1. Ofertas. Lista las ofertas de la mesa, marca la seleccionada y permite añadir otra. En Ofertas, Añadir copia una oferta del tablón precargado a la mesa. El salario vacío se muestra como «No publicado» y la modalidad vacía como «No indicada».
2. CV. Muestra el score del CV original contra la oferta elegida (Vanguard: 4,5/8) y el desglose por línea cuando existe. El panel de Figma enseña el CV.
3. Seguimiento. Ficha de esa oferta: estado, puesto, lugar, web, fechas, correos y diario. El estado empieza vacío. No pasa a «Enviada» solo.

En local los datos están en `trabajo/data/workspace.json`. La app los lee y escribe por `/api/workspace` mientras corre `npm run dev`. En GitHub Pages no hay ese API: se carga el mismo JSON y cada cambio se guarda en `localStorage` de ese navegador. La interfaz lo dice en el lateral.

## Agente y skills

Copia estas rutas al `.cursor/` de otro proyecto:

- `.cursor/agents/candidatura-design-systems.md`
- `.cursor/skills/ds-ofertas/`
- `.cursor/skills/ds-cv-oferta/`
- `.cursor/skills/ds-seguimiento-notion/`

En Cursor, elige el agente `candidatura-design-systems` o nómbralo en el chat. Si pides el proceso completo, las fases van en este orden:

1. Ofertas. Lista ofertas de design systems de los últimos 7 días con el MCP `user-ids-jobs`.
2. CV. Puntúa el CV de Figma contra las tres más recientes y se detiene. Reescribe el CV solo si nombras una oferta.
3. Seguimiento. Rellena una ficha nueva en Notion solo si lo pides para esa oferta.

No salta a reescribir el archivo de Figma ni a escribir en Notion si no lo has pedido.

Hace falta el MCP de Into Design Systems (`user-ids-jobs`). Para el CV, las skills `figma-use` y `figma-design-to-code` del plugin de Figma (no se copian con este paquete). Para Notion, si la integración no ve la página, el agente rellena la ficha en el navegador ya abierto.

## Qué no hacer

- No editar la fila de Notion cuyo título contiene «plantilla».
- No marcar una candidatura como enviada.
- No inventar salario, modalidad, años ni tipo de empresa. Si la oferta no lo dice, el campo se queda vacío.
