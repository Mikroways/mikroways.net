---
date: 2009-05-15 09:00:00 -3000
layout: post
title: Autenticación CHAP
authors: leandro
categories: redes
tags: [cisco, estándares, ppp, protocolos, seguridad]
permalink: /2009/05/15/autenticacion-chap/

---

El martes un colega nos dio una explicación de CHAP que me resultó muy fácil de
entender. Para ello usó algunos gráficos que están en la
[explicación de autenticación CHAP en PPP](http://www.cisco.com/en/US/tech/tk713/tk507/technologies_tech_note09186a00800b4131.shtml)
en la página de Cisco. Me tomé el trabajo de traducirlo para compartirlo con
ustedes. Espero que les sea útil. <!-- more -->

## Configuración

Para configurar CHAP de manera genérica es necesario:

* Definir en el cliente el nombre de usuario y contraseña a utilizar.
* Definir en el cliente quién es el autenticador.
* Definir en el cliente el nombre de usuario y contraseña del autenticador.
* Definir en el autenticador un nombre de usuario y contraseña para el cliente.

**IMPORTANTE**: la contraseña **DEBE** coincidir en ambos extremos.

## Procedimiento

1) El primer paso se produce cuando el usuario (léase cliente) se conecta al
equipo 3640-1. Tener en cuenta que el equipo 766-1 es el autenticante y el
3640-1 el autenticador.

![PPP CHAP - Paso 1](/images/blog/understanding_ppp_chap1.gif)

2) El servidor responde con los siguientes datos:

* **01**: identificador de paquete de desafío CHAP.
* **ID**: identificador del intercambio. Se usará para identificar tramas de una
misma conversación.
* **Nº aleatorio**: utilizado luego para computar un hash.
* **Nombre**: el servidor envía su hostname. También podría utilizar otro nombre
definido.

Además, el servidor almacena para sí el número aleatorio y el ID que envía.

![PPP CHAP - Paso 2](/images/blog/understanding_ppp_chap2.gif)

3) Luego, el cliente:

* Toma el ID y lo inyecta en el generador de hash MD5.
* Toma el Nº aleatorio y lo inyecta en el generador de hash MD5.
* Utiliza el nombre enviado por el otro equipo para buscar la contraseña y
la agrega al generador de hash MD5.

![PPP CHAP - Paso 3](/images/blog/understanding_ppp_chap3.gif)

4) El cliente utiliza el hash que generó en el paso anterior para armar una
nueva trama y envía en ella:

* **02**: identificador de respuesta CHAP.
* **ID**: el mismo que recibió de su par.
* **Hash**: el generado por él en el paso anterior.
* **Nombre**: manda su hostname u otro nombre definido.

![PPP CHAP - Paso 4](/images/blog/understanding_ppp_chap4.gif)

5) Ahora, el servidor debe comprobar la autenticidad del cliente. Para ello
realiza un nuevo cálculo:

* **ID**: lo usa para indexar la búsqueda del Nº aleatorio que
envió al cliente y lo inyecta al generador de hash MD5.
* **Nº aleatorio**: lo inyecta al generador de hash MD5.
* Utiliza el nombre enviado por el otro equipo para indexar la búsqueda de
la contraseña.

Luego de realizar lo anterior el servidor compara si el hash que envió el
cliente es igual al que obtuvo él. Entonces realiza el siguiente paso.

![PPP CHAP - Paso 5](/images/blog/understanding_ppp_chap5.gif)

6) En el último paso se indica al cliente si la
autenticación fue exitosa o falló.

* **03/04**: identificador de autenticación CHAP satisfactoria / identificador
de autenticación CHAP fallida.
* **ID**: el mismo que hasta el momento.
* **Bienvenido**: un mensaje para el usuario.

![PPP CHAP - Paso 6](/images/blog/understanding_ppp_chap6.gif)

**Notas sobre funcionamiento**

* El ejemplo anterior muestra la autenticación unidireccional. Si fuera
bidireccional el mismo procedimiento se repetiría cambiando los papeles.
* El tráfico que viaja entre ambos va encriptado.
* Notar que '''la contraseña nunca viaja por el medio'''. Esto hace que CHAP
sea aún más seguro.
