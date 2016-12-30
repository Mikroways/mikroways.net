---
date: 2009-12-17 09:00:00 -3000
layout: post
title: Notación de direcciones IPv6
authors: leandro
categories: redes
tags: [internet, ip, ipv6, protocolos]
permalink: /2009/12/17/notacion-de-direcciones-ipv6/

---

Como ya sabemos, las direcciones IPv4 se forman por 32 bits y para facilitar su
lectura se representan en cuatro grupos de 8 bits cada uno, con números
decimales. [Hemos visto](/2009/12/07/ipv6-vs-ipv4/) que IPv6, en cambio, utiliza
direcciones de 128 bits y se forman grupos de 16 bits cada uno. <!-- more -->
Como llevar esto a números decimales implica direcciones muy largas se trabaja
con números hexadecimales. Nuevamente para facilitar la lectura, las direcciones
se agrupan de a 4 dígitos hexadecimales, separados por ":". La siguiente es una
dirección IP válida:

```
2001:0db8:0000:f100:0000:0000:0000:0002
```

Ahora bien, lo primero que resulta inconveniente con una dirección como la
anterior es la longitud. Hemos dicho que se utilizan caracteres hexadecimales
para acortarlas y sin embargo aún es larga. Pues bien, para abreviar una
dirección como la que se muestra arriba existen algunas estrategias. La primera
es eliminar los ceros consecutivos que estén a la derecha de ":", es decir, al
inicio de cada grupo. En caso de ser todos ceros es necesario mantener alguno de
ellos. En el ejemplo mostrado:

```
2001:db8:0:f100:0:0:0:2
```

Donde haya uno o más grupos de ceros seguidos pueden reemplazarse por tan sólo
dos puntos. Notar que esto puede ser realizado sólo una vez, pues de lo
contrario daría lugar a ambigüedad. Aplicando la regla, obtenemos:

```
2001:db8:0:f100::2
```

La siguiente dirección no sería válida según nuestras normas de resumen porque
existen varias formas de llevarla a su notación completa:

~~2001:db8::f100::2~~

Lo mismo ocurre en el siguiente caso:

~~2001:db8:0:f1::2~~

Para mayor detalle sobre la estructura y notación de las direcciones IP es de
lectura recomendada la [RFC 4291](ftp://ftp.rfc-editor.org/in-notes/rfc4291.txt),
que también trata sobre la estructura de las direcciones IPv6 y de los tipos de
direcciones, un tema que trataremos más adelante en este mismo blog.
