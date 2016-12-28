---
date: 2010-06-15 09:00:00 -3000
layout: post
title: Apagar el monitor de forma remota 
authors: leandro
categories: [ sistemas operativos ]
tags: [linux, trucos]
permalink: /2010/06/15/apagar-el-monitor-de-forma-remota/

---

Este post surge como respuesta a una necesidad de máxima prioridad en mis
momentos de ocio. Resulta que me gusta ver películas acostado, reproduciéndolas
en la compu de escritorio y manejando la reproducción desde la notebook por SSH.
Eso es muy sencillo utilizando mplayer vía línea de comandos. <!-- more -->

No obstante, me resultaba muy poco práctico que luego de finalizada la película,
momento ideal para cerrar los ojos y dormir, tuviera que levantarme a apagar el
monitor. Sé que a muchos de los lectores les debe ocurrir lo mismo, por eso
quiero compartir con ustedes esto que encontré que nos libera de la molestia de
hacer un par de pasos para apretar el botón del monitor.

```
xset dpms force off
```

El comando anterior apaga efectivamente el monitor. No obstante no sirve para
utilizarlo por SSH, dado que no conoce el display en cuestión. Para ello, basta
sólo con indicarle cuál es el display, que por defecto sería :0. Entonces el
comando anterior se transformaría en lo siguiente:

```
xset dpms force off -display :0
```
