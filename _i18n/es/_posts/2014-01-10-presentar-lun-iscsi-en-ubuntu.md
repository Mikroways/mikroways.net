---
date: 2014-01-10 09:00:00 -3000
layout: post
title: Presentar LUN iSCSI en Ubuntu
authors: leandro
categories: servidores
tags: [iscsi, linux, nas, storage, ubuntu]
permalink: /2014/01/10/presentar-lun-iscsi-en-ubuntu/

---

En este tutorial se va a ver cómo conectar un servidor a una LUN exportada por
un [NAS](https://es.wikipedia.org/wiki/Almacenamiento_conectado_en_red) con
iSCSI. Para el desarollo del mismo se va a utilizar: <!-- more -->

* Storage:
  * Tipo: NAS Lenovo EMC.
  * Nombre: sto01.
  * IP: 192.168.45.190.
* Recursos iSCSI: 1x50GB nombrado como mikroways, 1x10GB nombrado como
netstorming.

## iSCSI en Ubuntu

Instalar las utilidades de iSCSI.

```
apt-get install open-iscsi
```

Luego, se debe descubrir los recursos iSCSI que el dispositivo tiene para
ofrecer. En este caso, serán dos.

```
root@testing:~# iscsiadm -m discovery -t st -p 192.168.45.190
192.168.45.190:3260,1 iqn.2012-07.com.lenovoemc:storage.sto01.mikroways
192.168.45.190:3260,1 iqn.2012-07.com.lenovoemc:storage.sto01.netstorming
```

Una vez que se detectaron los recursos del dispositivo, se procede a conectarse
al storage, lo que llevará a asociar ambos recursos iSCSI a dispositivos de
bloque en el sistema operativo cliente.

```
root@testing:~# iscsiadm -m node --login
Logging in to [iface: default, target: iqn.2012-07.com.lenovoemc:storage.sto01.mikroways, portal: 192.168.45.190,3260] (multiple)
Logging in to [iface: default, target: iqn.2012-07.com.lenovoemc:storage.sto01.netstorming, portal: 192.168.45.190,3260] (multiple)
Login to [iface: default, target: iqn.2012-07.com.lenovoemc:storage.sto01.mikroways, portal: 192.168.45.190,3260] successful.
Login to [iface: default, target: iqn.2012-07.com.lenovoemc:storage.sto01.netstorming, portal: 192.168.45.190,3260] successful.
```

Verificar que los dispositivos hayan sido correctamente identificados por el
sistema operativo.

```
root@testing:~# dmesg
...
[  327.952760] scsi3 : iSCSI Initiator over TCP/IP
[  327.961930] scsi4 : iSCSI Initiator over TCP/IP
[  328.541159] scsi 4:0:0:0: Direct-Access     LENOVO   LIFELINE-DISK    2 PQ: 0 ANSI: 5
[  328.541490] scsi 3:0:0:0: Direct-Access     LENOVO   LIFELINE-DISK    2 PQ: 0 ANSI: 5
[  328.553741] sd 4:0:0:0: Attached scsi generic sg2 type 0
[  328.554942] sd 3:0:0:0: Attached scsi generic sg3 type 0
[  328.565939] sd 3:0:0:0: [sdb] 104857600 512-byte logical blocks: (53.6 GB/50.0 GiB)
[  328.565942] sd 3:0:0:0: [sdb] 4096-byte physical blocks
[  328.574342] sd 4:0:0:0: [sdc] 20971520 512-byte logical blocks: (10.7 GB/10.0 GiB)
[  328.574347] sd 4:0:0:0: [sdc] 4096-byte physical blocks
[  328.575388] sd 3:0:0:0: [sdb] Write Protect is off
[  328.575394] sd 3:0:0:0: [sdb] Mode Sense: 83 00 10 08
[  328.576772] sd 4:0:0:0: [sdc] Write Protect is off
[  328.576778] sd 4:0:0:0: [sdc] Mode Sense: 83 00 10 08
[  328.577023] sd 3:0:0:0: [sdb] Write cache: disabled, read cache: enabled, supports DPO and FUA
[  328.577956] sd 4:0:0:0: [sdc] Write cache: disabled, read cache: enabled, supports DPO and FUA
[  328.590109]  sdb: sdb1
[  328.599811]  sdc: unknown partition table
[  328.602543] sd 3:0:0:0: [sdb] Attached SCSI disk
[  328.605130] sd 4:0:0:0: [sdc] Attached SCSI disk
```

En la salida anterior se puede ver que ambos recursos iSCSI fueron reconocidos
correctamente como dispositivos por bloques por Ubuntu y se les asoció una
entrada en /dev. Si se pone atención se puede extraer de la salida anterior la
siguiente información, que será importante para la utilización de los recursos.

* Se asocian dos dispositivos por bloques, identificados como sdb y sdc.
* El dispositivo sdb tiene 50G mientras que el sdc cuenta con 10G.
* El dispositivo sdb tiene una tabla de particiones creada, mientras que sdc no.

Hay que tener especial cuidado en esto al ejecutar el siguiente paso, porque el
dispositivo sdb podría contener información que se perdería.

Esto último puede verificarse utilizando el comando fdisk.

```
fdisk -l
...
Disk /dev/sdb: 53.7 GB, 53687091200 bytes
64 heads, 32 sectors/track, 51200 cylinders, total 104857600 sectors
Units = sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 4096 bytes
I/O size (minimum/optimal): 4096 bytes / 524288 bytes
Disk identifier: 0x05b7bb88

   Device Boot      Start         End      Blocks   Id  System
/dev/sdb1            2048   104857599    52427776   83  Linux

Disk /dev/sdc: 10.7 GB, 10737418240 bytes
64 heads, 32 sectors/track, 10240 cylinders, total 20971520 sectors
Units = sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 4096 bytes
I/O size (minimum/optimal): 4096 bytes / 524288 bytes
Disk identifier: 0x00000000

Disk /dev/sdc doesn't contain a valid partition table
```

Con ambos dispositivos asociados al cliente, ya es posible empezar a
utilizarlos. Para lograr que los recursos se vuelvan a montar al reiniciar el
sistema es necesario realizar dos acciones, que son indicarle a Open iSCSI que
se conecte automáticamente y al sistema operativo cliente que monte los
dispositivos en cuestión. Para el primer paso, editar el archivo
/etc/iscsi/iscsid.conf.

Modificar la línea:

```
node.startup = manual
```

Por:

```
node.startup = automatic
```

Luego, agregar los dispositivos al archivo /etc/fstab. En este caso sólo se
agrega el dispositivo /dev/sdb1 dado que, como se vio, el /dev/sdc no está
particionado. Poner especial atención en la opción de montaje **_netdev**.
Dicha opción le indica al sistema operativo que se trata de un dispositivo de
red. Sin ella, si al momento de reiniciar el equipo el recurso no estuviera
disponible, el cliente no iniciaría, esperando una acción por parte del
administrador ante su imposibilidad de montar el dispositivo requerido.

```
/dev/sdb1  /storage/mikroways/  ext3 defaults,auto,_netdev 0 0
```

Algo importante en este sentido es que, si se montan varios recursos de red, al
reiniciar el equipo podrían no mantener la misma asociación en el host. En otras
palabras, lo que es /dev/sdb1 podría transformarse en /dev/sdc1 al reiniciar el
equipo, lo que podría causar graves problemas. Para solucionarlo, es ideal
reemplazar la ruta al dispositivo de bloques por el UUID del mismo. Para más
detalles al respecto, consultar la entrada
[Utilizar los UUID para montar dispositivos](/2013/12/21/utilizar-los-uuid-para-montar-dispositivos/).
