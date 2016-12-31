---
date: 2009-11-03 09:00:00 -3000
layout: post
title: Agregar swap a Linux
authors: leandro
categories: [ sistemas operativos ]
tags: [filesystems, linux, trucos, unix]
permalink: /2009/11/03/agregar-swap-a-linux/

---

Sea porque no se creó un espacio para la swap en la instalación o porque la
misma haya quedado chica, puede resultar útil poder agregar swap a un sistema
Linux ya funcionando. Hacerlo es muy sencillo, utilizando un simple archivo. Los
pasos son los siguientes.<!-- more -->

* Crear el archivo para la swap. Para ello utilizaremos el comando dd. Los
parámetros del mismo son:
  * **if=/dev/zero**: aquí se le especifica el archivo o dispositivo de entrada.
  * **of=/media/swapfile**: aquí se le especifica el archivo de salida, el que
utilizaremos para la swap.
  * **bs=1024**: con este parámetro se indica el tamaño del bloque, especificado
en KB.
  * **count=2097152**: la cantidad de bloques del archivo. Si se multiplica por
el tamaño de cada bloque se obtiene el tamaño del archivo resultante, en KB.

```
dd if=/dev/zero of=/media/swapfile bs=1024 count=2097152
```

* Crear el filesystem.

```
mkswap /media/swapfile
```

* Activar el archivo para que sea utilizado como memoria de intercambio.

```
swapon /media/swapfile
```

* Registrarlo en /etc/fstab para que se active automáticamente al inicio. Para
ello, agregar la siguiente línea a dicho archivo.

```
/media/swapfile swap swap defaults 0 0
```
