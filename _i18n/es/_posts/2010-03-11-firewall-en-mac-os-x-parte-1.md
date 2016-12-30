---
date: 2010-03-11 09:00:00 -3000
layout: post
title: Firewall en Mac OS X
authors: leandro
categories: redes
tags: [diseño, subnetting, tutoriales]
permalink: /2010/03/11/firewall-en-mac-os-x-parte-1/

---

Todos los usuarios nuevos de Mac OS X acostumbrados a trabajar con Linux
probablemente sientan como yo la falta de control sobre el firewall utilizando
la aplicación gráfica incluida en el sistema. Incluso peor si les gusta trabajar
en modo texto. Pero a no desesperar, porque el firewall en Mac OS X puede ser
administrado vía **ipfw**. <!-- more -->El uso de la herramienta y la
construcción de un firewall elemental serán el objeto de este post.

## Sintaxis y funcionamiento de IPFW

IPFW funciona de la misma manera que iptables en el sentido que si un paquete
coincide con una regla es procesado en base al criterio de la misma y se analiza
el siguiente paquete. Por tal motivo, existe una regla especial que está
hardcodeada en el firewall de Mac OS X que permite todo el tráfico IP en todas
las direcciones. La misma puede verse teniendo incluso el firewall desactivado:

```
sh-3.2# ipfw list
65535 allow ip from any to any
```

El comando **ipfw** con argumento **list** nos muestra todas nuestras reglas de
firewall. Se ve allí que la regla anterior permite todo el tráfico IP con
cualquier origen y destino. Algo curioso a notar es el número al principio. Cada
regla tiene un número que indica su posición y le da orden a las mismas. Este
número puede especificarse manualmente o de forma automática, siendo 65535 el
más alto (es decir que** la regla anterior va a quedar siempre al final**). La
forma básica de una regla es la siguiente:

```
[orden] acción [log] protocolo from origen to destino [interface-spec]
```

## Escribiendo un firewall con IPFW

Ahora bien, luego de haber visto cómo funciona IPFW y cuál es la sintaxis del
comando nos abocaremos a escribir un conjunto de reglas utilizándolo. Las reglas
que escribiremos serán las correspondientes a:

* Permitir todo el tráfico local (de la propia máquina).
* Permitir todo el tráfico saliente.
* Permitir el tráfico entrante para las conexiones establecidas.
* Permitir el ping a la máquina.
* Permitir el acceso SSH a la máquina.
* Denegar todo el resto del tráfico entrante.

Lo cuál, traducido en reglas de IPFW queda de la siguiente manera:

```
ipfw add 00900 check-state
ipfw add 01000 allow ip from any to any via lo*
ipfw add 01010 allow ip from any to any out
ipfw add 01020 allow tcp from any to any established
ipfw add 01030 allow udp from any to any keep-state
ipfw add 01040 allow icmp from any to any in
ipfw add 01050 allow tcp from any to any dst-port 22 in
ipfw add 30000 deny ip from any to any
```

Ahora bien, en los comandos de arriba se puede interpretar lo siguiente:

* La primer línea le indica al firewall que deseamos que mantenga estados para
las conexiones. De esta manera, al generar una conexión saliente se generará una
regla de manera dinámica que permitirá la respuesta de la misma. Para ello nos
valemos luego de las palabras *established* y *keep-state*, la primera para TCP
y la segunda para UDP.
* La segunda línea permite todo el tráfico local.
* La tercer línea permite todo el tráfico saliente de la máquina.
* La cuarta y quinta línea indican explícitamente que se desea mantener el
estado para las conexiones que sean TCP y UDP.
* La sexta línea permite el ping a la máquina y la séptima el SSH.
* La última línea deniega todo el resto del tráfico, sea entrante o saliente,
que no haya coincidido con alguna de las reglas anteriores.

Finalmente, si se deseara eliminar todas las reglas de la tabla basta con
ejecutar:

```
ipfw -f flush
```
