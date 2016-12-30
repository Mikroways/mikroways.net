---
date: 2009-07-20 09:00:00 -3000
layout: post
title: Introducción a OSPF
authors: leandro
categories: redes
tags: [estándares, ospf, protocolos, ruteo]
permalink: /2009/07/20/introduccion-a-ospf/

---

En este post intentaré dar una introducción  muy breve al protocolo OSPF. Iré
dejando unos cuántos links para poder ampliar el tema, aunque probablemente en
un futuro esté escribiendo algo más sobre OSPF. <!-- more -->

## Introducción

OSPF es un protocolo de ruteo dinámico estándar definido en la
[RFC 2328](http://www.rfc-editor.org/rfc/rfc2328.txt) para IPv4 y en la
[RFC 5340](http://www.rfc-editor.org/rfc/rfc5340.txt) para IPv6. Su función (por
ser un protocolo de ruteo) es la de recolectar la información necesaria para
armar las tablas de ruteo. Se lo puede clasificar como
[protocolo de estado de enlace](http://es.wikipedia.org/wiki/Estado_de_enlace)
y, a su vez, dentro del grupo de los [IGP](http://es.wikipedia.org/wiki/IGP)
(Interior Gateway Protocol), dado que está pensado para ser utilizado dentro del
dominio de un sistema autónomo.

## Características básicas de OSPF

* Estándar y de especificación abierta.
* Intra sistema autónomo.
* Converge rápidamente.
* Soporta diseño jerárquico, lo que lo hace muy escalable.
* Envía actualizaciones disparadas y sólo con la información que cambia.
* Se comunica utilizando multicast.
* Soporta autenticación.

## Información utilizada por OSPF

OSPF mantiene tres tablas:

* **Tabla de ruteo:** el objetivo de cualquier protocolo de ruteo, lograr una
tabla que dada una red de destino indique el camino para alcanzarla.
* **Tabla de adyacencias (o de vecinos):** en esta tabla se mantiene la
información sobre los vecinos con los cuáles se realizan intercambios OSPF.
* **Tabla de topología (o base de datos de LSA):** en esta tabla se almacenan
todos los LSA recibidos de toda la red. Los LSA son paquetes OSPF que contienen
información sobre rutas (red y camino para alcanzarla). De esta manera es como
un router OSPF conoce la topología completa de la red. De hecho, utilizando la
tabla de topología es posible dibujar toda la red con los costos de cada enlace.

## Algoritmo OSPF

El algoritmo de OSPF puede resumirse en los siguientes pasos:

1. Lo primero que se necesita es **formar adyacencias** con los vecinos
directamente conectados. Por ello, todos los routers de la red envían paquetes
de saludo por todas sus interfaces. Con esta información, un router OSPF conoce
sus vecinos que será con los que se mantendrá en contacto para enviar la
información de ruteo.
2. Si se tratara de una red multiacceso como Ethernet entonces deberá elegirse
un **router designado (DR)** y un **router resignado de respaldo (BDR)**. El
objetivo es disminuir el tráfico de ruteo intercambiado en la red haciendo que
los routers se comuniquen sólo con el DR y el BDR. En un próximo post explicaré
con más detalle este tema.
3. Una vez establecidas las adyacencias, el siguiente paso es **enviar la
información de ruteo** mediante paquetes LSU (un paquete que uno o más LSA) a
todos los vecinos, lo que provoca una inundación (flooding) de LSU en la red.
4. Terminado el paso anterior, todos los routers tienen la tabla de topología
completa y ya es posible **calcular las rutas más cortas** hacia cada destino,
lo que se hace **ejecutando el
[algoritmo de Dijkstra](http://es.wikipedia.org/wiki/Algoritmo_de_Dijkstra)**
(o algoritmo de SPF). Este es un proceso que ejecuta cada router OSPF por sí
mismo y sin intervención de ningún otro router.
5. En el paso anterior se arma la tabla de ruteo con lo cuál luego del
mismo un router OSPF ya puede comenzar a rutear paquetes. A partir de ahora el
intercambio entre los equipos serán:
   * **Paquetes de saludo**: se envían de forma periódica para mantener las
adyacencias y detectar la caída de un equipo vecino.
   * **Actualizaciones de estado de enlace (LSU)**: enviadas sólo si el estado de
algún enlace cambia.
