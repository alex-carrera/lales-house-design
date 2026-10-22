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

La fachada del dormitorio tiene un ventanal continuo y una ventana lateral
amplia. La entrada baja ocupa el antiguo cajón de gas, con su grada de 25 cm
y una ventana a su derecha vista desde el patio. Los huecos atraviesan paredes
y acabados interiores; sus medidas son provisionales. El estado actual mantiene
sus puertas, ventanas originales y cajón de gas.

## Patio, asadero y parqueadero

La propuesta añade un asadero posterior de unos 4 × 2,8 m, con parrilla de
ladrillo, campana, estufa de leña y mesón con fregadero bajo una cubierta continua para todo el terreno de 6 × 11 m (66 m² en planta),
con estructura oscura y cielo con acabado de madera. Los cinco apoyos se sitúan
en el perímetro, fuera de la trayectoria del SUV. Se muestran pasos de
chimenea, canal y bajante de referencia. Las secciones y anclajes son provisionales.
La cubierta aparece al abrir el recorrido; «Mostrar cubierta del patio» permite
ocultarla para revisar la distribución. Se mantienen las vistas anteriores.

Se reservan 5,50 × 3,10 m delante para un SUV y 2,30 × 1,10 m al lateral
para una Husqvarna 401 de 2021. El plano interactivo muestra entrada de frente,
desplazamiento hacia el patio, giro en reversa y alineación final.
La comprobación geométrica usa una envolvente conservadora de 4,65 × 2,15 m
y un radio supuesto de 4,80 m en el eje trasero, contra los muros, baño social,
asadero, postes y plaza de moto del modelo. Las cotas y el giro real requieren
comprobación en sitio antes de ejecutar la obra.

