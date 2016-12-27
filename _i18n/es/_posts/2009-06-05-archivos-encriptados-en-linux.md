---
date: 2009-06-05 09:00:00 -3000
layout: post
title: Archivos encriptados en Linux
authors: leandro
categories: [ sistemas operativos ] 
tags: [filesystems, linux, seguridad, openssl, trucos]
permalink: /2009/06/05/archivos-encriptados-en-linux/

---

Al momento de guardar información sensible es muy importante contar con un
mecanismo que permita encriptarla y así ocultarla de quienes no deban verla. En
este post veremos dos formas rápidas y sencillas de encriptar archivos en
Linux. <!-- more -->

* Utilizando openssl para encriptar archivos individuales.
* Con encfs para encriptar un directorio y todo lo que él contenga.

## Encriptar un archivo con OpenSSL

La forma más sencilla de encriptar un fichero en Linux es utilizando openssl.
Para probarlo vamos a crear un archivo llamado ''archivo_texto_plano'' con el
contenido ''Prueba de cifrado de archivo con openssl''. Luego lo encriptamos en
un nuevo archivo y borramos el original.

{% highlight bash %}
leandro@scarlet:~$ echo "Prueba de cifrado de archivo con openssl" > archivo_texto_plano

leandro@scarlet:~$ openssl des3 -salt -in archivo_texto_plano -out archivo_encriptado

enter des-ede3-cbc encryption password: ****
Verifying - enter des-ede3-cbc encryption password: ****

leandro@scarlet:~$ rm archivo_texto_plano

leandro@scarlet:~$ cat archivo_encriptado
Salted__????I?y?
%???At~?eT??rܥ?Q9
??؁?? O&???{(
{% endhighlight %}

Para desencriptar el archivo basta con realizar el proceso inverso:

{% highlight bash %}
leandro@scarlet:~$ openssl des3 -d -salt -in archivo_encriptado -out
archivo_texto_plano
enter des-ede3-cbc decryption password: ****

leandro@scarlet:~$ cat archivo_texto_plano
Prueba de cifrado de archivo con openssl
{% endhighlight %}

## Encripción con EncFS

Aunque a priori pueda parecer más costoso, encriptar con encfs es muy sencillo y
la ventaja que nos provee con respecto a openssl es que es un filesystem en sí,
con lo cuál nos permite tener una completa jerarquía de directorios y
subdirectorios encriptados. Utiliza AES para encriptar su contenido,
garantizando un alto nivel de seguridad. La forma en la que trabaja es muy
sencilla:

* Crea un directorio denominado directorio raíz donde se almacenarán todos los
archivos encriptados.
* Utiliza un directorio como punto de montaje para acceder a los archivos luego
de desencriptarlos.
* La protección de los archivos se realiza por medio de una clave maestra.

### Instalación y configuración

La siguiente explicación se basa en Ubuntu 9.04, aunque debería ser muy similar
en cualquier otro Linux.

Instalar encfs:

{% highlight bash %}
leandro@scarlet:~$ aptitude install encfs
{% endhighlight %}

Crear los directorios a utilizar. Se utilizará ''.dir_encriptado'' como
directorio raíz y ''dir_encriptado'' como punto de montaje (notar la diferencia
en el nombre, el primero de ellos es oculto).

{% highlight bash %}
leandro@scarlet:~$ mkdir /home/leandro/.dir_encriptado
/home/leandro/dir_encriptado
{% endhighlight %}

Crear el sistema de archivos por primera vez:

{% highlight bash %}
leandro@scarlet:~$ encfs /home/leandro/.dir_encriptado
/home/leandro/dir_encriptado

Creando nuevo volumen cifrado.
Por favor, seleccione una de las siguientes opciones:
introduzca "x" para modo de configuración para expertos,
introduzca "p" para el modo preconfigurado paranoico,
cualquier otra cosa (o una línea vacía) seleccionará el modo estándar.
?> p

Configuración paranoica seleccionada.

Configuración finalizada. El sistema de archivos que se va a crear tendrá las
siguientes propiedades:
Cifrado del sistema de archivos: "ssl/aes", versión 2:1:1
Codificación de nombres de archivos: "nameio/block", versión 3:0:1
Tamaño de clave: 256 bits
Tamaño de bloque: 1024 bytes, incluyendo 8 bytes de cabecera MAC
Cada archivo contiene una cabecera de 8 bytes con datos únicos del IV.
Los nombres de archivos se codificarán usando el modo de encadenamiento de IV.
El IV de los datos del archivo está encadenado al IV del nombre del archivo.

------------------------ ADVERTENCIA ------------------------
Se ha habilitado  la opción de encadenamiento de vectores externos de
inicialización.
Esta opción impide el uso de enlaces duros en el sistema de archivos. Sin
enlaces duros, algunos programas pueden fallar; por ejemplo los programas 'mutt'
y 'procmail'.
Para más información, por favor revise la lista de correo de encfs.
Si desea elegir otra configuración, por favor pulse CTRL-C para abortar la
ejecución y comience de nuevo.

A continuación se le pedirá una contraseña para el sistema de archivos.
Debe recordar esta contraseña, ya que no existe absolutamente ningún mecanismo
de recuperación. No obstante, la contraseña puede cambiarse después con
encfsctl.

Nueva contraseña EncFS: ****
Verifique la contraseña EncFS: ****
{% endhighlight %}

### Utilización

Luego de terminados los pasos anteriores ya se creó y montó el sistema de
archivos encriptado. Lo siguiente es proceder a crear un archivo llamado
''prueba.txt'' con el contenido ''Prueba de encfs''.

{% highlight bash %}
leandro@scarlet:~$ echo "Prueba de encfs" >
/home/leandro/dir_encriptado/prueba.txt
leandro@scarlet:~$ cat /home/leandro/dir_encriptado/prueba.txt
Prueba de encfs
{% endhighlight %}

Ahora se desmonta el sistema de archivos y se intenta volver a leer el archivo
''prueba.txt'':

{% highlight bash %}
leandro@scarlet:~$ fusermount -u /home/leandro/dir_encriptado/
leandro@scarlet:~$ cat /home/leandro/dir_encriptado/prueba.txt
cat: /home/leandro/dir_encriptado/prueba.txt: No existe el fichero ó directorio
{% endhighlight %}

Se pueden listar los archivos que hay en el sistema de archivos encriptados sin
montar y se verifica que nada es legible:

{% highlight bash %}
leandro@scarlet:~$ ls /home/leandro/.dir_encriptado/
iEEeq3KRIMJ6WSJ9x2,6Sd,x
leandro@scarlet:~$ cat /home/leandro/.dir_encriptado/iEEeq3KRIMJ6WSJ9x2,6Sd,x
9&???Y???
????9?f???+?NL?9??U?leandro@scarlet:~$
{% endhighlight %}

Para volver a acceder al contenido:

{% highlight bash %}
leandro@scarlet:~$ encfs /home/leandro/.dir_encriptado/
/home/leandro/dir_encriptado/
Contraseña EncFS: ****
leandro@scarlet:~$ cat /home/leandro/dir_encriptado/prueba.txt
Prueba de encfs
{% endhighlight %}

**NOTA**: por practicidad, puede crearse un script que maneje todos los
directorios encriptados con argumentos que ahorren escritura.
