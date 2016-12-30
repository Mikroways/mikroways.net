---
date: 2013-12-21 09:00:00 -3000
layout: post
title: Utilizar los UUID para montar dispositivos
authors: leandro
categories: [ sistemas operativos ]
tags: [filesystems, linux]
permalink: /2013/12/21/utilizar-los-uuid-para-montar-dispositivos/

---

Tradicionalmente, para montar dispositivos de almacenamiento solía utilizarse la
ruta al mismo en el filesystem, normalmente algo parecido a /dev/sda1. Si bien
esto funciona sin problemas, no es una forma unívoca de referirse a un
dispositivo en particular, lo que podría provocar que si, por ejemplo, se
conectara un segundo disco rígido, el que antes se referenciaba como /dev/sda1
ahora se referencie como /dev/sdb1, con los problemas que eso implica.
<!-- more -->

Por tales motivos, lo ideal es utilizar el identificador único de los diferentes
dispositivos de almacenamiento en el sistema. Para ello, existe un comando que
es blkid (de Block ID), que nos brinda dicha información:

```
root@testing:~# blkid
/dev/sr0: LABEL="Ubuntu-Server 13.10 amd64" TYPE="iso9660"
/dev/sda1: UUID="9e906e5e-b0e1-4cc4-a883-1c89289a72c5" TYPE="ext2"
/dev/sda5: UUID="HIXH00-yG4z-ZKW6-Smis-qEra-5W6R-3wsaFh" TYPE="LVM2_member"
/dev/mapper/testing--vg-root: UUID="c071778b-6c3c-49bd-b3dd-e5cbe7ef5e73" TYPE="ext4"
/dev/mapper/testing--vg-swap_1: UUID="4c89e74a-767c-4cd4-bf90-a170ae09b84e" TYPE="swap"
/dev/sdb1: UUID="31fea32c-88c5-4564-b69a-e4e397dd6f6d" TYPE="ext3"
```

De esta manera, es lo mismo ejecutar:

```
mount /dev/sdb1  /storage
```

Que:

```
mount UUID=31fea32c-88c5-4564-b69a-e4e397dd6f6d /storage
```

Esto se vuelve aún más útil cuando la intención es que al reiniciar el sistema
los diferentes dispositivos de almacenamiento vuelvan a montarse automáticamente
en el directorio que les corresponde, y no en otro. Entonces, en /etc/fstab:

```
UUID=31fea32c-88c5-4564-b69a-e4e397dd6f6d  /storage   ext3    defaults,auto 0    0
```

Cabe aclarar que el de tipo de filesystem y las opciones de montaje pueden
variar dependiendo de qué se quiera montar y de qué manera.
