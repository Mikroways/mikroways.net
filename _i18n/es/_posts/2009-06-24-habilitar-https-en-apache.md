---
date: 2009-06-24 09:00:00 -3000
layout: post
title: Habilitar HTTPS en Apache
authors: leandro
categories: servidores
tags: [apache, linux, openssl, seguridad, ssl]
permalink: /2009/06/24/habilitar-https-en-apache/

---

Para los que siempre olvidan cómo hacerlo o para los que nunca lo hicieron en
este post explico cómo proteger un sitio web utilizando Apache y SSL. <!-- more -->

## Generación de los certificados

Para poder habilitar SSL en Apache es indispensable contar con los certificados
que validarán la autenticidad del servidor. Entonces, el primer paso será
[generar los certificados](/2010/01/04/generar-certificados-ssl/) (escoger el
método de la CA propia).

## Habilitar SSL en Apache

Cargar el módulo de ssl.

{% highlight bash %}
a2enmod ssl
{% endhighlight %}

Hacer que Apache escuche en el puerto 443.

{% highlight bash %}
/etc/apache2/ports.conf

Listen 80
Listen 443
{% endhighlight %}

## Definir un virtual host para SSL

Si bien no es necesario, este paso es recomendado, porque podremos separar los
sitios con HTTP de los que usan HTTPS de forma más ordenada.

Habilitar los virtual hosts en Apache.

{% highlight bash %}
a2enmod vhost_alias
{% endhighlight %}

Definir un virtual host en sites-availables. Aquí supongo que al momento sólo
existe un archivo que se llama default. A dicho archivo, definirle:

{% highlight bash %}
NameVirtualHost *:80
{% endhighlight %}

De esta manera, el default sólo es para los sitios con HTTP. Ahora crear el
archivo /etc/apache2/sites-availables/ssl con el siguiente contenido:

{% highlight bash %}
NameVirtualHost *:443
SSLEngine on
SSLCertificateFile /etc/ssl/ssl/server.crt
SSLCertificateKeyFile /etc/ssl/server.key
DocumentRoot /var/www
ErrorLog /var/log/apache2/error.log
CustomLog /var/log/apache2/access.log
{% endhighlight %}

Habilitar el virtual host.

{% highlight bash %}
a2ensite ssl
{% endhighlight %}

Finalmente, recargar Apache.

{% highlight bash %}
/etc/init.d/apache2 restart
{% endhighlight %}
