---
date: 2010-01-19 09:00:00 -3000
layout: post
title: "RFCs: concibiendo un Internet Standard"
authors: leandro
categories: redes
tags: [documentos, estándares, ietf, internet, rfc]
permalink: /2010/01/19/rfcs-concibiendo-un-internet-standard/

---

Todos los que trabajamos en el área de las redes conocemos y hemos leído en más
de una oportunidad una [RFC](/2009/07/12/¿que-es-una-rfc/). No obstante, no
todos saben qué estados puede tener una RFC y cuál es el proceso para
convertirse en estándar. Sin ir más lejos me pasó hace poco, cuando descubrí
que la especificación de IPv6 se encontraba en estado Draft Standard. Esta
particularidad me llamó la atención y por ello, luego de investigar, decidí
escribir este post. <!-- more -->

Por empezar, cualquier persona tiene la posibilidad de escribir un documento y
enviarlo a la [IETF](/2010/01/01/ietf-internet-engineering-task-force/) para
que sea evaluado. El mismo tendrá nivel inicial de Internet Draft y podrá ser
eventualmente definido como RFC. De ser así, la primer categoría que obtendrá
será de la de Proposed Standard, para luego convertirse en Draft Standard y,
finalmente, en Internet Standard (o simplemente Standard). El proceso completo
se explica en las 36 páginas de la [RFC 2026](http://www.ietf.org/rfc/rfc2026.txt).

## Internet Draft

Como hemos dicho, cualquier persona puede enviar un documento a la IETF, pero es
importante saber que el mismo debe cumplir una
[serie de requisitos](http://www.ietf.org/ietf-ftp/1id-guidelines.html), varios
de los cuáles pueden chequearse mediante una
[herramienta provista por la IETF](http://tools.ietf.org/tools/idnits/). Si
todos los requisitos se cumplimentan correctamente entonces se envía el
documento utilizando la
[I-D Sumission Tool](https://datatracker.ietf.org/idst/upload.cgi), también
provista por la IETF. Así, desde ese momento, el documento enviado se convierte
en un Internet Draft (borrador de Internet) que quedará disponible para la
comunidad de Internet por un plazo máximo de 185 días. Al cabo de ese tiempo el
mismo será eliminado a no ser que haya sido actualizado o que lo haya comenzado
a tratar la IESG. Un Internet Draft puede convertirse en una RFC, logrando el
nivel de Proposed Standard, si genera el suficiente interés en la comunidad.

## Proposed Standard

Los requisitos para que un documento alcance esta categoría son que el mismo sea
un Internet Draft y haya sido encontrado útil por la comunidad, tenga la
suficiente revisión de diferentes personas y organismos y haya resuelto
problemas de forma o funcionamiento derivados de la especificación inicial. Se
asume que un documento en este estado es suficientemente estable aunque es
posible que se vuelva a revisar la especificación para realizar mejoras o
solucionar inconvenientes.

Normalmente no se requiere ninguna implementación existente ni pruebas
operacionales para que un documento sea categorizado como Proposed Standard,
sino tan sólo ser tratado y aprobado por la IESG. No obstante, se requieren
experiencias prácticas si el documento propone modificaciones a los protocolos
fundamentales de Internet.

Los documentos en este estado son considerados inmaduros y no se aconseja su uso
en ambientes de producción, donde se brinde un servicio ininterrumpido. No
obstante se estimula la implementación de los mismos, de modo de lograr
referencias para mejorar la especificación.

Todo documento que alcanza este estado es considerado como una RFC y es aquí
donde se le asigna un número que lo identificará.

## Draft Standard

Para alcanzar este nivel es necesario probar al menos dos casos de éxito de
implementaciones independientes e intercambiables y que hayan surgido de códigos
diferentes. En este caso, para que un Proposed Standard se transforme en Draft
Standard las implementaciones de las que se habla deben abarcar todos y cada una
de las funcionalidades mencionadas en el Proposed Standard. En caso de no ser
así, sólo es posible una promoción si las características no testeadas se
remueven de la especificación.

Una especificación en este estado es considerada como suficientemente madura y
puede ser utilizada en ambientes de producción. Con el uso y la experiencia la
misma puede modificarse pero sólo para solucionar bugs y no para agregar ni
quitar funcionalidades.

## Internet Standard

Finalmente, luego de un largo proceso de testeo y mejoras y con un número
importante de implementaciones exitosas y un tiempo considerable de experiencia
en el mercado se alcanza el estado final de una RFC, el de estándar. Conocido
por la sigla STD, en este punto se le asigna un número de STD, mientras que se
le mantiene el anterior de RFC.

La IETF mantiene una
[lista de los estándares](ftp://ftp.rfc-editor.org/in-notes/std/std1.txt)
existentes al momento.

## Conclusión

La definición de un estándar de Internet es un proceso largo que hasta puede
parecer burocrático pero es la forma de asegurarse que lo que se aprueba como
estándar es una especificación funcional, completa y libre de errores o con
errores de mínimo impacto. Es positivo el hecho de que Internet lo construimos
entre todos y que esto se refleja en el mismo proceso de estandarización, el
cuál se inicia con una especificación enviada por cualquier persona.
