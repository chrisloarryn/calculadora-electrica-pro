# Plan de implementación

## Resultado esperado

Una PWA móvil-first que permita calcular y documentar una instalación sencilla con varios circuitos, pueda utilizarse sin conexión y produzca resultados trazables bajo un perfil normativo explícito.

## Arquitectura recomendada

### Aplicación

- React + TypeScript.
- Vite y soporte PWA.
- Componentes accesibles y diseño responsive.
- Estado de proyecto separado del estado visual.
- IndexedDB para guardado local y autosave.
- Generación de PDF y SVG en el cliente durante el MVP.

### Paquetes internos

```text
src/
├── app/              navegación y composición
├── features/         proyectos, circuitos, cargas e informes
├── domain/           entidades y validaciones
├── calculation/      fórmulas y resolución de reglas
├── standards/        perfiles normativos versionados
├── reports/          PDF, tablas y diagrama unifilar
├── storage/          persistencia local y migraciones
└── ui/               componentes reutilizables
```

El motor de cálculo y los perfiles normativos deben poder probarse sin navegador.

### Backend

No es necesario para el primer MVP. Más adelante puede incorporarse para cuentas, sincronización, compartir proyectos, suscripciones y administración remota de catálogos. Mantener el MVP local-first reduce coste, riesgo de privacidad y dependencia de red en terreno.

## Fases

### Fase 0 — Especificación y validación técnica

Objetivo: acordar qué puede afirmar la aplicación.

- Confirmar Chile como primer mercado.
- Definir tipos de instalación incluidos.
- Traducir RIC N°03, 04, 05 y 10 a reglas y tablas versionadas.
- Definir catálogo de calibres, secciones y materiales.
- Reunir entre 15 y 25 casos de cálculo revisados por un profesional autorizado.
- Definir advertencias legales y límites del producto.

Criterio de salida: especificación firmada por producto y revisor técnico.

### Fase 1 — Motor de cálculo

Objetivo: producir resultados deterministas sin interfaz.

- Modelo de proyecto, circuito, carga y condiciones de instalación.
- Cálculos monofásicos y trifásicos.
- Demanda, simultaneidad, factor de potencia y rendimiento.
- Selección de conductor por capacidad corregida.
- Cálculo y restricción de caída de tensión.
- Selección de breaker y diferencial con advertencias.
- Registro de reglas aplicadas.
- Pruebas unitarias, propiedades y casos dorados.

Criterio de salida: todos los casos dorados aprobados y cobertura alta en reglas críticas.

### Fase 2 — Interfaz móvil-first

Objetivo: completar un proyecto sencillo en pocos minutos.

- Pantalla de proyectos recientes.
- Asistente para crear proyecto.
- Pestañas o selector de circuitos.
- Crear, duplicar, renombrar y eliminar circuitos.
- Tabla/tarjetas de cargas con cantidad y potencia.
- Modo básico y avanzado.
- Tarjeta de resultado en vivo.
- Explicación desplegable de cada cálculo.
- Estados válido, advertencia, incompleto y bloqueado.
- Guardado automático y deshacer.

Criterio de salida: el caso de cuatro circuitos del reel puede reproducirse en teléfono sin perder datos.

### Fase 3 — Informes

Objetivo: convertir el proyecto en un entregable.

- Portada y datos del proyecto.
- Resumen general.
- Tabla de circuitos y cargas.
- Supuestos y perfil normativo.
- Diagrama unifilar básico en SVG.
- Lista de materiales estimada.
- Advertencias y campos pendientes.
- Código/identificador de la instantánea de cálculo.

Criterio de salida: el PDF coincide con la pantalla, se imprime correctamente y reproduce la versión del cálculo.

### Fase 4 — Calidad y piloto

Objetivo: reducir riesgo antes de uso en terreno.

- Revisión técnica externa.
- Pruebas en distintos teléfonos y navegadores.
- Accesibilidad y navegación por teclado.
- Pruebas offline, recuperación y migraciones de datos.
- Pruebas de PDF con proyectos pequeños y grandes.
- Telemetría opcional y respetuosa de privacidad.
- Piloto controlado con instaladores.

