---
date: 2017-03-22 15:03:00 -3000
layout: post
title: "Sitio web estático en Amazon: Automatizar el deploy"
authors: leandro
categories: devops
tags: [amazon, aws, s3, cloudfront, travis, route53, github, web, servicios, jekyll, cloud computing]
permalink: /2017/03/22/sitio-web-estatico-en-amazon-automatizar-el-deploy/
series: sitio-web-estatico-en-amazon

---

En el último post de esta serie explicaré cómo articular el uso de Github y
Travis CI para que cuando se suban cambios en los fuentes del sitio el mismo se
despliegue automáticamente en S3 e invalide la caché de CloudFront.
<!-- more -->

Como se vio en el [primer post de esta
serie](/2017/03/06/sitio-web-estatico-en-amazon-planificacion-y-diseno/), el
sitio web se almacena en un repositorio (público) en Github y su despliegue se
realiza con Travis CI. Esta plataforma es gratuita si el repositorio de origen
es público.

## Integración entre Github y Travis CI

Para empezar, ingresar con un navegador al sitio web de [Travis
CI](https://travis-ci.org) y allí seleccionar “Sign In with Github”. Autorizar a
la aplicación y se tendrán Github y Travis integrados.

## Configurar el deploy automatizado

Los pasos a seguir para poder realizar el deploy de forma automática son los
siguientes:

1. Crear un nuevo usuario en Amazon IAM que tenga permisos para actualizar los
   buckets de S3 e invalidar la caché de CloudFront.
2. Habilitar en Travis el repositorio del sitio web.
3. Configurar para el build de Travis las variables de entorno correspondientes.
4. Definir en el archivo .travis.yml todos los pasos a llevar adelante para
    hacer efectivo el build y desplegar el sitio web.

### Crear usuario en IAM

AWS IAM (Identity and Access Management) permite crear usuarios y darles
diferentes niveles de autorización sobre los recursos en Amazon. El objetivo de
crear un usuario diferente para hacer los deploys es darle los permisos
necesarios para hacer esa tarea y nada más, minimizando el impacto que pudiera
haber en caso de algún problema.

Para crear el usuario ingresar entonces en IAM y seguir los siguientes pasos:

* Hacer click en “Users” y luego en “Add user”.
* En “User name” escribir website-deployment y en “Access type” elegir
  “Programmatic access”. Luego, hacer click en “Permissions”.
* Seleccionar “Attach existing policies directly” y en el buscador:
  * Escribir “S3” y marcar la casilla de verificación de “AmazonS3FullAccess”.
  * Escribir “front” y marcar la casilla de verificación de “CloudFrontFullAccess”.
  * Luego, hacer click en “Review”.
* En el paso final, elegir “Create user”.

En la pantalla que se muestra a continuación hay dos datos muy importantes que
se deben anotar que son “Access key ID” y “Secret access key”. El primero puede
verse luego, pero el segundo ya no volverá a mostrarse, con lo cuál es este el
momento para tomar nota. Tener en cuenta que dichos datos deben mantenerse
privados, ya que son los que dan acceso a la cuenta del usuario.

### Habilitar Travis en el repositorio del sitio

Ingresando a Travis CI se puede leer a la izquierda de la pantalla el texto “My
Repositories” y un signo “+” que está al lado. Hacer click en el signo; esto
llevará a una nueva pantalla con el listado de repositorios de la cuenta de
Github asociada. Buscar el repositorio del sitio web y hacer click sobre la
equis que aparece al lado del nombre de dicho repositorio; debería transformarse
en un tilde, como se ve en la imagen debajo.

![Habilitar repositorio del sitio
web](/images/blog/static-website-on-amazon_enable-github-repo-in-travis.png)

Luego, hacer click en la ruedita que se ve allí mismo para configurar las
variables de entorno a utilizar para el build.

### Configurar las variables de entorno

Se necesitarán cuatro valores para la configuración en este punto:

* **Zona de AWS**: es la zona donde se tienen los recursos. Si se siguió este
  tutorial, será us-east-1.
* **Access Key ID**: el key ID del usuario creado en el primer paso.
* **Secret Access Key**: el secret del usuario creado en el primer paso.
* **CloudFront Distribution ID**: este es el ID de la distribución de
  CloudFront. Se puede obtener accediendo a la interfaz de gestión de dicho
  servicio; es el valor en la columna ID.

Con los valores anteriores, desde la configuración del repositorio en Travis,
crear las cuatro variables de entorno que se detallan a continuación, con los
valores correspondientes. La zona de AWS puede configurarse con la opción
“Display value in build log” seleccionada, los otros tres valores se recomienda
especialmente que no se muestren para preservar la seguridad.

* AWS_ACCESS_KEY_ID
* AWS_REGION
* AWS_SECRET_ACCESS_KEY
* CLOUDFRONT_DISTRIBUTION_ID

En la imagen se puede ver un ejemplo de cómo debería verse la pantalla luego de
creadas las variables de entorno.

![Configuración de las variables de 
entorno](/images/blog/static-website-on-amazon_environment-variables-in-travis.png)

### Archivo de configuración de Travis

Travis, cuando reciba la notificación que avise de un cambio en el repositorio,
buscará el archivo .travis.yml que le indicará los pasos a llevar adelante. Por
tal motivo, agregar en el root del repositorio un archivo con el nombre indicado
y el siguiente contenido:

{% highlight yaml %}
language: ruby
cache: bundler
rvm:
- 2.3.1
branches:
  only:
  - master
before_install:
- sudo apt-get -qq update
- sudo pip install awscli
script:
- bundle exec jekyll build
deploy:
  provider: s3
  skip_cleanup: true
  access_key_id: $AWS_ACCESS_KEY_ID
  secret_access_key: $AWS_SECRET_ACCESS_KEY
  region: $AWS_REGION
  bucket: leoditommaso.io
  local_dir: _site
  acl: public_read
after_deploy:
- aws configure set preview.cloudfront true
- aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_DISTRIBUTION_ID --paths "/*"
{% endhighlight %}

El archivo anterior configura Travis para ejecutar todos los pasos necesarios
para generar el sitio estático basado en los fuentes de Jekyll. En síntesis, lo
que se le indica a Travis es lo siguiente:

* Ejecutar los pasos sólo para los commits recibidos en master.
* Instalar la CLI de AWS como dependencia antes de iniciar cualquier
  procesamiento (será necesaria para dialogar con CloudFront).
* Ejecutar bundle exec jekyll build, que en base a los fuentes del repositorio,
  generará los archivos estáticos y los guardará en el directorio _site.
* Usar S3 para hacer el deploy, tomando los datos necesarios de las variables
  de entorno configuradas en el paso anterior. Notar la presencia de la opción
  *skip_cleanup* que indica a Travis que no borre el directorio generado por
  Jekyll antes de ejecutar este paso. Si esta opción no estuviera, Travis
  borraría el directorio _site y nada se subiría entonces a S3.
* También se le indica el bucket donde subir los archivos y el directorio local
  (de Travis) donde se ubican los mismos. De más está decir, que el nombre del
  bucket deberá corresponderse con el nombre del que aloja el sitio web.
* Con la ACL se configuran los archivos con permisos de lectura para todos.
* Las últimas dos líneas, en la sección *after_deploy*, generan una solicitud de
  invalidación de caché a CloudFront, de manera de indicarle a la CDN que los
  archivos que tiene en su caché ya no son válidos y, por lo tanto, debe obtener
  las nuevas versiones de los mismos antes de entregarlos a los usuarios. Tener
  en cuenta que este es un proceso que puede llevar unos minutos y puede verse
  el estado del mismo desde la consola de CloudFront, seleccionando la
  distribución correspondiente y eligiendo la pestaña “Invalidations”.

Como se explicó, esta configuración genera los archivos estáticos de un sitio
desarrollado con Jekyll, aunque adaptarlo a un caso diferente no debería ser
difícil. Probablemente sea necesario modificar la variable *local_dir*, el
script a ejecutar (si hubiera) y quizá instalar algún paquete previo, en el
*before_install*.

## Testear el funcionamiento

Una vez completado lo anterior, sólo queda verificar que funcione. Para hacerlo,
hacer un commit del archivo .travis.yml y luego un push a master. Esto deberá
disparar una tarea en Travis que podrá verse desde la interfaz de dicho
servicio. Se mostrará en amarillo mientras esté en espera de ser iniciada o
cuando se esté ejecutando, en rojo si falla y en verde si todo anduvo bien. En
este último caso, también debería actualizarse el sitio en S3 y generarse una
invalidación de CloudFront.

Si algo no funcionara, pueden consultarse los logs de la ejecución del build en
la propia página de Travis, así como la historia de los builds anteriores.

## El fin

Con esto se cierra la serie de posts relacionadas a la puesta en funcionamiento
de un sitio web estático en Amazon. Gracias por tomarse el tiempo de leer hasta
este punto y espero que haber sido claro y que lo visto resulte útil.

Serán bienvenidos los comentarios con correcciones, ideas o cualquier otro
aporte. ¡Hasta la próxima!
