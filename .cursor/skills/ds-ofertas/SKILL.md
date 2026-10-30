---
name: ds-ofertas
description: >-
  Lista ofertas abiertas de design systems del job board de Into Design
  Systems. Úsala cuando pidan ofertas, vacantes o puestos de design systems,
  de la última semana o de un rango de fechas.
---

# Ofertas de design systems

Fuente única: MCP `user-ids-jobs`. Cada frase sobre un puesto sale de una línea que devolvió la herramienta. Si no está, di que la oferta no lo indica y para.

## Herramientas

1. `search_jobs` con `postedAfter` inclusivo `YYYY-MM-DD`. «Última semana» = hoy menos 7 días.
2. `get_job` con el slug antes de citar requisitos, salario o modalidad de una ficha.

## Reglas de la ficha

- Cita el requisito con las palabras de la oferta.
- El salario se copia tal cual. Sin redondeo, sin pasarlo de otro país, nivel o moneda. Si no hay campo, «No publicado».
- `workType` solo si la oferta lo dice. Si `search_jobs` y `get_job` discrepan, manda `get_job`. Si no consta, «No indicada». No llames onsite a un puesto sin `workType`.
- «No pide IA» solo si hay texto de la oferta y `aiSkills` es false. Una línea de IA es un requisito como cualquier otro.
- `listingExpires` es el vencimiento del tablón (60 días), no un plazo del empleador.
- Nada de la empresa fuera de lo que dice su oferta.

## Salida

Tabla: fecha, puesto, empresa, lugar, modalidad, pide IA, salario. Responde en español. Enlaza la ficha `https://jobs.intodesignsystems.com/jobs/<slug>` y la URL de apply si la herramienta la devolvió.
