---
date: 2010-07-09 09:00:00 -3000
layout: post
title: Instalar árbol de ports en OpenBSD
authors: leandro
categories: [ sistemas operativos ]
tags: [bsd, openbsd, ports]
permalink: /2010/07/09/instalar-arbol-de-ports-en-openbsd/

---

OpenBSD cuenta con el excelente sistema de ports de FreeBSD que permite instalar
una gran cantidad de software desde repositorios centrales, al mismo estilo que
se realiza en Gentoo. Ahora bien, por defecto los ports no vienen incluidos en
el sistema por lo que es necesario descargarlos y crear su estructura inicial
para poder disponer de ellos. Esto se realiza de forma extremadamente sencilla,
como se ve a continuación:
<!-- more -->

```
cd /tmp
ftp ftp://ftp.openbsd.org/pub/OpenBSD/4.7/ports.tar.gz
cd /usr
tar -xvzf /tmp/ports.tar.gz
```

Con los pocos comandos anteriores basta para tener el árbol completo de ports en
un sistema OpenBSD. El mismo mecanismo es el utilizado para FreeBSD. Vale
aclarar que, en este caso, los ports corresponden a la versión 4.7 de OpenBSD
(la última estable al momento de escribir este post). Si se necesitaran para una
versión diferente basta con reemplazar dicho número por el de la versión en
cuestión.
