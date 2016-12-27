---
date: 2011-05-03 09:00:00 -3000
layout: post
title: Proxy transparente para control de acceso con Mikrotik
authors: leandro
categories: redes
tags: [internet, mikrotik, proxy, seguridad]
permalink: /2011/05/03/proxy-transparente-para-control-de-acceso-con-mikrotik/

---

Configurar un proxy transparente con Mikrotik para realizar control de acceso es
extremadamente simple. La primer acción a tomar es habilitar el servicio en el
equipo e inmediatamente restringir el acceso al puerto donde se ejecuta el proxy,
para evitar que el equipo sea utilizado por usuarios no autorizados.
<!-- more -->El paso siguiente es crear una regla de NAT que redirija todo el
tráfico destinado al puerto 80 al puerto donde esté escuchando el proxy. Esta
regla es precisamente la que hace que el proxy sea transparente.

```
[admin@MikroTik] > ip proxy set enabled=yes port=8080
[admin@MikroTik] > ip firewall filter add chain=input action=accept protocol=tcp
dst-port=8080 src-address=192.168.1.0/24 comment="Proxy para LAN"
[admin@MikroTik] > ip firewall nat add in-interface=LAN dst-port=80 protocol=tcp
action=redirect to-ports=8080 chain=dstnat
```

Finalmente, se deben escribir las reglas para restringir los sitios que se
desee. En este caso se permiten todos los sitios con excepción de los que están
explícitamente denegados, que son Facebook y Twitter.

```
[admin@MikroTik] > ip proxy access add dst-host=www.facebook.com action=deny
[admin@MikroTik] > ip proxy access add dst-host=twitter.com action=deny
```
