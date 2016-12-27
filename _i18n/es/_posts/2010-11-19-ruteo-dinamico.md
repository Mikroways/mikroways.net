---
date: 2010-11-19 09:00:00 -3000
layout: post
title: Ruteo dinámico
authors: leandro
categories: redes
tags: [internet, protocolos, ruteo]
permalink: /2010/11/19/ruteo-dinamico/

---

En un post anterior se describieron las [características del ruteo estático y
dinámico](/2010/09/05/ruteo-estatico-frente-a-ruteo-dinamico/), explicando
ventajas y desventajas de cada uno. En este caso, se explicarán los diferentes
tipos de ruteo dinámico y las características de cada uno. Existen
fundamentalmente dos tipos de protocolos de ruteo dinámico: los de vector
distancia y los de estado de enlace. Ambos se tratan a continuación. <!-- more -->

## Protocolos de vector distancia

En una red donde se utiliza un protocolo de vector distancia cada dispositivo
envía actualizaciones periódicas indicando una por una las redes que puede
alcanzar y la métrica para llegar a ellas (es decir, cuánto le cuesta llegar a
esa red). De esta manera, cada router conoce sólo a sus vecinos, las redes que
puede alcanzar por medio de ellos y el costo de ir por cada vecino (en caso de
existir múltiples caminos para un mismo destino). Para su funcionamiento se
basan en el algoritmo de [Bellman-Ford](http://en.wikipedia.org/wiki/Bellman–Ford_algorithm).

Por su naturaleza, los protocolos de vector distancia no tienen un conocimiento
global de la topología entera de la red, lo cuál puede traer asociadas algunas
dificultades como la posibilidad de bucles de ruteo. Adicionalmente, en una red
de dimensiones considerables, el intercambio de información propia de estos
protocolos puede generar un gran tráfico en la red. No obstante, cuentan con dos
ventajas importantes: son simples en su funcionamiento lo cuál implica facilidad
de configuración y detección de errores y la ejecución de su algoritmo consume
pocos recursos en los routers.

## Protocolos de estado de enlace

Los protocolos de estado de enlace, por su parte, se basan para funcionar en dos
bases fundamentales:

* Un conocimiento global de la red, con nodos, enlaces y los costos de los
mismos.
* Un algoritmo capaz de encontrar los caminos mínimos desde un punto a cada
destino.

Las ventajas de los protocolos de ruteo de estado de enlace es que al
tener un conocimiento global de la red siempre eligen los caminos óptimos y no
corren riesgos de sufrir bucles de ruteo. Además convergen de manera rápida y
reaccionan de una forma mucho más veloz al detectar algún problema en la red.
Otra gran ventaja es que son escalables lo que permite que sean utilizados en
redes medianas y grandes, dado que algunos de ellos soportan un diseño de red
jerárquico. Además suelen consumir pocos recursos de la red una vez que está
funcionando y si la misma se mantiene estable.

Las mayores desventajas de estos protocolos son, por un lado, su complejidad de
funcionamiento, lo que requiere que el administrador tenga un conocimiento
profundo para que funcionen de forma óptima y poder resolver eventuales
problemas. Los mismos utilizan el [algoritmo de Dijsktra](http://es.wikipedia.org/wiki/Algoritmo_de_Dijkstra)
para desempeñar su función. Otra desventaja es que son bastante más demandantes
en capacidad de procesamiento en comparación con los de vector distancia.

## Clasificación de los protocolos más conocidos


<table class="table table-striped table-bordered">
  <thead>
    <tr>
      <th>Protocolo</th>
      <th>Tipo</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>RIP</td>
      <td>Vector distancia</td>
    </tr>
    <tr>
      <td>OSPF</td>
      <td>Estado de enlace</td>
    </tr>
    <tr>
      <td>IS-IS</td>
      <td>Estado de enlace</td>
    </tr>
    <tr>
      <td>EIGRP</td>
      <td>Vector distancia (aunque se podría decir que es un híbrido, dado que tiene características de los protocolos de estado de enlace)</td>
    </tr>
    <tr>
      <td>BGP</td>
      <td>Vector de ruta</td>
    </tr>
  </tbody>
</table>
