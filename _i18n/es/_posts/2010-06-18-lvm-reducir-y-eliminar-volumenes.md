---
date: 2010-06-18 09:00:00 -3000
layout: post
title: "LVM: reducir y eliminar volúmenes"
authors: leandro
categories: [ sistemas operativos ]
tags: [debian, filesystems, linux, lvm, ubuntu]
permalink: /2010/06/18/lvm-reducir-y-eliminar-volumenes/
series: uso-de-lvm

---

Al momento se ha tratado la
[parte teórica de LVM](/2010/06/11/lvm2-administracion-de-volumenes-logicos-en-linux/)
introduciendo los conceptos del mismo y se ha visto también
[cómo crear y extender volúmenes](/2010/06/16/lvm-parte-2/). En el post del día
de hoy se explicará la forma de reducir el tamaño de un volumen y eliminar
volúmenes. <!-- more -->

## Reducir un volumen

Cuando se trató el tema de aumentar el tamaño de un volumen se vio que los pasos
básicamente consistían en extender el tamaño del grupo de volúmenes, luego el
tamaño del volumen lógico a expandir y, finalmente, el tamaño del sistema de
archivos.

Para el caso de reducir un volumen los pasos son los mismos pero en orden
inverso, aunque no es necesario achicar el grupo de volúmenes (eso dependerá de
la necesidad particular).

En la siguiente salida se puede verificar que el filesystem está montado y tiene
una tamaño total de 2.9G.

{% highlight bash %}
testing:/home/leandro# df -h

Filesystem                    Size   Used   Avail   Use%  Mounted on
/dev/mapper/testing-storage   2.9G   36M    2.8G    2%    /storage
{% endhighlight %}

Lo que hay que hacer entonces es redimensionar el filesystem. Para poder hacerlo
el mismo no debe estar montado, dado que de lo contrario da un error al intentar
la ejecución, tal como se muestra a continuación:

{% highlight bash %}
testing:/home/leandro# resize2fs /dev/testing/storage 1G

resize2fs 1.41.3 (12-Oct-2008)
Filesystem at /dev/testing/storage is mounted on /storage; on-line resizing required On-line shrinking from 772096 to 262144 not supported.
{% endhighlight %}

Se ve que dice claramente que la reducción del filesystem de forma on-line no
puede llevarse a cabo. Entonces sí es necesario desmontarlo y luego hacer la
reducción. Es **muy recomendado hacer un chequeo del filesystem antes de
achicarlo**.

{% highlight bash %}
testing:/home/leandro# umount /dev/mapper/testing-storage
testing:/home/leandro# e2fsck -f /dev/mapper/testing-storage
e2fsck 1.41.3 (12-Oct-2008)
Pass 1: Checking inodes, blocks, and sizes
Pass 2: Checking directory structure
Pass 3: Checking directory connectivity
Pass 4: Checking reference counts
Pass 5: Checking group summary information

/dev/mapper/testing-storage: ***** FILE SYSTEM WAS MODIFIED *****
/dev/mapper/testing-storage: 12/195840 files (0.0% non-contiguous), 21270/772096
blocks

testing:/home/leandro# resize2fs /dev/mapper/testing-storage 1G
resize2fs 1.41.3 (12-Oct-2008)
Resizing the filesystem on /dev/mapper/testing-storage to 262144 (4k) blocks.
The filesystem on /dev/mapper/testing-storage is now 262144 blocks long.
{% endhighlight %}

Muy bien, con los pasos anteriores logró reducirse el tamaño del sistema de
archivos a 1GB. Dicha modificación puede constatarse volviendo a montar el
filesystem y viendo que ahora el tamaño es de 1008M contra los 2.9G que mostraba
antes.

{% highlight bash %}
testing:/home/leandro# mount /storage/
testing:/home/leandro# df -h
Filesystem                    Size   Used   Avail   Use%  Mounted on
/dev/mapper/testing-storage   1008M  35M    923M    4%    /storage

testing:/home/leandro# cat /storage/archivo.txt
prueba
{% endhighlight %}

