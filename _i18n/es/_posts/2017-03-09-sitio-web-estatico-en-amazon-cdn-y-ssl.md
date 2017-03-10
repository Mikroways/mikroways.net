---
date: 2017-03-09 09:03:00 -3000
layout: post
title: "Sitio web estático en Amazon: CDN y SSL"
authors: leandro
categories: devops
tags: [amazon, aws, s3, cloudfront, travis, route53, github, web, servicios, jekyll, cloud computing]
permalink: /2017/03/09/sitio-web-estatico-en-amazon-cdn-y-ssl/
series: sitio-web-estatico-en-amazon

---

En esta instancia, si se siguieron los pasos anteriores, se debería tener el
sitio web funcionando en AWS S3 con su propio dominio. Se verá ahora entonces
cómo hacer para agregarle una CDN, que permita mejorar el tiempo de respuesta
para los usuarios, y SSL, de manera que el intercambio de información sea
cifrado.
<!-- more -->

## Solicitar el certificado

Si bien no es necesario contar con el certificado de SSL para configurar la CDN,
empezar por este paso evita tener que reconfigurar la misma más adelante. Se
debe considerar que, previo a la emisión del certificado, Amazon realizará una
validación que le permita asegurarse que quién lo solicita está autorizado para
ello, es decir, tiene alguna responsabilidad sobre el dominio en cuestión.

La forma en que lo realiza es enviando un enlace a una de las siguientes
direcciones de correo electrónico:

* admin
* administrator
* hostmaster
* postmaster
* webmaster

Por ello, es importante verificar que se tenga acceso a alguna de las cuentas
anteriores, dado que de lo contrario no se podrá finalizar el proceso de
validación.

Una vez chequeado lo anterior, ingresar a la consola de gestión de AWS
Certificate Manager y presionar “Get Started”. Se debe trabajar en la zona US
East (North Virginia), dado que CloudFront sólo puede utilizar los certificados
generados allí.

En la pantalla que se abre, ingresar debajo de “Domain name” el nombre con el que
se accede al sitio web. Si hubiera más de uno, hacer click en “Add another name
to this certificate” y escribir el otro nombre. Cuando se termine, hacer click
en “Review and request”. En el próximo paso, asegurarse que los nombres sean
correctos y seleccionar “Confirm and request”.

En la pantalla que sigue se muestra, para cada uno de los nombres solicitados,
las cuentas a las que se enviará un correo solicitando aprobación. Hacer click
en “Continue”. Esto dispara el envío de los correos para validar los nombres 
y mostrará una pantalla donde se puede observar el certificado solicitado en el
estado *validación pendiente*, como se ve a continuación.

![Certificado pendiente de
aprobación](/images/blog/static-website-on-amazon_ssl-certificate-pending-approval.png)

Luego de recibido el correo de validación, hacer click en el enlace y, en la
pantalla que se muestre, presionar el botón “I Approve”. Es importante
considerar que se deben aprobar las solicitudes de todos los nombres pedidos
para que el certificado se emita, con lo cuál lo anterior se debe realizar para
cada uno de ellos.

Luego de validar todos los nombres, recargar la pantalla desde las flechas
circulares que se ven en la consola y el estado del certificado debería cambiar
a “Issued”, como se muestra debajo.

![Certificado
emitido](/images/blog/static-website-on-amazon_ssl-certificate-issued.png)

Ahora sí, con el certificado ya emitido, se procede entonces a configurar la
CDN.

## Crear la distribución en CloudFront

AWS CloudFront es la CDN de Amazon y utiliza el concepto de distribución para
referirse a la red de distribución de contenidos para un sitio web. Entonces, lo
primero que se necesitará será crear una nueva distribución y luego configurarla
convenientemente. Para hacerlo, acceder a la consola de administración de
CloudFront y allí hacer click en “Create Distribution”. En la siguiente
pantalla, hacer click en “Get Started”, dentro de la sección “Web”.

Se abrirá una ventana con tres secciones diferentes que se explican a
continuación.

### Origin Settings

Completar en “Origin Domain Name” la dirección del sitio en S3, de la forma 
[nombre-bucket].s3-website-[region-aws].amazonaws.com. Por ejemplo, en este caso
es leoditommaso.io.s3-website-us-east-1.amazonaws.com. Poner especial atención
aquí, dado que al hacer click en el campo se desplegará una lista en la que se
puede seleccionar el bucket de S3, pero **si se hace de esa forma no va a
funcionar la carga del index.html en los directorios**.

Luego de la elección se autocompletará el campo “Origin ID” que servirá para
identificar la fuente de datos de CloudFront; se puede mantener el valor por
defecto o bien cambiarlo por otro que resulte más adecuado.

### Default Cache Behavior Settings

