---
date: 2009-08-11 09:00:00 -3000
layout: post
title: Dividir un archivo en partes
authors: leandro
categories: [ sistemas operativos ]
tags: [linux, mac, trucos, unix]
permalink: /2009/08/11/dividir-un-archivo-en-partes/

---

Algo que muchas veces es útil es poder dividir un archivo de gran tamaño en
partes más pequeñas. En Unix es una tarea extremadamente sencilla gracias a los
comandos split y cat. <!-- more -->Por ejemplo, suponiendo que se tiene un
archivo de 3,2GB y se lo quiere dividir en partes de 512 MB:

```
split -b 512m archivo_grande.iso archivo_grande
```

El comando anterior creará 7 partes, 6 de 512MB y una con el resto y el nombre
de cada una de ellas comenzará con archivo_grande. Ahora bien, para unir cada
una de esas partes se necesita la ayuda del comando cat:

```
cat archivo_grande* > archivo_grande.iso
```

Lo que hace el comando anterior es concatenar todos las partes en un único
archivo, obteniendo nuevamente el archivo original. Para que lo anterior
funcione sólo las partes deberían empezar con ese nombre, de lo contrario habría
que enumerar uno por uno los archivos.
