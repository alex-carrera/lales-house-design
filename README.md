# Casa Lales · Proyecto de remodelación

https://alex-carrera.github.io/lales-house-design/

Un espacio para documentar y organizar la remodelación de la casa:

- **Estado actual:** recorrido 3D basado en fotografías y medidas aproximadas.
- **Diseño futuro:** espacio reservado para la propuesta que se acordará después.
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
JavaScript modular. `recorrido.html` conserva el visor 3D independiente.
Se requiere WebGL para los materiales y sombras del recorrido, e Internet
para acceder al organizador y cargar la biblioteca oficial de Supabase.

El proyecto de Supabase está configurado en plan Free. Sus límites incluyen
la posible pausa por inactividad; no se han contratado servicios de pago.
Las fotografías originales y los modelos editables se conservan en el proyecto local.
