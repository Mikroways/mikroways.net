---
date: 2010-06-16 09:00:00 -3000
layout: post
title: "LVM: crear y expandir volúmenes"
authors: leandro
categories: [ sistemas operativos ]
tags: [debian, filesystems, linux, lvm, ubuntu]
permalink: /2010/06/16/lvm-crear-y-expandir-volumenes/
series: uso-de-lvm

---

Luego de haber tenido un post introductorio a LVM, explicaré en esta oportunidad
cómo:

* Crear volúmenes físicos, grupos de volúmenes y volúmenes lógicos.
* Redimensionar los volúmenes.
* Eliminar volúmenes.
<!-- more -->

## Preparándose para utilizar LVM

Para este tutorial utilizaré Debian. El mismo se puede aplicar a cualquier
Linux, aunque daré ciertas cosas por supuestas además de mostrar algunos
comandos específicos de los sistemas Debian like.

Antes que nada, será necesario contar con el soporte para LVM. Para ello:

{% highlight bash %}
testing:~# aptitude install lvm2
{% endhighlight %}

## Creación de un volumen lógico

Para crear un volumen lógico es necesario primero crear los volúmenes físicos
que se necesitarán y luego el grupo de volúmenes. Finalmente se podrá crear el
volumen lógico que se busca y asignar un sistema de archivos al mismo. Para este
paso vamos a suponer que tenemos un disco rígido nuevo, sin particionar. El
disco en cuestión se identifica en el sistema como /dev/hdb.

**Crear el volumen físico**

{% highlight bash %}
testing:~# pvcreate /dev/hdb
  Physical volume "/dev/hdb" successfully created
{% endhighlight %}

**Crear el grupo de volúmenes**

{% highlight bash %}
testing:~# vgcreate testing /dev/hdb
  Volume group "testing" successfully created
{% endhighlight %}

**Crear un volumen lógico**

{% highlight bash %}
testing:~# lvcreate testing -L 1.99G -n storage
  Rounding up size to full physical extent 1.99 GB
  Logical volume "storage" created

testing:~# ls -l /dev/testing/storage
lrwxrwxrwx 1 root root 27 2010-06-10 16:01 /dev/testing/storage -> /dev/mapper/testing-storage
{% endhighlight %}

**Crear el sistema de archivos en el volumen lógico**

{% highlight bash %}
testing:~# mkfs.ext3 /dev/mapper/testing-storage
mke2fs 1.41.3 (12-Oct-2008)
Filesystem label=
OS type: Linux
Block size=4096 (log=2)
Fragment size=4096 (log=2)
130560 inodes, 522240 blocks
26112 blocks (5.00%) reserved for the super user
First data block=0
Maximum filesystem blocks=536870912
16 block groups
32768 blocks per group, 32768 fragments per group
8160 inodes per group
Superblock backups stored on blocks:
        32768, 98304, 163840, 229376, 294912

Writing inode tables: done                           
Creating journal (8192 blocks): done
Writing superblocks and filesystem accounting information: done

This filesystem will be automatically checked every 23 mounts or
180 days, whichever comes first.  Use tune2fs -c or -i to override.
{% endhighlight %}

**Agregar el nuevo volumen al FSTAB**

{% highlight bash %}
testing:~# vi /etc/fstab 
/dev/mapper/testing-storage /storage ext3 defaults 0 2
{% endhighlight %}

**Montar el nuevo sistema de archivos y probarlo**

{% highlight bash %}
testing:~# mkdir /storage
testing:~# mount /storage/
testing:~# df -h
Filesystem                    Size  Used  Avail  Use%   Mounted on
/dev/mapper/testing-storage   2.0G   36M   1.9G    2%   /storage
testing:~# echo "prueba" &gt; /storage/archivo.txt
testing:~# cat /storage/archivo.txt
prueba
{% endhighlight %}

## Redimensionar un volumen lógico

Hasta aquí se ha visto cómo crear volúmenes físicos, grupos de volúmenes y
volúmenes lógicos. A su vez, se mostró cómo utilizar el volumen creado. En este
punto se verá el tema de redimensionar el volumen lógico recién creado, primero
agrandando su tamaño y luego achicándolo (tema de un próximo post). Es de
destacar que el primero de los redimensionamientos será llevado a cabo **sin
desmontar el volumen lógico**.

### Aumentar el tamaño

En este punto se considerará que se tiene un disco rígido adicional identificado
como /dev/hdc y que el mismo tiene dos particiones, /dev/hdc1 y /dev/hdc2. Se
utilizará la primera de ellas para extender el volumen creado en los pasos
anteriores.

**Crear volumen físico**

