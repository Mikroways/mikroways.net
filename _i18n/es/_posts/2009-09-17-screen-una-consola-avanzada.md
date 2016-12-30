---
date: 2009-09-17 09:00:00 -3000
layout: post
title: "Screen: una consola avanzada"
authors: leandro
categories: [ sistemas operativos ]
tags: [consola, linux, unix]
permalink: /2009/09/17/screen-una-consola-avanzada/

---

[Screen](http://www.gnu.org/software/screen) es un software desarrollado por el
proyecto [GNU](http://www.gnu.org) que consiste en un multiplexor de terminales
de forma que en una misma ventana puedan abrirse muchas consolas. Básicamente
funciona como un gestor de ventanas pero en modo texto. <!-- more -->

Las mayores ventajas de screen son:

* **Sesiones persistentes:** cada sesión que iniciemos en screen permanecerá 
abierta hasta que sea explícitamente cerrada o se reinicie la máquina. Esto es
muy bueno cuando por ejemplo trabajamos desde un lugar con SSH y luego queremos
seguir desde otra ubicación. Sin usar screen la sesión se cerraría. Una función
muy útil es poner a descargar algo en el equipo para que se siga corriendo en
background aún cuando cerremos nuestra sesión de SSH.
* **Pantalla compartida:** es posible que varias terminales se conecten a la
misma sesión screen pudiendo ver lo que se está haciendo en ella. De esta
manera, dos o más personas ubicadas en lugares diferentes podrían estar
trabajando viendo lo que hace una de ellas. Combinado con un programa de
mensajería o de VoIP es como trabajar uno al lado del otro!
* **Múltiples terminales:** dentro de una consola screen es posible abrir varias
terminales que se van conmutando con un atajo de teclas.

Los comandos básicos para empezar a utilizar screen son:

* screen: inicia una nueva sesión screen.
* Ctrl+A+c: crea una nueva terminal y cambia a ella.
* Ctrl+A+n: avanza a la siguiente terminal.
* Ctrl+A+k: cierra la terminal actual.
* Ctrl+A+A: permite definirle un título a la ventana actual.
* Ctrl+A+": lista todas las terminales abiertas con sus títulos y permite elegir
entre ellas.
* Ctrl+A+d: desacopla la terminal de screen. Esto significa que se deja screen
en segundo plano y se vuelve a la terminal común.
* screen -x: permite acoplarse a la sesión screen abierta.
