---
date: 2010-11-11 09:00:00 -3000
layout: post
title: Crear una ISO a partir de un CD
authors: leandro
categories: [ sistemas operativos ]
tags: [bash, comandos, consola, linux, unix]
permalink: /2010/11/11/crear-una-iso-a-partir-de-un-cd/

---

Linux tiene varias maravillas que lo hacen realmente simple y potente. Una de
ellas es el comando *dd*, que permite hacer varias cosas, entre las que
puede considerarse la de crear una ISO. Esto se hace de manera muy sencilla:
<!-- more -->

```
dd if=/dev/cdrom of=nombre_imagen.iso
```

En el ejemplo anterior se toma como origen el dispositivo de CD (que puede
variar según la distribución) y se genera el archivo *nombre_imagen.iso*.
Que hay utilidades gráficas más "amigables" no lo niego, pero hay que reconocer
que dd es la más ampliamente distribuida y nadie puede decir que no es capaz de
ejecutar el comando anterior.
