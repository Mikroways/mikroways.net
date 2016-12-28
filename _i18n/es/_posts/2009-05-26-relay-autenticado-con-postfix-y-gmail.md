---
date: 2009-05-26 09:00:00 -3000
layout: post
title: Relay autenticado con Postfix y Gmail
authors: leandro
categories: servidores
tags: [gmail, linux, mail, postfix, smtp]
permalink: /2009/05/26/relay-autenticado-con-postfix-y-gmail/

---

La intención de este artículo es explicar cómo enviar mails desde un servidor
con Postfix utilizando de relay a Gmail con un usuario y contraseña. Puede
resultar útil si queremos enviar mails que no sean enviados a Spam o simplemente
rechazados para el caso que tengamos una IP dinámica o porque necesitemos
contar con envío de mails de forma rápida. <!-- more -->

## Configuración de Postfix

La configuración de Postfix es muy sencilla y demanda editar sólo dos archivos.
Se ven los mismos a continuación y se deja una explicación de qué significa cada
línea introducida.

### /etc/postfix/main.cf

Dejar en este archivo sólo la siguiente información:

{% highlight bash linenos %}
relayhost = [smtp.gmail.com]:587

smtp_use_tls = yes
smtp_tls_CAfile = /etc/postfix/cacert.pem

smtp_sasl_auth_enable = yes
smtp_sasl_password_maps = hash:/etc/postfix/sasl/passwd
smtp_sasl_security_options = noanonymous
{% endhighlight %}

La explicación de la directiva en cada una de las líneas es:

* 1: se le indica que el host con el cual se debe hacer relay es
smtp.gmail.com y el puerto en 587. Se ponen corchetes para impedir que resuelve
un MX para ese nombre.
* 3: con esta línea, postfix sabe que deberá utilizar TLS para encriptar la
comunicación.
* 4: la ubicación del certificado de la CA, para asegurarse que el host
remoto corresponde con quién dice ser.
* 6: se habilita la autenticación SASL.
* 7: ubicación del archivo que contiene las passwords para utilizar en la
autenticación. La directiva hash indica que existe un archivo .db con la
información (que se creará con el comando postmap más adelante).
* 8: se le dice a postfix que no se permite la autenticación anónima.

### /etc/postfix/sasl/passwd

Reemplazar en la siguiente línea los datos de la cuenta que será utilizada para
hacer el relay.

```
[smtp.gmail.com]:587    usuario@gmail.com:password
```

Luego, desde la consola se debe crear el archivo .db para postfix y cambiarle
los permisos al archivo original para protegerlo.

```
postmap /etc/postfix/sasl/passwd
chmod 400 /etc/postfix/sasl/passwd
```

## Importar el certificado de la CA

Finalmente, debemos especificar a Postfix el certificado de la CA que deseamos
que utilice. Para ello:

```
cat /etc/ssl/certs/Thawte_Premium_Server_CA.pem &gt;&gt;
/etc/postfix/cacert.pem
```

## Cuentas de Google Apps

Si en lugar de utilizar una cuenta de Gmail se usa una de Google Apps el
tutorial sirve igual. Basta simplemente con reemplazar usuario@gmail.com por
usuario@dominio.
