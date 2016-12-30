---
date: 2009-10-17 09:00:00 -3000
layout: post
title: "Redes inalámbricas: seguridad"
authors: leandro
categories: redes
tags: [802.11, seguridad, wep, wifi, wpa, wireless]
permalink: /2009/10/17/redes-inalambricas-seguridad/

---

Un aspecto muy importante a tener en cuenta sobre las redes inalámbricas es la
seguridad dado que cualquier persona que pueda conectarse a nuestra red podría
llegar a utilizar nuestros servicios e incluso leer el intercambio de
información de nuestra máquina con otros hosts o Internet. <!-- more -->

Existen muchísimas técnicas para proteger una red inalámbrica siendo la primera
de ellas poder brindar un método de autenticación a la red. A continuación
describo brevemente algunas de ellas.

## WEP con clave compartida

Es el esquema más simple de autenticación aunque también muy inseguro. Con WEP
(Wired Equivalent Privacy) la red tiene un conjunto de claves que cada usuario
debe conocer para poder conectarse. Las claves pueden ser de 40 y de 104 bits,
con un vector de inicialización (un valor pseudoaleatorio) de 24 bits,
obteniendo 64 bits en el primer caso y 128 bits en el segundo.

La conexión de un cliente a una red protegida con WEP demanda los siguientes
pasos:

1. El cliente le indica al AP que desea autenticarse.
2. El AP responde enviándole un desafío en texto plano. Cabe aclarar que un
desafío es una cadena de caracteres aleatoria que se utiliza para asegurarse que
el otro equipo conoce la contraseña pero sin enviar la misma.
3. El cliente toma una de las claves WEP que conoce para la red, encripta el
desafío con ella y lo envía nuevamente al AP.
4. El AP chequea el texto encriptado que recibió y si el mismo coincide con
el que él calculó (encriptando el mismo desafío con la misma clave) entonces
autentica al cliente.

## Autenticación y encripción

WEP sólo provee una forma débil de autenticación y no encripta el tráfico en la
red inalámbrica. Existen entonces otros métodos más fuertes de autenticación y
que, además, proveen encripción para los paquetes intercambiados. Podemos
mencionar en este apartado dos tecnologías: WPA y WPA2.

## WPA y WPA2

WPA (Wireless Protected Access) es una importante mejora con respecto a WEP, ya
que utiliza claves dinámicas para encriptar el tráfico en la red y además se
vale TKIP, que es un algoritmo de autenticación más fuerte. No obstante, TKIP es
sólo una mejora sobre RC4 que es el algoritmo de encripción de WEP, con lo cuál,
si bien reducidos, sigue compartiendo varios de los problemas de WEP. WPA puede
utilizar AES que es un algoritmo muy seguro pero requiere que el hardware lo
soporte, motivo por el cuál es opcional con WPA. La diferencia aquí con WPA2 es
que este último no admite TKIP, obligando por lo tanto a utilizar AES.

WPA y WPA2 pueden utilizar dos modos de autenticación. Los mismos son:

* **Enterprise**: en este caso se utiliza un servidor RADIUS para realizar la
autenticación.
* **Personal**: utiliza el esquema de clave compartida, que si bien le da menos
seguridad es más fácil de configurar y suele ser lo utilizado para una red
pequeña o de un hogar.

## Otras consideraciones de seguridad

Existen varias acciones más que pueden llevarse a cabo para proteger una red.
Las más comunes son:

* **Filtrado por MAC**: en este caso, se arma una lista con las MAC de los
dispositivos que tienen permitido conectarse a la red, con lo que el AP
rechazará todo equipo cuya MAC no se encuentre en la lista.
* **Ocultar SSID**: como hemos visto, el SSID es el nombre de la red. Al
ocultarlo se logra que la red, aunque presente, no sea listada entre las
posibles redes para conectarse. Por ello, para poder conectarse a una red oculta
el cliente debe expresamente dar el SSID de la misma.
* **Desactivar DHCP**: al desactivar DHCP y suponiendo que un cliente haya
podido conectarse a la red, entonces el mismo debería conocer la subred
utilizada en la misma para poder hacer uso de los servicios.

Vale aclarar que los métodos anteriores sólo agregan algunas capas débiles de
seguridad, efectivas para un usuario sin muchos conocimientos pero totalmente
inútiles para detener a una persona que dedique tan sólo unas pocas horas de
lectura sobre el tema.

Una medida de seguridad totalmente independiente de todo lo anterior tiene que
ver con el tipo de servicio que se quiere brindar en la red inalámbrica y qué
acceso deben tener los clientes de la misma a la red cableada. Suponiendo que se
tiene una empresa con una red corporativa en la que se brinda acceso a varios
servicios, como por ejemplo archivos compartidos. Si la información es sensible,
es muy recomendable que la misma sea sólo accesible mediante la red cableada y
no por la red inalámbrica.

Se define entonces normalmente una subred diferente para las redes cableadas e
inalámbricas, con distintos servicios en cada una de ellas. Se suele configurar
un firewall delante de la red inalámbrica que permita por ejemplo sólo tráfico
web. De esta manera, se puede brindar Internet a los dispositivos móviles pero,
si necesitan acceder a la red corporativa, deben conectarse con un cable. Este
tipo de medidas son altamente recomendables, ya que aún si con toda la seguridad
implementada alguien consigue asociarse a la red inalámbrica no podrá acceder a
los servicios de la empresa.

## Redes inalámbricas contra redes cableadas

Las redes inalámbricas tienen muchas ventajas a la hora de instalarlas:

* Reducen los costos en cables.
* Son rápidas para instalar.
* No requieren herramientas especiales.

No obstante, tienen varias desventajas frente a las redes cableadas:

* La seguridad en una red cableada es siempre mayor.
* Son más propensas a fallos.
* Es más difícil detectar errores.
* Las velocidades máximas son inferiores.
* La adición de nuevos equipos a la red deteriora su funcionamiento.

De lo anterior me gustaría aclarar los dos últimos puntos. Si bien es cierto que
las velocidades son menores en las redes inalámbricas, en general son
suficientes para cualquier uso de escritorio y compartir internet. Más aún, con
la nueva norma 802.11n ya se consiguen velocidades mayores que las de
FastEthernet, con lo cuál no implica una gran limitación para las capas de
acceso.

Con respecto al último punto es muy importante saber que la capacidad de una red
inalámbrica se deteriora a medida que se conectan más clientes. Esto es así
porque el medio es compartido y se genera más tráfico, resultando en más
colisiones. Además, el punto de acceso es global y no por cliente, por lo que a
medida que se agregan clientes se divide la capacidad del mismo entre ellos.
Esto de alguna manera es análogo a lo que ocurre en una red cableada con hubs.
