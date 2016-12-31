---
date: 2009-10-11 09:00:00 -3000
layout: post
title: Montar una imagen ISO en Linux
authors: leandro
categories: [ sistemas operativos ] 
tags: [filesystems, linux, trucos, unix]
permalink: /2009/10/11/montar-una-imagen-iso-en-linux/

---

Muchas veces necesitamos acceder al contenido de una imagen ISO que tenemos. La
forma tradicional es grabar un CD, pero en Linux esto no es necesario, ya que,
como se ve a continuación, es posible montar directamente la imagen como
cualquier otro filesystem. <!-- more -->

{% highlight bash %}
sudo mkdir /media/imagen-cd
sudo mkdir mount -o loop imagen-cd.iso /media/imagen-cd
{% endhighlight %}
