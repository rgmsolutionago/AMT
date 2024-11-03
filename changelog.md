# v1.1.19 - 2023-07-27
- Pantalla de selección de función:
    - Ahora se muestran las funciones agotadas, pero deshabilitadas y sin posibilidad de seleccionarlas.

# v1.1.18 - 2023-07-25
- Pantalla de factura cliente:
    - Agregada validacion para evitar completar los datos del cliente con valor undefined cuando 
    el cliente no ingresa datos.
    - Agregado teclado virtual.

# v1.1.17 - 2023-07-01
- General:
    - Agregada funcionalidad de traducciones de textos. Esto permite configurar facilmente las traducciones
    necesarias para los diferentes cines.
    - Agregada traducciones para DNI y moneda.
    - Agregadada nueva pantalla que permite ingresar Nombre y Documento de cliente para agregarlo en la factura.

# v1.1.16 - 2023-06-01
- Pantalla de Retiro QR:
    - Agregado de validación para quitar cualquier carácter que no sea número del documento del cliente.

# v1.1.15 - 2023-05-31
- Pantalla de Selección de Producto:
    - Se modifica diseño para que se puedan visualizar hasta 10 productos en resolución 1024x768.
- Pantalla de Retiro QR:
    - Agregado de logs en detección de código.

# v1.1.14 - 2023-05-30
- Pantalla de Selección de Producto:
    - Modificado layout y diseño de listado de productos para que se muestren la información de forma horizontal.

# v1.1.13 - 2023-05-21
- Pantalla de Selección de Producto:
    - Precio se pasa a mostrar con color más oscuro y más grande
    - Se ajustan estilos para que entren 8 productos en pantalla
    
# v1.1.12 - 2023-05-21
- Pantalla de Pago:
    - Se agrega timer para indicar al usuario cuántos segundos tiene el usuario para finalizar 
    la compra en formato mm:ss, ejemplo: 05:42 minutos.
    - Se agregan indicaciones para distintos medios de pago:
        - Pago con Tarjeta con Chip
        - Pago con Tarjeta sin Contacto
        - Pago con Tarjeta Magnética
    - Se quita información del detalle del ticket
- Pantalla de Inicio:
    - Actualizada imagen inicial

# v1.1.11 - 2023-05-04
- General:
    - Cache de productos: 
        - Actualizada lógica para que no se filtren productos que no tienen imagen. 
- Pantalla de Selección de Función:
    - Modificada lógica para quitar las tecnologías que no tienen más funciones. 
    - Agregado de validación para mostrar mensaje si no se encuentran tecnologías con funciones. 

# v1.1.10 - 2023-05-03
- Pantalla de Bienvenida:
    - Se remplaza carousel por imagen fija, se quita lógica que actualizaba obtenía 
    info de películas para mostrar posters y también se quita timer
- General:
    - Se agrega validación para que no falle al actualizar el cache cuando un 
    producto no contiene información completa y no se puede asignar correctamente 
    su imagen

# v1.1.9 - 2023-04-26
- General:
    - Workstation settings ahora se obtiene cuando se actualiza el cache. En este punto 
    se guarda el User que se usa en las ventas y el ToleranceShowtime que se utiliza para 
    filtrar las funciones.
    - Renombrada configuración para invalidar cache
- Pantalla de Selección de Función:
    - Se agrega filtro para que no se muestren las funciones que están canceladas.

# v1.1.8 - 2023-04-24
- Pantalla de Selección de Función
    - Agregados logs de funciones no mostradas en pantalla.

# v1.1.7 - 2023-04-23
- Pantalla de Selección de Butacas
    - Se le agrega un fondo gris claro a las imagenes en la leyenda
- General:
    - Cache:
        - Se agrega a las configuraciones el valor *reloadCacheAfterMinutes* que hace que luego 
        de ese tiempo se refresque la cache
        - La lógica de refrezco de cache se dispara desde el componente que monitorea inactividad 
        del usuario y se va a hacer siempre que la app esté en la pantalla inicial
    - Tiempo de tolerancia: actualizada lógica

# v1.1.6 - 2023-04-19
- Pantalla de Selección de Butacas
    - Se quitan los números de butacas que se mostraban sobre los íconos
    - Se modifican los iconos de butacas y los de discapacitados para remplazar los cuadrados de colores

# v1.1.5 - 2023-04-18
- Pantalla Inicial
    - Ajustes visuales: Se ajusta posición de texto e imágenes para que no se solapen
