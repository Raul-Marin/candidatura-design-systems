# Agente y skills: candidatura de design systems

Un agente de Cursor y tres skills para buscar ofertas de design systems, puntuar un CV de Figma contra ellas y llevar el seguimiento en Notion.

## Instalar

Descomprime el zip en la raíz de tu proyecto abierto en Cursor. Quedan:

- `.cursor/agents/candidatura-design-systems.md`
- `.cursor/skills/ds-ofertas/SKILL.md`
- `.cursor/skills/ds-cv-oferta/SKILL.md`
- `.cursor/skills/ds-seguimiento-notion/SKILL.md`

Si ya tienes una carpeta `.cursor/`, los archivos se añaden a la que hay.

## Dependencias

- MCP `user-ids-jobs` de Into Design Systems, para las ofertas.
- MCP de Figma y las skills `figma-use` y `figma-design-to-code`, que vienen con el plugin de Figma (no van en este zip).
- Sesión de Notion abierta en el navegador, para la ficha de seguimiento.

## Usar

En el chat, elige el agente `candidatura-design-systems` o nómbralo. Ejemplos:

1. Ofertas: «Lista las ofertas de design systems de la última semana».
2. CV: «Puntúa mi CV de Figma <URL> contra las tres más recientes». Para reescribirlo: «Adapta el CV a la oferta de <empresa>».
3. Seguimiento: «Rellena la ficha de <empresa> en mi plantilla de Notion <URL>».

Si pides el proceso completo, va por fases y se detiene tras el score.

## Límites

- No inventa salario, modalidad, años ni tipo de empresa. Si la oferta no lo dice, queda vacío.
- No marca ninguna candidatura como enviada.
- No edita la fila plantilla de Notion.
- No reescribe el CV ni escribe en Notion si no lo pides.
