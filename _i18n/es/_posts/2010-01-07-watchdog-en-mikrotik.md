---
date: 2010-01-17 09:00:00 -3000
layout: post
title: Watchdog en Mikrotik
authors: leandro
categories: redes
tags: [mikrotik, trucos]
permalink: /2010/01/17/watchdog-en-mikrotik/

---

Suele ocurrir que en determinadas circunstancias un enlace deja de funcionar y
su causa es algún problema en uno de los equipos. Muchas veces, en estos casos,
el problema se soluciona simplemente reiniciando los mismos. Para ello, Mikrotik
tiene una utilidad que realiza este trabajo automáticamente y nos permite enviar
un email si ha tenido que hacerlo. <!-- more -->

En el siguiente ejemplo se ve cómo se configura el watchdog para que el equipo
se reinicie en una de dos situaciones: si sufre un kernel panic y si una
determinada IP deja de ser alcanzable.

```
[admin@MikroTik] > system watchdog set watch-address=192.168.1.2
reboot-on-failure=yes
```