- Pantalla de Selección de Función
    - Ajustes visuales: Se ajustó tamaño de scrollbar. Se ajustó tamaño y ubicación de texto Próxima Función.
- Pantalla de Selección de Medio de Pago
    - Modificado tamaño de items de medios de pago para que se visualicen 7 en resolución 1024x768
- Pantalla de Selección de Butacas
    - Se modifica layout de pantalla:
        - Agregado de sección derecha que contiene detalle de selección de butacas
        - Se disminuye el tamanó del canvas que dibuja las butacas
        - Se mueve a la derecha el detalle de butacas en la orden y butacas seleccionadas
    - Se quita icono de butaca ocupada. Si la butaca está Ocupada o No Disponible se muestra roja 
    - Se agrega lógica para mostrar butacas de discapacitados. Butacas de color celeste
    - Se cambian las imágenes de las butacas por cuadrados con bordes curvos de colores. Esto 
    permite mostrar dentro el número de butaca.
    - Se modifica lógica para mostrar la letra sobre el número en las butacas. Esto permite visualizar 
    claramente la letra y el número. 
    - Nuevo código de colores de butaca:
        - Gris: butacas disponible
        - Verde: butaca seleccionada
        - Rojo: butaca no disponible u ocupada
        - Azul: butaca discapacitado

# v1.1.4 - 2023-04-13
- Pantalla de Selección de Películas
    - Se modifica configuración y estilos para mostrar 4 películas al mismo tiempo
- Pantalla de Selección de Función
    - Ajustes visuales en botón de selección de día y botones de horarios
- Pantalla de Selección de Categoría
    - Ajustes visuales en opciones de cantidad de butacas y resumen de compra 
- Pantalla de Selección de Butacas
    - Ajustes de estilos de leyenda de butacas y cantidad de butacas
- Pantalla de Selección de Productos
    - Ajustes visuales para mostrar por defecto hasta 8 productos y tamaño de scroll bar
- Pantalla de Selección de Medio de Pago
    - Ajustes visuales en opciones de pago, resumen de compra y scroll bar
- Pantalla de Impresión de Ticket
    - Ajustes visuales resumen de compra
- General
    - Ajustes en varias pantallas para que se visualicen correctamente en resolución de 1024x768

# v1.1.3 - 2023-04-06
- Pantalla de Selección de Película:
    - Se modifica el layout para que siempre se muestren máximo 3 películas por slide. También se muestran los dots abajo del text "Seleccione la película" que indica en el grupo de slide que estamos parados actualmente. Al presionar las flechas de los costados el usuario se mueve 3 slides. Se probó con 1, 2, 3, 4 y hasta 15 películas y se visualizan correctamente.

# v1.1.2 - 2023-03-03
- Pantalla de Bienvenida 
    - Improvements: mejoras en lógica que carga las películas de la página.
- Pantalla de Selección de Producto:
    - Fix: Corrección en lógica que carga productos a cache. 
    - Fix: Agregado de validación que evita que pantalla genere error si el complejo 
    no tiene cargados productos.    

# v1.1.1 - 2023-03-26
- General
    - Fix: Se corrige error al presionar botón de cancelar compra
    - Fix: Error general cuando el complejo tiene solo un producto disponible.
    - Improvement: Se quitan del proyecto imagenes y videos que no se usaban. 
    - Improvement: Se quita componente de video que no se utiliza.
- Pantalla de Selección de Película
    - Improvement: si la película no tiene funciones para un día en particular
    no se carga en pantalla
    - Improvement: si no se encuentran días con funciones se muestra el mensaje
     "No existen funciones para la película seleccionada"
    - Improvement: si el ws info no retorna funciones para la película seleccionada
    se muestra el mensaje "No se encontraron funciones para la película seleccionada"
    - Fix: Para filtrar las funciones ahora se toma salesDate + Fecha y Hora actual - settings.TopeFuncionATM (20 min) 
    - Fix: Modificaciones visuales para soportar películas con muchos tipos de copias 
    y que tengan nombres largos de tecnologías y lenguajes
    - Improvement: Se agrega validación que muestra mensaje si no hay películas disponibles. 
- Pantalla de Selección de Película:
    - Fix: Agregado de validación que omite películas que no tiene OriginalTitle.
