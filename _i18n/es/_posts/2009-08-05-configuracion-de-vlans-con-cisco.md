---
date: 2009-08-05 09:00:00 -3000
layout: post
title: Configuración de VLANs con Cisco
authors: leandro
categories: redes
tags: [cisco, lan, switching, vlans]
permalink: /2009/08/05/configuracion-de-vlans-con-cisco/

---

En este post mostraré cómo crear [VLANs](/2010/01/18/introduccion-a-las-vlan/)
en un switch Cisco, configurar puertos de acceso y puertos de trunk y
[rutear las VLANs](/2009/12/20/ruteo-entre-vlans/) para que puedan comunicarse
entre sí. El ruteo se hace con el método de router-on-stick. <!-- more -->

## Ambiente

![Topología de ejemplo](/images/blog/vlan-routing.png)

La asignación de VLANs quedará:

* VLAN4: 192.168.4.0/24.
  * Switch0: puertos 1 al 9.
  * Switch1: puertos 1 al 9.
* VLAN5: 192.168.5.0/24.
  * Switch0: puertos 9, 10, 12.
  * Switch1: puertos 10 al 14.

* TRUNK
  * Switch0: fastEthernet 0/11, gigabitEthernet 1/1.
  * Switch1: gigabitEthernet 1/1.
  * Router0: fastEthernet 0/0.

## Creación de las VLAN

```
sw0(config)# interface vlan 4
sw0(config-if)# description Vlan4
sw0(config-if)# no shutdown

sw0(config)# interface vlan 5
sw0(config-if)# description Vlan5
sw0(config-if)# no shutdown

sw1(config)# interface vlan 4
sw1(config-if)# description Vlan4
sw1(config-if)# no shutdown

sw1(config)# interface vlan 5
sw1(config-if)# description Vlan5
sw1(config-if)# no shutdown
```

## Asignar puertos a las VLAN

```
sw0(config)#interface range fastEthernet 0/1 - fastEthernet 0/8
sw0(config-if-range)#switchport mode access
sw0(config-if-range)#switchport access vlan 4
sw0(config-if-range)#exit

sw0(config)#interface range fastEthernet 0/9, fastEthernet 0/10,
fastEthernet0/12
sw0(config-if-range)#switchport mode access
sw0(config-if-range)#switchport access vlan 5
sw0(config-if-range)#exit

sw1(config)#interface range fastEthernet 0/1 - fastEthernet 0/9
sw1(config-if-range)#switchport mode access
sw1(config-if-range)#switchport access vlan 4
sw1(config-if-range)#exit

sw1(config)#interface range fastEthernet 0/10 - fastEthernet 0/14
sw1(config-if-range)#switchport mode access
sw1(config-if-range)#switchport access vlan 5
sw1(config-if-range)#exit
```

## Configurar los puertos de Trunk

```
sw0(config)#interface fastEthernet 0/11
sw0(config-if)#switchport mode trunk
sw0(config-if)#switchport trunk encapsulation dot1q
sw0(config-if)#switchport trunk allowed vlan 4,5
sw0(config-if)#exit

sw0(config)#interface gigabitEthernet 1/1
sw0(config-if)#switchport mode trunk
sw0(config-if)#switchport trunk encapsulation dot1q
sw0(config-if)#switchport trunk allowed vlan 4,5
sw0(config-if)#exit

sw1(config)#interface gigabitEthernet 1/1
sw1(config-if)#switchport mode trunk
sw0(config-if)#switchport trunk encapsulation dot1q
sw1(config-if)#switchport trunk allowed vlan 4,5
sw1(config-if)#exit
```

## Ruteo entre VLANs

```
central(config)#interface fastEthernet 0/0
central(config-if)#no shutdown
central(config-if)#exit

central(config)# interface fastEthernet 0/0.4
central(config-if)# encapsulation dot1Q 4
central(config-if)# ip address 192.168.4.1 255.255.255.0
exit

central(config)# interface fastEthernet 0/0.5
central(config-if)# encapsulation dot1Q 5
central(config-if)# ip address 192.168.5.1 255.255.255.0
exit
```

## Verificación de la configuración de las VLAN

```
sw1#show vlan brief

VLAN Name                             Status    Ports
---- -------------------------------- --------- -------------------------------
1    default                          active    Fa0/15, Fa0/16, Fa0/17, Fa0/18
                                                Fa0/19, Fa0/20, Fa0/21, Fa0/22
                                                Fa0/23, Fa0/24, Gig1/2
4    VLAN0004                         active    Fa0/1, Fa0/2, Fa0/3, Fa0/4
                                                Fa0/5, Fa0/6, Fa0/7, Fa0/8
                                                Fa0/9
5    VLAN0005                         active    Fa0/10, Fa0/11, Fa0/12, Fa0/13
                                                Fa0/14
1002 fddi-default                     active
1003 token-ring-default               active
1004 fddinet-default                  active
1005 trnet-default                    active

sw1#show vlan id 4

VLAN Name                             Status    Ports
---- -------------------------------- --------- -------------------------------
4    VLAN0004                         active    Fa0/1, Fa0/2, Fa0/3, Fa0/4
                                                Fa0/5, Fa0/6, Fa0/7, Fa0/8
                                                Fa0/9

VLAN Type  SAID       MTU   Parent RingNo BridgeNo Stp  BrdgMode Trans1 Trans2
---- ----- ---------- ----- ------ ------ -------- ---- -------- ------ ------
4    enet  100004     1500  -      -      -        -    -        0      0

sw1#show interfaces vlan 4
Vlan4 is up, line protocol is up
Hardware is CPU Interface, address is 0007.ecaa.64a6 (bia 0007.ecaa.64a6)
MTU 1500 bytes, BW 100000 Kbit, DLY 1000000 usec, reliability 255/255, txload 1/255, rxload 1/255
Encapsulation ARPA, loopback not set
ARP type: ARPA, ARP Timeout 04:00:00
Last input 21:40:21, output never, output hang never
Last clearing of "show interface" counters never
Input queue: 0/75/0/0 (size/max/drops/flushes); Total output drops: 0
Queueing strategy: fifo
Output queue: 0/40 (size/max)
5 minute input rate 0 bits/sec, 0 packets/sec
5 minute output rate 0 bits/sec, 0 packets/sec
1682 packets input, 530955 bytes, 0 no buffer
Received 0 broadcasts (0 IP multicast)
0 runts, 0 giants, 0 throttles
0 input errors, 0 CRC, 0 frame, 0 overrun, 0 ignored
563859 packets output, 0 bytes, 0 underruns
0 output errors, 23 interface resets
0 output buffer failures, 0 output buffers swapped out

sw1#show interfaces trunk
Port        Mode         Encapsulation  Status        Native vlan
Gig1/1      on           802.1q         trunking      1

Port        Vlans allowed on trunk
Gig1/1      4-5

Port        Vlans allowed and active in management domain
Gig1/1      4,5

Port        Vlans in spanning tree forwarding state and not pruned
Gig1/1      4,5
```
