---
date: 2009-06-22 09:00:00 -3000
layout: post
title: FTP activo vs. pasivo
authors: leandro
categories: redes
tags: [estándares, firewalls, ftp, nat, protocolos, seguridad, tcp]
permalink: /2009/06/22/ftp-activo-vs-pasivo/

---

El protocolo [FTP](http://en.wikipedia.org/wiki/File_Transfer_Protocol)
es utilizado para transferencia de archivos entre dos hosts remotos, definido
en la [RFC 959](http://www.ietf.org/rfc/rfc959.txt). El mismo soporta
básicamente dos modos de funcionamiento, **activo** y **pasivo**. <!-- more -->

El protocolo FTP funciona de una forma que es denominada fuera de banda. Por un
lado, utiliza una conexión persistente para control (envío de comandos) y otra
conexión a demanda para datos (se abre sólo cuando hay una transferencia real de
información). Por ello se verá que el mismo utiliza 2 puertos TCP: 21 para
control y 20 para datos.

En el modo activo trabaja básicamente de la siguiente manera:

* El cliente A inicia la conexión con un puerto TCP origen aleatorio N al puerto
destino TCP 21 del servidor B.
* El cliente comienza a escuchar peticiones en el puerto TCP N+1 y se lo indica
al servidor.
* El servidor B será luego el que, al transferir información al cliente, se
conectará al puerto TCP destino N+1 del cliente A con puerto TCP origen 20.

El siguiente diagrama muestra el intercambio anterior:

![FTP activo](/images/blog/ftp-activo.png)

El gran problema con el modo activo es que **no funciona con clientes detrás de
NAT**, pues el servidor no puede alcanzar el puerto en el que el cliente
escucha. También implica un problema de seguridad, dado que el cliente no
debería recibir conexiones sino generarlas.

Lo anterior se soluciona con el modo pasivo, donde es el cliente el que inicia
ambas conexiones. En este caso el protocolo es el que sigue:

* El cliente A inicia una conexión desde un puerto TCP origen aleatorio N al
puerto destino TCP 21 del servidor B.
* El servidor le responde con un puerto donde estará escuchando sus
peticiones.
* El cliente A inicia las conexiones de datos desde otro puerto TCP origen
aleatorio N+1 al puerto TCP destino especificado por el servidor.

El siguiente diagrama refleja lo explicado:

![FTP pasivo](/images/blog/ftp-pasivo.png)

Ahora bien, el problema en este caso es asegurar el servidor, puesto que como
el puerto en el que escuchará las peticiones del cliente es aleatorio es difícil
diagramar el firewall para el mismo (aunque algunos programas permiten
especificar el rango de puertos posibles).

Referencia: [http://slacksite.com/other/ftp.html](http://slacksite.com/other/ftp.html)
