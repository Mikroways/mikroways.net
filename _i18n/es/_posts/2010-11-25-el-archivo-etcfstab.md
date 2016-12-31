---
date: 2010-11-25 09:00:00 -3000
layout: post
title: El archivo /etc/fstab
authors: leandro
categories: [ sistemas operativos ]
tags: [filesystems, linux]
permalink: /2010/11/25/el-archivo-etcfstab/

---

Un archivo fundamental en cualquier sistema Linux es el /etc/fstab, cuyo nombre
es una especie de abreviatura de File System Table. El mismo reune la
información sobre los sistemas de archivos y es leído por el demonio init para
poder montarlos al bootear el sistema operativo. También se utiliza su
información una vez iniciado el sistema al invocar al comando mount. <!-- more -->

La estructura del archivo es extremadamente simple y aún así muchas veces
confunde o se desconocen sus parámetros. A continuación se puede ver un ejemplo
de un archivo /etc/fstab y luego la explicación de cada elemento.

### El archivo /etc/fstab

```
# /etc/fstab: static file system information.
#
# file system   mount point     type    options         dump    pass
/dev/sda1       /boot           ext4    defaults        1       2
/dev/sda5       /               ext4    defaults        1       1
/dev/sda6       /home           ext4    defaults        0       0
/dev/sda7       /storage        ext4    defaults        1       2
/dev/sda8       swap            swap    defaults        0       0
```

Las líneas que comienzan con # son ignoradas como en la mayoría de los archivos
de configuración de Linux por tratarse de comentarios. Por lo tanto, la parte
interesante arranca a partir de la cuarta línea. Se puede ver que cada una de
las líneas del archivo representan un filesystem distinto. A su vez, es sencillo
notar que todas las líneas presentan seis columnas cada una, cuyo significado se
detalla a continuación:

* Primera: en este campo se indica el dispositivo o la partición donde se
encuentra el filesystem.
* Segunda: aquí va el punto de montaje para el dispositivo especificado.
* Tercera: el tipo de sistema de archivos. Puede tomar varios valores, entre los
que se destacan: ext2, ext3, ext4, iso9660, nfs, ntfs, reiserfs, smbfs, swap,
vfat, xfs.
* Cuarta: en esta columna van las opciones para el montaje del filesystem. Son
muchas y a continuación se mencionan las más comunes. Para un listado más
completo se pueden leer el manual del comando mount y el del nfs (para los
parámetros específicos de nfs).
  * **async**: las escrituras al filesystem se demoran, es decir que no se hacen en el
momento sino que se hacen varias escrituras juntas. Esto da un mayor
rendimiento, aunque si el sistema se cuelga, apaga o el filesystem se desmonta,
los datos se pederán si aún no han sido escritos.
  * **auto**: el sistema de archivos será montado automáticamente al iniciar el sistema
o al ejecutar el comando mount -a.
  * **noauto**: debe ser montado explícitamente.
  * **defaults**: utiliza las opciones por defecto, que son rw, suid, dev, exec, auto,
nouser, async.
  * **ro**: monta el filesystem como de sólo lectura.
  * **rw**: monta el filesystem como lectura/escritura.
  * **user**: permite que cualquier usuario pueda montar el filesystem.
  * **nouser**: especifica que el filesystem sólo puede ser montado por el usuario root
y no por un usuario común.
  * **sync**: todas las escrituras al filesystem se hacen en el momento. Esto da mayor
seguridad a los datos pero un menor rendimiento.
* Quinta: esta columna indica a la utilidad dump si debe o no hacer backup del
filesystem. Puede tomar dos valores: 0 y 1. Con 0 se indica que no se debe
backupear, con 1 que sí se haga. Lógicamente, depende de que se tenga instalado
y configurado dump, por lo que en la mayoría de los casos este campo es 0.
* Sexta: en este caso se trata de una indicación para el fsck (comando que chequea
el filesystem) y nuevamente se define con un valor numérico. Las posibilidades
son 0, 1 y 2. El 0 indica que el filesystem no debe ser chequeado, mientras que
el 1 y el 2 le dicen a fsck que sí lo chequee. La diferencia es que el 1
representa una prioridad mayor que el 2, por lo que debe utilizarse para el
sistema raíz y el 2 para el resto de los sistemas de archivos.
