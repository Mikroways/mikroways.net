---
date: 2009-11-26 09:00:00 -3000
layout: post
title: Seguridad de puerto en switches Cisco
authors: leandro
categories: redes
tags: [cisco, seguridad, switching]
permalink: /2009/11/26/seguridad-de-puerto-en-switches-cisco/

---

Con el objetivo de incrementar la seguridad en una red LAN es posible
implementar seguridad de puertos en los switches de capa de acceso, de manera de
permitir que a cada puerto se conecte sólo la estación autorizada. Para ello
[Cisco provee port security](http://www.cisco.com/en/US/docs/switches/lan/catalyst2960/software/release/12.2_50_se/configuration/guide/swtrafc.html#wp1042596),
un mecanismo bastante potente y sencillo que resumiré a continuación.
<!-- more -->

## Dirección MAC segura estática

* Se configura manualmente.
* Se agrega a la tabla de direcciones MAC.
* Se guarda en la *running-config*.
* Se puede hacer permanente guardando la configuración.

```
SwA(config-if)# switchport port-security mac-address DIRECCION-MAC
```

## Dirección MAC segura dinámica

* Se aprende del tráfico que atraviesa la interfaz.
* Se la guarda en la tabla de direcciones MAC.
* Se pierde cuando se reinicia el equipo.

```
SwA(config-if)# switchport port-security
```

## Dirección MAC segura sticky

* Se la puede configurar de forma manual o dinámica.
* Se la guarda en la tabla de direcciones MAC.
* Se almacena en la *running-config*.
* Se puede hacer permanente guardando la configuración.

```
SwA(config-if)# switchport port-security mac-address sticky [DIRECCION-MAC]
```

La principal ventaja de las direcciones sticky en contraposición con las
dinámicas es que éstas últimas se agregan a la running-config. Así nos evitamos
escribir un montón de direcciones MAC de manera estática pero aún podemos
guardarlas en el archivo de configuración de manera que se mantengan inclusive
si el switch se reinicia.

Dos aspectos importantes a tener en cuenta:

* Si se habilitan las direcciones MAC sticky y ya había direcciones aprendidas
de forma dinámica, éstas pasan a la running-config y todas las nuevas que se
aprendan también se agregan allí.
* Si se deshabilitan las direcciones MAC sticky todas las que hubiera pasan a
ser dinámicas y se borran de la running-config. Además, todas las que se
aprendan también serán dinámicas.

## Acciones a tomar si se produce una violación

Es importante tener en cuenta que por violación se entiende uno de los
siguientes dos casos:

* Se alcanzó la cantidad máxima de direcciones MAC permitidas.
* Una dirección MAC que se aprendió en un puerto se aprende por otro puerto
diferente.

Los modos en los que se puede establecer un puerto para decidir qué acción tomar
en el caso de una violación son, entonces:

* **Protect**: una vez que se alcanzó el máximo de direcciones MAC en un puerto,
todo el tráfico de orígenes desconocidos (es decir, de direcciones MAC que no
sean válidas para ese puerto) es descartado. No obstante, se continúa enviando
el tráfico legal normalmente. No se notifica al administrador de esta situación.
* **Restrict**: el mismo comportamiento que el caso anterior pero con la
diferencia que se envía un aviso al administrador mediante SNMP, se registra el
evento en el syslog y se incrementa el contador de violaciones.
* **Shutdown**: en este caso el puerto se da de baja dejándolo en estado
*err-disabled* (deshabilitado por error). Además se envía un aviso al
administrador mediante SNMP, se registra el evento en el syslog y se incrementa
el contador de violaciones.
* **Shutdown VLAN**: la única diferencia con el caso anterior es que se
deshabilita la VLAN en ese puerto en lugar de dar de baja el puerto completo. Es
particularmente atractivo para los puertos de trunk.

## Configuración

Para configurar port-security es importante saber que la interfaz debe estar en
modo access o en modo trunk. Port-security no puede habilitarse en una interfaz
que esté en modo dinámico.

* Habilitar port-security.

```
SwA(config-if)# switchport port-security
```

* Indicar que sólo se permite una MAC por interfaz.

```
SwA(config-if)# switchport port-security maximum 1
```

* Configurar el modo restrict para cuando ocurra una violación del puerto.

```
SwA(config-if)# switchport port-security violation restrict
```

* Configurar el aprendizaje de direcciones MAC sticky.

```
SwA(config-if)# switchport port-security mac-address sticky
```

* O bien especificar una MAC de forma estática.

```
SwA(config-if)# switchport port-security mac-address 5400.0000.0001
```

* Chequear el estado de port-security.

```
SwA# show port-security
```