SUV de referencia: longitud 4,576 m, ancho de
carrocería 1,850 m, con espejos 2,085 m y batalla 2,707 m. No se ha confirmado
la variante del vehículo del propietario. La moto es aproximada.
[Manual oficial Chevrolet](https://www.chevrolet.com.br/content/dam/chevrolet/south-america/brazil/portuguese/index/services/owner-manuals/05-pdf/captiva/manual-captiva-2010.pdf).

## Baño social y baño principal privado

El antiguo bloque de cocina reducido pasa a ser un baño social de 2 × 3 m
aproximados, con inodoro, lavabo y acceso interior desde la sala. No tiene
puerta exterior; dos ventanas altas permiten luz y privacidad.

En la planta alta, el antiguo balcón y el baño pequeño se unen en un baño
privado de 3 × 3 m aproximados. Se completan las paredes y la cubierta y se
retira la división interior. Incluye tina, inodoro, ducha independiente con
mampara y lavabo, con acceso desde la planta alta. Las paredes y cielos
interiores siguen blancos; se conservan las paletas exteriores.

La calle conserva 3 m hasta el fondo. La losa superior mantiene 1 m de volado,
sin columnas nuevas en el paso. Es una propuesta conceptual; estructura,
instalaciones, cotas y distribución deben comprobarse en obra.

El selector del recorrido incluye «Baño social» y «Baño privado».
El estado actual permanece independiente y conserva su distribución original.

## Más luz para el dormitorio

Se sustituyen las dos ventanas de la pared frente al sofá por una sola abertura
continua de unos 3,45 × 1,40 m, con perfiles finos oscuros y sin pared intermedia.
La ventana de la pared lateral izquierda se amplía a unos 2,60 × 1,40 m.
La puerta interior al baño principal pasa a una hoja de unos 82 × 200 cm,
con paso nominal de 80 cm y hueco de obra aproximado de 90 × 210 cm.
Los huecos atraviesan la mampostería y los acabados de ambos recintos.
La distribución de los sanitarios y la calle de tres metros se conservan.
Las medidas, los dinteles y los refuerzos se deben definir en obra.

## Cocina luminosa y lavandería ampliadas

El antiguo cuarto blanco se amplía 2 m hacia la franja lateral: el bloque mide
unos 6 × 3 m (18 m² brutos), sin ocupar la calle libre de 3 m. Se retiran su
baño, los muebles de dormitorio y el Eternit de ese bloque. Una losa plana
conceptual permite una altura libre aproximada de 2,60 m desde el piso actual.

La cocina conserva el ventanal hacia la calle y abre una ventana de unos
1,60 × 1,20 m en el retorno opuesto, solo dentro de los 2 m de ampliación.
Las dos ventanas de la fachada de la foto se retiran: esa pared queda ciega
por la construcción adosada del tío. El lavaplatos pasa bajo el nuevo retorno,
la preparación queda hacia la calle y la cocción con campana ocupa la pared
ciega. Incluye refrigerador, despensa y muebles bajos.
La lavandería se sitúa en el extremo derecho con lavadora y secadora lado a lado,
mesón, alacena, lavadero y una separación con puerta corrediza.

El acceso a la cocina queda desde el comedor y conserva provisionalmente su bajada de 15 cm.
Las ventanas y el paso se cortan en la geometría; los marcos quedan dentro
del límite de propiedad. El plano de maniobra también incluye la ampliación.
La losa, su apoyo, el desagüe, la impermeabilización y las redes son conceptuales
y requieren dimensionamiento. El estado actual sigue independiente.

## Construcciones adosadas

Se representa al tío junto al cuarto original, con altura similar a ese bloque,
y a la tía con dos pisos adosados al frente del parqueadero, frente a la casa
del tío al otro lado de la calle de tres metros. El adosamiento se sitúa
en el cerramiento frontal del terreno, conservando la entrada de tres metros.
Son volúmenes de contexto: sus huellas y alturas no están medidas.
La vista «Entorno · Construcciones adosadas» permite revisar su ubicación;
«Mostrar construcciones adosadas» permite ocultarlas para inspeccionar la casa.
No se abren ventanas hacia esas medianeras. La lavandería conserva iluminación
artificial y su extracción hacia un espacio libre queda pendiente de definir.

## Comedor junto a cocina y ventanas adicionales

El comedor se traslada al ambiente y=3..7 contiguo a la cocina; la sala pasa
al ambiente de la entrada principal, conservando la división central. Mesa,
cuatro sillas y aparador se reubican; el sofá, el sillón y la TV dejan un paso
lateral continuo hacia el baño social y las gradas. El estado actual no cambia.

El ventanal de planta baja junto a la entrada se amplía a aproximadamente
2,80 × 1,20 m. Cada baño añade una ventana alta de vidrio traslúcido hacia
la calle: social 1,20 × 0,65 m y principal 1,60 × 0,70 m sobre la tina.
Las carpinterías quedan dentro del cerramiento y se conservan las ventanas
del retorno. Los huecos atraviesan la geometría de las paredes y sus acabados;
dimensiones y dinteles siguen siendo propuestas pendientes de medir en obra.

## Entrada de madera y luz cálida

La entrada principal sigue la referencia del usuario: acabado nogal, paneles
horizontales, marco de madera, tirador negro largo, fijo lateral de vidrio,
tres focos bajo el remate superior y un aplique negro junto al ventanal.
El vidrio queda hacia el comedor; la propuesta social actual retira la división central.
La puerta se representa cerrada y puede abrirse 90 grados hacia dentro
con «Abrir puerta principal» en la vista «Entrada · Madera y luz cálida».

Se conserva la altura interior de 2 m y la grada de 25 cm. El hueco de entrada
mide unos 89 × 200 cm, con hoja aproximada de 80 × 195 cm; el remate exterior
alcanza unos 2,14 m. Son proporciones conceptuales por medir en sitio.
La apertura se comprueba contra el mobiliario de la propuesta;
la calle libre de tres metros, el ventanal ampliado y las ventanas de baños
se conservan. El estado actual permanece independiente.

## Planta alta y visor amplio

La propuesta organiza la planta alta como una suite abierta: escritorio en L de 1,90 × 1,50 m y 65 cm de fondo junto a los dos ventanales, cama con colchón provisional de 1,60 × 2,00 m, clósets corredizos grafito de 2,55 m con nicho iluminado, y cómoda como soporte de TV. Paredes y techo blancos; carpintería roble, textiles arena y carbón y luz cálida. La medida comercial de 2½ plazas debe confirmarse con el colchón seleccionado. El CAD comprueba pasos libres al baño y a la llegada de las gradas.

El sitio usa una navegación horizontal compacta, tipografía sans serif y tonos carbón, piedra y bronce. Los textos laterales se retiraron y el visor ocupa todo el ancho; paleta y estancia comparten una barra de controles. El plano del patio queda desplegable. Materiales y Presupuesto y gastos permanecen ocultos hasta recibir una sesión de propietario autorizada por el servidor; los enlaces directos sin sesión regresan al recorrido público. Se conserva el acceso privado existente.

## Recorrido depurado

El selector del diseño futuro conserva 18 vistas. Se retiraron las nueve tomas redundantes de patio cubierto, asadero, entorno, ampliación de cocina, vista elevada, escritorio, planta de la suite, ventanales del dormitorio y ventanas de baños. Anterior y siguiente recorren únicamente las vistas conservadas. Se eliminaron sus cámaras, leyendas y lógica exclusiva; el visor carga solo los datos necesarios para renderizar. El modelo editable y toda la geometría de la propuesta se conservan.


### Sala y comedor con los muebles existentes

Se retiran los dos retornos, el dintel y el murete centrales para unir sala y comedor; se conservan la fachada y los accesos existentes a cocina y baño. Antes de una demolición en obra debe verificarse la función estructural de esas divisiones. El sofá de 190 × 90 cm y el módulo de 145 × 90 cm forman la L; la mesa de centro mide 73 × 70 cm. La TV permanece sobre el mueble de 173 × 40 × 60 cm, con listones decorativos de madera y luz cálida.

El comedor de 120 × 70 cm se coloca junto al acceso existente a la cocina. Los dos sillones de 90 × 90 cm forman un rincón de conversación en ese ambiente. Se mantienen el mueble del equipo de 80 × 50 × 120 cm y el de moto de 68 × 33 × 115 cm. El reclinable de 100 × 85 cm pasa al dormitorio para liberar la sala.

El ancho de la TV se estima en 165 cm a partir de los 93 cm de alto y una proporción 16:9; las sillas y alturas no recibidas son orientativas. Los pasos más estrechos modelados rondan 68–73 cm y deben contrastarse con medidas en sitio. Se comprobaron sólidos, medidas, apertura de entrada y colisiones. El estado actual se conserva idéntico y siguen disponibles 18 vistas.


### Suite invertida y TV

El clóset de 2,55 × 0,60 m cruza el cuarto delante del borde de las gradas, con frentes corredizos hacia el dormitorio y unos 1,07 m de paso lateral. La cama se gira hacia una TV de referencia de 75 pulgadas en la pared opuesta. El cabecero queda en el tramo ciego; su extremo bajo respeta el vidrio existente. El reclinable se orienta a la TV, y el escritorio en L de 1,90 × 1,50 m se refleja hacia la esquina sureste.

Se comprueban unos 71 cm frente a los tiradores del clóset, 93 cm al pie de la cama, las familias de muebles sin colisiones y una extensión orientativa de 65 cm para el reclinable. Las medidas de la casa, colchón y TV siguen siendo referencias por confirmar. El clóset no sustituye una solución técnica para proteger el hueco de gradas. El estado actual y las 18 vistas se conservan.
