---
date: 2017-03-08 16:32:00 -3000
layout: post
title: "Sitio web estático en Amazon: Puesta en línea"
authors: leandro
categories: devops
tags: [amazon, aws, s3, cloudfront, travis, route53, github, web, servicios, jekyll, cloud computing]
permalink: /2017/03/08/sitio-web-estatico-en-amazon-puesta-en-linea/
series: sitio-web-estatico-en-amazon

---

En este segundo post de la serie se utilizará [el diseño planteado en el post
anterior](/2017/03/06/sitio-web-estatico-en-amazon-planificacion-y-diseno/),
para poner en funcionamiento el sitio web. Para ello, se harán las
configuraciones necesarias en AWS S3 y AWS Route53.
<!-- more -->

## Crear el sitio web en S3

AWS S3 es un servicio para almacenamiento de archivos que tiene la capacidad de
entregar también, por medio de un servidor web propio, contenido estático.
Aprovechando esa capacidad es que se lo utilizará para poner el sitio en línea.
A continuación se detallan todos los pasos necesarios para lograrlo.

**1) Crear el bucket**

Desde la consola de administración de S3, crear un nuevo bucket; darle nombre y
seleccionar la zona donde se alojará. Dos cosas deben considerarse en este paso:

* El nombre del bucket debe coincidir con el nombre del dominio.
* La selección de la zona determina varias cosas, entre ellas:
  * Delay respecto de los usuarios.
  * Precio de almacenamiento.
  * Zonas donde se alojarán el resto de los servicios.

Otra cosa que se debe tener en cuenta en este paso es que si no se utiliza AWS
Route53, el nombre con que se accederá al sitio web debe ser un subdominio del
dominio principal. Por ejemplo, si se tiene el dominio mikroways.net y no se
utiliza Route53, el sitio web debe tener como nombre cualquier subdominio de
mikroways.net, como www.mikroways.net, pero no podrá utilizar el root (es decir,
el nombre de dominio solo).

Por lo pronto, para este ejemplo, se hará uso de AWS Route53 y se utilizará el
nombre leoditommaso.io como principal, redireccionando cualquier petición a
www.leoditommaso.io a dicho nombre principal.

![Creación del bucket para el sitio
web](/images/blog/static-website-on-amazon_bucket-creation.png)

**2) Habilitar el hosting**

Una vez creado el bucket, se deben editar varias configuraciones. Para ello,
seleccionar el bucket recién creado y dirigirse a la pestaña “Properties”. Allí,
seleccionar “Static website hosting” y marcar la opción “Use this bucket to host
a website”. Se mostrarán dos casilleros para indicar qué documento usar como
index y qué documento mostrar de ocurrir un error. En este caso, completar
solamente el index, introduciendo como valor “index.html”. Luego, guardar los
cambios.

![Habilitar hosting](/images/blog/static-website-on-amazon_enable-static-website-hosting.png)

**3) Configurar la política para el bucket**

Ahora, elegir la pestaña “Permissions” y allí el botón “Bucket Policy”. Escribir
en el editor la política que se muestra debajo, reemplazando leoditommaso.io en
la línea 9 por el nombre del bucket.

{% highlight json linenos %}
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "Allow Public Access to All Objects",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::leoditommaso.io/*"
    }
  ]
}
{% endhighlight %}

**4) Habilitar el logging (opcional, recomendado)**

Para poder acceder a los logs del sitio web, es preciso habilitar dicha
funcionalidad. Para ello, crear primero un nuevo bucket que contendrá los logs.
En este ejemplo, se llama logs.leoditommaso.io y se almacena en la misma región
seleccionada para el bucket del sitio web.

![Crear bucket para almacenar los
logs](/images/blog/static-website-on-amazon_logging-bucket-creation.png)

Luego, volver a seleccionar el bucket del sitio web y desde las propiedades,
seleccionar “Logging” y allí la opción “Enable logging”. En la opción “Target
bucket” seleccionar el creado en el paso anterior y en “Target prefix” elegir el
nombre de la carpeta donde se guardarán los logs; aquí se utiliza “root/”.
Finalmente, guardar los cambios.

![Habilitar logging](/images/blog/static-website-on-amazon_s3-logging.png)

**5) Agregar alias para el sitio web (opcional)**

Como se explicó en el paso 1, el sitio web responde a dos nombres:

* leoditommaso.io: es el nombre principal del sitio web.
* www.leoditommaso.io: es un alias. Todas las peticiones que lleguen aquí serán
  redirigidas a leoditommaso.io.

Para poder hacer lo anterior, es necesario crear un nuevo bucket que redirija
todas las peticiones al principal. Así, entonces, crear un bucket con el nombre
www.leoditommaso.io en la misma región que el principal y luego, dentro
de las propiedades de ese bucket, seleccionar “Static website hosting” y allí
“Redirect requests”. En el casillero “Target bucket or domain” escribir
leoditommaso.io y guardar.

![Redirección del subdominio
www](/images/blog/static-website-on-amazon_www-redirect.png)

**6) Probar el funcionamiento del sitio web**

Con lo anterior, ya se tiene S3 completamente configurado para servir el sitio
web estático. No obstante, aún resta subir el sitio en sí. En este paso,
se creará un archivo llamado index.html con el contenido que se muestra debajo
para probar que todo funcione correctamente.

{% highlight html %}
<html>
  <head>
    <title>Sitio web de prueba</title>
  </head>
  <body>
    <h1>Sitio web de prueba</h1>
  </body>
</html>
{% endhighlight %}

Ahora, desde la consola de Amazon, seleccionar el bucket principal y elegir la
opción “Upload”. Hacer click en “Add files”, buscar el archivo y agregarlo.
Finalmente, hacer click en “Upload”.

Cuando finalice la carga del archivo, seleccionar “Properties” y luego “Static
website hosting”. Hacer click en la URL que aparece como Endpoint y debería
verse el sitio recién creado. Si es así, ya está el sitio funcionando. De lo
contrario, revisar todos los pasos anteriores.

![Probar funcionamiento](/images/blog/static-website-on-amazon_test-website.png)

Ahora ya es posible eliminar el archivo creado y subir el sitio real. Luego, se
puede llevar adelante la misma prueba para verificar que todo funcione.

**7) Asignar el nombre de dominio**

Como se explicó en el primer paso, se utilizará AWS Route53. No es objetivo de
este post explicar cómo delegar la resolución de dominios en Route53, por lo que
se asume que el dominio del sitio ya se maneja con dicho servicio.

Desde la consola de AWS Route53, elegir la zona correspondiente al dominio del
sitio y agregar a ella dos registros: uno para el root del dominio y otro para
el subdominio www.

Para el primer caso, hacer click en “Create Record Set”, dejar en blanco el
campo de “Name” y marcar la opción “Alias Yes”. Esto desplegará debajo una caja
de texto etiquetada como “Alias Target”. Hacer click allí y elegir de la lista
que se despliega el Endpoint de S3.

![DNS para sitio web](/images/blog/static-website-on-amazon_dns.png)

Agregar luego un nuevo registro, completar con *www* el campo “Name”, elegir
“CNAME - Canonical name” en la lista desplegable de “Type” y en “Value” escribir
el nombre de dominio, leoditommaso.io en este caso.

![CNAME para sitio web](/images/blog/static-website-on-amazon_cname.png)

En el próximo post se verá cómo agregar la CDN y SSL al sitio.