Criterio de salida: cero errores críticos abiertos y aprobación del revisor técnico.

### Fase 5 — Publicación

- Sitio/PWA productivo.
- Documentación y política de privacidad.
- Canal de reporte de cálculos dudosos.
- Procedimiento para actualizar normas y tablas.
- Backups/exportación de proyectos.

## Priorización

### P0 — imprescindible

- Proyectos, múltiples circuitos y múltiples cargas.
- Motor independiente y probado.
- Perfil Chile versionado.
- Conductor, breaker, caída y diferencial.
- Explicaciones y advertencias.
- Persistencia local.
- PDF y diagrama unifilar básico.

### P1 — inmediatamente después

- Catálogo personalizable de artefactos.
- Duplicar circuitos y plantillas.
- Comparar alternativas.
- Importar/exportar proyecto en JSON.
- Instalación PWA y offline completo.

### P2 — expansión comercial

- Cuenta y sincronización.
- Compartir con clientes o equipo.
- Logo y datos comerciales en PDF.
- Catálogo de materiales y precios.
- Suscripciones y licencias.
- Perfiles normativos adicionales.

## Estimación inicial

Para una persona desarrolladora con apoyo periódico de un revisor eléctrico:

- Fase 0: 1 semana.
- Fase 1: 1 a 2 semanas.
- Fase 2: 1 a 2 semanas.
- Fase 3: 1 semana.
- Fase 4 y piloto: 1 a 2 semanas.

Total orientativo: 5 a 8 semanas para un MVP pilotable. La incertidumbre principal no es la interfaz; es convertir la normativa en reglas correctas y conseguir casos de validación confiables.

## Riesgos y mitigaciones

| Riesgo | Impacto | Mitigación |
|---|---|---|
| Recomendación técnicamente incorrecta | Seguridad y responsabilidad | Revisor autorizado, casos dorados, explicaciones y límites explícitos |
| Norma desactualizada | Resultado inválido | Perfiles versionados, fecha/fuente visible y proceso de actualización |
| Simplificación excesiva | Falsa confianza | Datos mínimos obligatorios y estado "incompleto" |
| Equivalencias AWG equivocadas | Conductor mal seleccionado | Catálogos separados y equivalencia solo informativa |
| PDF distinto de la pantalla | Pérdida de trazabilidad | Una misma instantánea alimenta UI y PDF |
| Pérdida de proyectos locales | Mala experiencia | Autosave, exportación JSON y migraciones probadas |
| Crecimiento prematuro del alcance | Retraso | Excluir módulos especiales del MVP |

## Primer backlog ejecutable

1. Crear ADR de alcance normativo Chile.
2. Definir esquemas TypeScript y validación de unidades.
3. Cargar calibres normalizados y tablas RIC N°04 con referencias.
4. Implementar corriente monofásica/trifásica.
5. Implementar capacidad corregida.
6. Implementar caída de tensión.
7. Resolver conductor + breaker como una sola restricción.
8. Implementar reglas iniciales de diferencial.
9. Crear casos dorados y suite automatizada.
10. Construir el flujo móvil de proyectos/circuitos/cargas.
11. Generar una instantánea de informe.
12. Renderizar PDF y diagrama unifilar.

## Definición de terminado del MVP

- Un proyecto de cuatro circuitos se crea, guarda, reabre y exporta sin pérdida.
- Todos los cálculos muestran fórmula, entradas, reglas y supuestos.
- No se recomienda una protección incompatible con la capacidad corregida del conductor.
- El límite de caída aplicable se comprueba y se explica.
- La versión normativa aparece en pantalla y PDF.
- Los casos dorados están aprobados por un revisor autorizado.
- La aplicación funciona offline después de la primera carga.
- El PDF incluye resumen, circuitos, cargas, resultados, diagrama y advertencias.

