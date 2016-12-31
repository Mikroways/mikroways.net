---
date: 2009-09-03 09:00:00 -3000
layout: post
title: Deshabilitar DNS lookups en SSH
authors: leandro
categories: servidores
tags: [linux, mac, ssh, trucos, unix]
permalink: /2009/09/03/deshabilitar-dns-lookups-en-ssh/

---

Por defecto OpenSSH realiza una consulta DNS preguntando por el nombre de la IP
que intenta conectarse al servidor. Esta característica implica un retraso
importante cuando ningún servidor DNS responde. En determinados casos, cuando la
IP desde la que nos conectamos no tiene un reverso o no nos interesa ese chequeo
podemos deshabilitarlo para eliminar esa demora. <!-- more -->Para ello, es
necesario agregar la siguiente línea al archivo de configuración del servicio
SSH, que suele ser /etc/ssh/sshd_config:

```
UseDNS No
```

Luego basta con reiniciar el servicio para que se apliquen los cambios.
