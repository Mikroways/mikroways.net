---
date: 2009-08-08 09:00:00 -3000
layout: post
title: Modelos OSI y TCP/IP
authors: leandro
categories: redes
tags: [estándares, modelos, osi, protocolos]
permalink: /2009/08/08/modelos-osi-y-tcpip/

---

En el estudio de las redes existen dos modelos fundamentales que son el modelo
[OSI](http://en.wikipedia.org/wiki/OSI_model) y el
[TCP/IP](http://en.wikipedia.org/wiki/Internet_Protocol_Suite). Conocerlos y
entenderlos es fundamental para cualquier profesional de redes. <!-- more -->

El primero de ellos es un modelo teórico y de referencia creado por la ISO. Se
lo utiliza para el aprendizaje, el desarrollo de nuevas tecnologías y para el
análisis de problemas. No obstante, no es la mejor opción para ser la
especificación práctica de los protocolos. El motivo es que divide demasiado las
capas, lo cuál hace que en la práctica un protocolo implemente varias de las
capas juntas dado que se hace difícil separar su funcionalidad.

El segundo fue creado por el Departamento de Defensa de Estados Unidos y es el
modelo de protocolos que utilizan las redes actualmente.

A continuación dejo el diagrama de ambos modelos:

![Modelo OSI y TCP/IP](/images/blog/OSI-TCP_IP.png)

Se puede ver en la imagen que el modelo TCP/IP resume las *capas de aplicación*,
*presentación* y *sesión* del modelo OSI en una sola *capa de aplicación*. Lo
mismo ocurre con las *capas de enlace de datos* y *física*, que son resumidas en
la *capa de acceso a la red*.

Puede verse entonces cómo el modelo TCP/IP es más sencillo que el OSI, aunque es
este último al que se hace referencia normalmente al hablar de las capas y el
número de capa. Por ejemplo, se habla de switches de capa 3 al referirse a
aquellos equipos que son capaces de interpretar las direcciones de red y no las
direcciones de capa de transporte.
