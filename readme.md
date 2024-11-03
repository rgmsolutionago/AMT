# CINESTAR ATM
# General

La aplicación es un proyecto Angular.
Utiliza typescript.
Consume dos servicios soap, Cinestar Info y Trans.
Consume otro servicio .net para realizar la impresión en diferentes impresoras.
Los estilos están definidos utilizando scss.

# Dependencias

https://nodejs.org/dist/v16.13.1/

# Estructura de proyecto:

- `src\app\components`: contiene todos los componentes reutilizables de la app
    - `src\app\components\nav-bar`: contiene la barra de navegación superior derecha (selección de película, pago, etc) 
- `src\app\models`: contiene modelos usados para retornar información desde los servicios. No todos los objetos están modelados en la app, por ejemplo, hay algunos servicios que retornar objetos sin tipar
- `src\app\screens`: contiene las vistas de la app. Cada carpeta contiene una vista .html y el código que ejecuta la vista en el un archivo typescript .ts
- `src\app\services`: contiene clases que exponen los métodos de los servicios que consume la app
- `src\app\utils`: clases útiles para el proyecto en general
- `src\app\app.modules.ts`: contiene la definición de todos los componentes que contiene la aplicación. Cuando se crean nuevos componentes es necesario darlos de alta en este archivo también
- `src\app\app-config.model.ts`: contiene el modelo del archivo de configuración
- `src\assets\config` :  contiene los archivos con las configuraciones para ejecutar la app en desarrollo o producción
- `src\assets\css` :  contiene todos los estilos de la aplicación
- `src\assets\i18n` :  contiene las traducciones de texto disponibles


## Actualización de estilos
Los estilos se modifican utilizando los archivos .scss.

Instalar SASS:
`npm install -g sass`

Para que se actualicen los archivos .css del proyecto se deben seguir los siguientes pasos:
- abrir una consola
- posicionanos en la ruta `src\assets\css`
- ejecutar el comando `sass --watch .:.`
Este comando detecta automáticamente cambios en los archivos scss y en base a ellos actualiza los archivos css.

# Ejecución en debug
`ng serve --proxy-config proxy.conf.json` o simplemente `npm run run-dev`.

En vscode se puede ejecutar la aplicación en debug. Esto permite crear breakpoint y hacer debug del código.
Para eso se debe crear un nuevo launch task con el siguiente contenido:
```
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Launch Chrome against localhost",
      "url": "http://localhost:4200",
      "webRoot": "${workspaceFolder}"
    }
  ]
}
```

# Configuraciones

Las configuraciones se pueden encontrar en la ruta `src\assets\config`.
Existen dos tipos de configuraciones: desarrollo y producción. 
Las *configuraciones de desarrollo* se encuentran en el archivo `src\assets\config\config.dev.json`.
Las *configuraciones de producción* se encuentran en el archivo `src\assets\config\config.prod.json`.

A continuación, se enumeran algunas de las configuraciones más cómunes.

- `onlyWithdrawal: boolean;`: indica si la aplicación debe habilitar solo los retiros de entradas o retiro de entradas y venta. True solo habilita Retiro de Tickets. False Retiro y Venta de Entradas.
- `isQRWithdrawalEnabled: boolean;`: indica si se habilita la opción de retiro con código QR. False indica que no se debe mostrar la opción de menú de Retiro con QR.
- `printer.serviceBaseUrl`: indica la url en la cual está corriendo el servicio de impresión.
- `printer.boxOffice`, `printer.concession`, `printer.receiptConcession`:  permiten configurar de forma individual la impresora a usar en cada caso. Solo se debe configurar el nombre o el puerto de la impresora, nunca los dos porque uno va a ser ignorado.
- `withdraw.ticketCodeLength`: largo del código de retiro de entradas sin incluir documento
- `availablePaymentMethods`: contiene los medios de pago disponibles para seleccionar por el usuario.
  - `name`: nombre que se muestra en pantalla. Por ejemplo: Visa Crédito
  - `paymentMethodCode`: código de método de pago
  - `creditCardCSID`: id de cinestar de la tarjeta de crédito en caso de que corresponda
  - `logo`: logo asignado al medio de pago. Más info:
    - Logo que se puede asignar por defecto _PaymentMethodLogoUndefined.png_ que es un logo genérico. 
    - Los logos se encuentran en la ruta: _src\assets\img_ y el nombre de los mismos tiene el formato PaymentMethodLogoXXXXX.png.
    - Los logos deben tener una resolución de 256x192 pixeles. 
