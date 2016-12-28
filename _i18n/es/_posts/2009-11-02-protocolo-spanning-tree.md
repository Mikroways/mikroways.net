---
date: 2009-11-02 09:00:00 -3000
layout: post
title: Protocolo Spanning Tree
authors: leandro
categories: redes
tags: [cisco, protocolos, spanning tree, switching]
permalink: /2009/11/02/protocolo-spanning-tree/

---

En una red LAN la redundancia se logra teniendo varios enlaces físicos entre los
switches, de forma que queden varios caminos para llegar a un mismo destino. El
resultado de esto es que la red LAN queda con ciclos o bucles. En la figura
puede verse una red LAN redundante y cómo se forma un ciclo en ella.

![Topología de ejemplo](/images/blog/red-lan-redundante.png)

<!-- more -->

Si bien la red anterior es redundante los ciclos son altamente perjudiciales
para la misma dado que producen una serie de problemas que acabarán por dejarla
inutilizada. Dentro de dichos problemas podemos encontrarnos con:

* **Tormentas de broadcast**: los broadcast en la red son reenviados una y otra
vez y permanecen circulando en la misma sin fin, dado que en Ethernet no existe
como en IP un campo de TTL. Lógicamente, al no eliminarse la situación se agrava
con cada nuevo broadcast.
* **Múltiples copias de una trama**: con la redundancia es muy probable que un
host reciba una trama repetida, dado que la misma podría llegar por dos enlaces
diferentes.
* **Tabla CAM inconsitente**: una trama que proviene de una MAC en particular
podría llegar desde enlaces diferentes.
* **Bucles recursivos**: un bucle puede generar un nuevo bucle y estos crecer de
forma exponencial. En una situación así la red quedará inusable en pocos
segundos.

Ante la necesidad de tener una red LAN redundante y dinámica libre de los
problemas asociados a la redundancia resulta evidente que es imperioso un
protocolo que sea capaz de resolver estas cuestiones. Es aquí donde entra en
acción el Protocolo de Spanning Tree (STP).

## Terminología básica

Para comprender el funcionamiento del STP es necesario conocer alguna
terminología indispensable asociada al mismo.

* **Bridge ID**: es el identificador de cada bridge. Es el resultado de combinar
la prioridad del bridge con su dirección MAC base.
* **Root bridge (puente raíz)**: es el punto focal de la red y el que se toma
como referencia para las decisiones del STP. El RB será aquel switch que tenga
el menor bridge ID.
* **BPDU (Bridge Protocol Data Unit)**: son pequeñas unidades de datos que
transportan información de control del STP. Se las utiliza en primera instancia
para escoger el RB y luego para detectar posibles fallos en la red.
* **Bridges no raíz**: son todos los demás bridges de la topología. Participan
en el intercambio de BPDUs y actualizan a su vez su base de datos del STP.
* **Costo de un puerto**: se determina en base al ancho de banda del enlace y
será el valor que se utilice para decidir el camino más corto al RB.
* **Costo del camino al RB**: el costo de un camino al RB es la suma de los
costos de cada enlace por el que pasa. El camino elegido por el STP al RB será
aquel cuyo costo sea más bajo.
* **Puerto raíz (designado)**: es el puerto de cada bridge que se encuentra en
el camino mínimo al RB. Sólo hay uno por bridge que siempre estará en estado de
forwarding.
* **Puerto no designado**: todo puerto en un bridge con mayor costo que el
puerto designado. Será puesto en estado de bloqueo.

## Estado de los puertos

Cada puerto que participa del STP puede estar en uno de cinco estados. Estos
son:

* **Bloqueado (BLK)**: no reenvía tramas de datos, aunque sí recibe y envía
BPDUs. Es el estado por defecto de los puertos cuando un switch se enciende y su
función es la de prevenir ciclos.
* **Escuchando (LST)**: recibe, analiza y envía BPDUs para asegurarse que no
existen bucles.
* **Aprendiendo (LRN)**: al igual que el estado LST, recibe, analiza y envía
BPDUs, aunque aquí también comienza a armar la tabla CAM. En este estado aún no
se reenvían tramas de datos.
* **Reenviando (FWD)**: envía y recibe todas las tramas de datos. Los puertos
designados al final del estado de LRN serán marcados como FWD.
* **Deshabilitado**: es un puerto deshabilitado administrativamente y que no
participará en el STP. Para el STP un puerto en este estado es como si no
existiera.

## Operación del STP

El protocolo de STP cumple con una serie de pasos antes de alcanzar el estado
estable y comenzar a enviar tramas de datos. Los mismos son los que se listan a
continuación.

1. Escoger el RB:
   1. Se elige el bridge con prioridad más baja.
   2. Si uno o más switches tienen la prioridad más baja se elige entre ellos el
que posea la MAC base más baja.
2. Se eligen los puertos raíz: cada bridge encuentra el menor camino hasta el
RB y, con él, su puerto designado.
3. Cada uno de los bridges escucha BPDUs en todos sus puertos y, si detecta
algún bucle en un puerto, lo bloquea. De lo contrario lo pone en estado FWD. El
criterio para decidir qué puerto bloquear en un switch es el siguiente:
  1. Si debe escogerse un puerto entre dos switches diferentes se elige para
