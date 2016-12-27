---
date: 2010-02-23 09:00:00 -3000
layout: post
title: Equivalencias entre DPKG/RPM y APT/YUM
authors: leandro
categories: [ sistemas operativos ]
tags: [apt-get, comandos, consola, debian, dpkg, fedora, rpm, linux, red-hat,
ubuntu, yum]
permalink: /2010/02/23/equivalencias-entre-dpkgrpm-y-aptyum/

---

Las distribuciones basadas en Red Hat usan rpm como el formato de sus paquetes
binarios y rpm / yum para administrarlos. Por otro lado, las basadas en Debian
usan deb y dpkg / apt-get. En la siguiente tabla presento las equivalencias para
los usuarios que estén acostumbrado a uno de ellos y se muevan al otro.<!-- more -->

## Comparación entre dpkg y rpm

<table class="table table-striped table-bordered">
  <thead>
    <tr>
      <th>DPKG</th>
      <th>RPM</th>
      <th>Descripción</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>dpkg -Gi paquete(s).deb</td>
      <td>rpm -Uvh packages(s).rpm</td>
      <td>Instalar/Upgradear archivo(s) del/de los paquete(s)</td>
    </tr>
    <tr>
      <td>dpkg -r paquete</td>
      <td>rpm -e paquete</td>
      <td>Eliminar paquete</td>
    </tr>
    <tr>
      <td>dpkg -l <em>palabra</em></td>
      <td>rpm -qa <em>palabra</em></td>
      <td>Mostrar todos los paquetes cuyo nombre contenga “palabra”</td>
    </tr>
    <tr>
      <td>dpkg -l paquete</td>
      <td>rpm -q paquete</td>
      <td>Mostrar la versión del paquete instalada</td>
    </tr>
    <tr>
      <td>dpkg -s paquete</td>
      <td>rpm -q -i paquete</td>
      <td>Mostrar todos los metadatos del paquete</td>
    </tr>
    <tr>
      <td>dpkg -I paquete.deb</td>
      <td>rpm -q -i -p paquete.rpm</td>
      <td>Mostrar todos los metadatos de los archivos del paquete</td>
    </tr>
    <tr>
      <td>dpkg -S /path/archivo</td>
      <td>rpm -q -f /path/archivo</td>
      <td>A que paquete pertenece el archivo</td>
    </tr>
    <tr>
      <td>dpkg -L paquete</td>
      <td>rpm -q -l paquete</td>
      <td>Lista dónde se instalaron los archivos</td>
    </tr>
    <tr>
      <td>dpkg -c paquete.deb</td>
      <td>rpm -q -l -p paquete.rpm</td>
      <td>Lista dónde los archivos serían instalados</td>
    </tr>
    <tr>
      <td>dpkg -x paquete.deb</td>
      <td>cpio -id</td>
      <td>Extrae los archivos del paquete al directorio actual</td>
    </tr>
    <tr>
      <td>dpkg –purge –dry-run paquete</td>
      <td>rpm -q –whatrequires paquete</td>
      <td>Lista los paquetes que requiere paquete (ver también whatrequires)</td>
    </tr>
  </tbody>
</table>

## Comparación entre apt-get y yum

<table class="table table-striped table-bordered">
  <thead>
    <tr>
      <th>APT-GET</th>
      <th>YUM</th>
      <th>Descripción</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>apt-get dist-upgrade</td>
      <td>yum update [lista de paquetes]</td>
      <td>Upgradea todos los paquetes del sistema (en el caso de yum se puede especificar sólo algunos)</td>
    </tr>
    <tr>
      <td>apt-get install</td>
      <td>yum install</td>
      <td>Instala la última versión del/de los paquete(s)</td>
    </tr>
    <tr>
      <td>apt-get remove</td>
      <td>yum remove</td>
      <td>Elimina los paquetes del sistema</td>
    </tr>
    <tr>
      <td>apt-cache list [lista de paquetes]</td>
      <td>yum list [lista de paquetes]</td>
      <td>Lista los paquetes disponibles en los repositorios</td>
    </tr>
  </tbody>
</table>


