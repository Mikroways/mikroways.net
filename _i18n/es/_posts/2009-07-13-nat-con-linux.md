---
date: 2009-07-13 09:00:00 -3000
layout: post
title: NAT con Linux
authors: leandro
categories: redes
tags: [firewalls, linux, nat, seguridad, servidores]
permalink: /2009/07/13/nat-con-linux/

---

Hacer NAT con Linux es muy simple y no se necesita ninguna herramienta
adicional, sino que el mismo sistema operativo está listo para realizarlo. En
este post vamos a ver cómo hacerlo. <!-- more -->Para ello, se va a utilizar la
siguiente topología de ejemplo:

![Topología de ejemplo](/images/blog/nat_linux.png)

Los pasos a seguir son:

* Indicarle al equipo *router-linux* que actúe como router. Para ello, es
necesario habilitarle el reenvío (forwarding) de paquetes.
* Forzar a que *router-linux* cambie la dirección IP de origen de todos los
paquetes provenientes desde la red privada por su propia dirección IP pública.
Es decir que los paquetes de cualquier máquina de la red 192.168.0.0/24 serán
vistos en internet con la IP 197.3.10.209.

Finalmente, lo anterior se traduce en:

{% highlight bash %}
root@router-linux:~# iptables -P FORWARD ACCEPT
root@router-linux:~# iptables -t nat -A POSTROUTING -s 192.168.0.0 -d 0.0.0.0 -j MASQUERADE
root@router-linux:~# sysctl net.ipv4.ip_forward=1
net.ipv4.ip_forward=1
{% endhighlight %}

Notar que se está aceptando todo en la cadena forward. Si se deseara poner
alguna restricción en el tráfico intercambiado entre las máquinas de la red
interna e internet podrían establecerse las reglas en dicha cadena. Ver los post
[Diseño de un firewall](/2009/06/16/diseno-del-firewall/) y
[Firewall con IPtables](/2009/06/18/firewall-con-iptables/) para más información.
