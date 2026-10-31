# Candidatura

Superficie local para trabajar una candidatura de design systems: tus candidaturas a la izquierda y la ficha de cada una con Resumen, CV y Seguimiento.

## Cómo arrancar

Desde esta carpeta:

```bash
npm install
npm run dev
```

Abre http://127.0.0.1:4740/

El servidor de desarrollo incluye la API que lee y escribe el JSON. Hace falta tener `npm run dev` en marcha para que los cambios se guarden.

## Dónde viven los datos

`data/workspace.json`

- GET `/api/workspace` devuelve el archivo
- PUT `/api/workspace` escribe el objeto completo

La interfaz carga el archivo al abrir y guarda cada edición unos 400 ms después.

En el build de GitHub Pages no existe `/api/workspace`. Ahí se usa el mismo JSON como archivo estático y los cambios quedan en `localStorage` de ese navegador.

## Estructura

- Mis candidaturas. Lista lateral de las ofertas en la mesa. Por debajo de 1024 px pasa a un selector arriba.
- Ficha de la candidatura, con tres pestañas:
  1. Resumen. Datos de la oferta y estado.
  2. CV. Puntuación del CV original frente a la oferta y el CV de Figma de esa oferta.
  3. Seguimiento. Ficha editable: estado, fechas, correos y diario.
- Buscar ofertas. Botón de la barra superior que abre el tablón y añade una oferta a la mesa.

Cada oferta guarda su propio CV de Figma en `cvFigmaUrl`. Si no lo tiene, se usa el `figmaUrl` general del CV.
