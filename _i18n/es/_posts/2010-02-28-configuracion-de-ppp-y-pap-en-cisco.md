---
date: 2010-02-28 09:00:00 -3000
layout: post
title: Configuración de PPP y PAP en Cisco
authors: leandro
categories: redes
tags: [cisco, internet, pap, ppp, protocolos, seguridad, wan]
permalink: /2010/02/28/configuracion-de-ppp-y-pap-en-cisco/

---

Uno de los protocolos de WAN más utilizados en la actualidad es PPP por ser un
estándar abierto y porque tiene muchas características avanzadas que lo
convierten en un protocolo muy interesante. En este post explicaré cómo
configurarlo en un router Cisco sin autenticación y luego agregándole
autenticación PAP en un sentido y en dos sentidos. <!-- more -->

Para ello utilizaré una topología extremadamente simple, con dos routers
conectados directamente a través de un enlace serial.

**NOTA**: si intentan hacerlo en el Packet Tracer o en un laboratorio deberán
tener en cuenta que uno de los equipos (el que tenga el extremo DCE) debe tener
configurado su clock rate. Puede consultarse un post anterior que explica la
[configuración básica de un router Cisco](/2009/07/15/configuracion-basica-de-un-router/).

## Configuración de PPP

```
LaPlata# configure terminal
LaPlata(config)# interface serial 0/0/0
LaPlata(config-if)# ip address 192.168.1.1 255.255.255.252
LaPlata(config-if)# encapsulation ppp
LaPlata(config-if)# no shutdown

BuenosAires# configure terminal
BuenosAires(config)# interface serial 0/0/0
BuenosAires(config-if)# ip address 192.168.1.2 255.255.255.252
BuenosAires(config-if)# encapsulation ppp
BuenosAires(config-if)# no shutdown
```

Como ven, configurar PPP en un router Cisco es extremadamente sencillo. De
hecho, sólo es necesario cambiar la encapsulación de HDLC (encapsulación que
dichos equipos traen por defecto) por PPP. Resulta apenas más difícil agregar
autenticación con PAP a este enlace.

## Autenticación con PAP

En este caso es necesario tener en cuenta que PAP acepta dos casos:

* **Unidireccional**: un equipo autentica al otro y con eso se
establece el enlace. En este caso, uno de los dos routers envía su usuario y
contraseña y el otro espera recibirlo. Este último verifica los datos recibidos
con los que espera: si coinciden se establece el enlace, de lo contrario se lo
rechaza.
* **Bidireccional**: es simplemente realizar dos autenticaciones
unidireccionales, una para cada equipo.

A continuación se muestra cómo configurar PPP con autenticación PAP
unidireccional, siendo LaPlata el autenticador. Se asume que PPP ya está
configurado, tal como se mostró en la sección anterior.

```
LaPlata# configure terminal
LaPlata(config)# username BSAS password 1234
LaPlata(config)# interface serial 0/0/0
LaPlata(config-if)# ppp authentication pap

BuenosAires# configure terminal
BuenosAires(config)# interface serial 0/0/0
BuenosAires(config-if)# ppp pap sent-username BSAS password 1234
```

Ahora bien, configurar la autenticación bidireccional es trivial. Sólo es
necesario indicarle ahora a BuenosAires que requiere autenticación PAP y el
nombre de usuario y contraseña que utilizará el otro extremo; de la misma
manera, se le debe indicar a LaPlata el nombre de usuario y contraseña que tiene
que enviar.

```
BuenosAires# configure terminal
BuenosAires(config)# username LaPlata password 3456
BuenosAires(config)# interface serial 0/0/0
BuenosAires(config-if)# ppp authentication pap

LaPlata# configure terminal
LaPlata(config)# interface serial 0/0/0
LaPlata(config-if)# ppp pap sent-username LaPlata password 3456
```

## Resumen

Con lo visto se puede configurar PPP con autenticación PAP unidireccional y
bidireccional en equipos Cisco. En un próximo post explicaré cómo realizar la
autenticación con CHAP.
