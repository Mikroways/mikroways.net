---
date: 2009-07-15 09:00:00 -3000
layout: post
title: Configuración básica de un router
authors: leandro
categories: redes
tags: [ccna, cisco, routers]
permalink: /2009/07/15/configuracion-basica-de-un-router/

---

La intención de este post es mostrar la configuración básica de un router,
utilizando como ejemplo la interfaz CLI de un equipo Cisco. Los parámetros que
configuraremos serán:
<!-- more -->

* Nombre.
* Contraseña de enable.
* Acceso con nombre de usuario y contraseña.
* Acceso por telnet.
* Banner.
* IPs de cada interfaz.

## Nombre de equipo

```
Router> enable
Router#configure terminal
Router(config)#hostname R1
```

## Contraseña de enable

```
R1> enable
R1#configure terminal
R1(config)#enable secret cisco
```

## Acceso con nombre de usuario y contraseña

```
R1> enable
R1#configure terminal
R1(config)#username alumno password class
```

## Acceso por telnet

Hay dos posibles formas de configurar la autenticación por telnet. La primera es
definiendo una contraseña independiente y la segunda usando el nombre de usuario
y contraseña seteados en el equipo. Para esto último es necesario haber llevado
a cabo el paso anterior.

### Contraseña independiente

```
R1> enable
R1#configure terminal
R1(config)#line vty 0 4
R1(config-line)#password class
R1(config-line)#login
```

### Nombre de usuario y contraseña del equipo

```
R1> enable
R1#configure terminal
R1(config)#line vty 0 4
R1(config-line)#login local
```

## Banner

```
R1> enable
R1#configure terminal
R1(config)#banner motd ###Sistema de uso privado. No acceder sin autorización###
```

## IPs de cada interfaz

```
R1> enable
R1#configure terminal
R1(config)#interface fastEthernet 0/0
R1(config-if)#ip address 192.168.1.1 255.255.255.252
R1(config-if)#no shutdown
R1(config-if)#exit
R1(config)#interface fastEthernet 0/1
R1(config-if)#ip address 192.168.2.1 255.255.255.252
R1(config-if)#no shutdown
R1(config-if)#exit
R1(config)#interface serial 0/0
R1(config-if)#ip address 192.168.3.1 255.255.255.252
R1(config-if)#clock rate 56000
R1(config-if)#no shutdown
R1(config-if)#exit
R1(config)#interface serial 0/1
R1(config-if)#ip address 192.168.4.1 255.255.255.252
R1(config-if)#clock rate 56000
R1(config-if)#no shutdown
R1(config-if)#exit
```
