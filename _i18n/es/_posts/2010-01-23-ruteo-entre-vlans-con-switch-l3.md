---
date: 2010-01-23 09:00:00 -3000
layout: post
title: "Ruteo entre VLANs: con switch L3"
authors: leandro
categories: redes
tags: [cisco, lan, ruteo, switching, vlans]
permalink: /2010/01/23/ruteo-entre-vlans-con-switch-l3/

---

Hasta ahora hemos tratado en un primer post las formas de realizar
[ruteo entre VLANs](/2009/12/20/ruteo-entre-vlans/) y luego vimos el caso de
[router on-a-stick](/2010/01/20/ruteo-entre-vlans-router-on-a-stick/). En esta
oportunidad analizaremos el ruteo entre
[VLANs](/2010/01/18/introduccion-a-las-vlan/) utilizando un switch de capa 3,
ejemplificando la configuración con equipos Cisco. <!-- more -->Nos valdremos
de la siguiente topología:

![Topología de ejemplo](/images/blog/routing-swl3-ex.png)

Las tareas a realizar son las siguientes:

* En el Sw2960:
  * Configurar el puerto que lo conecta al switch de capa 3 como trunk.
  * Enviar las VLANs deseadas por el trunk.
* En el Sw3560:
  * Configurar las direcciones IP en cada VLAN.
  * Configurar el puerto que lo conecta al switch de capa 2 como trunk.
  * Enviar las VLANs deseadas por el trunk.

A continuación se pueden ver los comandos para configurar ambos equipos:

```
Sw2960(config)#interface fastEthernet 0/1
Sw2960(config-if)#switchport mode trunk
Sw2960(config-if)#switchport trunk allowed vlan 2,3,4,5

Sw3560(config)#interface vlan 2
Sw3560(config-if)#ip address 192.168.2.1 255.255.255.0
Sw3560(config-if)#exit
Sw3560(config)#interface vlan 3
Sw3560(config-if)#ip address 192.168.3.1 255.255.255.0
Sw3560(config-if)#exit
Sw3560(config)#interface vlan 4
Sw3560(config-if)#ip address 192.168.4.1 255.255.255.0
Sw3560(config-if)#exit
Sw3560(config)#interface vlan 5
Sw3560(config-if)#ip address 192.168.5.1 255.255.255.0
Sw3560(config-if)#exit
Sw3560(config)#interface fastEthernet 0/1
Sw3560(config-if)#switchport mode trunk
Sw3560(config-if)#switchport trunk allowed vlan 2,3,4,5
```
