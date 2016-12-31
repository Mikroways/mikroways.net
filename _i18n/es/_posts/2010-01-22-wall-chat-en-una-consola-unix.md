---
date: 2010-01-22 09:00:00 -3000
layout: post
title: "Wall: chat en una consola Unix"
authors: leandro
categories: [ sistemas operativos ]
tags: [comandos, consola, linux, mac, unix]
permalink: /2010/01/22/wall-chat-en-una-consola-unix/

---

Wall es una utilidad estándar de Unix que permite comunicar usuarios de un mismo
sistema vía consola. Es bastante primitivo pero puede sernos de utilidad en más
de una oportunidad. Al enviar un mensaje lo reciben todos los usuarios logueados
que tengan una consola abierta en el sistema. <!-- more -->El mensaje les
aparece en pantalla sobre cualquier cosa que estén viendo, con lo cuál se debe
tener cierta consideración al utilizarlo. A continuación un ejemplo:

Consola del usuario que envía el mensaje

{% highlight bash %}
sh-3.2# wall
esto es un mensaje con wall

Broadcast Message from leandro@scarlet
(/dev/ttys000) at 16:11 BRT...

esto es un mensaje con wall
{% endhighlight %}

Consola del usuario que recibe el mensaje

{% highlight bash %}
Broadcast Message from leandro@scarlet
(/dev/ttys000) at 16:11 BRT... 

esto es un mensaje con wall
{% endhighlight %}
