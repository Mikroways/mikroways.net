---
date: 2010-07-31 09:00:00 -3000
layout: post
title: Configuración estática de red en FreeBSD
authors: leandro
categories: [ sistemas operativos ]
tags: [freebsd, internet, redes]
permalink: /2010/07/31/configuracion-estatica-de-red-en-freebsd/

---

Configurar una IP estática, puerta de enlace y DNS en FreeBSD es muy sencillo y
se hace de la siguiente manera. Suponemos para el ejemplo los siguientes datos:
<!-- more -->

* La interfaz a la que le asignaremos la IP estática se identifica como *em0*.
* La IP que deseamos asignar es *192.168.40.2/24*.
* La puerta de enlace es *192.168.40.1*.
* El servidor de DNS es la *192.168.40.10*.

Ahora bien, para configurar entonces la IP de manera estática, editar el archivo
/etc/rc.conf e incluir la siguiente información:

```
ifconfig_em0="inet 192.168.40.2 netmask 255.255.255.0"
defaultrouter="192.168.40.1"
```

Por su parte, los servidores de nombres se definen en el archivo
/etc/resov.conf, con el siguiente contenido:

```
nameserver 192.168.40.10
```
