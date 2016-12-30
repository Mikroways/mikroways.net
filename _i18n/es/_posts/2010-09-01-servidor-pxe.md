---
date: 2010-09-01 09:00:00 -3000
layout: post
title: Servidor PXE
authors: leandro
categories: servidores
tags: [debian, linux, netinstall, protocolos, pxe, ubuntu]
permalink: /2010/09/01/servidor-pxe/

---

Un servidor PXE es un sistema capaz de brindar a sus clientes la opción de
instalación vía red (netinstall). Es una forma muy rápida y cómoda de realizar
la instalación de un sistema operativo dado que no se necesita siquiera que el
equipo a instalar cuente con una lectora de CD/DVD. <!-- more -->Además, un
servidor PXE puede contar con la capacidad de instalar múltiples sistemas
operativos, evitándonos tener uno o más CDs/DVDs por cada sistema. Otra ventaja
es que la instalación se realiza obteniendo los paquetes desde un repositorio
central con lo que, terminada la instalación, el sistema contará con las últimas
versiones de cada paquete. Esto mismo puede suponer una desventaja si la
conexión a Internet es lenta, aunque en este último caso lo ideal es montar un
mirror de los sistemas necesarios de manera que los archivos se descarguen mucho
más rápido.

Para montar un servidor PXE propio utilizaremos Debian Lenny y los siguientes
programas:

* Servidor DHCP.
* Servidor TFTP.

En la sección siguiente se procede a la instalación y configuración del servidor
en cuestión.

## Instalación y configuración

Instalar el software necesario.

{% highlight bash %}
pxe-server:~# aptitude install tftpd-hpa dhcp3-server
{% endhighlight %}

Una vez instalados ambos servicios, es necesario permitir el inicio de tftpd-hpa
como demonio, de la siguiente manera:

{% highlight bash %}
pxe-server:~# vi /etc/default/tftpd-hpa 

RUN_DAEMON="yes"
OPTIONS="-l -s /var/lib/tftpboot"
{% endhighlight %}

Si el directorio /var/lib/tftpboot no existiera será necesario crearlo. Ahora
bien, el próximo paso es iniciar el servidor TFTP.

{% highlight bash %}
pxe-server:~# /etc/init.d/tftpd-hpa start
{% endhighlight %}

Luego de configurado TFTP, habrá que indicarle al servidor DHCP las interfaces
en las que debe ofrecer IPs. En este caso se utiliza la eth0.

{% highlight bash %}
pxe-server:~# vi /etc/default/dhcp3-server

INTERFACES="eth0"
{% endhighlight %}

El próximo paso es instruir al servidor DHCP acerca de la información de
configuración que debe brindar.

{% highlight bash %}
pxe-server:~# vi /etc/dhcp3/dhcpd.conf

subnet 192.168.1.0 netmask 255.255.255.0 {
  range 192.168.1.200 192.168.1.250;
  option routers 192.168.1.1;
  option domain-name-servers 192.168.1.1;

  filename "pxelinux.0";
}
{% endhighlight %}

Una vez cumplidos los dos pasos anteriores ya se puede poner a funcionar el
servidor DHCP.

{% highlight bash %}
pxe-server:~# /etc/init.d/dhcp3-server restart
{% endhighlight %}

Constatar entonces que tanto el servidor DHCP como el servidor TFTP estén
funcionando.

{% highlight bash %}
pxe-server:~# netstat -nlup
Active Internet connections (only servers)
Proto  Recv-Q  Send-Q   Local Address   Foreign Address  State   PID/Program name
udp         0       0   0.0.0.0:67      0.0.0.0:*                2684/dhcpd3    
udp         0       0   0.0.0.0:68      0.0.0.0:*                1706/dhclient3 
udp         0       0   0.0.0.0:69      0.0.0.0:*                2379/in.tftpd
{% endhighlight %}

El paso siguiente es descargar los archivos necesarios para realizar la
instalación por red. En este caso se mostrará cómo configurar al servidor para
que permita instalar Debian Lenny.

{% highlight bash %}
pxe-server:~# cd /var/lib/tftpboot/
pxe-server:/var/lib/tftpboot# lftp -c "open http://http.us.debian.org/debian/dists/lenny/main/installer-i386/current/images/netboot/; mirror"
{% endhighlight %}

Listo, el servidor ya está configurado y funcionando. A partir de este momento
ya es posible instalar Debian Lenny en cualquier equipo vía red. Para ello, se
configura el cliente para que bootee utilizando PXE, se lo conecta en el mismo
segmento de red en que se encuentra el servidor configurado y listo, la
instalación comenzará automáticamente.
