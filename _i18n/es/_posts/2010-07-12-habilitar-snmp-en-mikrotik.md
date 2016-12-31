---
date: 2010-07-12 09:00:00 -3000
layout: post
title: Habilitar SNMP en Mikrotik
authors: leandro
categories: redes
tags: [internet, mikrotik, monitoreo, servidores, snmp]
permalink: /2010/07/12/habilitar-snmp-en-mikrotik/

---

Los routerboard Mikrotik incluyen la posibilidad de monitorearlos utilizando
SNMP de forma muy sencilla, como puede verse a continuación. <!-- more -->

```
[user@core-gateway] > snmp set enabled=yes contact="root@netstorming" location="communications-room" trap-community=public 
[user@core-gateway] > snmp print 
         enabled: yes
         contact: "root@netstorming"
        location: "communications-room"
       engine-id: ""
    engine-boots: 0
     time-window: 15
       trap-sink: 0.0.0.0
  trap-community: public
    trap-version: 1

[user@core-gateway] > snmp community print 
 # NAME     ADDRESS            SECURITY   READ-ACCESS
 0 public   0.0.0.0/0          none       yes 

[user@core-gateway] > snmp community set 0 address=172.16.30.2     
[user@core-gateway] > snmp community print
 # NAME     ADDRESS            SECURITY   READ-ACCESS
 0 public   172.16.30.2/32     none       yes
```

En los comandos anteriores puede verse que se habilita SNMP, se utiliza la
comunidad por defecto public que nos permite consultar diferentes MIBS al equipo
y se la restringe para que sólo se la pueda consultar desde la IP 172.16.30.2
que es la IP del servidor de monitoreo.

Se puede constatar que lo anterior funcione correctamente ejecutando el comando
*snmpwalk* en dicho servidor:

```
scarlet:~ leandro$ snmpwalk -v1 -c public 172.16.30.1

SNMPv2-MIB::sysDescr.0 = STRING: router
SNMPv2-MIB::sysObjectID.0 = OID: SNMPv2-SMI::enterprises.14988.1
DISMAN-EVENT-MIB::sysUpTimeInstance = Timeticks: (29815700) 3 days, 10:49:17.00
SNMPv2-MIB::sysContact.0 = STRING: root@netstorming
SNMPv2-MIB::sysName.0 = STRING: core-gateway
SNMPv2-MIB::sysLocation.0 = STRING: communications-room
SNMPv2-MIB::sysServices.0 = INTEGER: 78
...
```

La salida es mucho más extensa que lo que se muestra, pero si se obtiene algo de
lo anterior entonces se puede asumir que SNMP está funcionando correctamente en
el equipo y que el servidor es capaz de obtener la información que necesita.
