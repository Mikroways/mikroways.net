---
date: 2010-06-07 09:00:00 -3000
layout: post
title: Lista negra de phishers con Postfix
authors: leandro
categories: servidores
tags: [linux, mail, postfix, seguridad, smtp, spam]
permalink: /2010/06/07/lista-negra-de-phishers-con-postfix/

---

En el lugar donde trabajo nos ocurrió que desde hace un tiempo al día de hoy
recibimos muy seguido mails solicitando nombre de usuario y contraseña de
nuestras casillas de correo. Desde el punto de vista del usuario, responder este
tipo de mails suministrando los datos reales es peligroso porque se facilita el
robo de identidad; desde la óptica del administrador del equipo se abre una
puerta para realizar spam. <!-- more -->

Como administrador de un servidor de mail, es posible aprovechar dichos correos
para que las cuentas de nuestros usuarios no sean vulneradas. Por ello, comparto
con ustedes la solución que encontramos con un compañero que, si bien no es el
remedio definitivo para estos problemas, sí se la puede utilizar como un medio
para minimizar los casos exitosos del atacante.

## La solución

La solución de la que les hablo consiste básicamente en interceptar los mails
que los usuarios respondan de manera que nunca lleguen a destino. Para ello son
necesarias dos cosas:

* **Crear una lista con las direcciones de mail de los
phishers:** esto se puede hacer obteniendo el campo *reply-to* de
los mails que se reciben solicitando información sensible. En este punto, el
administrador puede incorporar cada dirección a mano o buscar la forma de
automatizar el proceso.
* **Interceptar los mails dirigidos a dichas direcciones:**
para ello, a la lista creada es necesario indicarle la cuenta a la cuál se
quiere redirigir los mails. Luego hay que incorporar dicha lista en
Postfix.

## Manos a la obra

Crear la lista negra con direcciones y la cuenta a la cuál se redigirán:

{% highlight bash %}
vi /etc/postfix/blacklist

dir1@example.com phishers
dir2@example.com phishers
{% endhighlight %}

Generar, a partir de dicho archivo, la Berkeley DB que utilizará Postfix.

{% highlight bash %}
postmap /etc/postfix/blacklist
{% endhighlight %}

El comando anterior dejará como resultado un archivo con extensión .db en el
mismo directorio donde se encuentra el fuente:

{% highlight bash %}
file /etc/postfix/blacklist.db
/etc/postfix/blacklist.db: Berkeley DB (Hash, version 8, native
byte-order)
{% endhighlight %}

Luego, indicarle a Postfix que lea dicha lista:

{% highlight bash %}
vi /etc/postfix/main.cf

virtual_alias_maps = hash:/etc/postfix/blacklist
{% endhighlight %}

Ahora bien, al armar la lista redirigimos los mails que van a cada dirección de
mail de un phisher a una cuenta especial llamada phishers. Esa cuenta puede ser
uno de tres casos:

* Una cuenta en el sistema.
* Un alias a la cuenta del administrador.
* Una redirección a /dev/null.

De las opciones anteriores, la ventaja de la primera o la segunda es que si el
administrador recibe un mail donde ve que un usuario contestó con sus datos
puede ponerse en contacto con el mismo para aconsejarle cómo actuar en esa
situación y así evitar que la misma se vuelva a repetir. No obstante, con una
redirección a /dev/null y un análisis de los logs podría lograrse el mismo
resultado de forma menos invasiva. Optaremos en este caso por la última opción y
por ello agregaremos la entrada phishers a los alias de Postfix.

{% highlight bash %}
vi /etc/aliases

phishers: /dev/null
{% endhighlight %}

Regenerar la base de datos de los alias.

{% highlight bash %}
newaliases
{% endhighlight %}

Finalmente es necesario reiniciar Postfix para que lea la nueva configuración
por los cambios efectuados en /etc/postfix/main.cf. A partir de este momento,
cada vez que se tenga una nueva dirección de correo de un phisher bastará con
agregarla a la lista negra y ejecutar el comando postmap.
