---
date: 2009-10-03 09:00:00 -3000
layout: post
title: Medir el tiempo que toma ejecutar un comando
authors: leandro
categories: [ sistemas operativos ]
tags: [comandos, consola, linux, mac, trucos, unix]
permalink: /2009/10/03/medir-el-tiempo-que-toma-ejecutar-un-comando/

---

Muchas veces es útil tener una aproximación o incluso el tiempo exacto que le
toma a un comando ejecutarse. Para ello existe el comando time que mide
precisamente este factor. Su funcionamiento es sencillo: chequea el reloj del
sistema antes de ejecutar el comando en cuestión y lo vuelve a chequear ni bien
finaliza. <!-- more -->El resultado: una simple diferencia. En el siguiente
ejemplo vemos que ejecutar el comando du -sh en mi home demora aproximadamente
1 minuto y 22 segundos:

{% highlight bash %}
scarlett:~ leandro$ time du -sh
166G    .

real    1m22.445s
user    0m0.797s
sys     0m13.733s
{% endhighlight %}
