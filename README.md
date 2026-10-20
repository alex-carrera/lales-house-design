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

## Patio, asadero y parqueadero

La propuesta añade un asadero posterior de unos 4 × 2,8 m, con parrilla de
ladrillo, campana, estufa de leña y mesón con fregadero bajo una cubierta continua para todo el terreno de 6 × 11 m (66 m² en planta),
con estructura oscura y cielo con acabado de madera. Los cinco apoyos se sitúan
en el perímetro, fuera de la trayectoria de la Captiva. Se muestran pasos de
chimenea, canal y bajante de referencia. Las secciones y anclajes son provisionales.
La cubierta aparece al abrir el recorrido; «Mostrar cubierta del patio» permite
ocultarla para revisar la distribución. Se mantienen las vistas anteriores.

Se reservan 5,50 × 3,10 m delante para una Captiva y 2,30 × 1,10 m al lateral
para una Husqvarna 401 de 2021. El plano interactivo muestra entrada de frente,
desplazamiento hacia el patio, giro en reversa y alineación final.
La comprobación geométrica usa una envolvente conservadora de 4,65 × 2,15 m
y un radio supuesto de 4,80 m en el eje trasero, contra los muros, cocina,
asadero, postes y plaza de moto del modelo. Las cotas y el giro real requieren
comprobación en sitio antes de ejecutar la obra.

Referencia del automóvil: Captiva Sport MY2010, longitud 4,576 m, ancho de
carrocería 1,850 m, con espejos 2,085 m y batalla 2,707 m. No se ha confirmado
la variante del vehículo del propietario. La moto es aproximada.
[Manual oficial Chevrolet](https://www.chevrolet.com.br/content/dam/chevrolet/south-america/brazil/portuguese/index/services/owner-manuals/05-pdf/captiva/manual-captiva-2010.pdf).
