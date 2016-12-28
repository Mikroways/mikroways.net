---
date: 2009-10-09 09:00:00 -3000
layout: post
title: Sistema autónomo
authors: leandro
categories: redes
tags: [ruteo]
permalink: /2009/10/09/sistema-autonomo/

---

El concepto de [sistema autónomo](http://es.wikipedia.org/wiki/Sistema_autónomo),
definido en la página 3 de la [RFC 1771](http://www.ietf.org/rfc/rfc1771.txt),
hace referencia a un conjunto de routers bajo la administración de una misma
organización (o varias) con una política de ruteo definida. <!-- more -->Se
utiliza un mismo
[IGP (Interior Gateway Protocol)](http://es.wikipedia.org/wiki/Interior_Gateway_Protocol)
para el ruteo dentro del sistema autónomo y un protocolo intra-sistema autónomo
para el ruteo en Internet, siendo BGP el protocolo estándar en este último
aspecto.

Como dije antes, lo habitual es que un sistema autónomo utilice el mismo IGP y
las mismas métricas para sus rutas dentro de su dominio, aunque bien podrían
utilizarse varios IGP o métricas diferentes, según la política de la
organización. No obstante y en cualquier caso, un sistema autónomo es visto por
organizaciones ajenas a él como una unidad con un plan de ruteo interior
uniforme y coherente, con rutas que muestren claramente los lugares que pueden
alcanzarse por medio del mismo.

Los números de sistema autónomo son asignados por las [RIR (Regional Internet
Registries)](https://www.arin.net/knowledge/rirs.html) y se necesitan una serie
de requisitos para obtener uno. Entre ellos se pide que la organización tenga al
menos dos enlaces de proveedores independientes, que cuente con un
direccionamiento IP con un prefijo /24 o más pequeño, entre otros. Luego, el
número de sistema autónomo será utilizado en Internet por BGP para definir el
camino para llegar a las redes que pertenezcan a dicho AS.

Existe como fuente adicional de información una BCP (Best Current Practices)
definida en la [RFC 1930](http://www.ietf.org/rfc/rfc1930.txt) que define una
guía para la creación, selección y registro de un sistema autónomo.