Ahora bien, hasta aquí sólo se achicó el filesystem y no se modificó nada del
volumen lógico, por lo que es de suponer que el mismo se haya mantenido sin
cambios. Se puede verificar esto mediante el siguiente comando:

{% highlight bash %}
testing:/home/leandro# lvdisplay /dev/testing/storage | grep Size
  LV Size                2.95 GB
{% endhighlight %}

Entonces, para reducir efectivamente el volumen hay que indicarle con el comando
*lvreduce* cuál será su nuevo tamaño. En este caso, 1GB.

{% highlight bash %}
testing:/home/leandro# lvreduce -L 1GB /dev/testing/storage
  WARNING: Reducing active and open logical volume to 1.00 GB
  THIS MAY DESTROY YOUR DATA (filesystem etc.)
Do you really want to reduce storage? [y/n]: y
  Reducing logical volume storage to 1.00 GB
  Logical volume storage successfully resized

testing:/home/leandro# df -h
Filesystem                    Size   Used   Avail   Use%  Mounted on
/dev/mapper/testing-storage   1008M   35M   923M    4%    /storage

testing:/home/leandro# lvdisplay /dev/testing/storage | grep Size
  LV Size                1.00 GB
{% endhighlight %}

En este punto sí se ve claramente que se ha reducido tanto el tamaño del
filesystem como el del volúmen. Faltaría asegurarse que los datos sigan estando
bien. Para ello se puede ver que el contenido de "archivo.txt" sea legible.

{% highlight bash %}
testing:/home/leandro# cat /storage/archivo.txt
prueba
{% endhighlight %}

Obviamente, lo anterior no asegura que todo esté bien. El archivo se creó como
una demostración de que los datos se mantienen, pero una medida más precisa
implicaría tener un volumen más amplio de información, en lo posible cerca del
límite del tamaño del filesystem.

Finalmente, con el siguiente comando se puede verificar que, si bien se
achicaron el filesystem y el volúmen lógico, el grupo de volúmenes sigue
teniendo la misma dimensión, con la diferencia que en este caso tiene espacio
libre que podrá ser asignado a un nuevo volumen. Esta información puede verse en
las variables *VG Size*, *Alloc Size*, *Free Size*.

{% highlight bash %}
testing:/home/leandro# vgdisplay testing
  --- Volume group ---
  VG Name               testing
  System ID            
  Format                lvm2
  Metadata Areas        2
  Metadata Sequence No  5
  VG Access             read/write
  VG Status             resizable
  MAX LV                0
  Cur LV                1
  Open LV               1
  Max PV                0
  Cur PV                2
  Act PV                2
  VG Size               2.95 GB
  PE Size               4.00 MB
  Total PE              755
  Alloc PE / Size       256 / 1.00 GB
  Free  PE / Size       499 / 1.95 GB
  VG UUID               epQoNY-6JWP-1vUX-IZm0-LRwo-4fR4-AEEo1p
{% endhighlight %}

## Remover volúmenes

Llegó el momento de deshacer todo el trabajo que se llevó adelante hasta el
momento.

**Eliminar un volumen lógico**

{% highlight bash %}
testing:/home/leandro# umount /storage/
testing:/home/leandro# lvremove /dev/testing/storage
Do you really want to remove active logical volume "storage"? [y/n]: y
  Logical volume "storage" successfully removed
{% endhighlight %}

**Eliminar un grupo de volúmenes**

{% highlight bash %}
testing:/home/leandro# vgremove testing
  Volume group "testing" successfully removed
{% endhighlight %}

**Eliminar un volumen físico**


{% highlight bash %}
testing:/home/leandro# pvremove /dev/hdb
  Labels on physical volume "/dev/hdb" successfully wiped
{% endhighlight %}

## Conclusión

Luego de tres posts se han visto las funcionalidades básicas de LVM que
consisten en crear volúmenes, expandirlos, achicarlos y eliminarlos. Quedan como
temas de algún otro post dos tópicos interesantes: las instantáneas de los
volúmenes y los volúmenes encriptados. Probablemente haya algo de eso en un
tiempo.
