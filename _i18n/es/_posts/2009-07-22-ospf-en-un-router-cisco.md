---
date: 2009-07-22 09:00:00 -3000
layout: post
title: OSPF en un router Cisco
authors: leandro
categories: redes
tags: [cisco, ospf, protocolos, ruteo]
permalink: /2009/07/22/ospf-en-un-router-cisco/

---

Este post muestra la configuración básica de OSPF en una única área utilizando
routers Cisco. Se recomienda primero la lectura del post
[Introducción a OSPF](/2009/07/20/introduccion-a-ospf/), que sirve como material
previo a este artículo. <!-- more -->

## Ambiente

Para este post se utiliza dynamips con 5 routers con etherswitch, conectados
entre sí tanto por enlaces ethernet como seriales. La versión de IOS que se
utiliza es:
<pre>Router#show version
Cisco IOS Software, C2600 Software (C2600-ADVSECURITYK9-M), Version 12.3(4)T,
RELEASE SOFTWARE (fc1)</pre>
<p style="text-align: center;"><a
href="http://www.netstorming.com.ar//wp-content/uploads/2009/07/Ospf5r.png"><img
class="aligncenter size-full wp-image-2027" title="Topología para OSPF"
src="http://www.netstorming.com.ar//wp-content/uploads/2009/07/Ospf5r.png"
alt="" width="634" height="215" /></a></p>

## Configuración

Se asume que ya se han configurado los nombres de equipo, direcciones IP,
contraseñas, y demás. Para una guía sobre cómo hacerlo puede encontrarse en este
mismo blog un post que explica la
[configuración básica de un router](/2009/07/15/configuracion-basica-de-un-router/).

Parámetros necesarios

Configurar OSPF es muy sencillo. Se necesita incluir la siguiente información:

* **Process ID**: es el número que acompaña al comando router OSPF y es de
importancia local, por lo tanto puede diferir entre routers.
* **Redes**: se deben enumerar las redes directamente conectadas **que desean
publicarse**. La forma es indicando la dirección de red acompañada de una
máscara de wildcard y luego el área donde se publicará (el área 0 es el área de
backbone).

**NOTA**: la máscara de wildcard es el inverso de la máscara de subred y puede
obtenerse fácilmente restando la máscara de subred a 255.255.255.255. En el
ejemplo se usan máscaras 255.255.255.252, entonces:

```
255.255.255.255
-
255.255.255.252
=
0.0.0.3
```

## Configurar OSPF

```
R1(config)#router ospf 1
R1(config-router)#network 192.168.1.0 0.0.0.3 area 0
R1(config-router)#network 192.168.2.0 0.0.0.3 area 0
R1(config-router)#network 192.168.3.0 0.0.0.3 area 0
R1(config-router)#network 192.168.4.0 0.0.0.3 area 0

R2(config)#router ospf 1
R2(config-router)#network 192.168.1.0 0.0.0.3 area 0
R2(config-router)#network 192.168.5.0 0.0.0.3 area 0

R3(config)#router ospf 1
R3(config-router)#network 192.168.2.0 0.0.0.3 area 0

R4(config)#router ospf 1
R4(config-router)#network 192.168.4.0 0.0.0.3 area 0

R5(config)#router ospf 1
R5(config-router)#network 192.168.3.0 0.0.0.3 area 0
R5(config-router)#network 192.168.5.0 0.0.0.3 area 0
```

## Verificar funcionamiento

Para verificar el correcto funcionamiento de OSPF vamos a mirar la tabla de
enrutamiento del R3. Se ve que todas aquellas rutas que no tiene directamente
conectadas las aprendió por OSPF, con lo cual podemos asumir que OSPF funciona
correctamente.

```
R3#show ip route
Codes: C - connected, S - static, R - RIP, M - mobile, B - BGP
D - EIGRP, EX - EIGRP external, O - OSPF, IA - OSPF inter area
N1 - OSPF NSSA external type 1, N2 - OSPF NSSA external type 2
E1 - OSPF external type 1, E2 - OSPF external type 2
i - IS-IS, su - IS-IS summary, L1 - IS-IS level-1, L2 - IS-IS level-2
ia - IS-IS inter area, * - candidate default, U - per-user static route
o - ODR, P - periodic downloaded static route

Gateway of last resort is not set

192.168.4.0/30 is subnetted, 1 subnets
O       192.168.4.0 [110/65] via 192.168.2.1, 00:00:07, FastEthernet0/0
192.168.5.0/30 is subnetted, 1 subnets
O       192.168.5.0 [110/3] via 192.168.2.1, 00:00:07, FastEthernet0/0
192.168.1.0/30 is subnetted, 1 subnets
O       192.168.1.0 [110/2] via 192.168.2.1, 00:00:07, FastEthernet0/0
192.168.2.0/30 is subnetted, 1 subnets
C       192.168.2.0 is directly connected, FastEthernet0/0
192.168.3.0/30 is subnetted, 1 subnets
O       192.168.3.0 [110/65] via 192.168.2.1, 00:00:07, FastEthernet0/0
```

Otras herramientas que pueden utilizarse para monitorear el enrutamiento por
OSPF son:

```
R1#show ip ospf
R1#show ip ospf database
R1#show ip ospf neighbor
R1#show ip ospf interface
R1#show ip ospf interface brief
```
