---
date: 2009-09-05 09:00:00 -3000
layout: post
title: Introducción a la virtualización
authors: leandro
categories: [ sistemas operativos ]
tags: [kvm, virtualbox, virtualización, vmware, xen]
permalink: /2009/09/05/introduccion-a-la-virtualizacion/

---

La idea de este post es dar una brevísima introducción a algunos de los
conceptos básicos de la virtualización, orientados a la arquitectura x86. Luego,
en un post cercano estaré explicando algo en la práctica. <!-- more -->

## Conceptos básicos

* **Sistema host**: es el sistema que sirve de plataforma base para las máquinas
virtuales. En otras palabras, es el sistema instalado directamente en el
hardware.
* **Sistema guest**: es el sistema operativo de la máquina virtual.
* **Hypervisor**: es un software que permite ejecutar varios sistemas operativos
concurrentemente en una única máquina física. También se lo suele denominar
Virtual Machine Monitor (VMM).

## Virtualización y otros métodos

* **Emulador**: un emulador es un software que es capaz de ejecutar programas
escritos para otra plataforma o arquitectura como si estuvieran en realidad
ejecutándose en ella, dado que traduce cada instrucción de la máquina huésped a
una instrucción válida para la arquitectura del host. Por ejemplo, un emulador
permitiría ejecutar un programa de Mac OS X en Linux. En el caso de un emulador,
**el software que permite ejecutar es el mismo (sin ninguna modificación) que
funciona en la plataforma para la que fue originalmente desarrollado**.
* **Simulador**: en este caso, se trata de un software que copia el
comportamiento de otro, intentando ser lo más parecido al software que trata de
imitar. Notar que **un simulador se trata de otro software distinto al que
intenta simular**.
* **Virtualizador**: un virtualizador es, por su parte, un software que permite
crear máquinas virtuales dentro de una máquina física. La principal diferencia
con un emulador es que no traduce instrucciones sino que
las ejecuta directamente, con lo cuál no es posible virtualizar un guest
diseñado para una plataforma diferente a la del host. No obstante, la ventaja de
esto es que se obtiene un rendimiento mucho mayor comparado con los
emuladores.

## Tipos de virtualización

