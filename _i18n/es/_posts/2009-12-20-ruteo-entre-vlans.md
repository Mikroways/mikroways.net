---
date: 2009-12-20 09:00:00 -3000
layout: post
title: Ruteo entre VLANs
authors: leandro
categories: redes
tags: [internet, lan, ruteo, switching, vlans]
permalink: /2009/12/20/ruteo-entre-vlans/

---

Para que los hosts de una misma [VLAN](/2010/01/18/introduccion-a-las-vlan/) se
comuniquen entre sí alcanza con tener switches de capa 2 con soporte para VLANs.
No obstante, es altamente probable que deseemos que pueda haber comunicación
entre hosts de diferentes VLANs e, incluso, con Internet. Para esto necesitamos,
lógicamente, algún dispositivo que realice el ruteo. En este post intentaré
resumir brevemente las diferentes alternativas para rutear entre VLANs.
<!-- more -->

Este post será introductorio y luego habrá otros posts que expliquen la
configuración de los casos aquí mencionados.

## Router sin trunk (ruteo tradicional)

![Router sin trunk](/images/blog/routing-vlan.png)

Como se ve en el diagrama, el ruteo sin trunk utiliza una interfaz del router
por cada VLAN. Lo mismo hace con las interfaces del switch. La ventaja de este
esquema es que es muy sencillo de configurar. La desventaja es su ineficiencia
en el uso de los recursos, sumado a que si la cantidad de VLANs a rutear son
muchas podrían no alcanzar las interfaces en el router o switch. La otra gran
desventaja es que cada vez que se quiere agregar una nueva VLAN es necesario
conectar un cable adicional entre el switch y el router.

## Router con trunk (router on-a-stick)

![Router con trunk](/images/blog/routing-vlan-on-a-stick.png)

Voilà! Esto se ve mucho mejor, ¿lo les parece? Con una configuración de router
on-a-stick se optimiza la utilización de recursos, dado que no importa si se
necesitan rutear 2 o 10 VLANs; siempre se necesitará tan sólo una interfaz en el
router y una en el switch. El cableado es más sencillo y prolijo y agregar una
nueva VLANs al ruteo requiere un esfuerzo mínimo. La principal desventaja está
dada, quizá, porque con el esquema anterior cada VLAN tenía el 100% del ancho de
banda con el router para sí misma y en este esquema debe compartirlo. No
obstante, puede solucionarse con un enlace entre el switch y el router de mayor
capacidad que los enlaces entre el switch y el resto de los hosts.

## Switch de capa 3

![Ruteo con switch de capa 3](/images/blog/routing-vlan-swl3.png)

A nivel físico este esquema es idéntico al de router on-a-stick, aunque la
diferencia está dada por el rendimiento y por la implementación. Con respecto a
lo primero, un switch está optimizado para conmutar tramas con lo cuál suele
tener un throughput mayor. En lo que a implementación se refiere, en el caso del
router se usan subinterfaces y con un switch de capa 3 VLANs.
