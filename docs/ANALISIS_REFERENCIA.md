# Análisis de las referencias

Fecha de análisis: 23 de agosto de 2026.

## Resumen ejecutivo

La propuesta de valor observada no es una calculadora aislada: es un flujo de trabajo para técnicos eléctricos. La entrada es una instalación dividida en circuitos y cargas; la salida es una recomendación rápida y presentable de breaker, conductor, caída de tensión y diferencial, acompañada por un PDF.

La oportunidad para nuestro producto es conservar esa inmediatez, pero mejorar tres aspectos críticos:

1. Trazabilidad: mostrar de dónde sale cada resultado.
2. Validez normativa: aplicar reglas versionadas por país y tipo de instalación.
3. Seguridad: pedir los datos que realmente modifican la capacidad del conductor y las protecciones, y advertir cuando no hay información suficiente.

## Lo que ofrece la demo web

La versión pública está limitada a un circuito y una carga. Permite configurar:

- Voltaje: 110, 120, 127, 208, 220, 230 o 240 V.
- Factor de demanda.
- Factor de seguridad: 1,00, 1,25 o 1,60.
- Distancia en metros.
- Curva del breaker: automática, B, C o D.
- Nombre del artefacto y potencia.

Entrega estos resultados:

- Corriente base.
- Corriente final corregida.
- Breaker y curva recomendados.
- Sección de cable en mm² y una equivalencia AWG.
- Porcentaje de caída de tensión.
- Interruptor diferencial sugerido.
- Exportación PDF, bloqueada en la demo.

Prueba realizada: una carga de 5.500 W a 220 V produce 25 A de corriente base. Con factor 1,25, el resultado muestra 31,25 A, breaker de 32 A curva C, conductor de 6 mm², caída de 1,52 % para 20 m y diferencial de 40 A / 30 mA clase A.

## Lo que muestra el reel

El video presenta la versión completa en un teléfono y confirma un flujo de varios circuitos:

- Encabezado con versión de la herramienta y acceso directo al PDF.
- Pestañas de circuitos con nombre y capacidad resultante.
- Crear y renombrar circuitos.
- Configuración independiente por circuito.
- Modo avanzado.
- Tabla con múltiples cargas, potencia, cantidad y total.
- Tarjeta de resultado con breaker, cable, corriente, caída y curva.
- Resumen de potencia total y potencia corregida.
- PDF con tabla de circuitos y diagrama unifilar.

El caso comercial del reel divide un negocio en cuatro circuitos y plantea bajar el trabajo manual de aproximadamente 45 a 5 minutos.

## Fortalezas de la referencia

- Flujo corto y comprensible.
- Diseño móvil-first útil en terreno.
- Resultados que el técnico reconoce inmediatamente.
- Organización natural por circuitos.
- El PDF convierte un cálculo en un entregable profesional.
- El resultado se actualiza al editar las cargas.

## Vacíos que debemos resolver

### Datos eléctricos insuficientes

Voltaje, potencia y distancia no bastan para dimensionar todos los casos con seguridad. El motor debería considerar, según corresponda:

- Monofásico, trifásico o corriente continua.
- Tensión fase-neutro o fase-fase.
- Factor de potencia y rendimiento.
- Tipo de carga: resistiva, iluminación, motor, electrónica/no lineal, climatización, etc.
- Régimen continuo, simultaneidad y demanda.
- Material del conductor.
- Tipo de aislación y temperatura de servicio.
- Método de instalación.
- Temperatura ambiente.
- Agrupamiento y cantidad de conductores cargados.
- Longitud real del recorrido.
- Caída máxima admisible.
- Condiciones del lugar: humedad, exterior, baño, ambiente especial.
- Corriente de cortocircuito disponible y capacidad de ruptura, cuando exista el dato.

### Reglas poco explicadas

La referencia muestra la respuesta, pero no la justificación. Nuestro resultado debe incluir:

- Fórmula utilizada.
- Entradas y valores por defecto.
- Factores de corrección aplicados.
- Tabla normativa consultada y versión del perfil.
- Razón por la que se aumentó la sección o la protección.
- Advertencias por datos faltantes.

### Riesgo en equivalencias AWG

Las secciones IEC en mm² y las secciones AWG no son intercambiables de forma exacta. La aplicación debe mantener catálogos separados y, si muestra una equivalencia, etiquetarla como aproximada y verificar la capacidad admisible del conductor real.

### Curva y diferencial

La curva de disparo no debería inferirse solo desde el nombre escrito por el usuario. Debe depender del tipo de carga, corriente de arranque, coordinación y selectividad. Del mismo modo, clase y sensibilidad del diferencial dependen del uso del circuito y de la forma de onda esperada.

## Mercado normativo inicial propuesto: Chile

La arquitectura se preparará para perfiles por país, pero el primer paquete puede basarse en los Pliegos Técnicos RIC de la Superintendencia de Electricidad y Combustibles.

Las fuentes oficiales relevantes incluyen:

- RIC N°03: alimentadores, subalimentadores y demanda.
- RIC N°04: conductores, materiales y canalizaciones.
- RIC N°05: protección contra tensiones peligrosas y descargas.
- RIC N°10: instalaciones de uso general.
- RIC N°18: presentación de proyectos.
- RIC N°19: verificación y puesta en servicio.

Ejemplos que afectan directamente al motor:

- RIC N°03 establece límites de caída de tensión y factores de demanda para ciertos alimentadores.
- RIC N°04 contiene capacidades de transporte y factores de corrección por agrupamiento y temperatura.
- RIC N°05 reconoce diferenciales de sensibilidad menor o igual a 30 mA como protección complementaria y distingue clases según la forma de corriente esperada.
- RIC N°10 vincula la corriente nominal de la protección con la capacidad de los conductores y exige diferencial de hasta 30 mA para circuitos de alumbrado, con reglas adicionales de agrupación y protección.

Las reglas deberán ser revisadas con un instalador autorizado antes de publicar resultados para uso real.

## Producto propuesto

### Experiencia básica

1. Crear proyecto y elegir país/norma.
2. Definir sistema de alimentación y condiciones generales.
3. Crear circuitos con una plantilla: iluminación, enchufes, motor, climatización, alto consumo u otro.
4. Agregar cargas desde un catálogo editable.
5. Completar solo los datos necesarios; abrir modo avanzado para condiciones especiales.
6. Ver el resultado en vivo, con estado: válido, advertencia o incompleto.
7. Revisar el resumen del tablero y corregir inconsistencias.
8. Exportar PDF, diagrama unifilar y lista de materiales.

### Diferenciadores

- Explicación paso a paso de cada resultado.
- Perfil SEC Chile versionado y auditable.
- Catálogo de cargas que no decide reglas por texto libre.
- Comparación entre alternativas de conductor/protección.
- Detección de problemas: caída excesiva, protección mayor que la capacidad corregida, diferencial mal dimensionado o datos insuficientes.
- Informe reproducible: guarda una instantánea de entradas, resultados y versión normativa.
- Operación offline en terreno.

## Alcance que no debe entrar al primer MVP

- Firma o declaración oficial de instalaciones.
- Cálculo completo de cortocircuito y selectividad sin datos de la red.
- Diseño detallado de puesta a tierra.
- Ambientes explosivos, generación, baterías y electromovilidad.
- Precios de materiales en tiempo real.
- Facturación, pagos y marketplace.
- Colaboración multiusuario en tiempo real.

Estas capacidades pueden agregarse por módulos cuando el núcleo esté validado.

