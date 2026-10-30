---
name: ds-seguimiento-notion
description: >-
  Rellena una ficha nueva en la plantilla de seguimiento laboral de Notion
  para una oferta ya elegida. Úsala al pedir tracking, plantilla de Notion,
  ficha de empresa o registrar una candidatura.
---

# Seguimiento en Notion

Una fila nueva por oferta. La fila cuyo título contiene «plantilla» no se edita.

## Acceso

Prueba `notion-fetch` de la URL. Si responde `object_not_found`, la integración no ve la página: rellena en el navegador ya logueado. No des por hecho que el MCP puede escribir.

## Qué se rellena

Solo datos que devolvió `get_job` o que el usuario escribió. Si la oferta no lo dice, el campo se queda vacío.

| Campo | Origen |
|---|---|
| Empresa | Nombre de la empresa en la oferta. Confírmalo en la fila de la base, no solo en el panel. |
| Puesto | Título de la oferta. Es un select: escribe, pulsa «Crear…» y comprueba el chip. El primer snapshot tras el clic suele seguir en «Vacío». |
| Lugar | Solo si la oferta lo dice, con su modalidad. También es select. Notion quita las comas al crear la opción. |
| Web | URL de apply. |
| Primera actividad | Fecha de publicación de la oferta, o el día en que empieza el seguimiento. |
| Diario | Una línea: fecha de la oferta, si el CV se adaptó, y que no se ha enviado email. |

Déjalos vacíos si no constan: tipo de empresa, e-mails, primer e-mail, followup, última actividad si no hay un segundo hecho.

No pongas el estado «No buscan activamente»: eso es el valor de la plantilla. No marques la candidatura como enviada. No abras opciones de estado si ninguna dice preparación o sin enviar.

## Cierre

Comprueba en la tabla: nombre de empresa, puesto, lugar, web y fecha. Di la URL de la ficha y la lista de campos que quedaron vacíos porque la oferta no los publica.
