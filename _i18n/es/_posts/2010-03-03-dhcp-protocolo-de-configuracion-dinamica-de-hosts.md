---
date: 2010-03-03 09:00:00 -3000
layout: post
title: "DHCP: protocolo de configuración dinámica de hosts"
authors: leandro
categories: redes
tags: [dhcp, internet, ip, protocolos]
permalink: /2010/03/03/dhcp-protocolo-de-configuracion-dinamica-de-hosts/

---

DHCP es un protocolo muy difundido en las redes tanto LAN como WAN porque su
implementación simplifica mucho el trabajo del administrador de una red. Además,
brinda una comodidad a los usuarios móviles debido a que no deben preocuparse
por la asignación de direcciones IP en cada nueva red a la que se conectan. 
<!-- more -->El mismo se encuentra definido en la
[RFC 2131](http://www.rfc-editor.org/rfc/rfc2131.txt). La función básica de DHCP
es asignar direcciones IP de un pool de direcciones a los nuevos hosts que se
agregan a la red. Los parámetros más elementales que provee DHCP son la
asignación de dirección IP de host, su máscara, la dirección IP de la puerta de
enlace y las direcciones de los servidores DNS.

## Funcionamiento de DHCP

DHCP se basa en un esquema cliente-servidor para su funcionamiento y tiene
básicamente cuatro etapas, desde que un host requiere su configuración hasta que
finalmente la obtiene. Para ello, cuando un nuevo equipo se conecta a la red se
suceden los siguientes pasos:

* **DHCP discovery**: el nuevo host envía una solicitud de descubrimiento de
DHCP con el objetivo de ver si existe algún servidor de DHCP en la red. Los
parámetros que incluye en el datagrama son los siguientes:
  * ID de transacción.
  * IP origen: 0.0.0.0.
  * Puerto origen: UDP 68.
  * IP destino: 255.255.255.255.
  * Puerto destino: UDP 67.
* **DHCP offer**: los servidores de DHCP que puedan estar escuchando en la red
tomarán el requerimiento del equipo y responderán con un datagrama de oferta de
DHCP. El mismo incluirá la siguiente información:
  * ID de transacción.
  * IP origen: 192.168.1.1 (la IP del servidor DHCP).
  * Puerto origen: UDP 67.
  * IP destino: 255.255.255.255.
  * Puerto destino: UDP 68.
  * Opciones de configuración: IP de host, máscara, puerta de enlace, servidores
DNS.
* **DHCP request**: un host puede llegar a recibir varias ofertas de DHCP debido
a que puede haber múltiples servidores en la red. Lo que hará en tal caso es
escoger una de las ofertas y responder a dicha oferta con un DHCP request, que
será identificado por el servidor en cuestión por el ID de transacción. Los
datos de este datagrama serán iguales a los de DHCP discovery. No obstante, el
cliente incluirá además la IP ofrecida con algún otro dato de configuración.
* **DHCP acknowledgement**: este último datagrama es el que hace efectiva la
cesión de la dirección IP y confirma los parámetros negociados con el cliente.
A partir de aquí, el cliente ya cuenta con su dirección IP y el servidor la
marca como utilizada.

DHCP utiliza también otros mensajes y es incluso un poco más complejo. No
obstante, con lo dicho es suficiente para contar con una introducción al mismo.
