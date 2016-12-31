---
date: 2010-01-24 09:00:00 -3000
layout: post
title: Permisos granulares en Linux
authors: leandro
categories: [ sistemas operativos ]
tags: [autorización, linux, seguridad, unix]
permalink: /2010/01/24/permisos-granulares-en-linux/

---

En Linux existe un archivo de configuración muy interesante para establecer
distintos tipos de restricciones por usuarios/grupos del sistema, el mismo es
*/etc/security/limits.conf*. <!-- more -->

Cada entrada del archivo debe tener la siguiente estructura:

```
<dominio> <tipo> <item> <valor>
```

## Dominio

El valor de este item indica cual sería el dominio al que le va a regir la
limitación. El valor de este ítem podría ser un usuario, un grupo o todos. Es
importante tener conciencia de que el usuario root esta excluido de cualquier
limitación que se defina a un grupo de usuarios al que pertenezca. Si fuera
necesario aplicarle alguna limitación al usuario root debe realizarse utilizando
root dominio.

* Nombre de usuario.
* @ seguido de un nombre de grupo (ej. @users).
* El caracter '*' para usarlo a forma de comodín para cualquier usuario.
* % seguido un nombre de grupo (ej. %grupo).

## Tipo

<table class="table table-striped table-bordered">
  <thead>
    <tr>
      <th>Tipo</th>
      <th>Descripción</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>soft</td>
      <td>Establece el valor con el que dominio inicia sesión. Y luego el
usuario podrá cambiar de acuerdo a un rango menor al definido como limite hard</td>
    </tr>
    <tr>
      <td>hard</td>
      <td>Establece el valor que el dominio no puede sobrepasar.</td>
    </tr>
  </tbody>
</table>

## Items


<table class="table table-striped table-bordered">
  <thead>
    <tr>
      <th>Item</th>
      <th>Descripción</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>core</td>
      <td>Limita el tamaño del archivo de imagen de memoria (core file) (KB)</td>
    </tr>
    <tr>
      <td>data</td>
      <td>Tamaño máximo de los datos (KB)</td>
    </tr>
    <tr>
      <td>fsize</td>
      <td>Tamaño máximo de un archivo (KB)</td>
    </tr>
    <tr>
      <td>memlock</td>
      <td>Máximo espacio de direcciones de memoria bloqueada (KB)</td>
    </tr>
    <tr>
      <td>nofile</td>
      <td>Cantidad máxima de archivos abiertos</td>
    </tr>
    <tr>
      <td>rss</td>
      <td>Tamaño máximo del conjunto residente (KB)</td>
    </tr>
    <tr>
      <td>stack</td>
      <td>Tamaño máximo de la pila (KB)</td>
    </tr>
    <tr>
      <td>cpu</td>
      <td>Tiempo máximo de CPU (MIN)</td>
    </tr>
    <tr>
      <td>nproc</td>
      <td>Número máximo de procesos</td>
    </tr>
    <tr>
      <td>as</td>
      <td>Límite del espacio de direcciones (KB)</td>
    </tr>
    <tr>
      <td>maxlogins</td>
      <td>Cantidad máxima de logins para el usuario</td>
    </tr>
    <tr>
      <td>maxsyslogins</td>
      <td>Cantidad máxima de logins en el sistema</td>
    </tr>
    <tr>
      <td>priority</td>
      <td>La prioridad con la que se ejecutarán los procesos del usuario</td>
    </tr>
    <tr>
      <td>locks</td>
      <td>Cantidad máxima de archivos bloqueados que puede tener el usuario</td>
    </tr>
    <tr>
      <td>sigpending</td>
      <td>Cantidad máxima de señales pendientes</td>
    </tr>
    <tr>
      <td>msgqueue</td>
      <td>Cantidad máxima de memoria utilizada para la cola de mensajes POSIX (bytes)</td>
    </tr>
    <tr>
      <td>nice</td>
      <td>Máximos valores a los que puede llevarse la prioridad con nice: [-20, 19]</td>
    </tr>
    <tr>
      <td>rtprio</td>
      <td>Prioridad máxima para tiempo real</td>
    </tr>
    <tr>
      <td>chroot</td>
      <td>Cambiar el directorio raíz a uno diferente (Específico de Debian)</td>
    </tr>
  </tbody>
</table>

## Ejemplo

Si quisiéramos definirle al usuario *testing* un máximo de 2 terminales,
podemos incluir la siguiente línea en el /etc/security/limits.conf.

```
testing hard maxlogins 2
```

Al usuario, al intentar iniciar sesión en una tercer terminal, le informará que
el acceso no está permitido.
