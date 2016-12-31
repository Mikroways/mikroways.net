---
date: 2009-06-05 09:00:00 -3000
layout: post
title: Atributos de archivos en ext3
authors: leandro
categories: [ sistemas operativos ] 
tags: [ext3, filesystems, linux]
permalink: /2009/10/08/atributos-de-archivos-en-ext3/

---

Los permisos de Linux nos permiten dar distintos niveles de acceso a los
archivos y directorios a los diferentes usuarios y son provistos por el sistema
operativo. Existe también otro tipo de permisos que son provistos por el propio
sistema de archivos y son los atributos de los archivos. <!-- more -->

La diferencia de los atributos es que van más allá de la autorización del
sistema operativo, dado que el control se realiza a nivel de filesystem. De esta
manera, los atributos son capaces de restringir los privilegios incluso al
usuario root. En esta ocasión voy a hacer una revisión de los atributos de los
archivos en el sistema ext3.

## Atributos del sistema ext3

El sistema ext3 provee los siguientes atributos:

* Append only (a).
* Compressed (c).
* No dump (d).
* Extent format (e).
* Inmutable (i).
* Data journalling (j).
* Secure deletion (s).
* No tail merging (t).
* Undeletable (u).
* No atime updates (A).
* Synchronous directory updates (D).
* Synchronous updates (S).
* Top of directory hierarchy (T).

En el [manual de chattr](http://linux.die.net/man/1/chattr) puede encontrarse una
explicación más detallada sobre el significado de cada uno de los atributos
anteriores. No obstante, de la lista me gustaría comentar el atributo inmutable;
dicho atributo impide que el archivo se renombre, modifique, elimine o tenga un
link simbólico que lo apunte. Y dicha restricción se aplica incluso al root. En
la siguiente sección muestro un ejemplo.

## Manejo de los atributos

Para administrar los atributos existen los comandos lsattr y chattr provistos en
el paquete e2fsprogs. El primero de ellos lista los atributos de un archivo y el
segundo permite cambiarlos.

A continuación creamos un archivo vacío y chequeamos los atributos del mismo.
Comprobaremos que no tiene ninguno seteado.

{% highlight bash %}
root@scarlet-ubuntu:~# touch prueba.txt
root@scarlet-ubuntu:~# lsattr
------------------- ./prueba.txt
{% endhighlight %}

Ahora le seteamos el atributo inmutable y volvemos a chequear los atributos.
Para ello, tener en cuenta que el comando chattr utiliza el signo + para setear
un atributo y el signo - para eliminarlo.

{% highlight bash %}
root@scarlet-ubuntu:~# chattr +i prueba.txt
root@scarlet-ubuntu:~# lsattr
----i-------------- ./prueba.txt
{% endhighlight %}

El próximo paso es intentar borrar el archivo. Notar que el comando rm se
ejecuta como root y se le exige que fuerce el borrado. El resultado será que el
propio filesystem nos impedirá hacerlo.

{% highlight bash %}
root@scarlet-ubuntu:~# rm -f prueba.txt
rm: cannot remove `prueba.txt': Operación no permitida
{% endhighlight %}

Ahora bien, le quitaremos el atributo inmutable y volveremos a intentar
eliminarlo. Lógicamente funcionará de la manera esperada.

{% highlight bash %}
root@scarlet-ubuntu:~# chattr -i prueba.txt
root@scarlet-ubuntu:~# lsattr
------------------- ./prueba.txt
root@scarlet-ubuntu:~# rm prueba.txt
root@scarlet-ubuntu:~# ls
{% endhighlight %}
