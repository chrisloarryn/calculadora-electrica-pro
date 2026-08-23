# Calculadora Eléctrica Pro

Aplicación web mobile-first, instalable como PWA y funcional sin conexión, para dimensionar circuitos eléctricos, protecciones y conductores, comprobar la caída de tensión y generar documentación profesional.

Estado: definición de producto y arquitectura. Todavía no debe usarse para ejecutar ni certificar instalaciones reales.

## Objetivo

Reducir el tiempo necesario para pasar de una lista de cargas a una propuesta técnica trazable:

1. Crear un proyecto y sus circuitos.
2. Registrar cargas, cantidades y condiciones de instalación.
3. Calcular corriente de diseño, breaker, conductor, caída de tensión y diferencial.
4. Explicar supuestos, advertencias y la norma aplicada.
5. Exportar un PDF con resumen, tabla de circuitos, diagrama unifilar y lista de materiales.

## MVP propuesto

- Proyectos con múltiples circuitos y cargas.
- Sistemas monofásicos y trifásicos.
- Perfil normativo inicial para Chile, versionado y basado en los Pliegos Técnicos RIC de la SEC.
- Dimensionamiento por capacidad de corriente y caída de tensión.
- Recomendación asistida de protección termomagnética y diferencial.
- Resultados explicables, con validaciones y advertencias.
- Guardado local y funcionamiento PWA/offline.
- Informe PDF y diagrama unifilar básico.
- Pruebas automatizadas con casos de referencia revisados por un profesional autorizado.

## Documentación

- [Software Design Document (SDD)](docs/SDD.md)
- [Despliegue en GCP y Cloud Run](docs/GCP_CLOUD_RUN.md)
- [Análisis de las referencias](docs/ANALISIS_REFERENCIA.md)
- [Ruta de implementación](docs/PLAN_IMPLEMENTACION.md)
- [Especificación inicial del motor de cálculo](docs/MOTOR_DE_CALCULO.md)

## Principios

- La seguridad y la normativa prevalecen sobre la rapidez.
- Cada resultado debe poder explicarse y reproducirse.
- Las reglas normativas no se mezclarán con componentes de interfaz.
- Una recomendación no sustituye la revisión, medición ni firma de un instalador autorizado.
- Las equivalencias entre mm² y AWG se tratarán como referencias, no como sustituciones exactas.

## Referencias del producto

- [Calculadora Eléctrica Pro — demo](https://demo-calculadora-pro.lovable.app/)
- [Reel con el flujo de cuatro circuitos y PDF](https://www.facebook.com/share/v/18sUD7rJ4W/?mibextid=wwXIfr)
- [Pliegos Técnicos RIC — SEC Chile](https://www.sec.cl/reglamento-de-seguridad-de-las-instalaciones-de-consumo-de-energia-electrica-decreto-08/)

## Próxima decisión

Antes de programar el motor se debe confirmar el mercado normativo inicial. El plan asume Chile como primer perfil; la arquitectura permitirá incorporar otros países sin alterar el núcleo de la aplicación.
