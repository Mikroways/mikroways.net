---
date: 2009-05-29 09:00:00 -3000
layout: post
title: Private VLANs
authors: leandro
categories: redes
tags: [cisco, seguridad, switching, vlans]
permalink: /2009/05/29/private-vlans/

---

Un concepto bastante interesante y ampliamente usado en ambientes donde la
seguridad lo exige es el de private VLAN. Básicamente, se divide una VLAN
primaria en varias VLANs privadas, donde cada puerto de una VLAN privada puede
comunicarse sólo con un único puerto de Uplink y no con los demás puertos. Para
clarificarlo un poco con un ejemplo se muestra el siguiente esquema:

![Topología de ejemplo](/images/blog/private-vlans.png)

<!-- more -->

Lo que se desea lograr es que cada uno de los tres servidores puedan tener
acceso a internet pero no comunicarse directamente entre sí (a nivel de capa 2).
Entonces, lo que se hace es crear una VLAN primaria (VLAN5) en la que están los
tres puertos de los servidores y el puerto que se utilizará de Uplink; se crean
también tres VLAN privadas y se asignan cada una de las VLAN privadas a cada uno
de los tres puertos de los servidores. Así, la única forma de que un servidor se
comunique con los demás sería yendo hasta el router y volviendo por él, quedando
aisalado en capa 2 del resto de los servidores.

La forma tradicional de hacerlo sería poniendo cada servidor en una VLAN
diferente, pero el problema es que podría ocurrir que se necesiten muchos
VLAN-ID pudiendo dar lugar a consecuencias tales como que se agoten los VLAN-ID
posibles y dificultando la administración ya que es necesario mantener más
identificadores y mayor cantidad de redes.

Como contraparte, las VLAN privadas no utilizan un tag como lo hacen las VLAN
primarias entonces la dificultad anterior no existe. En cambio, el aislamiento
lo hace el switch, a nivel de puerto y de forma interna. Además, otra cosa a
tener en cuenta, es que **se utiliza la misma red para todas las VLAN privadas
dentro de una misma VLAN primaria**.

Las aplicaciones de las private VLAN pueden ser, por ejemplo:

* Servicio de housing.
* DMZ con servidores que no se comuniquen entre sí.
* Red de un hotel, donde cada habitación sea una VLAN privada diferente.

Cisco tiene una
[interesante explicación conceptual y de configuración](http://www.cisco.com/en/US/products/hw/switches/ps700/products_tech_note09186a008013565f.shtml)
sobre private VLANs y también puede encontrarse
[la definición en Wikipedia](http://en.wikipedia.org/wiki/Private_VLAN). Me
resultó interesante también otra
[breve explicación en Cisco Press](http://www.ciscopress.com/articles/article.asp?p=29803&amp;seqNum=6)
y un
[artículo en Internetwork Expert's](http://blog.internetworkexpert.com/2008/01/31/understanding-private-vlans/).
Lógicamente, siempre se puede ampliar haciendo alguna búsqueda en Google.