Existen varios tipos de virtualización, algunos de los cuáles resumo a
continuación. Para una explicación detallada recomiendo una lectura del white
paper de VMware titulado
[Understanding Full Virtualization, Paravirtualization and Hardware Assist](http://www.vmware.com/files/pdf/VMware_paravirtualization.pdf).

* **Paravirtualización:** la paravirtualización es una técnica que permite
reducir la sobrecarga producida por la virtualización, incrementando la
performance del guest de manera que se obtenga un rendimiento casi idéntico a la
ejecución nativa. Para esto **requiere que se modifique el sistema operativo que
se virtualizará**, lo que hace que la paravirtualización sea poco flexible (no
es posible paravirtualizar sistemas Windows). No obstante su excelente
rendimiento la convierten en una opción ideal para el caso que se necesite
virtualizar sistemas operativos que soporten paravirtualización y el hardware no
tenga las extensiones de virtualización necesarias.
* **Virtualización completa:** la virtualización completa permite ejecutar un
sistema operativo guest sin ninguna modificación en él. Es necesario tener en
cuenta que para esto se requiere algún "artilugio" a nivel de software o el
soporte del hardware. El motivo está dado por la propia arquitectura x86, que
utiliza diferentes niveles de acceso para el sistema operativo y para las
aplicaciones de usuario. Entonces, si la máquina virtual se ejecuta en el nivel
de aplicación no podrá funcionar dado que el sistema operativo virtual requerirá
el acceso al nivel privilegiado. Aquí podemos hablar entonces de dos estrategias
para la virtualización completa:

* **Virtualización completa con traducción binaria:** esta técnica traduce las
instrucciones del kernel del sistema operativo virtualizado mientras que ejecuta
directamente las instrucciones de las aplicaciones de usuario. Este tipo de
virtualización es muy eficiente y tiene la ventaja de que puede llevarse a cabo
en cualquier hardware.
* **Virtualización completa asistida por hardware:** en este el propio hardware
provee la tecnología para que las máquinas virtuales puedan ejecutar el sistema
operativo en el nivel privilegiado que utilizaría si estuviera instalado
físicamente. En otras palabras, lo que antes se hacía con una traducción
binaria ahora se ejecuta directamente. Lógicamente, la performance en los
procesadores modernos es mayor con este método. Su desventaja es obvia: **el
hardware que se utilice debe tener incorporada la tecnología de virtualización**.



## Ventajas de la virtualización
Existen numerosas ventajas que hacen que la virtualización sea una técnica cada
vez más adoptada para montar los servicios de un datacenter. La mayoría de ellas
vienen dadas por el hecho de que en un único equipo es posible ejecutar
numerosas máquinas virtuales, algo que antes habría requerido numerosos equipos.
Veamos una lista de algunas de las ventajas:
* Reducción de espacio físico ocupado.
* Reducción de consumo eléctrico.
* Reducción de calor en los datacenters.
* Mayor seguridad: en las empresas o instituciones de bajo presupuesto se suele
utilizar un único servidor para montar todos los servicios, lo que hace que una
vulnerabilidad en cualquiera de los servicios prestados exponga a todos los
demás. Con las máquinas virtuales es posible pensar una máquina por servicio (o
agrupando por tipos de servicios).
* Facilidad de administración: al reducir la cantidad de equipos a administrar
se facilita el trabajo en este aspecto.
* Mayor disponibilidad: con servidores físicos cualquier cambio de hardware
requería apagar la máquina y con ella dar de baja los servicios para realizar el
mantenimiento. Con las máquinas virtuales es posible moverlas en caliente a otro
servidor, apagar el que se requiera y volver a restaurarlas luego al servidor
original sin necesidad de apagar las máquinas virtuales en ningún momento.
* Mejora en la tolerancia a fallos: replicar una máquina virtual es mucho más
sencillo que replicar una máquina física. Aún más, es mucho más económico tener
dos máquinas virtuales exactamente idénticas encendidas todo el tiempo que dos
máquinas físicas.

## Plataformas de virtualización

Existen numerosas plataformas para virtualizar. Los más populares de ellos son:

* [KVM](http://www.linux-kvm.org/page/Main_Page): utiliza virtualización
completa por hardware y requiere que el sistema operativo host sea Linux. Es
open source y gratuito.
* [VirtualBox](http://www.virtualbox.org/): propiedad de Sun desde hace ya un
tiempo, es un producto open source con versiones para Windows, Linux, Mac OS X y
OpenSolaris. VirtualBox permite realizar virtualización completa eligiendo
traducción binaria o asistida por hardware.
* [VMware](http://www.vmware.com/es/): VMware es quizá el producto con más
experiencia y madurez en el mercado. Tiene muchísimas versiones diferentes que
soportan múltiples técnicas de virtualización. Entre ellas, la gama ESX instala
directamente el hypervisor sobre el hardware, sin necesidad de otro sistema
operativo que le sirva de host. Este tipo de plataforma se denomina precisamente
non-hosted. Puede accederse a varias versiones gratuitas y otras son pagas.
* [Xen](http://xen.org/): corre sobre hosts Linux y soporta paravirtualización y
virtualización completa por hardware. Es un muy buen producto muy popular entre
los usuarios de Linux, sobre todo en plataformas de paravirtualización. También
es open source.

## Conclusión

En este post he intentando dar un panorama al mundo de la virtualización. El
tema es extenso y complejo con lo cuál esto debe servir quizá como punto de
partida y/o motivación para continuar leyendo y profundizando. Sin dudas he
dejado muchas cosas afuera pero todo ha sido con el afán de mantener el post
breve y claro.
