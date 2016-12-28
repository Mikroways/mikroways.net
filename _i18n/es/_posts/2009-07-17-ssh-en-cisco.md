---
date: 2009-07-17 09:00:00 -3000
layout: post
title: SSH en Cisco
authors: leandro
categories: [ sistemas operativos ]
tags: [cisco, seguridad, ssh]
permalink: /2009/07/17/ssh-en-cisco/

---

Por defecto, al habilitar las líneas VTY en un equipo Cisco estos utilizan
Telnet, que es un protocolo inseguro dado que no cifra la información que envía.
Por ello, siempre es recomendable habilitar SSH e incluso deshabilitar Telnet.
Para hacerlo son necesarios los siguientes pasos:<!-- more -->

* Setear nombre de equipo y de dominio.
* Configurar una contraseña para modo enable.
* Crear un usuario con contraseña para autenticarse.
* Asignar una IP con la que se accederá al equipo.
* Generar el par de llaves RSA (pública y privada).
* Habilitar las líneas VTY.
* Indicar al router que sólo utilice SSH.

Lo anterior se lleva a cabo de la siguiente manera:

```
Router(config)# hostname border
border(config)# ip domain-name mikroways.net
border(config)# enable secret prueba
border(config)# username leandro password prueba
border(config-if)# ip address 192.168.1.1
border(config-if)# no shutdown
border(config)# crypto key generate rsa
border(config)# line vty 0 4
border(config-line)# login local
border(config-line)# transport input ssh
```
