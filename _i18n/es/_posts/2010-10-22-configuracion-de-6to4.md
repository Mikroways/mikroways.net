---
date: 2010-10-22 09:00:00 -3000
layout: post
title: Configuración de 6to4
authors: leandro
categories: redes
tags: [6to4, internet, ipv6, protocolos]
permalink: /2010/10/22/configuracion-de-6to4/

---

6to4 es uno de los varios mecanismos de transición a IPv6. Este mecanismo
permite tener una red local con IPv6 y acceder con direcciones globalmente
ruteables a todos aquellos sitios que tengan IPv6 habilitado por medio de una
red IPv4. <!-- more -->

Si bien no es el objetivo de este post explicar los fundamentos teóricos de 6to4
sí haré una breve introducción al mismo, aunque recomiendo la lectura de
material adicional como el
[disponible en Wikipedia](http://en.wikipedia.org/wiki/6to4"). Básicamente, 6to4
es un mecanismo de tunelización, en el cuál se envían los paquetes IPv6
encapsulados dentro de paquetes IPv4. Se utilizan diversos servidores
distribuidos por el mundo con la dirección IP anycast 192.88.99.1 que están
conectados tanto a la red IPv4 como a la red IPv6. Los mismos reciben paquetes
IPv6 encapsulados en paquetes IPv4 y los reenvían a la red IPv6, realizando el
proceso inverso con las respuestas.

Lo que permite 6to4 en pocas palabras es poder conectar una red IPv6 con otras
redes IPv6 utilizando la infraestructura IPv4 existente. El caso típico es hacer
el deploy de IPv6 en nuestra red cuando el proveedor de Internet no nos asigne
direcciones IPv6, en cuyo caso nuestra red no podría comunicarse con el resto
del mundo.

Si bien 6to4 es a priori una solución para las situaciones mencionadas, el
rendimiento de la red puede llegar a ser muy pobre, dado que las latencias
pueden aumentar en grandes proporciones al utilizar este mecanismo de
tunelización. En particular, en una prueba que hice los tiempos de alrededor de
30ms que tengo de mi casa al trabajo con IPv4 aumentaron a un promedio de 460ms
utilizando 6to4.

## Topología de ejemplo

En el siguiente diagrama se puede apreciar que se tiene una red LAN IPv6 con
tres máquinas conectadas por medio de un router y éste último conectado a la red
IPv4 pública de su proveedor. Finalmente se tiene un servidor Linux con IPv6
nativo al que se desea acceder.

![Topología de ejemplo](/images/blog/6to4.png)

## Preparando para el deploy

Las direcciones 6to4 tienen la siguiente estructura:

```
2002:XXXX:XXXX:YYYY:ZZZZ:ZZZZ:ZZZZ:ZZZZ
```

Donde:

* 2002: prefijo que indica que se trata de una dirección 6to4. Nunca varía.
* XXXX:XXXX: es la dirección IPv4 **pública** expresada en formato hexadecimal
que tiene el router que tendrá el tunel 6to4 configurado.
* YYYY: es el identificador de subred. Las direcciones 6to4 utilizan 48 bytes,
dejando luego 16 bytes que nos permiten crear subredes 6to4.
* ZZZZ:ZZZZ:ZZZZ:ZZZZ: es el identificador de host que puede ser o configurado
manualmente o utilizando un mecanismo de autoconfiguración.

Entendido lo anterior, lo que se necesita para que el túnel 6to4 de la red de
ejemplo funcione correctamente es primero generar la dirección 6to4 a partir de
la dirección IPv4 pública. En este caso sería:

```
167 = 10100111 = A7
80  = 01010000 = 50
129 = 10000001 = 81
210 = 11010010 = D2
```

Lo que da como resultado:

```
2002:A750:81D2::/48
```

Se puede utilizar una función de C (una simple línea de código que podrá
ejecutarse en cualquier Unix) que puede hacer el trabajo anterior más sencillo:

```
scarlet:~ leandro$ printf "2002:%02x%02x:%02x%02x\n" 167 80 129 210 2002:a750:81d2
```

Ahora bien, una vez que se tiene la dirección IPv6 6to4 de la red que se
utilizará para el túnel se pueden definir:

* **IP para la interfaz del túnel en el router**: debe ser una IP en dicha red.
Ejemplo: 2002:A750:81D2::1/128.
* **Red para el segmento de LAN**: se utiliza una subred de la obtenida 6to4. Un
ejemplo puede ser: 2002:A750:81D2:2222::/64.
* **IP para el router en el segmento de LAN**: debe estar en la red definida en
el paso anterior. Por facilidad en la administración se asignará la primer IP en
el rango: 2002:A750:81D2:2222::1/64.

## Configuración

Ahora bien, llegó el momento de configurar efectivamente 6to4 en el router y
dejar que la autoconfiguración de IPv6 se encargue del trabajo de configurar los
hosts. Mi intención es explicar a continuación cómo efectuar la configuración de
6to4 suponiendo tanto que el router es un Mikrotik como un Cisco, que son los
equipos con los que he hecho las pruebas. Si extiendo las mismas a un equipo de
otra marca lo agregaré aquí.

### Configuración con Mikrotik

```
/interface 6to4 add mtu=1280 name=ipv6-tunnel local-address=167.80.129.210 remote-address=192.88.99.1 disabled=no
/ipv6 address add address=2002:A750:81D2::1/128 interface=ipv6-tunnel
/ipv6 address add address=2002:A750:81D2:2222::1/64 interface=LAN advertise=yes disabled=no
/ipv6 route add gateway=ipv6-tunnel
```
### Configuración con Cisco

```
router# configure terminal
router(config)# ipv6 unicast-routing
router(config)# interface Tunnel2002
router(config-if)# no ip address
router(config-if)# no ip redirects
router(config-if)# ipv6 address 2002:A750:81D2::1/128
router(config-if)# tunnel source FastEthernet
```
