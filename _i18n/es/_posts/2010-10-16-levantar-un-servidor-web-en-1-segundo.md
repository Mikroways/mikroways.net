---
date: 2010-10-16 09:00:00 -3000
layout: post
title: Levantar un servidor web en 1 segundo
authors: leandro
categories: servidores
tags: [linux, python, trucos, web]
permalink: /2010/10/16/levantar-un-servidor-web-en-menos-de-1-segundo/

---

Hoy leí en la columna de Charly Kühnast en Linux Magazine un truco muy simple
para iniciar un servidor web teniendo solamente Python instalado. Las ventajas
son que Python suele incluirse en todas las distribuciones de Linux, que el
servidor se puede ejecutar con cualquier usuario sin privilegios y que el tiempo
que toma iniciarlo es menor al que lleva leer este post. <!-- more -->Ahora
bien, dentro del directorio que se desea publicar por web basta con ejecutar:

{% highlight python %}
python -m SimpleHTTPServer 8080
{% endhighlight %}

Si no se especifica el número de puerto por defecto inicia en el 8000.
