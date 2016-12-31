---
date: 2010-08-26 09:00:00 -3000
layout: post
title: VLANs con Linux
authors: leandro
categories: redes
tags: [internet, linux, protocolos, ruteo, switching, vlan]
permalink: /2010/08/26/vlans-con-linux/

---

Crear múltiples VLANs en Linux e incluso armar un trunk con dicho sistema
operativo es muy sencillo y explicar cómo se hace es el objetivo de este post.
Los motivos por los cuáles se puede querer hacer esto son potencialmente muchos,
aunque a continuación dejo algunos ejemplos. <!-- more -->

* Utilizar el equipo como punto de concentración y ruteo de varias redes
diferentes.
* Host de máquinas virtuales, necesitando que las diferentes máquinas estén en
VLANs distintas.

## Configuración

El prerequisito para hacer esto es contar con el paquete de VLAN que, en Debian
y derivados es pecisamente vlan. Por ello, en esos sistemas:

{% highlight bash %}
aptitude install vlan
{% endhighlight %}

Luego, para crear una interfaz de con un VLAN ID 22, con nombre vlan22, asociada
a la interfaz eth0 y con la IP 192.168.22.2:

{% highlight bash %}
vconfig add eth0 22 vlan22
ifconfig vlan22 192.168.22.2 netmask 255.255.255.0 up
{% endhighlight %}

De la misma manera, para eliminar la interfaz creada:

{% highlight bash %}
vconfig rem vlan22
{% endhighlight %}

Ahora bien, esto es necesario hacerlo cada vez que arranca el equipo. Para que
el cambio sea permanente, en los Debian/Ubuntu, editar el archivo
/etc/network/interfaces y agregar las siguientes líneas:

{% highlight bash %}
auto vlan22
iface vlan22 inet static
      address 192.168.22.2
      netmask 255.255.255.0
{% endhighlight %}

**NOTA**: si el equipo con Linux recibe tráfico sin taggear, lo interpretará
directamente en su interfaz eth0. Si el tráfico viene taggeado con el ID 22
entonces deberá leerse en la interfaz vlan22. Obviamente pueden agregarse tantas
interfaces de VLAN a la misma interfaz física como se deseen y, de esta manera,
el equipo podría recibir un trunk con cada una de las VLANs.
