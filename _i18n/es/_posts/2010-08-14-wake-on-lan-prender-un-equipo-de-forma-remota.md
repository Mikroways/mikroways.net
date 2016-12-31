---
date: 2010-08-14 09:00:00 -3000
layout: post
title: "Wake On LAN: prender un equipo de forma remota"
authors: leandro
categories: servidores
tags: [wake on lan, protocolos]
permalink: /2010/08/14/wake-on-lan-prender-un-equipo-de-forma-remota/

---

Muchas veces es necesario acceder a una máquina remota por algún motivo aunque
puede que la necesidad sea eventual y no se justifique el gasto de tenerla
encendida todo el tiempo. Para estas oportunidades, la técnica de Wake On LAN
(WOL) es ideal. Básicamente, nos permite encender un equipo utilizando como
único medio la red local. <!-- more -->

WOL tiene dos prerrequisitos fáciles de cumplir: requiere que la computadora a
ser encendida soporte WOL y esté conectada a una red Ethernet. Su forma de
funcionamiento es igualmente simple: se envía una trama especial, llamada
paquete mágico (magic packet), que contiene dentro la dirección MAC de la PC a
"despertar" repetida 16 veces. De esta manera, la PC que está apagada recibe
dicha trama, detecta el paquete mágico y al verificar que la MAC contenida es la
propia envía una señal de encendido. Lógicamente, para que esto funcione es
necesario que la placa de red siga recibiendo energía, con lo cuál existe un
mínimo consumo.

## Configurando WOL en la máquina destino

Para habilitar WOL es necesario hacerlo primero desde el BIOS, desde la sección
Power Management (administración de energía). Allí se encuentra una opción
normalmente referida como Wake On LAN, Wake on MAC LAN o algo parecido.
Lógicamente, hay que habilitar dicha opción. En la mayoría de los sistemas
debería alcanzar con eso, dado que WOL es una característica independiente del
sistema operativo. No obstante, en un caso (con un motherboard MSI K9N Neo) no
me funcionó dicha opción y lo habilité desde Linux. Por ello explicaré a
continuación cómo hacerlo.

```
testing:~# ethtool eth0
Settings for eth0:
        Supported ports: [ MII ]
        Supported link modes:   10baseT/Half 10baseT/Full
                                100baseT/Half 100baseT/Full
                                1000baseT/Full
        Supports auto-negotiation: Yes
        Advertised link modes:  10baseT/Half 10baseT/Full
                                100baseT/Half 100baseT/Full
                                1000baseT/Full
        Advertised auto-negotiation: Yes
        Speed: 100Mb/s
        Duplex: Full
        Port: MII
        PHYAD: 1
        Transceiver: external
        Auto-negotiation: on
        Supports Wake-on: g
        Wake-on: d
        Link detected: yes
```

De la salida anterior importan particularmente dos opciones: *Supports Wake-on*
y *Wake-on*. La primera de ellas, con una *g* indica que la placa de red soporta
efectivamente WOL; la segunda, con una *d* indica que WOL está desactivado en
esa interfaz. Para habilitarlo:

```
testing:~# ethtool -s eth0 wol g
testing:~# ethtool eth0
Settings for eth0:
        Supported ports: [ MII ]
        Supported link modes:   10baseT/Half 10baseT/Full
                                100baseT/Half 100baseT/Full
                                1000baseT/Full
        Supports auto-negotiation: Yes
        Advertised link modes:  10baseT/Half 10baseT/Full
                                100baseT/Half 100baseT/Full
                                1000baseT/Full
        Advertised auto-negotiation: Yes
        Speed: 100Mb/s
        Duplex: Full
        Port: MII
        PHYAD: 1
        Transceiver: external
        Auto-negotiation: on
        Supports Wake-on: g
        Wake-on: g
        Link detected: yes
```

## Despertando un equipo por LAN

Para encender un equipo por LAN se necesita enviar el paquete mágico. Hay varias
utilidades que hacen esto. En Linux se puede utilizar *wakeonlan* y en Mac
existe una utilidad free llamada [WakeUp](http://www.coriolis.ch/en/wakeup/).
Mikrotik también lo soporta con una utilidad propia, que se verá a continuación.

### Utilizando wakeonlan en Linux.

Si el equipo a encender está en la misma red alcanza con el siguiente comando,
indicando sólo la MAC del mismo. En este caso se supone que la MAC es
08:00:27:e8:02:6b.

```
leandro@megan:~$ wakeonlan 08:00:27:e8:02:6b
Sending magic packet to 255.255.255.255:9 with 08:00:27:e8:02:6b
```

Si el equipo está en otra red entonces son necesarios algunos pasos y parámetros
adicionales:

* La utilidad wakeonlan envía el paquete mágico al puerto 9 UDP. Por tal
motivo, en caso de utilizar NAT es necesario redirigir ese puerto a la IP de la
máquina destino. De le contrario será necesario sólo habilitarlo en el
[firewall](/tag/firewalls/).
* La máquina que ejecute la utilidad para prender el equipo remoto debe ahora
apuntar a la IP del router que redirigirá el paquete.

A continuación se muestran los parámetros del comando dado que no es tema de
este post explicar cómo redirigir puertos. Se supone aquí que el router hace NAT
y tiene la IP 10.0.0.1.

```
leandro@megan:~$ wakeonlan -i 10.0.0.1 08:00:27:e8:02:6b
Sending magic packet to 10.0.0.1:9 with 08:00:27:e8:02:6b
```

### Utilizando la utilidad de Mikrotik.

Con un router Mikrotik, basta con especificar la MAC del sistema destino y,
opcionalmente, la interfaz mediante la cual dicho sistema se conecta.

```
[leandro@MikroTik] > tool wol mac=08:00:27:e8:02:6b interface=LAN
```
