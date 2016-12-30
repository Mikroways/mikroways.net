---
date: 2010-05-22 09:00:00 -3000
layout: post
title: Instalación de Lighttpd
authors: leandro
categories: servidores
tags: [lighttpd, web]
permalink: /2010/05/22/instalacion-de-lighttpd/

---

Debido a que recientemente
[instalé Lighttpd en mi servidor con CentOS](/2010/05/21/migrado-a-lighttpd/)
decidí compartir la documentación de lo realizado con los lectores de
NetStorming, dado que quizá pueda servirles. Es muy probable que varias de las
cosas que dejo debajo se puedan hacer de una manera mejor debido a que reitero
que recién estoy conociendo el producto. En tal caso será bienvenido cualquier
comentario y/o consejo.<!-- more -->

## Entorno
Básicamente en el servidor tengo tres blogs con Wordpress y diferentes dominios.
Además, cada dominio tiene en algunos casos más de un nombre que lo identifica.
Los dominios en cuestión son:

* netstorming.com.ar
* mikroways.net
* leandroditommaso.com.ar

## Instalación de Lighttpd

Para instalar Lighttpd en CentOS es necesario tener habilitado el
[repositorio de RPMForge](http://rpmrepo.org/RPMforge/Using). Luego, simplemente
se invoca a yum con los siguientes paquetes:

```
yum install lighttpd.i386 lighttpd-fastcgi.i386 lighttpd-mod_mysql_vhost.i386
```

## Configuración

El archivo de configuración del servidor se encuentra en
/etc/lighttpd/lighttpd.conf. Al principio de dicho archivo se definen los
módulos a habilitar. Por defecto no viene casi ningún módulo habilitado por lo
cuál debemos elegir los que utilizaremos. En mi caso:

```
server.modules = (
                   "mod_rewrite",
                   "mod_redirect",
                   "mod_access",
                   "mod_fastcgi",
                   "mod_simple_vhost",
                   "mod_cgi",
                   "mod_accesslog"
                 )
```

En la configuración anterior se puede ver que se habilitaron los módulos de
FastCGI y CGI. Luego, es necesario descomentar las siguientes líneas para que
funcione.

```
fastcgi.server             = ( ".php" =&gt;
                               ( "localhost" =&gt;
                                 (
                                   "socket" =&gt; "/var/run/lighttpd/php-fastcgi.socket",
                                   "bin-path" =&gt; "/usr/bin/php-cgi"
                                 )
                               )
                            )

cgi.assign                 = ( ".pl"  =&gt; "/usr/bin/perl",
                               ".cgi" =&gt; "/usr/bin/perl" )
```

Ahora bien, para utilizar FastCGI con PHP es necesario crear el directorio donde
se ubicará el socket junto con el archivo del mismo y luego darle los permisos
al usuario que ejecuta Lighttpd, que por defecto es Lighttpd.

```
mkdir /var/run/lighttpd
touch /var/run/lighttpd/php-fastcgi.socket-0
chown -R lighttpd:lighttpd /var/run/lighttpd
```

Luego es necesario definir los diferentes hosts virtuales. En mi caso:

```
$HTTP["host"] == "^www\.mikroways\.(net|com.ar|com)" {
  server.document-root = "/var/www/mikroways/"
  server.name          = "www.mikroways.net"
}

$HTTP["host"] =~ "(leandroditommaso.com.ar|www.leandroditommaso.com.ar|ditommaso.com.ar|www.ditommaso.com.ar)"
{
  server.document-root = "/var/www/leandroditommaso/"
  server.name          = "leandroditommaso.com.ar"
}

$HTTP["host"] =~ "www.netstorming.com.ar" {
  server.document-root = "/var/www/netstorming/"
  server.name          = "www.netstorming.com.ar"
}
```

Como Wordpress ejecutado con Apache se vale de un archivo .htaccess para
realizar algunas reescrituras necesarias para su funcionamiento que no funcionan
con Lighttpd es necesario incluir dichas reescrituras en el lenguaje del
servidor web. Las cláusulas que dejo debajo pueden ponerse una única vez de
forma general o múltiples veces dentro de la configuración de cada host virtual.

```
url.rewrite = (
  "^/(wp-.+).*/?" =&gt; "$0",
  "^/(sitemap.xml)" =&gt; "$0",
  "^/(xmlrpc.php)" =&gt; "$0",
  "^/(.+)/?$" =&gt; "/index.php/$1"
)
```

## Prueba y retoques finales

Para verificar el funcionamiento de lo realizado es necesario reiniciar el
servicio:

```
service lighttpd restart
```

Luego, configurarlo para que arranque al inicio:

```
chkconfig --level 35 lighttpd on
```

## Conclusión

Con lo hecho en este post ya se puede tener un servidor con Lighttpd funcionando
con soporte para PHP, hosts virtuales y el módulo de reescritura. Y todo con muy
pocos y sencillos pasos. En un próximo post, luego de investigar un poco más,
trataré el tema de las redirecciones, mejorando algunas cosas de la
configuración anterior.
