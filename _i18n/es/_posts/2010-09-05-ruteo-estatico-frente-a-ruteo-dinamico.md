---
date: 2010-09-05 09:00:00 -3000
layout: post
title: Ruteo dinámico
authors: leandro
categories: redes
tags: [internet, ruteo]
permalink: /2010/09/05/ruteo-estatico-frente-a-ruteo-dinamico/

---

Para que una red funcione correctamente es necesario que todos los routers
conozcan las distintas redes que pueden alcanzar y por dónde. Este conocimiento
y la decisión de a quién enviar el tráfico es responsabilidad del router. Ahora
bien, para obtener el conocimiento necesario, un equipo se puede basar
básicamente en dos estrategias: ruteo estático y ruteo dinámico. <!-- more -->

## Ruteo estático

El ruteo estático es la forma más sencilla y que menos conocimientos exige para
configurar las tablas de ruteo en un dispositivo. Es un método manual que
requiere que el administrador indique explícitamente en cada equipo las redes
que puede alcanzar y por qué camino hacerlo.

La ventaja de este método, además de la simpleza para configurarlo, es que no
supone ninguna sobrecarga adicional sobre los routers y los enlaces en una red.
Sin embargo, las desventajas principales son determinantes en muchos casos para
no escoger este método.

Por un lado, configurar rutas estáticas en una red de más de unos pocos routers
puede volverse un trabajo muy engorroso para el administrador, además de
aumentar la probabilidad de cometer un error, en cuyo caso puede llegar a ser
bastante dificultoso encontrar dicho error. Pero además, existe un problema aún
más importante: la redundancia. Cuando se utiliza ruteo estático en una red con
redundancia y hay un fallo en un enlace **el administrador debe modificar las
rutas manualmente**, lo cuál implica un tiempo de respuesta ante una falla mucho
mayor que si se utiliza un método automático.

## Ruteo dinámico

En contraposición con el método estático, el ruteo dinámico utiliza diferentes
protocolos cuyo fin es el de intercambiar rutas entre dispositivos intermedios
con el objetivo de tener una red totalmente accesible. En este caso, los routers
envían y reciben información de enrutamiento que utilizan para armar sus tablas
de ruteo.

El ruteo dinámico tiene varias ventajas que lo convierten en el preferido en la
mayoría de los casos: configurar el ruteo en una red mediana a grande implica
mucho menos trabajo para el administrador, a la vez que permite que la red
completa se ponga en funcionamiento en un tiempo mucho menor; es capaz también
de adaptarse a los problemas, ya que puede detectar la falla de un enlace
principal y utilizar entonces un enlace alternativo para alcanzar el destino (si
lo hubiera).

Las desventajas son que, al intercambiar información entre los dispositivos y
requerir que cada router procese dicha información se utiliza tanto ancho de
banda de los enlaces como tiempo de procesamiento en los equipos, lo cuál en
algunas circunstancias puede convertirse en un problema. Adicionalmente,
dependiendo del protocolo que se utilice, el enrutamiento dinámico requiere un
mayor conocimiento por parte del administrador, tanto para configurarlo de forma
correcta como para solucionar problemas.

## Conclusión

En este breve post se ha visto una introducción a cada tipo de protocolo de
ruteo. La elección de un tipo sobre el otro depende siempre del administrador,
aunque en muchos casos también puede existir una limitación en el hardware
utilizado o en las políticas de la organización.
