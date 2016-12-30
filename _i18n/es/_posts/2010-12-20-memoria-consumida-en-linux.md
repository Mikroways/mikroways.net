---
date: 2010-12-20 09:00:00 -3000
layout: post
title: Memoria consumida en Linux
authors: leandro
categories: [ sistemas operativos ]
tags: [comandos, consola, linux, servidores]
permalink: /2010/12/20/memoria-consumida-en-linux/

---

Muchas veces puede ser necesario encontrar la memoria que un proceso o un
usuario consumen en el sistema. Lograr esto es bastante sencillo aunque implica
hacer algunas cuentas. Por ello es posible simplificar la tarea utilizando algún
script que la haga por nosotros. <!-- more -->A continuación puede verse primero
cómo calcular la memoria física consumida por el proceso Apache y luego por el
usuario www-data. La unidad final está dada en MB.

{% highlight bash %}
root@server:~# ps -C apache2 -o rss --no-headers | (tr '\n' +; echo 0) | bc | awk '{print "scale=2; " $0 "/1024"}' | bc
267.32
root@server:~# ps -U www-data -o rss --no-headers | (tr '\n' +; echo 0) | bc | awk '{print "scale=2; " $0 "/1024"}' | bc
146.15
{% endhighlight %}

Existe otra forma también de chequearlo que es bastante más sencilla y es
utilizando la herramienta *smem*. El problema es que dicha herramienta es
compatible sólo con los kernels 2.6.27 o más nuevos. A continuación se puede ver
la consulta de cuánto consume el proceso *apache2*. En este caso, smem mostrará
todos los procesos y, al final, la suma de los consumos (debido a la opción -t
suministrada). La opción que nos interesa en este caso es RSS, que se ve que da
un total de 16720 bytes. Es para tener en cuenta que smem está sumando a lo
consumido por el proceso que se le pidió la propia ejecución del comando; esto
debería restarse del total para tener una valor más preciso. Daría finalmente
12020 bytes.

{% highlight bash %}
root@server:/home/leandro# smem -t -P "apache2"
  PID User     Command                         Swap      USS      PSS      RSS
10171 root     /usr/sbin/apache2 -k start       348      144      248     1328
 7173 root     /usr/sbin/apache2 -k start       360      172      276     1476
 7171 root     /usr/sbin/apache2 -k start       364      200      302     1516
 7174 root     /usr/sbin/apache2 -k start       364      200      302     1516
 7175 root     /usr/sbin/apache2 -k start       364      200      302     1516
 7731 root     /usr/sbin/apache2 -k start       364      200      302     1516
 7172 root     /usr/sbin/apache2 -k start       352      204      306     1520
 1816 root     /usr/sbin/apache2 -k start       364      180      319     1632
18189 root     /usr/bin/python /usr/bin/sm        0     2944     3119     4700
-------------------------------------------------------------------------------
  183 1                                        2880     4444     5476
16720
{% endhighlight %}

Finalmente, debajo se hace la misma consulta pero esta vez preguntando lo
consumido por el usuario leandro.

{% highlight bash %}
root@server:/home/leandro# smem -t -U "leandro" -k
  PID User     Command                         Swap      USS      PSS      RSS
 8708 leandro  sshd: leandro@pts/17               0   292.0K   848.0K     1.8M
 8709 leandro  -bash                              0     3.8M     4.3M     5.5M
-------------------------------------------------------------------------------
    2 1                                           0     4.1M     5.1M     7.3M
{% endhighlight %}
