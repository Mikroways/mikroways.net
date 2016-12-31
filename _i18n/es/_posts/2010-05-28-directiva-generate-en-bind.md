---
date: 2010-05-28 09:00:00 -3000
layout: post
title: Directiva $GENERATE en BIND
authors: leandro
categories: servidores
tags: [bind, dns, internet, linux]
permalink: /2010/05/28/directiva-generate-en-bind/

---

BIND tiene una interesante extensión que permite crear múltiples entradas de
forma automática con una única línea. Se trata de la directiva $GENERATE.
<!-- more -->Supongamos que necesitamos crear los siguientes registros para
nuestro DNS reverso:

```
2         IN       PTR        host192-168-0-2.mikroways.net.
3         IN       PTR        host192-168-0-3.mikroways.net.
4         IN       PTR        host192-168-0-4.mikroways.net.
5         IN       PTR        host192-168-0-5.mikroways.net.
6         IN       PTR        host192-168-0-6.mikroways.net.
...
253       IN       PTR        host192-168-0-253.mikroways.net.
254       IN       PTR        host192-168-0-254.mikroways.net.
```

La forma de hacerlo manualmente es escribir cada entrada en el archivo del DNS
reverso de BIND. Con la directiva GENERATE esta tarea es mucho más sencilla de
realizar y simplifica mucho el mantenimiento del DNS. Simplemente basta con
agregar la siguiente línea en lugar de todas las anteriores:

```
$GENERATE 2-254 $  PTR        host192-168-0-$.mikroways.net.
```
