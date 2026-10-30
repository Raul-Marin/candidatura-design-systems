---
name: ds-cv-oferta
description: >-
  Puntúa un CV de Figma contra ofertas de design systems y, si se pide,
  reescribe ese CV para una oferta concreta sin cambiar empleadores, fechas ni
  cifras. Úsala al comparar un CV con ofertas, pedir un score o adaptar el CV
  de Figma a un puesto.
---

# CV contra una oferta

Lee antes `ds-ofertas` si aún no tienes la ficha (`get_job`). El CV se lee de Figma con `get_design_context` después de cargar la skill `figma-design-to-code`.

## Score

Denominador = lista `requirements` más cada línea de `aiRequirements` marcada required que no esté ya en esa lista.

Por línea, contra el texto del CV:

- 1: el CV nombra ese requisito.
- 0,5: nombra solo una parte de la línea.
- 0: no lo nombra.

Una línea de IA vale 0 hasta que el CV nombre esa habilidad. Un curso que no dice IA no la cubre. Cita la frase de la oferta, sin anteponer «Required».

Muestra el total `n/d` y cada línea con 1, 0,5 o 0. No reutilices un score de antes si el CV ya se reescribió: o recalculas o dices que es el score del texto anterior.

## Adaptar el CV

Solo cuando el usuario nombre la oferta. Mismos empleadores, fechas y cifras. Cambia las palabras para nombrar lo que esa oferta pide y el score dejó a 0 o 0,5.

Antes de `use_figma`, carga la skill `figma-use` y pasa `skillNames: figma-use`.

- El marco es fijo y recorta el desborde. Mantén una longitud parecida a la de origen.
- Las líneas de foco en una columna estrecha van en una sola línea, unas 26 caracteres.
- Texto de una instancia: `setProperties`. No edites el texto anidado.
- Nodos de texto sueltos: `loadFontAsync` de esa familia y peso antes de escribir.
- No borres la nota de perfil ficticio si el pie ya la trae.
- Captura el marco al terminar y comprueba que no se corta.

No presentes el score viejo como si fuera el del CV ya adaptado.
