---
date: 2010-06-11 09:00:00 -3000
layout: post
title: "Introducción a LVM"
authors: leandro
categories: [ sistemas operativos ]
tags: [debian, filesystems, linux, lvm, ubuntu]
permalink: /2010/06/11/introduccion-a-lvm/

---

LVM2 es un administrador de volúmenes lógicos desarrollado para el kernel de
Linux, compatible con su predecesor LVM1. En la actualidad, LVM está disponible
en la mayoría de los sistemas Linux para utilizarlo al momento de la
instalación. De hecho, sistemas como Fedora utilizan LVM si se los particiona
como lo sugiere el instalador por defecto. <!-- more -->

La primer ventaja fundamental de LVM es que nos quita el inconveniente de
dimensionar exactamente las particiones tal cuál las necesitaremos,
encontrándonos luego con que el esquema de particionamiento escogido no es el
más adecuado. Este caso es muy fácil verlo con un ejemplo.

Se tiene un disco de 40G. Se desea instalar Linux allí entonces se decide
particionarlo de la siguiente manera:

{% highlight bash %}
/boot          200M
/                4G
swap             1G
/home           34G
{% endhighlight %}

El problema al que nos enfrentamos en este caso (me ha ocurrido en alguna
oportunidad) es quedarnos sin espacio en alguna partición y tener lugar de sobra
en otra. Por ejemplo, supongamos que se llena el disco raíz y sin embargo
tenemos aún 14G libres en /home. Eso representa una situación donde se hace un
uso ineficiente del espacio en disco, además de un problema. La solución más
obvia en este caso es hacer algún link simbólico apuntando a algún lugar de
/home, pero es una solución bastante mala.

Con LVM, la solución a este problema es trivial, dado que se podría simplemente
achicar la partición que contiene /home y aumentar luego el espacio asignado al
directorio raíz.

## Características de LVM2

LVM2 cuenta, básicamente, con las siguientes funcionalidades:

* Redimensión de grupos de volúmenes y volúmenes lógicos en línea.
* Crear instantáneas (snapshots) de lecturea/escritura del sistema de archivos.
* Constituir los volúmenes lógicos separados en los diferentes volúmenes físicos,
de manera similar que RAID 0.
* Mover los volúmenes lógicos entre los diferentes volúmenes físicos.

## Conceptos básicos de LVM

Para entender cómo funciona LVM es necesario conocer algunos conceptos
elementales, que son:

* **Volumen físico (PV)**: un PV es un disco rígido, una partición o un
RAID.
* **Volumen lógico (LV)**: un LV es el equivalente a una partición
tradicional.
* **Grupo de volúmenes (VG)**: un grupo de volúmenes reúne uno o más PVs.
Los PVs pueden comenzar a utilizarse en LVM recién cuando pasan a formar parte
de un VG.
* **Physical extent (PE)**: un PE es una porción de cada volumen físico,
de tamaño fijo. Un volumen físico se divide en mútiples PEs del mismo
tamaño.
* **Logical extent (LE)**: un LE es una porción de cada volumen lógico,
de tamaño fijo. Un volumen lógico se divide en mútiples LEs del mismo
tamaño.
* **Device mapper**: es un framework genérico del kernel de Linux que
permite realizar un mapeo de un dispositivo de bloques a otro. Es la herramienta
fundamental en la que se basa LVM para hacer el mapeo de los dispositivos
virtuales con los dispositivos físicos.

## Conclusión

LVM es un sistema muy interesante para utilizar ya sea en sistemas pequeños como
en sistemas con muchos discos y esquemas complejos de particionamiento. Por su
flexibilidad y sus capacidades puede reducir mucho el trabajo de mantenimiento
de los equipos y cualquier cambio a nivel de almacenamiento.

En un próximo post explicaré cómo trabajar con LVM, desde la creación de los
PVs, VGs y LVs, cómo redimensionarlos y eliminarlos e, incluso, cómo trabajar
con las instantáneas.
