---
date: 2010-05-05 09:00:00 -3000
layout: post
title: Redirección de puertos con SSH
authors: leandro
categories: [ sistemas operativos ]
tags: [comandos, consola, linux, mac, ssh, unix]
permalink: /2010/05/05/redireccion-de-puertos-con-ssh/

---

Supongamos que tenemos la siguiente topología:

![Topología de ejemplo](/images/blog/redireccion_ssh.png)

<!-- more -->

* RTB tiene una redirección del puerto 22 hacia la PCB. Esto significa que todas
las conexiones que se hagan al puerto TCP 22 con la IP del router serán enviadas
a la PCB.
* Tanto RTA como RTB están en lugares remotos en Internet. Ambos hacen NAT de
sus redes internas.
* PCB tiene un servidor SSH.
* PCB puede alcanzar al servidor web porque está en la misma LAN.
* SRV es un servidor web.

En este caso, desde la PCA deseamos acceder al servidor web SRV. Con lo único
que contamos es con el acceso vía SSH a la PCB, dado que el servidor SRV tiene
una IP privada y ningún puerto redireccionado. En este caso SSH nos da la
posibilidad de redireccionar el puerto 80 del servidor por medio de la PCB,
permitiéndonos acceder efectivamente al mismo. Esto se logra por medio de SSH
haciendo un redirección local de puertos, de la siguiente manera:

{% highlight bash %}
ssh -L 10080:192.168.2.3:80 leandro@200.200.200.200
{% endhighlight %}

Para entender bien lo que ocurre sigamos los pasos:

* La PCB puede acceder normalmente al servidor web en SRV, sin ninguna
restricción.
* La PCA tiene acceso SSH a la PCB.
* La PCA forma un túnel hacia el SRV utilizando la PCB.
* Luego de la redirección, la PCA puede acceder localmente al puerto 10080 que
en realidad es uno de los extremos del túnel. El otro extremo es el puerto 80 en
SRV.

Para hacer uso de la redirección se abre un navegador de Internet en PCA y se
escribe http://127.0.0.1:10080, lo que hará que las peticiones lleguen hasta
SRV, como si estuviéramos en esa red LAN.