En esta sección, modificar sólo la opción que dice “Compress Objects
Automatically”, poniendo el valor en “Yes”. Con esto se le indica a CloudFront
que si el pedido tiene el encabezado **Accept-Encoding: gzip** entonces comprima
el contenido antes de entregarlo. Esto no sólo reduce para el cliente el tiempo
de descarga del archivo, sino que también disminuye el ancho de banda consumido
para entregarlo, lo que se traduce en un menor costo de transferencia.

### Distribution Settings

Esta es la parte que requiere más trabajo. Las opciones a configurar son las
siguientes:

* **Price Class**: este ítem se debe seleccionar según cuál sea la prioridad al
  momento de entregar el sitio a los usuarios. Si lo que se desea es obtener el
  mejor rendimiento posible se aconseja dejar la opción por defecto, que es “Use
  All Edge Locations”. Se debe considerar, no obstante, que si muchos usuarios
  acceden fuera de Estados Unidos, esta opción es más cara, dado que CloudFront
  tiene precios diferentes dependiendo de cuál sea la ubicación que devuelva el
  contenido solicitado. De todas maneras, para sitios que no tengan muchas
  visitas no habrá una diferencia significativa de precios (remitirse al primer
  post de la serie para los detalles sobre costos).
* **Alternate Domain Names (CNAMEs)**: escribir acá, uno por línea o separados
  por comas, todos los nombres con los que puede accederse el sitio. En el
  ejemplo, leoditommaso.io y www.leoditommaso.io.
* **SSL Certificate**: seleccionar la opción “Custom SSL Certificate” y elegir
  de la lista el certificado creado anteriormente.
* **Custom SSL Client Support**: esta opción será visible luego de completar el
  paso anterior. Se puede ver que aquí se tienen dos opciones:

  * **Only Clients that Support Server Name Indication (SNI)**.
  * **All Clients**.

  Seleccionar la primer opción dado que la segunda tiene un costo adicional muy
  elevado. Dicha selección hará que los usuarios que tengan versiones viejas
  (realmente viejas) de sus navegadores reciban un error de validación al
  acceder al sitio con HTTPS, al no contar estos con [soporte para
  SNI](https://en.wikipedia.org/wiki/Server_Name_Indication#Support).

* **Logging**: habilitarlo seleccionando “On”. Completar luego los dos campos
  que se desbloquean debajo:
  * **Bucket for Logs**: hacer click y, de la lista que se despliega,
    seleccionar el bucket creado en el post anterior para los logs. En este
    caso, logs.leoditommaso.io.
  * **Log Prefix**: nombre de la carpeta dentro del bucket donde se almacenarán
    los logs. Por ejemplo, “cdn”.

Finalizar el procedimiento haciendo click en “Create Distribution”. Se mostrará
una nueva pantalla con una serie de datos, entre ellos:

* **ID**: es el identificador de la distribución. Tomar nota de este dato, dado
  que será utilizado más adelante, cuando se configure el deploy automático.
* **Domain Name**: es el nombre de dominio de CloudFront con el que puede
  accederse al sitio web (además de los nombres configurados).
* **Status**: es el estado actual de la distribución. Ni bien se crea, aparecerá
  como “In Progress”, un estado que representa que se han hecho cambios y están
  aplicándose en todos los servidores, con lo que es posible que no se tenga una
  visión consistente del sitio hasta que se complete dicha tarea. Cuando eso
  ocurra, el estado pasará a “Deployed”.
* **State**: Enabled indica que la distribución está habilitada.

Una vez finalizado el deploy del sitio en la CDN ya se podrá acceder al mismo a
través del nombre de CloudFront (el campo “Domain Name” explicado arriba) con
HTTP y HTTPS.

## Habilitar el acceso con el dominio propio

Hasta el paso anterior el sitio debería funcionar perfectamente con el DNS
provisto por CloudFront, pero el nombre de dominio definitivo y sus alias aún
resuelven al bucket de S3, lo que significa que, si bien el sitio está online,
no está haciendo uso de la CDN. Para terminar entonces se debe modificar el DNS,
de forma muy similar a como se hizo la asignación en el post anterior.

Para esto, desde la consola Route53 seleccionar la zona correspondiente, tomar
allí el nombre que apunta al bucket de S3 (en el caso del ejemplo,
leoditommaso.io) y apuntarlo a la CDN. Esta tarea es tan simple como borrar el
contenido del campo “Alias Target” y elegir en la lista desplegable la
distribución de CloudFront correspondiente. Al hacerlo, aparecerá el “Domain
Name” visto en el paso anterior. Guardar los cambios.

A partir de ahora el sitio comenzará a servirse a través de CloudFront
(considerar que es posible que el cambio en el DNS demore algunos minutos en
hacerse efectivo).

En el próximo y último post en la serie, explicaré cómo automatizar el deploy
del sitio web usando Github y Travis CI.
