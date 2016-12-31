---
date: 2009-11-23 09:00:00 -3000
layout: post
title: "Comandos de Unix: apropos"
authors: leandro
categories: [ sistemas operativos ]
tags: [comandos, consola, linux, mac, unix]
permalink: /2009/11/23/comandos-de-unix-apropos/

---

Es muy común olvidar el nombre de una aplicación o un comando en Unix, sobre
todo si no lo usamos frecuentemente. El comando apropos, estándar en Unix, nos
permite encontrar aquellos programas que coincidan con la cadena de caracteres
que le pasamos como argumentos. <!-- more -->En realidad, lo que hace el
mencionado comando es buscar en las páginas de los manuales aquellas
aplicaciones que coincidan con nuestra búsqueda y las lista en pantalla. Por
ejemplo, deseo buscar los programas que contengan web browser en su descripción:

{% highlight bash %}
leandro@megan:~$ apropos "web browser"
google-chrome (1) - the web browser from Google
w3m (1) - a text based Web browser and pager
www-browser (1) - a text based Web browser and pager
{% endhighlight %}
