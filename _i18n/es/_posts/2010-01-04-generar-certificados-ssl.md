---
date: 2010-01-04 09:00:00 -3000
layout: post
title: Generar certificados SSL
authors: leandro
categories: servidores
tags: [linux, seguridad, openssl]
permalink: /2010/01/04/generar-certificados-ssl/

---

En este post explicaré cómo crear certificados SSL para ser utilizados con el
fin de asegurar servicios como HTTPS, IMAPS, POPS, SMTPS, entre otros. Para ello
será necesario tener instalado OpenSSL en el equipo. La [fuente
original](http://www.tc.umn.edu/~brams006/selfsign.html), en
inglés, puede consultarse en el sitio web de Paul Bramscher's. <!-- more -->

## Descripción de la tarea

A la hora de crear los certificados existen dos posibilidades: crear
certificados autofirmados o crear certificados firmados por una autoridad
certificante (CA). En el segundo caso, es posible acudir a una autoridad
certificante reconocida a nivel internacional o crear una propia.

El método a elegir depende de la política de cada organización. Si existe un
único servidor la primer opción es más sencilla. Si se cuenta con más de un
servidor la segunda opción es la más recomendable. Los motivos los explicaré en
algún post futuro. Lo importante es entender que basta con sólo uno de los dos
métodos.

## Crear un certificado autofirmado

Esta sección explica cómo crear un certificado autofirmado. Si en cambio se
desea crear una CA y firmar los certificados con ella, leer directamente la
próxima sección. Para que los certificados queden ya en el lugar adecuado
dirigirse a la carpeta donde se los guardará. Por convención propia, suelo
guardarlos en /etc/certificados/.

Generar una llave para el servidor:

{% highlight bash %}
openssl genrsa -des3 -out server.key 4096
{% endhighlight %}

Luego crear un requerimiento de firmado del certificado con la misma. Este
comando pedirá una serie de cosas (país, provincia, etc..). Es importante poner
el "Common Name (eg, YOUR name)" el nombre del servidor o, si no lo tuviera, la
IP del mismo.

Los valores por defecto de las preguntas se guardan en /etc/ssl/openssl.cnf. Por
ello, es bueno modificarlos allí si son varios los certificados a crear.

{% highlight bash %}
openssl req -new -key server.key -out server.csr
{% endhighlight %}

Luego firmar el requerimiento de firmado. El ejemplo genera un certificado
firmado válido por 365 días.

{% highlight bash %}
openssl x509 -req -days 365 -in server.csr -signkey server.key -out server.crt
{% endhighlight %}

Ahora crear una versión de server.key que no necesite contraseña.

{% highlight bash %}
openssl rsa -in server.key -out server.key.insecure
mv server.key server.key.secure
mv server.key.insecure server.key
{% endhighlight %}

Como estos archivos son muy sensibles deberían ser bien protegidos. Por ello,
cambiarle los permisos con chmod 000 y chown root:root.

## Generar una propia CA (Autoridad Certificante)

La siguiente sección explica cómo crear una CA y firmar los certificados con
ella. También se incluyen los pasos para crear el certificado para el servidor.

El Common Name (CN) de la CA y del certificado del servidor no deben coincidir o
habrá una colisión de nombres y aparecerán errores más adelante. En el siguiente
paso deben proveerse los datos de la CA y más adelante los del servidor.

{% highlight bash %}
CA:
Common Name (CN): CA-Mikroways
Organization (O): Mikroways
Organizational Unit (OU): Dirección de Informática

Server:
Common Name (CN): www.mikroways.net
Organization (O): Mikroways
Organizational Unit (OU): Dirección de Informática
{% endhighlight %}

Generar el certificado de la CA.

{% highlight bash %}
openssl genrsa -des3 -out ca.key 4096
openssl req -new -x509 -days 365 -key ca.key -out ca.crt
{% endhighlight %}

Generar una llave para el servidor y un requerimiento de firmado (csr).

Al elegir el nombre del servidor "Common Name (eg, YOUR name)" setear con el
nombre que resuelva el dns o, en todo caso, con la IP del equipo.

{% highlight bash %}
openssl genrsa -des3 -out server.key 4096
openssl req -new -key server.key -out server.csr
{% endhighlight %}

Ahora firmar el requerimiento de firmado del certificado (csr) con la CA recién
creada. Notar que se firma por 365 días, al cabo de los cuales hay que volver a
firmarlo. También notar que se setea el serial a 01. Es importante que cada vez
que se haga esto se cambie el serial, para los navegadores que tengan cacheado
el certificado.

{% highlight bash %}
openssl x509 -req -days 365 -in server.csr -CA ca.crt -CAkey ca.key -set_serial 01 -out server.crt
{% endhighlight %}

Para examinar los componentes en caso de que se desee:

{% highlight bash %}
openssl rsa -noout -text -in server.key
openssl req -noout -text -in server.csr
openssl rsa -noout -text -in ca.key
openssl x509 -noout -text -in ca.crt
{% endhighlight %}

Generar una clave que no obligue al servidor a pedir la contraseña.

Aquí creamos una versión insegura de la clave del servidor. La clave insegura se
usará para iniciar el servicio y no requerir la password cada vez que esto
ocurra. Lógicamente, como no pide la password la misma es almacenada lo cual
hace que si alguien tiene acceso al archivo podria desencriptar toda la
transmisión, por lo cual lo mejor es hacer un chown root:root y chmod 000 de los
archivos de claves.

{% highlight bash %}
openssl rsa -in server.key -out server.key.insecure
mv server.key server.key.secure
mv server.key.insecure server.key
{% endhighlight %}

## Archivos obtenidos

Si se siguió el primer camino al momento debería haber 4 archivos:

* server.crt: el certificado autofirmado.
* server.csr: requerimiento de firmado del certificado.
* server.key: la clave privada del servidor que no requiere password.
* server.key.secure: la clave privada del servidor que requiere password.

Si se siguió el segundo camino debería haber dos archivos adicionales:

* ca.crt: el certificado propio de la CA.
* ca.key: la llave que usa la CA para firmar los certificados.

Los archivos de la CA son importantes para firmar nuevos certificados mientras
la misma permanezca vigente.

Ahora sólo resta configurar el servicio para usar SSL con los certificados
recién creados.