bloquear el de aquel switch con el mayor bridge ID.
  2. Si debe escogerse un puerto dentro del mismo switch entonces se escoge
aquel que tenga el mayor costo. En caso de coincidir el costo, el puerto que se
bloquea es aquel que tenga el identificador más alto.

A continuación se lista el costo de cada tipo de enlace para el STP (según
IEEE):

Ahora bien, para ver lo aprendido hasta aquí vamos a analizar un ejemplo. Se
plantea entonces la siguiente topología:

![Topología de ejemplo](/images/blog/spanning-tree-topo-apunte.png)

Se asume que todos los bridges tienen en la topología anterior la misma
prioridad. Entonces, sabemos que el primer paso es escoger el RB. Para ello, al
tener todos la misma prioridad vamos a escoger el que tenga menor dirección MAC,
que resulta ser el SWA.

El próximo paso es encontrar el camino mínimo desde cada switch hasta el RB.
Empezando por el SWB vemos que tiene tres puertos que nos permiten alcanzar el
RB. Por el puerto 1 el costo total es de 27, resultado de sumar 19 del enlace de
100 mbps y 4 de cada enlace de 1 gbps. Luego, tanto por el puerto 2 como por el
puerto 3 el costo total es de 19. En este caso, se escoge el puerto con
identificador más pequeño, que es el 2. De esta manera, el puerto 2 será el
puerto raíz y pasará a estado de FWD y el 3 quedará bloqueado. Dejaremos el
análisis del puerto 1 para un poco más adelante.

Para el caso del SWC, el puerto raíz es el 1, ya que el costo por allí es de 4.
Nuevel costo total  el análisis del puerto 2 para más adelante.

Finalmente, el SWD tiene dos posibles caminos al RB. Uno de ellos con costo 8 a
través del puerto 2 y el otro con costo 38 por el puerto 1. Lógicamente será
puerto raíz el puerto 2.

El último paso es decidir, de los puertos que quedaron sin determinar, cuál
pasará a estado BLK para romper el bucle. Veamos las posibilidades:

* Puerto 1 de SWB.
* Puerto 2 de SWC.
* Puerto 1 de SWD.

De lo anterior, el puerto 2 de SWC no podrá ser dado que está en el camino
mínimo del SWD al RB. Así que ese pasará a estado FWD. La decisión se reduce
entonces entre el puerto 1 del SWB y el 1 del SWD. Ante esta situación se
resolvía bloqueando el puerto del bridge con mayor MAC, lo que implica que el
puerto 1 del SWD quedará en BLK y el puerto 1 del SWB en FWD.

## Extensiones de Cisco

* **Portfast**: un puerto marcado como portfast será puesto en estado de FWD
desde el inicio. Es especialmente útil para aquellos puertos donde estemos
seguros que va a haber un único host. Asociado a portfast existen dos técnicas
que permiten impedir un bucle en un puerto en este modo.
  * **BPDU guard**: su objetivo es el de evitar que se conecte un switch a un
puerto de este tipo. Por ello, al recibir una BPDU el puerto se pone en estado
de deshabilitado por error.
  * **BPDU filter**: es menos restrictivo que el anterior y lo que hace es
detectar BPDUs en el puerto. Si se recibe alguna se saca al puerto de modo
portfast y pasa al estado de bloqueo para cumplir con todos los pasos requeridos
por el protocolo.
* **Uplink fast**: debería ser habilitado en aquellos switches en donde existe
algún puerto en estado de bloqueo. En ese caso, si se detecta una caída en el
puerto que está como FWD se habilita rápidamente el puerto bloqueado, sin el
delay habitual. Permite una reacción más rápida ante un inconveniente en la red.
* **Backbone fast**: en este caso, se detecta el fallo en algún otro switch de
la red y su objetivo es acelerar la convergencia ante dicho fallo.

## Rapid Spanning Tree

El protocolo RSTP es un estándar que incorpora muchas características que
aceleran el proceso de convergencia inicial y ante un fallo, valiéndose de
varias de las ideas anteriores de Cisco. Es totalmente compatible con STP y de
hecho un bridge ejecutando STP y otro RSTP pueden convivir perfectamente en la
misma red, aunque utilizando el protocolo STP. Por ello, para que RSTP funcione,
todos los switches deben soportarlo.

## Etherchannel

Cuando existen dos enlaces entre dos switches una alternativa es utilizar
Etherchannel. Esta tecnología lo que hace es combinar dos o más puertos como si
fueran uno solo, agregando el ancho de banda a ese único canal lógico.

Un etherchannel provee también redundancia, dado que si uno de los links se cae
sigue funcionando perfectamente, con un ancho de banda reducido. La ventaja
entonces en comparación con STP es que etherchannel hace uso activo de todos los
enlaces, en contraste con STP que de un conjunto utilizaría sólo uno.

<table class="table table-striped table-bordered">
  <thead>
    <tr>
      <th>Tipo de enlace</th>
      <th>Costo</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>10 Gbps</td>
      <td>2</td>
    </tr>
    <tr>
      <td>1 Gbps</td>
      <td>4</td>
    </tr>
    <tr>
      <td>100 Mbps</td>
      <td>19</td>
    </tr>
    <tr>
      <td>10 Mbps</td>
      <td>100</td>
    </tr>
  </tbody>
</table>
