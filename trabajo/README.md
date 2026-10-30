# Candidatura

Superficie local para trabajar una candidatura de design systems: ofertas, CV y seguimiento en la misma pantalla. El CV de Figma permanece visible.

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

## Los tres pasos

1. Ofertas. Lista, selección y alta.
2. CV. Puntuación del CV original frente a la oferta elegida, y notas de adaptación.
3. Seguimiento. Ficha editable de esa oferta.

En pantallas grandes el CV queda a la derecha. Por debajo de 1024 px el CV pasa debajo del paso activo, y los pasos quedan arriba.
