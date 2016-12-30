---
date: 2010-04-20 09:00:00 -3000
layout: post
title: Utilizar Apache como frontend a JBoss
authors: leandro
categories: servidores
tags: [apache, http, https, java, jboss, web]
permalink: /2010/04/20/utilizar-apache-como-frontend-a-jboss/

---

Por medio del módulo mod_jk es posible utilizar Apache como el servidor público
y que sea éste el encargado de redirigir las peticiones al servidor JBoss
correspondiente. Las ventajas de este enfoque son varias: <!-- more -->

* Es Apache quien maneja las conexiones públicas, lo que nos da todas las
garantías que el software provee.
* Permite que los accesos a los servicios de JBoss sean por medio del puerto
80, en lugar del 8080 que utiliza por defecto JBoss. Esto es bueno en muchos
casos donde los usuarios no pueden acceder a puertos diferentes del 80.
* Es posible habilitar SSL en Apache y encriptar de esa manera las
conexiones al servidor JBoss.
* La forma más trivial de hacer balanceo de carga entre servidores JBoss es
utilizando Apache.

La manera de configurar dicho módulo en Ubuntu es bastante sencilla, sólo basta
con seguir los pasos que se listan a continuación.

{% highlight bash %}
aptitude install libapache2-mod-jk
{% endhighlight %}

Editar el archivo de vhost que redigirá a JBoss:

{% highlight bash %}
JkMount /OpenKM default
JkMount /OpenKM/* default
{% endhighlight %}

En el archivo anterior, JkMount recibe dos parámetros: el primero es la URL que
se desea redirigir y el segundo es el "worker" al que se lo redireccionará.
Luego es necesario indicar dónde contactar dicho "worker". Para ello, en un
nuevo archivo:

{% highlight bash %}
# Define 1 real worker named ajp13
worker.list=default

# Set properties for worker named ajp13 to use ajp13 protocol,
# and run on port 8009
worker.default.type=ajp13
worker.default.host=localhost
worker.default.port=8009
{% endhighlight %}

Luego, como último paso, es necesario indicarle a Apache dónde buscar la
configuración del worker. Para ello, editar el archivo
/etc/apache2/conf.d/jk.conf:

{% highlight bash %}
<pre>JkWorkersFile "/etc/apache2/workers.properties"
JkLogFile "/var/log/apache2/mod_jk.log"

JkLogLevel info

JkMount /OpenKM/ ajp13
JkMount /OpenKM/* ajp13
{% endhighlight %}

Finalmente basta con reiniciar el Apache y todo ya se podrá acceder al servicio
por medio de la URL especificada.
