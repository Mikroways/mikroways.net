---
date: 2010-11-13 09:00:00 -3000
layout: post
title: Bonding con Linux
authors: leandro
categories: redes
tags: [linux, bonding]
permalink: /2010/11/13/bonding-con-linux/

---

En este post se verá cómo configurar bonding en Linux para utilizar más de una
placa a la vez con el objetivo de lograr agregación de enlaces y alta
disponibilidad. Existen varios modos de funcionamiento de bonding <!-- more -->
que se listan debajo:

* **Modo 0 (balance-rr)**: en este modo se utiliza una política de round-robin.
* **Modo 1 (active-backup)**: sólo una placa funciona a la vez, el resto actúan
como backup si la que está funcionando deja de hacerlo.
* **Modo 2 (balance-xor)**: modo que soporta agregación de enlaces y tolerancia
a fallos. Utiliza una política de transmisión basada en un hsh. Dicha política
puede modificarse cambiando el valor del atributo xmit_hash_policy.
* **Modo 3 (broadcast)**: envía la misma información por cada placa.
* **Modo 4 (802.3ad)**: estándar que ajusta el bondig de forma dinámica.
Requiere soporte del switch y que el mismo sea configurado.
* **Modo 5 (balance-tlb)**: realiza balanceo de carga entre las placas sólo para
la transmisión de datos.
* **Modo 6 (balance-alb)**: realiza balanceo de carga entre las placas tanto
para transmisión como para recepción de datos.

### Información del módulo

Se puede consultar toda la información del módulo con el comando modinfo. Con la
salida del comando puede verse el detalle de los modos en los que puede
funcionar y los demás parámetros que se le pueden configurar.

```
root@test:~# modinfo bonding
filename:
/lib/modules/2.6.32-21-server/kernel/drivers/net/bonding/bonding.ko
author:         Thomas Davis, tadavis@lbl.gov and many others
description:    Ethernet Channel Bonding Driver, v3.5.0
version:        3.5.0
license:        GPL
srcversion:     0D992F3F7BA86233AA29838
depends:        
vermagic:       2.6.32-21-server SMP mod_unload modversions 
parm:           max_bonds:Max number of bonded devices (int)
parm:           num_grat_arp:Number of gratuitous ARP packets to send on failover event (int)
parm:           num_unsol_na:Number of unsolicited IPv6 Neighbor Advertisements packets to send on failover event (int)
parm:           miimon:Link check interval in milliseconds (int)
parm:           updelay:Delay before considering link up, in milliseconds (int)
parm:           downdelay:Delay before considering link down, in milliseconds (int)
parm:           use_carrier:Use netif_carrier_ok (vs MII ioctls) in miimon; 0 for off, 1 for on (default) (int)
parm:           mode:Mode of operation : 0 for balance-rr, 1 for active-backup, 2 for balance-xor, 3 for broadcast, 4 for 802.3ad, 5 for balance-tlb, 6 for balance-alb (charp)
parm:           primary:Primary network device to use (charp)
parm:           lacp_rate:LACPDU tx rate to request from 802.3ad partner (slow/fast) (charp)
parm:           ad_select:803.ad aggregation selection logic: stable (0, default), bandwidth (1), count (2) (charp)
parm:           xmit_hash_policy:XOR hashing method: 0 for layer 2 (default), 1 for layer 3+4 (charp)
parm:           arp_interval:arp interval in milliseconds (int)
parm:           arp_ip_target:arp targets in n.n.n.n form (array of charp)
parm:           arp_validate:validate src/dst of ARP probes: none (default), active, backup or all (charp)
parm:           fail_over_mac:For active-backup, do not set all slaves to the same MAC.  none (default), active or follow (charp)
```

### Configuración en Debian

Ahora bien, después de haber explicado de forma básica la parte teórica y
conocer el módulo de bonding, sólo restar configurarlo y ponerlo a funcionar. En
Debian esta tarea es absolutamente trivial y se lleva a cabo editando el archivo
/etc/network/interfaces, agregando la configuración que se ve a continuación
(modificando los parámetros según las necesidades particulares). Las interfaces
que intervienen en el bonding no deberían tener una configuración en el archivo
mencionado.

```
auto bond0
iface bond0 inet static
    address 192.168.10.2
    netmask 255.255.255.0
    network 192.168.10.0
    gateway 192.168.10.1
    slaves eth0 eth1
    bond_mode balance-alb
    bond_miimon 100
    bond_downdelay 200
    bond_updelay 200
```

### Conclusión

Como se puede ver, configurar en bonding en Linux es extremadamente sencillo y
puede traer grandes ventajas cuando se lo utiliza en un servidor que reciba
mucho tráfico o bien que se necesite tenga una alta disponibilidad. Y los
requisitos necesarios son muy fáciles de cumplir: a no ser que se quiera
utilizar el modo 4, sólo basta con tener al menos dos placas en el servidor y
dos puertos libres en uno o más switches.
