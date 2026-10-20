# Casa Lales · Proyecto de remodelación

https://alex-carrera.github.io/lales-house-design/

Un espacio para documentar y organizar la remodelación de la casa:

- **Estado actual:** recorrido 3D basado en fotografías y medidas aproximadas.
- **Diseño futuro:** dos paletas exteriores comparables (gris cálido y arena/gris), simulación de Eternit pintado, blanco inicial y 66 m² aproximados de adoquines en el terreno lateral.
- **Materiales:** cantidades, ambientes, cotizaciones y estado de compra.
- **Presupuesto y gastos:** pagos realizados y pendientes, saldo y exportación CSV.

## Acceso privado

El recorrido es público. Materiales y gastos están reservados a una única cuenta autorizada.
Los registros se guardan en Supabase con políticas de seguridad por propietario
(RLS), y se sincronizan al ingresar con la misma cuenta desde otro dispositivo.
Las claves incluidas en `config.js` son públicas y no otorgan acceso administrativo.

El registro de nuevas cuentas está deshabilitado en Supabase. La web verifica
la autorización del propietario mediante `lales_is_owner`; las tres tablas
aplican la misma restricción mediante RLS. No basta con tener una sesión.
Las cotizaciones de materiales no se suman automáticamente a los gastos.
El disponible se calcula como presupuesto menos pagos realizados y pendientes.

## Publicación

GitHub Pages publica desde la raíz de `main`. La aplicación usa HTML, CSS y
JavaScript modular. `recorrido.html` conserva el visor del estado actual. `propuesta.html` contiene
la propuesta de acabados independiente.
Se requiere WebGL para los materiales y sombras del recorrido, e Internet
para acceder al organizador y cargar la biblioteca oficial de Supabase.

El proyecto de Supabase está configurado en plan Free. Sus límites incluyen
la posible pausa por inactividad; no se han contratado servicios de pago.
Las fotografías originales y los modelos editables se conservan en el proyecto local.

El cerramiento frontal de la propuesta deja una apertura libre de 3 m, alineada
con el paso. Altura de 2,80 m y espesor de 15 cm provisionales.
Las caras interiores de los muros permanecen blancas para cualquier paleta;
las dos paletas exteriores se conservan y la vista inicial usa Agreeable Gray / Dovetail.

La fachada propuesta reemplaza la puerta alta por un ventanal, conserva la
otra ventana alta y retira el cajón de gas. La entrada baja se reubica allí
con su grada de 25 cm, y una ventana queda a su derecha vista desde el patio.
Los huecos se han modelado en paredes y acabados interiores; sus medidas son
provisionales. El estado actual mantiene sus puertas y su cajón de gas.
