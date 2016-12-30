---
date: 2009-09-30 09:00:00 -3000
layout: post
title: Resetear password de root en Linux
authors: leandro
categories: [ sistemas operativos ]
tags: [linux, troubleshooting]
permalink: /2009/09/30/resetear-password-de-root-en-linux/

---

En caso de olvidar la password de root existe un método para recuperarla si
usamos Grub como gestor de booteo (lo usan todos los Linux modernos). Para ello
es necesario seguir los siguientes pasos:<!-- more -->

* El primer paso es que cuando se nos muestra la lista de sistemas a iniciar
apretar la letra "e" sobre el que deseemos iniciar para recuperar la contraseña.
Esto se haría desde una pantalla similar a la siguiente:

![Pantalla inicial de Grub](/images/blog/grub-1.png)

* Al hacerlo nos encontraremos con una pantalla como la siguiente, en la cuál
debemos elegir la línea correspondiente al kernel (la segunda en este caso) y
nuevamente apretar "e" para editar.

![Editar el Kernel](/images/blog/grub-2.png)

* En este paso podremos editar los parámetros que se le pasan al kernel. Lo
que haremos será agregar al final *init=/bin/sh* lo que hará que al bootear nos
quede una consola como root. Se puede ver esto en la siguiente pantalla, donde
luego de escribir lo anterior apretaremos *enter* y finalmente la letra "b" para
ordenarle al grub que inicie el booteo.

![Parámetros del Kernel](/images/blog/grub-3.png)

* Al terminar de bootear aparecerá una consola logueada como root en la que
deben llevarse a cabo dos pasos: montar el sistema de archivo raíz como de
lectura/escritura y cambiar la contraseña de root. Esto es lo que se hace en el
siguiente paso:

![Cambio de contraseña](/images/blog/grub-4.png)

Con lo anterior, al reiniciar el sistema se iniciará como normalmente con la
nueva contraseña asignada para root.
