---
date: 2009-08-12 09:00:00 -3000
layout: post
title: Ejecutar aplicaciones gráficas de otra máquina con SSH
authors: leandro
categories: [ sistemas operativos ]
tags: [linux, mac, ssh, trucos, unix]
permalink: /2009/08/12/ejecutar-aplicaciones-graficas-de-otra-maquina-con-ssh/

---

Algo a veces muy útil es ejecutar una aplicación gráfica de otra computadora
como si estuviera en la propia máquina en la que se está trabajando. Hacer esto
es muy simple con SSH y consiste básicamente en reenviar las solicitudes que se
hagan al servidor X por medio del túnel SSH. ¿Cómo? <!-- more -->Con los
siguientes dos comandos se ejecuta el software Dia, que está instalado en
test-ubuntu, en la máquina scarlett:

{% highlight bash %}
scarlett:~ leandro$ ssh -X 192.168.1.3
leandro@test-ubuntu:~$ dia &
{% endhighlight %}
