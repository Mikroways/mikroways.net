---
date: 2009-06-16 09:00:00 -3000
layout: post
title: Diseño de un firewall
authors: leandro
categories: redes
tags: [firewalls, seguridad, servidores]
permalink: /2009/06/16/diseno-del-firewall/

---

En un entorno de red, incluyendo tanto equipos finales como de conectividad,
**el firewall es la primer medida indispensable en lo que hace a seguridad
lógica** de la misma. Por ello es importante entender cómo funciona un
firewall y diseñarlo correctamente antes de ponerlo en funcionamiento, sobre
todo si se trata de un ambiente de producción. <!-- more -->Para empezar es
importante saber que un firewall puede tener una de dos políticas:

* **Política permisiva:** por defecto se permite todo el tráfico y se deniega
explícitamente lo que no se desea que atraviese el mismo. La ventaja es que es
fácil de implementar ya que no requiere conocimientos precisos de los servicios
brindados. La desventaja es, lógicamente, su falta de seguridad.
* **Política restrictiva:** por defecto se bloquea todo el tráfico y se permite
sólo el tráfico válido. Por ejemplo, si se tiene un servidor web se denegará
todo tipo de intento de conexión al mismo con excepción del tráfico destinado
al puerto 80 TCP.

Será necesario entonces escoger una para luego definir las reglas necesarias. En
la práctica uso la segunda de ellas y será la que utilice en este post.

Ahora bien, el próximo paso es relevar los servicios que se permitirán pasar por
el firewall con la mayor precisión posible: IPs de origen, IPs de destino,
puertos, protocolos. Una vez obtenida esa información ya es posible comenzar a
definir las reglas para permitir lo relevado.

Un consejo en este punto es mantener las reglas lo más restrictivas posibles
aunque dependerá siempre de cuán críticos sean los equipos a proteger. Con esto
en cuenta mostraré un ejemplo práctico en base al siguiente diagrama:

![Topología de ejemplo](/images/blog/firewall_network.png)

En la red anterior se tiene una red de servidores con un firewall y otra red con
máquinas sin un firewall en el medio donde, una de ellas, es la máquina del
administrador. Ya se decidió que la política será restrictiva. Siguiendo con los
pasos, debería hacerse entonces un relevamiento. A continuación listo los
requerimientos obtenidos a partir del mismo:

* **FTP:** se utiliza para subir cambios en la web y se permite sólo desde la
red con los dos hosts.
* **SSH:** para los tres equipos, sólo desde la máquina del administrador.
* **DNS:** a todo internet, pues es el servidor de DNS de la empresa.
* **HTTP/HTTPS:** a todo internet, ya que los servidores alojan el sitio web de
la empresa.
* **SMTP:** como se necesita que reciba mails es necesario que sea accesible
desde cualquier lugar de internet.
* **POP/IMAP:** los usuarios de mail de la empresa pueden chequearlo desde sus
casas. Por lo tanto estará disponible para todo internet también.
* Además se desea que sea posible hacer **ping** a los servidores desde la
máquina del administrador.

Antes de seguir con la definición del firewall es importante saber los puertos
que utiliza cada servicio. Los mismos son:

* **FTP**: puertos de destino 20/tcp y 21/tcp.
* **SSH**: puerto de destino 22/tcp.
* **DNS**: puertos de destino 53/udp y 53/tcp. Puertos de origen 53/udp y 53/tcp.
* **HTTP/HTTPS**: puertos de destino 80/tcp y 443/tcp respectivamente.
* **SMTP**: puerto de destino 25/tcp. Puerto de origen 25/tcp.
* **POP/IMAP**: puertos de destino 110/tcp y 143/tcp.
* **Ping**: usa el protocolo ICMP que no tiene puertos.

Basados en lo anterior se podría definir el firewall. Sería algo como lo
siguiente:

* Denegar todo tráfico entrante.
* Permitir todas las conexiones establecidas y relacionadas (si una conexión
pasó por el firewall ya no se vuelve a analizar el tráfico referente a dicha
conexión ni necesita ser explícitamente aceptado. Lo mismo con las conexiones
relacionadas).
* Permitir tráfico ICMP con cualquier destino y origen.
* Permitir conexiones con destino 172.25.11.0/24 desde la ip 172.25.10.2 puerto
origen tcp 20 (FTP ACTIVO).
* Permitir conexiones con destino 172.25.10.2 al puerto tcp 21 desde
172.25.11.0/24.
* Permitir conexiones con destino 172.25.10.2-4 al puerto tcp 22 desde
172.25.11.2 (SSH).
* Permitir conexiones con destino 172.25.10.4 al puerto tcp 25 desde cualquier
lado.
* Permitir conexiones con cualquier destino al puerto tcp 25 desde 172.25.10.4.
* Permitir conexiones con destino 172.25.10.3 al puerto tcp 53 desde cualquier
lado.
* Permitir conexiones con destino 172.25.10.3 al puerto udp 53 desde cualquier
lado.
* Permitir conexiones con cualquier destino al puerto tcp 53 desde 172.25.10.3.
* Permitir conexiones con cualquier destino al puerto udp 53 desde 172.25.10.3.
* Permitir conexiones con destino 172.25.10.2 al puerto tcp 80 desde cualquier
lado.
* Permitir conexiones con destino 172.25.10.4 al puerto tcp 110 desde cualquier
lado.
* Permitir conexiones con destino 172.25.10.4 al puerto tcp 143 desde cualquier
lado.
* Permitir conexiones con destino 172.25.10.2 al puerto tcp 443 desde cualquier
lado.

Con lo visto he pretendido dar una noción del diseño básico de un firewall. En
un próximo post mostraré cómo implementarlo con herramientas libres.
