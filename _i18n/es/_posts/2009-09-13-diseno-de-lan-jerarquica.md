---
date: 2009-09-13 09:00:00 -3000
layout: post
title: Diseño de LAN jerárquica
authors: leandro
categories: redes
tags: [diseño, lan, ruteo, switching]
permalink: /2009/09/13/diseno-de-lan-jerarquica/

---

El tipo de diseño de LAN jerárquica es quizá el más difundido debido a su
simpleza y a varias características importantes que garantiza: redundancia,
escalabilidad, seguridad, mantenibilidad. La idea es muy sencilla y consiste en
dividir una red LAN en tres capas diferentes: <!-- more -->


* **Capa de acceso (access layer):** en la capa de acceso se tiene los
dispositivos finales conectados a los switches, hubs, access points, bridges. Es
la encargada además de controlar qué dispositivos pueden conectarse a la red y
cuáles no.
* **Capa de distribución (distribution layer):** en esta capa se interconectan
los dispositivos de la capa de acceso y provee funcionalidades de ruteo entre
las diferentes subredes de la LAN, dividiendo los dominios de broadcast,
usualmente por medio de VLANs. Es posible encontrar aquí routers y switches de
capa 3. También se realizan controles de seguridad por medio de reglas de
filtrado. Es importante notar que los equipos de esta capa deben tener una
buena capacidad de procesamiento.
* **Capa de núcleo (core layer):** la capa de núcleo provee la interconexión de
los dispositivos de la capa de distribución y conectan la red LAN a redes
externas, como por ejemplo Internet. Es aquí donde se encuentran los routers de
borde. Para un buen rendimiento de la red, los equipos de la capa de núcleo
deben proveer altas tasas de transferencia con latencias muy bajas. Su función
debe limitarse sólo al reenvío de paquetes, minimizando el procesamiento.

Es importante notar que cada dispositivo de una capa se conecta con dispositivos
de una capa adyacente; es decir que **nunca se conecta directamente un
dispositivo de capa de acceso a uno de capa de núcleo**. Además, excepto en el
núcleo, **los dispositivos de una misma capa tampoco deberían conectarse entre
sí**.

![Topología de ejemplo](/images/blog/lan-jerarquica.png)

Ahora bien, a simple vista es probable que las funciones de la capa de núcleo y
de distribución parezca que pueden resumirse en una sola. Efectivamente esto
puede realizarse y de hecho ocurre en redes pequeñas. No obstante, el motivo por
el cuál se separan en redes de mayor tamaño es para dividir el trabajo;
fundamentalmente, la capa de distribución implementa varias funciones que tienen
gran demanda de procesamiento y, de esta manera, alivia el trabajo que tendría
en otro caso la capa de núcleo.

Por otra parte, la capa de distribución y de núcleo necesitan ser
**redundantes** ya que un fallo en alguna de ellas puede afectar la red
completa. Para ello se suelen **duplicar los equipos**, aplicar el protocolo de
**spanning tree** y utilizar **ruteo dinámico**. Otra característica muy
importante está en los enlaces entre equipos, ya que podrían representar un
cuello de botella para la red. Para evitar esto, suelen utilizarse puertos de
mayor ancho de banda combinados con el **agregado de enlace** (bound channel o
Etherchannel).

En resumen, la siguiente tabla deja la función predominante de cada capa:

<table class="table table-striped table-bordered">
  <thead>
    <tr>
      <th>Capa</th>
      <th>Función principal</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Núcleo</td>
      <td>Reenvío de datos</td>
    </tr>
    <tr>
      <td>Distribución</td>
      <td>Routing</td>
    </tr>
    <tr>
      <td>Acceso</td>
      <td>Switching</td>
    </tr>
  </tbody>
</table>

