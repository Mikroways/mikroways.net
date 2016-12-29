---
date: 2010-06-06 09:00:00 -3000
layout: post
title: Tipos de NAT y configuración en Cisco
authors: leandro
categories: redes
tags: [ccna, cisco, internet, nat, ruteo]
permalink: /2010/06/06/tipos-de-nat-y-configuracion-en-cisco/

---

Existen básicamente tres modos de funcionamiento de NAT que son los que
explicaré a continuación.<!-- more -->

## NAT estático

Consiste básicamente en un tipo de NAT en el cuál se mapea una dirección IP
privada con una dirección IP pública de forma estática. De esta manera, cada
equipo en la red privada debe tener su correspondiente IP pública asignada para
poder acceder a Internet. La principal desventaja de este esquema es que por
cada equipo que se desee tenga acceso a Internet se debe contratar una IP
pública. Además, es posible que haya direcciones IP públicas sin usar (porque
los equipos que las tienen asignadas están apagados, por ejemplo), mientras que
hay equipos que no puedan tener acceso a Internet (porque no tienen ninguna IP
pública mapeada). Para configurar este tipo de NAT en Cisco nos valemos de los
siguientes comandos, donde se ve que el equipo con IP 192.168.1.6 conectado por
medio de la interfaz fastEthernet 0/0 será nateado con la IP pública
200.41.58.112 por medio de la interfaz de salida serial 0/0.

```
Router(config)# ip nat inside source static 192.168.1.6 200.41.58.112
Router(config)# interface fastEthernet 0/0
Router(config-if)# ip nat inside
Router(config)# interface serial 0/0
Router(config-if)# ip nat outside
```

## NAT dinámico

Este tipo de NAT pretende mejorar varios aspectos del NAT estático dado que
utiliza un pool de IPs públicas para un pool de IPs privadas que serán mapeadas
de forma dinámica y a demanda. La ventaja de este esquema es que si se tienen
por ejemplo 5 IPs públicas y 10 máquinas en la red privada, las primeras 5
máquinas en conectarse tendrán acceso a Internet. Si suponemos que no más de 5
máquinas estarán encendidas de forma simultánea nos garantiza que todas las
máquinas de nuestra red privada tendrán salida a Internet eventualmente. Para
configurar este tipo de NAT definimos el pool de IPs públicas disponibles y el
rango de direcciones privadas que deseamos que sean nateadas.

En el siguiente ejemplo se cuenta con las direcciones IPs públicas desde la
163.10.90.2 a la 163.10.90.6 y la subred privada 192.168.1.0/24.

```
Router(config)# ip nat pool name DIR_NAT_GLOB 163.10.90.2 163.10.90.6 netmask 255.255.255.240
Router(config)# access-list 10 permit 192.168.1.0 0.0.0.255
Router(config)# ip nat inside source list 10 pool DIR_NAT_GLOB
Router(config)# interface fastEthernet 0/0
Router(config-if)# ip nat inside
Router(config)# interface serial 0/0
Router(config-if)# ip nat outside
```

## NAT con sobrecarga

El caso de NAT con sobrecarga o PAT (Port Address Translation) es el más común
de todos y el más usado en los hogares. Consiste en utilizar una única dirección
IP pública para mapear múltiples direcciones IPs privadas. Las ventajas que
brinda tienen dos enfoques: por un lado, el cliente necesita contratar una sola
dirección IP pública para que las máquinas de su red tengan acceso a Internet,
lo que supone un importante ahorro económico; por otro lado se ahorra un número
importante de IPs públicas, lo que demora el agotamiento de las mismas.

La pregunta casi obvia es cómo puede ser que con una única dirección IP pública
se mapeen múltiples IPs privadas. Bien, como su nombre lo indica, PAT hace uso
de múltiples puertos para manejar las conexiones de cada host interno. Veamos
esto con el siguiente ejemplo:

La PCA quiere acceder a www.netstorming.com.ar. El socket está formado por:

* IP origen: PCA.
* Puerto origen: X.
* IP destino: www.netstorming.com.ar.
* Puerto destino: 80.

Al llegar el requierimiento anterior al router que hace PAT, el mismo modifica
dicha información por la siguiente:

* IP origen: router.
* Puerto origen: Y.
* IP destino: www.netstorming.com.ar.
* Puerto destino: 80.

Además, el router arma una tabla que le permite saber a qué máquina de la red
interna debe dirigir la respuesta. De esta manera, cuando recibe un segmente
desde el puerto 80 de www.netstorming.com.ar dirigido al puerto Y del router,
este sabe que debe redirigir dicha información al puerto X de la PCA.

La forma de configurar NAT con sobrecarga es la siguiente.

```
Router(config)# access-list 10 permit ip 192.168.1.0 0.0.0.255
Router(config)# ip nat inside source list 10 interface serial 0/0 overload
Router(config)# interface fastEthernet 0/0
Router(config-if)# ip nat inside
Router(config)# interface serial 0/0
Router(config-if)# ip nat outside
```
