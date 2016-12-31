---
date: 2010-11-29 09:00:00 -3000
layout: post
title: ¿Qué es el MTU?
authors: leandro
categories: redes
tags: [mtu, protocolos]
permalink: /2010/11/29/¿que-es-el-mtu/

---

Básicamente, el MTU (Maximum Transmission Unit) define el tamaño máximo que
pueden tener los datos en capa 2 para un protocolo cualquiera. Lo que esto
significa es que si por ejemplo una trama de datos excede el MTU, dicha trama
deberá ser dividida en porciones más pequeñas para que pueda ser enviada por la
red utilizando el protocolo subyacente. <!-- more -->Dependiendo del protocolo,
el MTU puede estar prefijado o definirse al momento de la conexión. Por ejemplo,
el MTU para Ethernet es de 1500 bytes.

Ahora bien, la pregunta que surge muchas veces es si conviene un MTU grande o
uno pequeño y la respuesta está asociada en general al tipo de medio con el que
se cuente, aunque es importante primero entender las ventajas y desventajas en
casa caso. Un MTU grande suele ser más eficiente debido a que puede llevar gran
cantidad de datos de usuario, haciendo que el porcentaje de overhead (dado por
los diferentes encabezados) sea menor. A su vez, para igual cantidad de datos,
un MTU mayor implica menos tramas lo que también redunda en eficiencia, debido a
que los dispositivos intermedios deben interactuar con menos paquetes. Por otro
lado, existen dos desventajas principales asociadas a MTU muy grandes; una de
ellas es que si en una de las tramas se detecta un error se descarta toda la
trama, siendo entonces mayor el tiempo y el ancho de banda que se desperdician;
la otra es que el enlace que transmite tramas grandes puede verse ocupado
durante bastante tiempo, lo que implicaría retrasar otros datos de usuario,
deteriorando la calidad del servicio.

Entonces y básicamente, el tamaño del MTU suele derivarse de la velocidad del
enlace y la confiabilidad del mismo, dado que por ejemplo en un enlace con mucha
tendencia a errores es poco eficiente un MTU grande, mientras que resulta ideal
en enlaces confiables y rápidos.
