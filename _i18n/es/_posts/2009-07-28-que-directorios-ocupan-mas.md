---
date: 2009-07-28 09:00:00 -3000
layout: post
title: ¿Qué directorios ocupan más?
authors: leandro
categories: [ sistemas operativos ]
tags: [linux, scripting]
permalink: /2009/07/28/¿que-directorios-ocupan-mas/

---

Algo muy común para un administrador de un sistema operativo es necesitar
conocer qué directorios de su sistema ocupan más espacio. Esto puede ser porque
sea necesario hacer lugar en el disco o para detectar usuarios con mucha
ocupación en el mismo. A raíz de una necesidad semejante surgió un script muy
sencillo que es el siguiente. <!-- more -->

{% highlight bash %}
du -s -m * | sort -g -r | awk '{ if ($1 > 500) print "Tamaño (MB): "$1" - Archivo: "$2}'
{% endhighlight %}

Lo que hace el script anterior es calcular la ocupación en megas de cada archivo
y directorio en el lugar desde donde se ejecuta, ordenar lo anterior de mayor a
menor y luego, para aquellos archivos y directorios que ocupan más de 500MB,
imprimir el tamaño ocupado y el nombre del archivo o directorio en cuestión.

Este tipo de scripts resultan útiles para llevar un control del sistema y pueden
programarse en el cron para que se ejecuten mensualmente y envíen un mail con el
reporte. ¡Qué les sea útil!
