---
date: 2011-04-26 09:00:00 -3000
layout: post
title: Proxy de un sitio web con Apache
authors: leandro
categories: servidores
tags: [internet, apache, web]
permalink: /2011/04/26/proxy-de-un-sitio-web-con-apache/

---

En Apache existe un módulo llamado mod_proxy que es bastante útil para cumplir
con varias funciones. Una de ellas es la de que un servidor reciba tráfico web
para un sitio que en realidad está hosteado en otro servidor, que será la que
explicaré a continuación.<!-- more -->

Para el ejemplo, vamos a suponer:

* Sitio web www.mikroways.net.
* Por DNS, la IP que corresponde al dominio www.mikroways.net es la IPA, donde hay
un Apache pero no se encuentra el código del sitio de dicho dominio.
* El servidor web para www.mikroways.net tiene la IPB.

El comportamiento básicamente es el siguiente:

1. Un cliente abre una conexión HTTP contra el servidor web en IPA, que según su
DNS es el servidor web www.mikroways.net.
2. El servidor Apache en IPA acepta la conexión para ese dominio pero en el virtual
host correspondiente tiene configurado el mod_proxy que le indica que en
realidad el sitio web está en el servidor con IPB. Entonces, el Apache en IPA
actúa como cliente haciendo el requerimiento del sitio web de www.mikroways.net
a IPB.
3. El servidor IPB le devuelve el sitio tal como lo hace con cualquier cliente y lo
mismo hace el servidor IPA con su cliente.
Notar que el procedimiento anterior es totalmente transparente tanto para el
cliente del servidor IPA como para el propio servidor IPB.

### Configuración

A continuación se muestra la configuración del servidor IPA. Notar que en la
misma, el valor IPB debe ser reemplazado por la IP del servidor donde realmente
se encuentra alojado el sitio web.

```
<VirtualHost *:80>

    ServerName  www.mikroways.net
    ServerAlias mikroways.net
    ServerAdmin invalidaddress@mikroways.net

    ProxyPreserveHost On
    ProxyRequests Off

    <Proxy *>
         Order deny,allow
         Allow from all
    </Proxy>

    ProxyPass               / http://IPB/
    ProxyPassReverse        / http://IPB/

    ErrorLog /var/log/apache2/error.log
    TransferLog /var/log/apache2/access.log

</VirtualHost>
```

Lógicamente debe habilitarse el mod_proxy en Apache y luego reiniciar el
servicio para que los cambios tomen efecto. Lo primero se hace muy simple en
Debian con el comando:

```
a2enmod proxy
a2enmod proxy_http
```
