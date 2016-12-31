---
date: 2010-08-01 09:00:00 -3000
layout: post
title: Nginx + PHP + FastCGI + MySQL + FreeBSD
authors: leandro
categories: servidores
tags: [fastcgi, freebsd, mysql, nginx, php, web]
permalink: /2010/08/01/nginx-php-fastcgi-mysql-freebsd/

---

El objetivo de este post es explicar la configuración mínima para tener
funcionando sobre un sistema FreeBSD 8 un servidor web muy liviano con
[Nginx](http://nginx.org/) y [FastCGI](https://es.wikipedia.org/wiki/FastCGI),
con soporte para PHP y MySQL. <!-- more -->

## Un poco de la arquitectura

Como ya comenté, el servidor web estará basado en un sistema FreeBSD 8 por
diferentes motivos:

* Altamente estable.
* Muy seguro en su configuración por defecto.
* Sistema liviano, sin servicios innecesarios ni paquetes de software que no
sean indispensables para el funcionamiento del sistema.

Además de lo anterior me gustan los sistemas BSD y también trabajar con
diferentes entornos operativos, lo cual también ayudó en la elección.

Para brindar el servicio web el elegido fue Nginx, debido a que es un servidor
web muy liviano y estable, capaz de ofrecer alta performance y con una
configuración muy sencilla. Como se comenta en
[su wiki](http://wiki.nginx.org/Main), Nginx es el motor de alrededor del 6.55%
de los servidores web del mercado, siendo el backend de varios sitios
importantes como Wordpress, Hulu, Ohloh, Git HUB, Source Forge y Torrent Reactor.

Ahora bien, para servir los requerimientos de FastCGI se utilizará
[spawn-fcgi](http://cgit.stbuehler.de/gitosis/spawn-fcgi/about/), que es una
implementación empaquetada del código escrito originalmente para dar soporte a
FastCGI en [Lighttpd](/tag/lighttpd/).

Por su parte, las versiones de MySQL y PHP serán la 5.5 y la 5.3.3
respectivamente, con la primera disponible en los repositorios de FreeBSD. En el
caso de PHP, será necesario compilarlo desde los fuentes.

## Pasos preliminares

Se asume que se cuenta con un sistema FreeBSD 8 instalado y funcionando
correctamente, con los repositorios de paquetes configurados. En el sistema
utilizado para este tutorial los únicos servicios que se ejecutan son sendmail
(viene por defecto con FreeBSD) y SSH, como se puede ver a continuación:

{% highlight bash %}
[root@ ~]# netstat -na -p tcp | grep -i listen
tcp4       0      0 127.0.0.1.25           *.*                    LISTEN
tcp4       0      0 *.22                   *.*                    LISTEN
tcp6       0      0 *.22                   *.*                    LISTEN
{% endhighlight %}

## Instalación del servidor MySQL

Lo primero a instalar será el servidor de bases de datos, dado que es el paso
más simple de realizar. Para ello, se instala y se define que se desea permitir
que el servicio se inicie y que lo haga automáticamente con el sistema. Dicha
acción se define en el archivo /etc/rc.conf. Finalmente se inicia el servicio.

{% highlight bash %}
[root@ ~]# pkg_add -r mysql55-server

[root@ ~]# vi /etc/rc.conf
mysql_enable="YES"

[root@ ~]# /usr/local/etc/rc.d/mysql-server start
{% endhighlight %}

A continuación puede verse que el servicio está efectivamente esperando por
conexiones en el puerto TCP 3306.

{% highlight bash %}
[root@ ~]# netstat -na -p tcp | grep -i listen
tcp4       0      0 127.0.0.1.25           *.*                    LISTEN
tcp4       0      0 *.22                   *.*                    LISTEN
tcp6       0      0 *.22                   *.*                    LISTEN
tcp46      0      0 *.3306                 *.*                    LISTEN
{% endhighlight %}

## Instalación y configuración de Nginx

El servidor nginx está también disponible en los repositorios de paquetes de
FreeBSD, con lo cuál para instalarlo basta con ejecutar lo siguiente:

{% highlight bash %}
[root@ ~]# pkg_add -r nginx
{% endhighlight %}

Ahora bien, si se desea que el servidor sea accesible desde otros lugares es
necesario editar el nombre del mismo desde el archivo de configuración de nginx
y cambiar el nombre localhost por uno válido o por la IP del servidor.

{% highlight bash %}
[root@ ~]# vi /usr/local/etc/nginx/nginx.conf
        server_name  NOMBRE_SERVIDOR;
{% endhighlight %}

Luego, es necesario nuevamente definir el inicio del servicio y arrancarlo.

{% highlight bash %}
[root@ ~]# vi /etc/rc.conf
nginx_enable="YES"

[root@ ~]# /usr/local/etc/rc.d/nginx start
{% endhighlight %}

A continuación puede verse que el servicio está efectivamente esperando por
conexiones en el puerto TCP 80.

{% highlight bash %}
[root@ ~]# netstat -na -p tcp | grep -i listen
tcp4       0      0 *.80                   *.*                    LISTEN
tcp4       0      0 127.0.0.1.25           *.*                    LISTEN
tcp4       0      0 *.22                   *.*                    LISTEN
tcp6       0      0 *.22                   *.*                    LISTEN
tcp46      0      0 *.3306                 *.*                    LISTEN
{% endhighlight %}

## Instalación y configuración de PHP

Como se dijo al principio del post, PHP se instalará desde los fuentes, con lo
cuál será necesario cumplir algunas dependencias y luego realizar la
compilación. En este caso, PHP se compilará con soporte para zlib, gd y mysql.

{% highlight bash %}
[root@ ~]# pkg_add -r gd libXpm
[root@ ~]# cd /usr/rsc
[root@ /usr/src]# wget -c http://ar2.php.net/distributions/php-5.3.3.tar.bz2
[root@ /usr/src]# tar -xvjf php-5.5.5.tar.bz2     
[root@ /usr/src/php-5.3.3]# ./configure --with-zlib --with-gd --with-mysql --with-jpeg-dir=/usr/local/lib --with-png-dir=/usr/local/lib --with-xpm-dir=/usr/local/lib
[root@ /usr/src/php-5.3.3]# make
[root@ /usr/src/php-5.3.3]# make install
{% endhighlight %}

## Configurar el soporte para FastCGI

Este paso es muy simple y consiste en instalar spawn-fcgi, configurar su inicio,
arrancarlo e indicarle a Nginx que los requerimientos PHP los redirija a dicho
servicio. Todo esto se hace como se ve a continuación.

{% highlight bash %}
[root@ ~]# pkg_add -r spawn-fcgi

[root@ ~]# vi /etc/rc.conf
spawn_fcgi_enable="YES"

[root@ ~]# /usr/local/etc/rc.d/spawn-fcgi start
{% endhighlight %}

Luego de iniciado el servicio, se puede ver que el mismo está efectivamente
escuchando en el puerto TCP 9000.

{% highlight bash %}
[root@ ~]# netstat -na -p tcp | grep -i listen
tcp4       0      0 *.80                   *.*                    LISTEN
tcp4       0      0 127.0.0.1.9000         *.*                    LISTEN
tcp4       0      0 127.0.0.1.25           *.*                    LISTEN
tcp4       0      0 *.22                   *.*                    LISTEN
tcp6       0      0 *.22                   *.*                    LISTEN
tcp46      0      0 *.3306                 *.*                    LISTEN
{% endhighlight %}

Ahora sí, finalmente, indicarle a Nginx dos cosas:

* Que considere las páginas index.php como páginas de inicio. Esto se realiza
agregando el valor *index.php* al final de la directiva *index*.
* Que procese los scripts PHP con spawn-fcgi. Ya existe una configuración que
simplemente se debe descomentar para que esto funcione.

{% highlight bash %}
[root@ ~]# vi /usr/local/etc/nginx/nginx.conf

            index  index.html index.htm index.php;

        location ~ \.php$ {
            root           html;
            fastcgi_pass   127.0.0.1:9000;
            fastcgi_index  index.php;
            fastcgi_param  SCRIPT_FILENAME
/usr/local/www/nginx/$fastcgi_script_name;
            include        fastcgi_params;
        }
{% endhighlight %}

Una aclaración es que la variable fastcgi_param debe indicar el path completo al
directorio raíz de nginx, dado que el valor que incluye por defecto no funciona.

## Pasos finales

Si se cumplieron todos los pasos anteriores y no surgió ninguna dificultad ya se
cuenta entonces con la implementación de la arquitectura planteada funcionando
correctamente. Ahora sólo resta publicar los sitios web que se deseen.
