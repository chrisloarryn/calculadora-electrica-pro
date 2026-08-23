# Especificación inicial del motor de cálculo

## Propósito

El motor será un paquete TypeScript independiente de React, PDF y almacenamiento. Recibirá datos normalizados, aplicará un perfil normativo versionado y devolverá resultados, explicaciones y advertencias deterministas.

No se codificarán reglas normativas dentro de componentes de interfaz.

## Modelo conceptual

```text
Proyecto
├── Perfil de instalación y norma
├── Circuitos
│   ├── Configuración eléctrica
│   ├── Condiciones de instalación
│   ├── Cargas
│   └── Resultado calculado
└── Instantáneas de informes
```

## Entradas mínimas por proyecto

- País y versión del perfil normativo.
- Tipo de suministro.
- Tensión nominal.
- Frecuencia cuando corresponda.
- Límites globales de caída de tensión.

## Entradas mínimas por circuito

- Nombre y uso del circuito.
- Número de fases.
- Tensión aplicable.
- Longitud.
- Factor de demanda o regla que lo determina.
- Régimen de la carga.
- Material, aislación y método de instalación del conductor.
- Temperatura y agrupamiento.
- Cargas con potencia, cantidad, factor de potencia y rendimiento cuando apliquen.

La interfaz ofrecerá valores por defecto visibles. Si un valor por defecto puede comprometer la validez del cálculo, el resultado quedará en estado de advertencia.

## Cálculos base

Las siguientes fórmulas son el punto de partida, no la totalidad del dimensionamiento:

### Corriente monofásica

```text
I = P / (V × FP × η)
```

### Corriente trifásica balanceada

```text
I = P / (√3 × VLL × FP × η)
```

### Corriente continua

```text
I = P / (V × η)
```

La corriente de diseño se obtiene aplicando las reglas de demanda, simultaneidad y régimen continuo del perfil normativo. No se asumirá que un multiplicador genérico sirve para todos los tipos de carga.

## Selección del conductor

El conductor debe superar simultáneamente estas comprobaciones:

1. Sección mínima normativa para el uso.
2. Capacidad de corriente tabulada.
3. Capacidad corregida por instalación, temperatura y agrupamiento.
4. Compatibilidad entre corriente de diseño, protección y capacidad corregida.
5. Caída de tensión máxima.
6. Requisitos adicionales de neutro, protección y condiciones especiales.

Para el perfil Chile, RIC N°04 incluye tablas de capacidad y factores de corrección. El motor almacenará las tablas como datos versionados con referencia exacta a la fuente.

## Caída de tensión

El cálculo usará longitud, corriente, material, sección y parámetros eléctricos del conductor. La implementación distinguirá circuitos monofásicos y trifásicos y permitirá incorporar resistencia a temperatura de operación y reactancia cuando sea relevante.

El algoritmo probará secciones normalizadas en orden ascendente y elegirá la primera que cumpla tanto capacidad como caída. El resultado explicará cuál de las dos condiciones gobernó la selección.

En el perfil Chile, RIC N°03 indica que la caída provocada por la corriente máxima en alimentadores/subalimentadores no debe exceder 3 % de la tensión nominal y que la caída total en el punto más desfavorable no debe superar 5 %. Existen requisitos específicos para otros tipos de instalación, por lo que el límite será una regla del perfil y no una constante global.

## Protección termomagnética

La selección debe:

- Usar calibres normalizados del perfil.
- Ser suficiente para la corriente de diseño.
- No superar la capacidad corregida del conductor.
- Considerar tipo de carga, arranque y curva.
- Advertir que la capacidad de ruptura requiere conocer la corriente de cortocircuito disponible.
- Marcar la coordinación/selectividad como no verificada cuando falten datos aguas arriba y aguas abajo.

## Protección diferencial

La recomendación considerará:

- Uso y ubicación del circuito.
- Sensibilidad exigida.
- Clase AC, A, F o B cuando corresponda al perfil.
- Corriente nominal igual o mayor que la protección o combinación de protecciones que deba soportar.
- Cantidad de circuitos asociados y reglas de continuidad de servicio.

No se presentará una clase A universal como respuesta para todos los casos.

## Salida del motor

Cada cálculo devolverá:

- Entradas normalizadas.
- Potencia instalada y demandada.
- Corriente de carga y corriente de diseño.
- Protección recomendada y alternativas.
- Conductor recomendado.
- Caída de tensión en voltios y porcentaje.
- Diferencial recomendado cuando aplique.
- Lista de reglas aplicadas.
- Supuestos.
- Advertencias y errores bloqueantes.
- Identificador y versión del perfil normativo.

## Versionado y reproducibilidad

Un informe guardará una instantánea inmutable de:

- Entradas.
- Resultado.
- Versión del motor.
- Versión del perfil normativo.
- Fecha de cálculo.

Actualizar una norma no modificará silenciosamente informes anteriores. El usuario podrá recalcular y comparar los cambios.

## Validación

Antes de liberar el MVP:

- Pruebas unitarias para fórmulas y selección de tablas.
- Pruebas de propiedades: aumentar distancia no puede reducir la caída; reducir sección no puede aumentar la capacidad admisible; la protección no puede exceder el conductor corregido.
- Casos dorados revisados por un instalador autorizado.
- Comparación manual con ejemplos normativos.
- Pruebas de límites y entradas inválidas.
- Revisión de redondeos y unidades.
- Auditoría específica de equivalencias mm²/AWG.

## Fuentes iniciales

- [Índice oficial de Pliegos Técnicos RIC](https://www.sec.cl/reglamento-de-seguridad-de-las-instalaciones-de-consumo-de-energia-electrica-decreto-08/)
- [RIC N°03 — Alimentadores y demanda](https://www.sec.cl/sitio-web/wp-content/uploads/2021/03/RIC-N03-Alimentadores-y-demanda-de-una-instalacion-V1.1-1.pdf)
- [RIC N°04 — Conductores y canalizaciones](https://www.sec.cl/sitio-web/wp-content/uploads/2021/01/RIC-N04-Conductores-y-Canalizaciones.pdf)
- [RIC N°05 — Medidas de protección](https://www.sec.cl/sitio-web/wp-content/uploads/2021/01/RIC-N05-Medidas-de-Proteccion-Contra-Tensiones-Peligrosas.pdf)
- [RIC N°10 — Instalaciones de uso general](https://www.sec.cl/sitio-web/wp-content/uploads/2021/01/RIC-N10-Instalaciones-de-uso-general.pdf)

