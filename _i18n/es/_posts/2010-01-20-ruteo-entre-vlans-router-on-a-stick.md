---
date: 2010-01-20 09:00:00 -3000
layout: post
title: "Ruteo entre VLANs: router-on-a-stick"
authors: leandro
categories: redes
tags: [cisco, lan, ruteo, switching, vlans]
permalink: /2010/01/20/ruteo-entre-vlans-router-on-a-stick/

---

En un post anterior hemos visto las formas de realizar
[ruteo entre VLANs](/2009/12/20/ruteo-entre-vlans/). En esta oportunidad
analizaremos uno de ellos, el de router on-a-stick. La idea es ver cómo se
configura en equipos Cisco. <!-- more -->Utilizaremos para ello la topología del
siguiente diagrama:

![Topología de ejemplo](/images/blog/routing-on-a-stick-ex.png)

Las tareas a realizar son las siguientes:

* En el switch:
  * Configurar el puerto que lo conecta al router como trunk.
  * Enviar las VLANs deseadas por el trunk.
* En el router:
  * Levantar la interfaz que se conecta al switch.
  * Configurar tantas subinterfaces como VLANs se deseen rutear (una por VLAN).
El identificador de cada subinterfaz puede ser cualquiera, pero se recomienda
que coincida con el ID de la VLAN para que sirva de autodocumentación.

A continuación se pueden ver los comandos para configurar ambos equipos:

```
Switch(config)#interface fastEthernet 0/1
Switch(config-if)#switchport mode trunk
Switch(config-if)#switchport trunk allowed vlan 2,3,4,5

Router(config)#interface fastEthernet 0/0
Router(config-if)#no shutdown
Router(config-if)#exit
Router(config)#interface fastEthernet 0/0.2
Router(config-subif)#encapsulation dot1Q 2
Router(config-subif)#ip address 192.168.2.1 255.255.255.0
Router(config-subif)#exit
Router(config)#interface fastEthernet 0/0.3
Router(config-subif)#encapsulation dot1Q 3
Router(config-subif)#ip address 192.168.3.1 255.255.255.0
Router(config-subif)#exit
Router(config)#interface fastEthernet 0/0.4
Router(config-subif)#encapsulation dot1Q 4
Router(config-subif)#ip address 192.168.4.1 255.255.255.0
Router(config-subif)#exit
Router(config)#interface fastEthernet 0/0.5
Router(config-subif)#encapsulation dot1Q 5
Router(config-subif)#ip address 192.168.5.1 255.255.255.0
Router(config-subif)#exit
```
