---
date: 2009-10-26 09:00:00 -3000
layout: post
title: Configurar un Etherchannel en Cisco
authors: leandro
categories: redes
tags: [cisco, switching]
permalink: /2009/10/26/configurar-un-etherchannel-en-cisco/

---

Un Etherchannel es un tipo especial de interfaz que agrupa varios puertos
físicos en un único puerto lógico. De esta manera es posible armar uplinks con
mayor capacidad que la provista por los puertos individuales. <!-- more -->Por
ejemplo, en la siguiente topología:

![Topología de ejemplo](/images/blog/etherchannel-topology.png)

Podría aprovecharse allí la redundancia para en lugar de tener dos enlaces a 1
gigabit (de los cuáles sólo uno funcionará si utilizamos STP) tengamos un único
enlace lógico a 2 gigabits. En este punto es preciso saber que un Etherchannel
puede configurarse de modo estático o de modo dinámico. El segundo caso nos
provee además redundancia, ya que si uno de los enlaces se cae el Etherchannel
continúa funcionando con un ancho de banda menor. Para configurarlo de esta
manera:

```
SWA(config)#interface range gigabitEthernet 0/1 -gigabitEthernet 0/2
SWA(config-if-range)#channel-group 1 mode desirable
SWA(config-if-range)#end

SWB(config)#interface range gigabitEthernet 0/1 -gigabitEthernet 0/2
SWB(config-if-range)#channel-group 1 mode desirable
SWB(config-if-range)#end

SWA#show etherchannel

Channel-group listing:
----------------------
Group: 1
----------
Group state = L2
Ports: 2 Maxports = 8
Port-channels: 1 Max Portchannels = 1
Protocol: PAGP

SWA#show etherchannel 1 summary
Flags: D - down P - in port-channel
I - stand-alone s - suspended
H - Hot-standby (LACP only)
R - Layer3 S - Layer2
U - in use f - failed to allocate aggregator
u - unsuitable for bundling
w - waiting to be aggregated
d - default port

Number of channel-groups in use: 1
Number of aggregators: 1

Group Port-channel Protocol Ports
------+-------------+-----------+-----------------------------
1 Po1(SD) PAgP Gi0/1(D) Gi0/2(D)
```