- `finalCustomer`: datos del cliente final utilizado para las ventas en el ATM. 
  - `name`: nombre del cliente final
  - `lastName`: apellido del cliente final
  - `ID`: identificador del cliente final
  - `telephone`: teléfono del cliente final
  - `email`: email del cliente final
- `paymentTimeoutSeconds`: segundos que tiene el usuario para finalizar el pago de la compra. 
- `showPaymentMethodContactless`: indica si se debe mostrar la pantalla de ayuda de Pago Sin Contacto. 
- `showPaymentMethodMagnetic`: indica si se debe mostrar la pantalla de ayuda de Pago con Tarjeta con Banda Magnética. 
- `showPaymentMethodChip`: indica si se debe mostrar la pantalla de ayuda de Pago con Tarjeta con Chip. 
- `showClientInvoiceScreen`: indica si se debe mostrar la pantalla de ingreso de Nombre y Documento de Cliente para la facturación. 

# Uso de Traducciones

Las traducciones se encuentran en el siguiente path: `\src\assets\i18n\es.json`.
El archivo de traducciones es un simple json que almacena clave-valor.
En una vista html se debe usar de la siguiente forma:
```<label>{{ 'client_invoice_name' | translate:'es' | async }}</label>```
Donde `client_invoice_name` es la clave que se va a buscar en el archivo de traducciones. 
`| translate:'es' | async` esta parte indica que se debe usar un pipe de angular que va a invocar a la función `translate` pasandole como parámetros la key a buscar y el valor `es` que indica el archivo al que hace referencia. 

# Generación de Release

Ejecutar el comando `npm run build-release`, esto ejecuta el comando `ng build --delete-output-path --configuration production`. Genera una versión para distribución en la carpeta `/dist`. El contenido de esta carpeta es lo que se debe desplegar en el servidor.

Cuando la aplicación se ejecute se van a levantar las configuraciones de producción que se encuentran en la ruta `src\assets\config\config.prod.json`.

# Despliegue

En la carpeta en la que se encuentren los servicios Info y Trans se debe generar un archivo web.config que tenga el siguiente contenido:

<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <system.webServer>
		<httpProtocol> 
			<customHeaders>
                <add name="Access-Control-Allow-Origin" value="http://localhost:8081" /> 
				<add name="Access-Control-Allow-Headers" value="Content-Type, Authorization, SOAPAction" />
				<add name="Access-Control-Allow-Methods" value="GET, POST, PUT, DELETE, OPTIONS" />
             </customHeaders> 
         </httpProtocol>
    </system.webServer> 
 </configuration> 

Esta configuración tiene el fin de habilitar CORS para el sitio de ATM. Con esto el sitio ATM podrá consumir los servicios correctamente y no generar un error por CORS debido a que el ATM corre en un puerto y los servicios corren en uno diferente.

Ejemplo de estructura de carpetas con archivo de configuración:
  inetpub
    wsCinestar85
      CsWsInfo
      CsWsTrans
      web.config

**Importante**: *Access-Control-Allow-Origin* debe contener la url con puerto donde está desplegado el ATM. 


# Dev Dependencies
npm i -g npm@6 
npm i g @angular/cli

# Custom Commands
Se crearon algunos comando de uso recurrente en el archivo package.json. 

- **npm run scss**: ejecuta el comando `sass --watch .:.` para monitorear cambios en archivos scss y regenerar los archivos css en caso de ser necesario. 
- **npm run build-release**: ejecuta el comando `ng build --delete-output-path --configuration production` genera un nuevo release para desplegar en producción. 
- **npm run build-release-zip**: ejecuta el comando `ng build --delete-output-path --configuration production && @powershell -NoProfile -ExecutionPolicy Unrestricted -Command ./scripts/ZipRelease.ps1 -Version %npm_package_version%`. Ejecuta el comando de build y luego genera un *zip* del contenido de la carpeta *dist* que almancena en la carpeta de *Releases*. Ejemplo: */Releases/20230422161214-dist-atm-production-v1.1.6.zip*
- **npm run run-dev**: `ng serve --proxy-config proxy.conf.json` corre la aplicación web con el proxy configurado para poder ejecutar de forma local los request a los servicios de backend.
