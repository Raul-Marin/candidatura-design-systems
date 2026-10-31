# Candidatura de design systems

Ejercicio de clase: un escritorio de candidaturas (Resumen, CV y Seguimiento por oferta) y un agente de Cursor con tres skills. Los datos de ejemplo son de un perfil ficticio. El 4,5/8 es el score del CV original, no de un CV reescrito. No hay ninguna candidatura enviada.

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

- Mis candidaturas. A la izquierda, las ofertas que tienes en la mesa. Al elegir una se abre su ficha.
- Buscar ofertas. En la barra superior. Abre el tablón con las ofertas de la semana y añade una a la mesa. El salario vacío se muestra como «No publicado» y la modalidad vacía como «No indicada».
- La ficha tiene tres pestañas:
  1. Resumen. Datos de la oferta y estado.
  2. CV. Score del CV original contra la oferta (Vanguard: 4,5/8), desglose por línea cuando existe y el CV de Figma de esa oferta.
  3. Seguimiento. Estado, puesto, lugar, web, fechas, correos y diario. El estado empieza vacío. No pasa a «Enviada» solo.

Cada oferta tiene su propio CV de Figma (`cvFigmaUrl`). Los datos de ejemplo traen cuatro: KnowledgeCity, Amplify, Betclic y Vanguard.

En local los datos están en `trabajo/data/workspace.json`. La app los lee y escribe por `/api/workspace` mientras corre `npm run dev`. En GitHub Pages no hay ese API: se carga el mismo JSON y cada cambio se guarda en `localStorage` de ese navegador. La interfaz lo dice en la barra superior.

## Agente y skills

### Descargar el agente y las skills

Zip con el agente, las tres skills y un `LEEME.md`. Descomprímelo en la raíz de tu proyecto en Cursor y queda la carpeta `.cursor/` lista.

- [candidatura-agente-skills.zip](https://github.com/Raul-Marin/candidatura-design-systems/raw/main/descargas/candidatura-agente-skills.zip)
- También desde el sitio: https://raul-marin.github.io/candidatura-design-systems/candidatura-agente-skills.zip

```bash
unzip candidatura-agente-skills.zip -d /ruta/a/tu-proyecto
```

### Copiar a mano

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
