---
date: 2009-07-24 09:00:00 -3000
layout: post
title: Administración del firewall en Mikrotik
authors: leandro
categories: redes
tags: [firewall, mikrotik, seguridad]
permalink: /2009/07/24/administracion-del-firewall-en-mikrotik/

---

El objetivo de este post es dar una explicación de cómo funciona el firewall de
un equipo Mikrotik y la sintaxis para realizar algunas acciones básicas. Lo
expuesto aquí es el resultado de los apuntes que tomé en un curso de Mikrotik
que tomé, dictado por
[Alessio Garavano](https://www.xing.com/profile/Alessio_Garavano) y
[Maximiliano Dobladez](https://www.maxid.com.ar), y de algunas pruebas que hice
por mi cuenta. <!-- more -->

## Funcionamiento general

El firewall por defecto lee las reglas de arriba hacia abajo y sale con la
primera que coincide. Se usa la orden passthrough para obligar a que, luego de
cumplirse una regla, se siga con las demás. En su naturaleza y funcionamiento es
muy similar a [iptables](/2009/06/18/firewall-con-iptables/). En el siguiente
esquema se puede ver cómo se produce el flujo de los paquetes dentro del
firewall.

![Flujo de paquetes en firewall Mikrotik](/images/blog/packet-flow-mktk.png)

## Firewall con ejemplos

**Connection tracking**: permite visualizar las conexiones en las que interviene
nuestro equipo.

```
[admin@MikroTik] > ip firewall connection print
Flags: S - seen reply, A - assured

 #    PROTOCOL  SRC-ADDRESS           DST-ADDRESS       TCP-STATE     TIMEOUT
0 SA  tcp       192.168.88.4:34838    192.168.88.1:23   established   21h54m32s
1 SA  tcp       192.168.4.254:48101   192.168.4.1:8291  established   23h59m59s
2     udp       192.168.4.1:123       163.10.0.84:123                 8s
3 SA  tcp       192.168.4.254:51654   192.168.4.1:23    established   4m59s
```

## Reglas generales

**Escritura de firewall**: siempre conviene empezar con las reglas de estado,
para ahorrar procesamiento y acelerar las conexiones ya establecidas y las
relativas.

```
[admin@MikroTik] > ip firewall filter add connection-state=established action=accept chain=input
[admin@MikroTik] > ip firewall filter add connection-state=related action=accept chain=input
[admin@MikroTik] > ip firewall filter add connection-state=invalid action=drop  chain=input
[admin@MikroTik] > ip firewall filter add protocol=tcp src-port=8291 in-interface=!wlan1 action=accept chain=input comment="DENIEGA WINBOX DESDE LA WIRELESS"
```

**Aceptar conexiones VPN**:

```
[admin@MikroTik] > ip firewall filter add protocol=gre action=accept chain=input
[admin@MikroTik] > ip firewall filter add protocol=tcp dst-port=1723 action=accept chain=input comment="ACEPTO CONEXIONES VPN"
```

**Denegar ping y loguear los intentos de ping**:

```
[admin@MikroTik] > ip firewall filter add protocol=icmp chain=input action=log log-prefix="PING DENEGADO"
[admin@MikroTik] > ip firewall filter add protocol=icmp action=accept chain=input comment="DENIEGO ICMP"
[admin@MikroTik] > log print
23:34:12 firewall,info PING DENEGADO input: in:ether1 out:(none), src-mac 00:21:70:fd:e3:25, proto ICMP (type 8, code 0), 192.168.4.254->192.168.4.1, len 64
```

## Uso de listas

Las listas contienen direcciones IP para las que podemos tomar determinadas
acciones. De esta manera, mantenemos una única lista de direcciones y la
invocamos en el firewall.

**Crear una lista especificando desde dónde permitimos conexiones SSH**

```
[admin@MikroTik] > ip firewall address-list add list=ssh-permitido address=192.168.1.2/32 comment="MAQUINA DEL ADMINISTRADOR"
[admin@MikroTik] > ip firewall filter add src-address-list=!ssh-permitido protocol=tcp dst-port=22 action=drop chain=input comment="ACEPTO SSH DESDE LAS MAQUINAS EN LA LISTA ssh-permitido"
```

**Agregar IPs a una address-list de forma dinámica**: si quiero por ejemplo
guardar todas las IPs que intentaron acceder por WinBox a mi equipo:

```
[admin@MikroTik] > ip firewall filter add chain=input action=add-src-to-address-list protocol=tcp address-list=acceso-winbox dst-port=8291
[admin@MikroTik] > ip firewall address-list print
Flags: X - disabled, D - dynamic
  #     LIST              ADDRESS
  0     acceso-winbox     0.0.0.0
  1 D   acceso-winbox     192.168.4.254
```

## Cadenas creadas por el usuario

Las cadenas creadas por el usuario sirven para ordenar el firewall. Por ejemplo,
creo una cadena que se llame virus donde cargo los virus conocidos. Necesito
luego hacer un jump desde la cadena input.

```
[admin@MikroTik] > ip firewall filter add dst-port=135-139,445 protocol=tcp action=drop chain=virus comment="VIRUS DE WINDOWS"
[admin@MikroTik] > ip firewall filter add chain=input action=jump jump-target=virus
```

## Administración de reglas

**Mover una regla**: por ejemplo, acabo de agregar una regla y por defecto lo
hace al final. Necesito que dicha regla que esta en el lugar 13 pase al 3:

```
[admin@MikroTik] > ip firewall filter move 13 3
```

## Protección contra ataques conocidos

A continuación se explican algunos ataques conocidos y qué estrategias pueden
implementarse para protegerse contra ellos. También algunas estrategias para
aumentar la seguridad en nuestras redes.

### Bogons nets

El grupo [CYMRU](http://www.cymru.com) mantiene un listado con direcciones de
red no asignadas o banneadas. De esta forma, utilizando sus listas podemos
protegernos de ataques que tengan direcciones no válidas. Lo que se hace es
rutear dichas direcciones a un black hole.

### Port knocking

[Port knocking](http://www.portknocking.org) consiste en utilizar un preámbulo
específico para luego lograr el acceso a donde necesitamos. Por ejemplo, si
queremos acceder por SSH al equipo podemos definir que desde la IP que deseamos
ingresar hagamos un intento de acceso al puerto 33, luego al 55 y finalmente al
77. Al cumplir lo anterior entonces abriremos el puerto 22 para esa IP por un
tiempo limitado.

La forma de implementar el port knocking del ejemplo con Mikrotik es la
siguiente:

```
[admin@MikroTik] > ip firewall filter add chain=input connection-state=new protocol=tcp dst-port=77 action=add-src-to-address-list address-list=ssh-permit-temp address-list-timeout=1h src-address-list=step2
[admin@MikroTik] > ip firewall filter add chain=input connection-state=new protocol=tcp dst-port=55 action=add-src-to-address-list address-list=step2 address-list-timeout=1m src-address-list=step1
[admin@MikroTik] > ip firewall filter add chain=input connection-state=new protocol=tcp dst-port=33 action=add-src-to-address-list address-list=step1 address-list-timeout=1m
[admin@MikroTik] > ip firewall filter add chain=input protocol=tcp dst-port=22 src-address-list=!ssh-permit-temp action=drop
```

### Fuerza bruta

Para impedir que, por ejemplo, nos descubran la password del SSH utilizando
fuerza bruta podemos implementar un mecanismo que habilite sólo tres intentos de
acceso y luego bloquee la IP por 10 días:

```
[admin@MikroTik] > ip firewall filter add chain=input connection-state=new protocol=tcp dst-port=22 action=add-src-to-address-list address-list=ssh-blacklist address-list-timeout=10d src-address-list=ssh3
[admin@MikroTik] > ip firewall filter add chain=input connection-state=new protocol=tcp dst-port=22 action=add-src-to-address-list address-list=ssh3 address-list-timeout=1m src-address-list=ssh2
[admin@MikroTik] > ip firewall filter add chain=input connection-state=new protocol=tcp dst-port=22 action=add-src-to-address-list address-list=ssh2 address-list-timeout=1m src-address-list=ssh1
[admin@MikroTik] > ip firewall filter add chain=input connection-state=new protocol=tcp dst-port=22 action=add-src-to-address-list address-list=ssh1 address-list-timeout=1m
[admin@MikroTik] > ip firewall filter add chain=input protocol=tcp dst-port=22 action=drop address-list=ssh-blacklist
```

### DoS

Los ataques de DoS se llevan a cabo consumiendo y agotando los recursos del
equipo/red atacado. Existen algunas formas de mitigarlos.

Una estrategia es utilizar
[tarpit](http://en.wikipedia.org/wiki/Tarpit_(networking) Tarpit). Esto baja la
ventana TCP a 0, impidiendo que haya transferencia de datos pero dejando que se
generen las conexiones. El siguiente ejemplo muestra cómo permitir 19 conexiones
simultáneas por IP con destino al servidor web y aplicar tarpit a partir de la
conexión 20.

```
[admin@MikroTik] > ip firewall filter add chain=forward dst-address=163.10.0.84 protocol=tcp dst-port=80 action=tarpit connection-limit=20,32
```

Otra estrategia que puede realizarse es permitir un máximo de conexiones nuevas
simultáneas. Por ejemplo, la siguiente regla permite 5 conexiones nuevas al
mismo tiempo y las restantes las dropea:

```
[admin@MikroTik] > ip firewall filter add chain=forward connection-state=new dst-address=163.10.0.84 protocol=tcp dst-port=80 action=drop connection-limit=5,32
```

## Notas sobre rendimiento

* Tener en cuenta que siempre conviene que si hay dos reglas que pueden
resumirse en una se haga, pues es una regla menos para procesar.
* Si no se utiliza el equipo como router conviene deshabilitar el connection
tracking, pues así nos estaríamos ahorrando tiempo de procesamiento y memoria
RAM.

## Referencias e interés

Existen varios sitios que nos permiten ingresar con un usuario de sólo lectura a
sus routers para verificar la configuración. Dos de ellos son accesibles vía
WinBox con usuarios demo y sin password. Las direcciones son
*demo.mikrotikexpert.com* y *demo2.mt.lv*.

Se puede encontrar también más información sobre
[tarpit](http://www.securityfocus.com/infocus/1723) en un artículo de Security
Focus. Finalmente, en la documentación del RouterOS puede accederse a una
explicación sobre el funcionamiento de la
[cadena filter del firewall](http://wiki.mikrotik.com/wiki/Manual:IP/Firewall/Filter).
