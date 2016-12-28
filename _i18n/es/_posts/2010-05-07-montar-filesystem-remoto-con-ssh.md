---
date: 2010-05-07 09:00:00 -3000
layout: post
title: Montar filesystem remoto con SSH
authors: leandro
categories: [ sistemas operativos ]
tags: [comandos, consola, filesystems, linux, mac, ssh, unix]
permalink: /2010/05/07/montar-filesystem-remoto-con-ssh/

---

Ya se habrá entendido que SSH es más que un simple protocolo para administración
remota. De hecho, nos brinda una cantidad enorme de funciones muy útiles. Hace
unos días veíamos cómo
[redireccionar puertos con SSH](/2010/05/05/redireccion-de-puertos-con-ssh/); un
tiempo atrás habíamos visto también cómo
[ejecutar aplicaciones gráficas remotas](/2009/08/12/ejecutar-aplicaciones-graficas-de-otra-maquina-con-ssh/).
Esta vez veremos cómo montar un sistema de archivos remoto utilizando sólo SSH.
<!-- more -->Para ello necesitamos, lógicamente, acceso por SSH a la máquina que
tiene el filesystem que deseamos montar. Además, en la máquina de destino
tendremos que instalar la utilidad que nos permitirá hacer esto: sshfs. A
continuación muestro un ejemplo utilizando Fedora:

{% highlight bash %}
[root@megan leandro]# yum install fuse-sshfs.i686
{% endhighlight %}

Una vez instalado sshfs su uso es muy trivial. Simplemente especificamos el
nombre de usuario@IP_maquina:/directorio/a/montar /punto/de/montaje.

{% highlight bash %}
[leandro@megan ~]# sshfs leandro@192.168.1.2:/Users/leandro/datos/
/mnt/scarlet/
Password:
[leandro@megan ~]$ mount
192.168.1.2:/Users/leandro/datos on /mnt/scarlet type fuse.sshfs
(rw,nosuid,nodev,max_read=65536,user=leandro)
{% endhighlight %}

En el ejemplo anterior se puede ver cómo se ha montado el sistema de archivos.
Importante y a destacar es que podemos montar el mismo sin ser root. De hecho,
conviene hacerlo con el usuario sin privilegios que utilicemos dado que de esa
manera podremos leer y escribir sin problemas.