- Pantalla de Retiro de Entrada:
    - Fix: Se contempla que la terminal pueda tener hasta 4 dígitos. Con esto si la terminal 
    tiene 3 dígitos solo se toman los últimos 2 para generar el código de retiro.
- Pantalla de Bienvenida
    - New feature: Se muestra la lista de posters de las películas que se están 
    mostrando en el complejo. 
    - New feature: Se puede omitir esta pantalla utilizando la configuración *showIntroScreen*.
    - New feature: El timer se dispara desde todas las pantallas para evitar 
    que queden compras en curso en el ATM.
    - New feature: El nombre del complejo se puede configurar con la opción 
    de configuración *theatreName*.


# v1.1.0 - 2023-03-24
- Pantalla de Selección de Película
    - Se agrega agruapación de películas por OriginaTitle
- Pantalla de Selección de Funciones
    - Se agrega opción de seleccionar una de las copias (2D Español, 3D Ingles Sub, etc) para luego seleccionar una función
- Pantalla de Procesando su Compra
    - Se agrega animación a imagen de carga igual que pantalla de Retiro

# v1.0.0 - 2023-03-14
- Pantalla de Selección de funciones
    - Agregado de validaciones para mostrar mensaje cuando no hay funciones disponibles para la película.

# v0.0.0 - 2023-03-14
- General
    - Corregidos parámetros para invocar servicio unblockSeat.
    - Agregado de popup luego de imprimir ticket correctamente para redirigir el usuario a la pantalla de inicio.
    - Agregada validación para que la aplicación no genere error cuando no hay películas para mostrar.

# v0.0.0 - 2023-03-07
- General
    - Agregado request de chequeo de status de impresora genérica de windows para despertar servicio de 
    impresión y evitar errores al intentar imprimir entrada por primera vez. 
    
# v0.0.0 - 2023-03-03
- Pantalla Selección Película
    - Se agrega filtro para que solo se muestren las películas habilitadas para el ATM .
- General
    - Update estilos.

# v0.0.0 - 2023-02-15
- Pantalla inicial
    - Ajustes visuales en estilos de botones de opciones
    - Ajustes en tamaños de textos 

- Pantalla de selección de película
    - Modificación en estilos de botones para mover lista de películas
    - Modificación en estilos de titulo
    - Agregado botón para navegaar a panntalla de inicio
    - Agregado de animaciones en titulo y botón de inicio
    - Agregado de ordenamiento de películas por OriginalTitle. 
    
- Pantalla de selección de categorías
    - Mejoras visuales menores

- Pantalla selección de forma de retiro
    - Ajustes visuales en estilos de botones de opciones
    - Ajustes en tamaños de textos 
    - Agregado botón para volver a pantalla inicial 

- Pantalla de retiro
    - Modificado text CI por DNI
    - Corrección de error que se daba en pantalla de retiro de entrada cuando la orden tenía productos de candy

- Pantalla de procesamiento de venta 
    - Ajustes en diseño de ticket con detalle de compra
    - Modificación en lógica de error para que al cerrar el mensaje de error se redirija al usuario a la pantalla de inicio.

- Pantalla de impresión
    - Al generar error al imprimir muestra un error en pantalla y al aceptar vuelve al inicio de la aplicación
    - Modificación en lógica para mostrar error ni bien se produzca un error al intentar enviar a imprimir
    - Ajustes en diseño de ticket con detalle de compra
    - Agregado de animaciones
    - Modificación en lógica de error para que al cerrar el mensaje de error se redirija al usuario a la pantalla de inicio.

- General
    - Actualizada librería de animaciones
    - Solucionado progreso en barra de navegaciòn superior, antes no marcaba correctamente el retiro
    - Modificación para que al hacer clic sobre el logo del cine ya no permite navegar al inicio
    - Header:
        - Deshabilitada navegación a pantalla de inicio cuando se presionaba sobre el logo
        - Deshabilitada navegación a pantalla de inicio al presionar los botones de la derecha superior (cartelera, funciones, candy)
        - Modificación en estilos para quitar color azul de fondo en el paso de compra actual
        - Se quita lógica que pintaba de amarillo el progreso en el paso actual porque era confusa, por ejemplo, 
        dependiendo de la función, la barra de progreso podía pintar media barra o un tercio, pero no era intuitiva 
        la lógica. Para simplificar se utiliza el color amarillo para indicar en el paso actual de la compra. 
- Otros 
    - Agregados estilos para Cine Multiplex: logo, background, color de acento.
