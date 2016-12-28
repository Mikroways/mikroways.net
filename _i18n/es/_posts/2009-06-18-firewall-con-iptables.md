---
date: 2009-06-18 09:00:00 -3000
layout: post
title: Firewall con IPtables
authors: leandro
categories: redes
tags: [firewalls, iptables, linux, seguridad, servidores]
permalink: /2009/06/18/firewall-con-iptables/

---

En el post titulado [Diseño de un firewall](/2009/06/16/diseno-del-firewall/)
expliqué los conceptos básicos de un firewall y con un ejemplo presenté una
aproximación en pseudocódigo de cómo implementarlo. En este la intención es
explicar básicamente el funcionamiento de [IPtables](http://www.netfilter.org/) 
y luego traducir el pseudocódigo a reglas del mismo. <!-- more -->

IPtables es un software muy poderoso que permite, entre otras cosas, realizar
filtrado de paquetes, hacer NAT y loguear determinado tipo de tráfico. Está
construido sobre la base de [Netfilter](http://es.wikipedia.org/wiki/Netfilter)
que reside en el núcleo de Linux y es quién provee las herramientas para que
IPtables pueda realizar su trabajo.

Para poder trabajar con los paquetes, IPtables se divide en varias tablas,
dentro de las cuáles existen diferentes cadenas. En este post pretendo trabajar
sólo con la **tabla filter** y con las **cadenas input**, **output** y
**forward**. El siguiente diagrama muestra la división completa de IPtables y
**es importante entenderlo** y saberlo (o al menos tenerlo a mano) para armar
nuestras propias reglas y encontrar y solucionar problemas:

![Arquitectura de IPtables](/images/blog/iptables.gif)

Dentro de la tabla filter tenemos entonces las siguientes tres cadenas:

* **Input:** aquí se clasifican los paquetes entrantes destinados al equipo
local.
* **Output:** aquí se clasifican los paquetes salientes originados en el equipo
local.
* **Forward:** aquí se clasifican los paquetes que pasan por el equipo pero cuyo
origen y destino son hosts diferentes al equipo local.

Situándonos en la posición del firewall, las cadenas input y output protegen el
tráfico que entra y sale del mismo; en cambio, la cadena forward es la
responsable de custodiar el tráfico de los servidores.

Vamos a intentar traducir lo visto en el post anterior a reglas de IPtables.
Como las pseudoreglas que se pusieron no filtran contenido para el firewall en
sí no utilizaremos en principio las cadenas input ni output, sólo la forward.
Así quedaría:

{% highlight iptables %}
iptables -P FORWARD DROP
iptables -A FORWARD -m state --state RELATED,ESTABLISHED -j ACCEPT
iptables -A FORWARD -p icmp -j ACCEPT
iptables -A FORWARD -p tcp --sport 20 -s 172.25.10.2 -d 172.25.11.0/24 -j ACCEPT
iptables -A FORWARD -s 172.25.11.0/24 -d 172.25.10.2 -p tcp --dport 21 -j ACCEPT
iptables -A FORWARD -s 172.25.11.2 -d 172.25.10.2 -p tcp --dport 22 -j ACCEPT
iptables -A FORWARD -s 172.25.11.2 -d 172.25.10.3 -p tcp --dport 22 -j ACCEPT
iptables -A FORWARD -s 172.25.11.2 -d 172.25.10.4 -p tcp --dport 22 -j ACCEPT
iptables -A FORWARD -d 172.25.10.4 -p tcp --dport 25 -j ACCEPT
iptables -A FORWARD -s 172.25.10.4 -p tcp --dport 25 -j ACCEPT
iptables -A FORWARD -d 172.25.10.3 -p tcp --dport 53 -j ACCEPT
iptables -A FORWARD -d 172.25.10.3 -p udp --dport 53 -j ACCEPT
iptables -A FORWARD -s 172.25.10.3 -p tcp --dport 53 -j ACCEPT
iptables -A FORWARD -s 172.25.10.3 -p udp --dport 53 -j ACCEPT
iptables -A FORWARD -d 172.25.10.2 -p tcp --dport 80 -j ACCEPT
iptables -A FORWARD -d 172.25.10.4 -p tcp --dport 110 -j ACCEPT
iptables -A FORWARD -d 172.25.10.4 -p tcp --dport 143 -j ACCEPT
iptables -A FORWARD -d 172.25.10.2 -p tcp --dport 443 -j ACCEPT
{% endhighlight %}

Con las reglas anteriores, nuestro firewall con IPtables estaría dando seguridad
a nuestros servidores desde cualquier host en internet. No obstante, **cada
servidor debería tener su propio firewall**, dado que si fuera comprometido uno
de los servidores el resto quedarían expuestos.

Veremos entonces cómo sería el **firewall del servidor de DNS**. El
relevamiento ya lo conocemos, así que sólo escribiremos las reglas. Una cosa a
tener en cuenta es que el tráfico que salga y entre desde y hacia el servidor
debería ser propio de él y no para un equipo diferente, con lo cuál la cadena
forward no debería permitir ningún tipo de tráfico. Ahora sí, las reglas:


{% highlight iptables %}
## Definición de políticas
iptables -P INPUT DROP
iptables -P OUTPUT DROP
iptables -P FORWARD DROP

# Permitir el tráfico generado localmente
iptables -A INPUT -i lo -j ACCEPT
iptables -A OUTPUT -o lo -j ACCEPT

# Permitir conexiones establecidas y relacionadas
iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT
iptables -A OUTPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

# Permitir el ping hacia el equipo
iptables -A INPUT -p icmp -j ACCEPT

# Excepciones para la cadena INPUT
iptables -A INPUT -s 172.25.11.2 -p tcp --dport 22 -j ACCEPT
iptables -A INPUT -p tcp --dport 53 -j ACCEPT
iptables -A INPUT -p udp --dport 53 -j ACCEPT

# Excepciones para la cadena OUTPUT
iptables -A OUTPUT -p tcp --dport 53 -j ACCEPT
iptables -A OUTPUT -p udp --dport 53 -j ACCEPT
{% endhighlight %}

Con lo visto ya es posible contar con un panorama general del uso de IPtables.
Ahora es cuestión de empezar a experimentar un poco y quizá lograr cosas más
avanzadas.
