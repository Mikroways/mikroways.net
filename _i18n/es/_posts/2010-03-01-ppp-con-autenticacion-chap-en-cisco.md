---
date: 2010-03-01 09:00:00 -3000
layout: post
title: PPP con autenticación CHAP en Cisco
authors: leandro
categories: redes
tags: [chap, cisco, internet, ppp, protocolos, seguridad, wan]
permalink: /2010/03/01/ppp-con-autenticacion-chap-en-cisco/

---

En este post explicaré cómo utilizar CHAP en PPP para realizar la autenticación.
La configuración la llevaré a cabo con la CLI de Cisco. Recomiendo leer antes el
post que explica el
[proceso de autenticación CHAP](/2009/05/15/autenticacion-chap/) donde se
detalla cómo se lleva a cabo este tipo de autenticación y el que explica cómo
[configurar PPP en un equipo Cisco](/2010/02/28/configuracion-de-ppp-y-pap-en-cisco/),
ya que se continúa con la topología y los comandos descriptos en él. <!-- more -->

## Configuración CHAP

```
LaPlata# configure terminal
LaPlata(config)# username BuenosAires password 1234
LaPlata(config)# interface serial 0/0/0
LaPlata(config-if)# ppp authentication chap

BuenosAires# configure terminal
BuenosAires(config)# username LaPlata password 1234
```

Los comandos anteriores nos dejan ante el siguiente escenario:

* La autenticación es unidireccional, donde LaPlata es el autenticador y
BuenosAires el autenticante.
* El nombre de usuario que se define en un equipo debe coincidir con el hostname
del equipo que autenticará contra él.
* La contraseña debe ser la misma en ambos equipos.

Para lograr una autenticación bidireccional sólo basta con agregar la línea
*ppp authentication chap* a la interfaz serial 0/0/0 en BuenosAires.

```
BuenosAires# configure terminal
BuenosAires(config)# interface serial 0/0/0
BuenosAires(config-if)# ppp authentication chap
```
