---
date: 2010-08-13 09:00:00 -3000
layout: post
title: Averiguar la versión de Linux/BSD instalada
authors: leandro
categories: [ sistemas operativos ]
tags: [centos, debian, fedora, linux, red hat, trucos, ubuntu]
permalink: /2010/08/13/averiguar-la-version-de-linuxbsd-instalada/

---

En muchas oportunidades es necesario chequear la versión del sistema operativo
instalado en un equipo. A continuación, cómo hacerlo en diferentes sistemas
operativos: <!-- more -->

**Debian / Ubuntu**

```
root@server:~# cat /etc/issue
Ubuntu 10.04.1 LTS \n \l

root@server:~# lsb_release -a
No LSB modules are available.
Distributor ID:  Ubuntu
Description:  Ubuntu 10.04.1 LTS
Release:  10.04
Codename:  lucid
```

El último comando no viene instalado en Debian por defecto, por lo que será
necesario:

```
root@server:~# aptitude install lsb-release
```

**Fedora / CentOS / Red Hat**

```
[root@server ~] # cat /etc/redhat-release 
CentOS release 5.5 (Final)

[root@server ~] # lsb_release -a
LSB Version:
:core-3.1-ia32:core-3.1-noarch:graphics-3.1-ia32:graphics-3.1-noarch
Distributor ID:  CentOS
Description:  CentOS release 5.5 (Final)
Release:  5.5
Codename:  Final
```

El último comando lo probé sólo en CentOS y no viene instalado. En este caso,
para utilizarlo:

```
[root@server ~] # yum install redhat-lsb.i386
```

**FreeBSD / OpenBSD**

```
[root@ ~]# uname -rs
FreeBSD 8.0-RELEASE
```