{% highlight bash %}
testing:~# pvcreate /dev/hdc1
  Physical volume "/dev/hdc1" successfully created
{% endhighlight %}

**Extender el grupo de volúmenes**

En este paso se le indica al grupo de volúmenes *testing* que se le
agregará un nuevo volumen físico.

{% highlight bash %}
testing:~# vgextend testing /dev/hdc1
  Volume group "testing" successfully extended
{% endhighlight %}

**Extender el volumen lógico**

El siguiente comando toma el volumen *storage* ya existente y le agrega
0.95G de tamaño, tomados a partir de la integración del nuevo volumen físico.

{% highlight bash %}
testing:~# lvextend -L +0.95G /dev/testing/storage
  Rounding up size to full physical extent 976.00 MB
  Extending logical volume storage to 2.95 GB
  Logical volume storage successfully resized
{% endhighlight %}

**Redimensionar el sistema de archivos**

Hasta aquí está todo bien, sin embargo aún nuestro volumen no ha crecido en
tamaño, según muestra la salida del comando *df*.

{% highlight bash %}
testing:~# df -h
Filesystem                    Size  Used  Avail  Use%   Mounted on
/dev/mapper/testing-storage   2.0G   36M  1.9G     2%   /storage
{% endhighlight %}

Lo que ha ocurrido es que, si bien el volumen ya cuenta con una mayor capacidad
de almacenamiento, el sistema de archivos que se creó está limitando el tamaño
del mismo. Por ello, es necesario extender el sistema de archivos existente.
Este paso se realizará on-line, es decir, **sin desmontar el volumen**.

{% highlight bash %}
testing:~# resize2fs /dev/testing/storage
resize2fs 1.41.3 (12-Oct-2008)
Filesystem at /dev/testing/storage is mounted on /storage; on-line resizing required old desc_blocks = 1, new_desc_blocks = 1
Performing an on-line resize of /dev/testing/storage to 772096 (4k) blocks.
The filesystem on /dev/testing/storage is now 772096 blocks long.

testing:~# df -h
Filesystem                    Size  Used  Avail  Use%   Mounted on
/dev/mapper/testing-storage   2.9G   36M  2.8G     2%   /storage

testing:~# cat /storage/archivo.txt
prueba
{% endhighlight %}

Como puede verse, el sistema de archivos ha sido extendido sin desmontar el
volumen y los datos que se tenían fueron conservados.

## Herramientas informativas

Es posible ver el estado y detalles de los diferentes volúmenes físicos, grupos
de volúmenes y volúmenes lógicos mediante tres sencillos comandos que se
muestran a continuación: *pvdisplay*, *vgdisplay* y *lvdisplay*.

{% highlight bash %}
testing:/home/leandro# pvdisplay 
  --- Physical volume ---
  PV Name               /dev/hdb
  VG Name               testing
  PV Size               2.00 GB / not usable 4.00 MB
  Allocatable           yes (but full)
  PE Size (KByte)       4096
  Total PE              511
  Free PE               0
  Allocated PE          511
  PV UUID               pE7qSU-COhd-j6a4-YnWg-1mR7-xZ48-XDstZk

  --- Physical volume ---
  PV Name               /dev/hdc1
  VG Name               testing
  PV Size               976.96 MB / not usable 984.50 KB
  Allocatable           yes 
  PE Size (KByte)       4096
  Total PE              244
  Free PE               1
  Allocated PE          243
  PV UUID               rmvKFh-0hGJ-mBby-zPjT-eyvf-2CrP-TjTKG3

testing:/home/leandro# vgdisplay 
  --- Volume group ---
  VG Name               testing
  System ID             
  Format                lvm2
  Metadata Areas        2
  Metadata Sequence No  4
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
  Alloc PE / Size       754 / 2.95 GB
  Free  PE / Size       1 / 4.00 MB
  VG UUID               epQoNY-6JWP-1vUX-IZm0-LRwo-4fR4-AEEo1p

testing:/home/leandro# lvdisplay 
  --- Logical volume ---
  LV Name                /dev/testing/storage
  VG Name                testing
  LV UUID                ywXZGl-kafG-CoHV-3jGt-wt1S-rnlY-IBIgF8
  LV Write Access        read/write
  LV Status              available
  # open                 1
  LV Size                2.95 GB
  Current LE             754
  Segments               2
  Allocation             inherit
  Read ahead sectors     auto
  - currently set to     256
  Block device           254:2
{% endhighlight %}

## Para la próxima

En otro nuevo post se mostrará cómo achicar un volumen lógico y cómo eliminar
volúmenes lógicos, grupos de volúmenes y volúmenes físicos.
