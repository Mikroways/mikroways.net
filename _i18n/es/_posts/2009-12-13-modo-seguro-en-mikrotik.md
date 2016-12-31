---
date: 2009-12-13 09:00:00 -3000
layout: post
title: Modo seguro en Mikrotik
authors: leandro
categories: [ redes ] 
tags: [mikrotik, trucos]
permalink: /2009/12/13/modo-seguro-en-mikrotik/

---

Muchas veces es necesario configurar algún parámetro en un equipo Mikrotik de
forma remota. El riesgo de esto es que si cometemos un error, como por ejemplo
una regla de firewall mal aplicada, podemos perder la conexión con el equipo, lo
que supondría tener que ir físicamente al lugar donde está. Esto último no sólo
es incómodo sino que además puede implicar dejar sin servicio a quiénes dependan
del equipo afectado. <!-- more -->

Para evitar esto contamos con el modo seguro de Mikrotik. Para activarlo basta
sólo con apretar en la línea de comandos la combinación de teclas Ctrl+X. Lo
bueno del modo seguro es que el equipo es capaz de detectar si nuestra conexión
de consola dejó de funcionar y, en tal caso, vuelve hacia atrás los cambios,
permitiéndonos seguir administrándolo. Si todo anda bien, luego de cambiar lo
necesario, volvemos a presionar Ctrl+X y las modificaciones se almacenan. Veamos
un ejemplo:

{% highlight bash %}
[leandro@MikroTik] >
[Safe Mode taken]
[leandro@MikroTik] system identity set name=Router
[leandro@Router]
[Safe Mode released]
[leandro@Router] >
{% endhighlight %}
