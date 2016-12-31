---
date: 2010-01-18 09:00:00 -3000
layout: post
title: Introducción a las VLAN
authors: leandro
categories: redes
tags: [lan, switching, vlans]
permalink: /2010/01/18/introduccion-a-las-vlan/

---

Una VLAN (virtual LAN) es, conceptualmente, una red de área local formada a
nivel lógico. Dada esta particularidad, las VLANs proveen una forma de separar
grupos de hosts con objetivos diferentes aunque estos se encuentren conectados
al mismo switch. A su vez, en este punto, nos permite optimizar los puertos de
switch. <!-- more -->

Debajo pueden verse dos topologías que dan como resultado una misma red a nivel
lógico. La primera de ellas no utiliza VLANs, con lo cual necesita de diferentes
switches para garantizar una correcta separación entre las redes. La segunda
utiliza el mismo switch pero con un esquema de VLANs.

![Figura 1](/images/blog/vlanpost-novlan.png)

![Figura 2](/images/blog/vlanpost-convlan.jpg)

Si vemos la configuración del switch en la figura 2 podemos abstraerlo en tres
switches diferentes, como muestra la figura 3.

![Figura 3](/images/blog/vlanpost-switch.png)

Por su naturaleza, una VLAN puede formarse también a partir de múltiples
segmentos de LAN. Esto permiten que estaciones de trabajo ubicadas físicamente
en lugares diferentes pueden trabajar en la misma red lógica (es decir, con el
mismo direccionamiento de red), como si estuvieran conectadas al mismo switch.
La figura 4 muestra un ejemplo de este caso.

![Figura 4](/images/blog/vlanpost-trunked.png)

## Funcionamiento de las VLAN

Hasta ahora hemos visto que un switch es capaz de separar los hosts de las
diferentes VLANs como si los grupos de puertos fueran efectivamente switches
diferentes. Que funcione dicha separación trabajando con un único switch no es,
a priori, difícil. El trabajo que debe hacer el switch es comunicar sólo entre
sí los hosts que pertenezcan a una misma VLAN. Con indicarle en su configuración
a qué VLAN pertenece cada puerto el inconveniente estaría solucionado.

El problema surge cuando deseamos que la separación se mantenga entre diferentes
switches, permitiendo aún la comunicación entre hosts de la misma VLAN. Veamos
la figura 4. Es claro, como ya dije anteriormente, que dentro de un mismo switch
no hay problema. ¿Pero qué ocurre cuando el tráfico de un switch pasa a los
siguientes? En el primer switch hay tres hosts en la VLAN 2 que se comunican con
un host de la VLAN 2 en el segundo switch y uno en el tercero. No obstante, en
estos dos últimos hay hosts que pertenecen a otras VLANs y también deben
comunicarse entre sí. Si el lector es observador notará que entre cada switch
hay un único cable, lo que supone que tanto el tráfico de la VLAN 2 como el de
la VLAN 3 se mezclan en dicho cable. No obstante, los switches son capaces de
garantizar la separación de las VLANs y la comunicación entre los hosts. Veamos
cómo ocurre esto.

Para la comunicación entre switches se utiliza un protocolo estándar definido
por la IEEE. Se trata de 802.1q, cuya función es la de encapsular las tramas
Ethernet en una nueva estructura. Así, a la trama Ethernet tradicional se le
agregan 4 bits en la cabecera que conforman el identificador de VLAN. De esta
manera, el tráfico va todo junto en el mismo cable pero es fácilmente
identificable.

## Tipos de puertos

Un switch que utiliza VLANs puede tener dos tipos de puertos: puertos de acceso
y puertos de trunk. A continuación se da una explicación de cada uno de ellos.

* **Puertos de acceso**: este tipo de puertos son los que
conectan hosts finales. Trabajan con las tramas clásicas de Ethernet, sin el
agregado de las etiquetas de VLAN.
* **Puertos de trunk**: los puertos de trunk tienen una función
especial que es la de conectar switches entre sí o un switch con un router.
Cuando llega tráfico a un puerto de trunk proveniente desde el propio switch,
éste es etiquetado con el identificador de VLAN y enviado por el puerto. El
equipo que lo recibe, desencapsula la trama Ethernet (quitándole la etiqueta) y
lo envía al puerto que corresponda.

## Conclusión

Las VLANs son un medio muy poderoso a la hora de gestionar redes de área local
de mediano y gran tamaño. Ampliamente utilizadas hoy en día, el conocimiento y
comprensión de las mismas es fundamental para cualquier administrador de redes.
