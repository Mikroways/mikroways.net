---
date: 2010-11-11 09:00:00 -3000
layout: post
title: "Watch: repetir periódicamente la ejecución de un programa"
authors: leandro
categories: [ sistemas operativos ]
tags: [bash, comandos, consola, linux]
permalink: /2010/11/11/watch-repetir-periodicamente-la-ejecucion-de-un-programa/

---

Muchas veces nos encontramos en la necesidad de ejecutar repetidas veces un
comando, siendo la forma más común de hacerlo la de escribir una y otra vez el
mismo comando. Por suerte, existe en Linux una utilidad que se llama *watch* que
hace precisamente esa tarea por nosotros. <!-- more -->La forma de uso es
extremadamente simple:

```
watch comando
```

Por ejemplo, si estamos copiando archivos desde otro lugar y deseamos hacer un
ls de un directorio para controlar el ritmo de la copia se podría ejecutar:

```
watch ls
```

Que dará como salida:

```
Every 2.0s: ls                           Thu Nov 11 16:55:00 2010

netstorming

-----------------------------------------------------------------

Every 2.0s: ls                           Thu Nov 11 16:55:04 2010

netstorming
mikroways
```

Sin dudas, hay situaciones donde el watch es mucho más útil, espero entiendan
que lo anterior fue sólo a modo de ejemplo.
