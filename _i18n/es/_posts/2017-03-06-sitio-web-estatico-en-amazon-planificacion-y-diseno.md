---
date: 2017-03-06 12:00:00 -3000
layout: post
title: "Sitio web estático en Amazon: Planificación y diseño"
authors: leandro
categories: devops
tags: [amazon, aws, s3, cloudfront, travis, route53, github, web, servicios, jekyll, cloud computing]
permalink: /2017/03/06/sitios-web-estatico-en-amazon-planificacion-y-diseno/
series: sitio-web-estatico-en-amazon

---

Este post es el primero de una serie en la que se explicaré cómo alojar un sitio
web estático en Amazon, utilizando SSL y deploy automatizado de cambios. El
resultado será un sitio con una alta performance, disponibilidad y escalabilidad,
a un muy bajo costo. Este blog y el propio sitio de Mikroways utilizan la
metodología que se explica aquí.
<!-- more -->

Para este tutorial utilizaré como ejemplo [mi blog
personal](https://leoditommaso.io), un sitio estático desarrollado con Jekyll.
Cabe aclarar que la metodología aquí explicada puede replicarse para cualquier
otro sitio estático; sólo cambiará la forma de hacer el deploy.

## Arquitectura

En el siguiente diagrama se muestra la arquitectura que tendrá el sitio a
implementar y se listan luego los servicios que intervienen en la arquitectura.

![Arquitectura de sitio web estático en
Amazon](/images/blog/static-website-on-amazon_architecture.png)

Entonces, para montar el sitio web se utilizarán los siguientes servicios:

* **AWS Certificate Manager**: permite generar certificados SSL y gestionar de
  forma desatendida su renovación. El proceso de generación de los certificados
  es extremadamente simple y rápido.
* **AWS CloudFront**: es el servicio de Amazon que dará soporte de CDN para todo
  el contenido del sitio.
* **AWS Route 53**: será utilizado para gestionar los DNS del dominio. Se puede
  usar otro proveedor para este fin, pero se debe tener en cuenta que en ese
  caso habrá algunas restricciones que serán analizadas más adelante.
* **AWS S3**: origen de los datos, aquí será donde efectivamente se almacene el
  sitio web.
* **Github**: el sitio web se versiona usando GIT y está en un repositorio
  público de Github.
* **Travis CI**: se utilizará Travis para forzar el deploy del sitio luego de
  subir el código a Github.

## Estimación de costos

* **AWS Certificate Manager**: servicio completamente gratuito.
* **Github**: gratuito para repositorios públicos, que es el caso de este
  ejemplo.
* **Travis CI**: gratuito para deploy de proyectos open source. Debido a que el
  sitio se aloja en un repositorio público de Github, no se paga por este
  servicio.

Así, los únicos servicios pagos son AWS CloudFront, AWS Route53 y AWS S3. Ahora
bien, para hacer el cálculo, se supone lo siguiente:

* Promedio de tamaño por página servida: 2MB.
* Cantidad de recursos promedio por página: 40.
* Cantidad de visitas por día: 1.000.
* Cantidad de elementos subidos a S3 por día: 300.
* Cantidad de posts nuevos por día: 10.
* Cantidad de zonas de DNS: 1.

Esto da un total por mes de:

* 1.200.000 peticiones GET.
* 9.000 peticiones PUT.
* 59 GB de transferencia.
* 300 invalidaciones de caché.

Además, se estima que de las visitas que recibe el sitio:

* El 10% se producen desde Estados Unidos.
* El 30% desde Europa.
* El 60% desde América del Sur.

Así, el costo aproximado mensual para mantener este sitio es de U$S 14.31. Para
el caso de una cuenta recién abierta, Amazon da una capa de servicios gratuita
por un año, lo que reduce dicho costo a tan sólo U$S 1.36 por mes durante ese
período.

En el próximo post de esta serie explicaré cómo montar el sitio web con S3 y
asignar el DNS correspondiente.
