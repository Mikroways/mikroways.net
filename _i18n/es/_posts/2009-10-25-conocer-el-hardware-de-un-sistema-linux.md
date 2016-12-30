---
date: 2009-10-25 09:00:00 -3000
layout: post
title: Conocer el hardware de un sistema Linux
authors: leandro
categories: [ sistemas operativos ]
tags: [comandos, consola, hardware, linux]
permalink: /2009/10/25/conocer-el-hardware-de-un-sistema-linux/

---

Muchísimas veces es nesario saber el hardware de un determinado equipo. Si
tenemos Linux (y en particular Debian/Ubuntu) esto resulta muy fácil gracias a
la utilidad *lshw* que es capaz de listar con gran detalle el hardware del
equipo. <!-- more -->

Está disponible en los repositorios con lo cual instalarla se reduce a:

```
aptitude install lshw
```

Luego, para usarla simplemente se la invoca y se obtiene el resultado (sólo un
breve extracto):

```
testing:/home/leandro# lshw
testing
description: Computer
product: VirtualBox
vendor: innotek GmbH
version: 1.2
serial: 0
width: 32 bits
capabilities: smbios-2.5 dmi-2.5
configuration: uuid=4758A2E5-A9EE-4687-8A8B-40CC82818167
*-core
description: Motherboard
physical id: 0
*-firmware
description: BIOS
vendor: innotek GmbH
physical id: 0
version: VirtualBox (12/01/2006)
size: 128KiB
capabilities: isa pci cdboot bootselect int9keyboard int10video acpi
```

Si no podemos instalar dicha utilidad, la forma tradicional de hacer esto es
valerse de las entradas en el */proc* o de comandos como *lspci*, *lsusb*,
*dmesg*, *free*, entre otros. Por ejemplo, para conocer la
información acerca del microprocesador:

```
testing:/home/leandro# cat /proc/cpuinfo
processor : 0
vendor_id : GenuineIntel
cpu family : 6
model : 23
model name : Intel(R) Core(TM)2 Duo CPU P8700 @ 2.53GHz
stepping : 10
cpu MHz : 2528.933
cache size : 0 KB
fdiv_bug : no
hlt_bug : no
f00f_bug : no
coma_bug : no
fpu : yes
fpu_exception : yes
cpuid level : 5
wp : yes
flags : fpu vme de pse tsc msr mce cx8 apic sep mtrr pge mca cmov pat pse36
clflush mmx fxsr sse sse2 constant_tsc up pni monitor
bogomips : 6130.80
clflush size : 64
power management:
```

Para ver los dispositivos PCI conectados:

```
testing:/home/leandro# lspci
00:00.0 Host bridge: Intel Corporation 440FX - 82441FX PMC [Natoma] (rev 02)
00:01.0 ISA bridge: Intel Corporation 82371SB PIIX3 ISA [Natoma/Triton II]
00:01.1 IDE interface: Intel Corporation 82371AB/EB/MB PIIX4 IDE (rev 01)
00:02.0 VGA compatible controller: InnoTek Systemberatung GmbH VirtualBox Graphics Adapter
00:03.0 Ethernet controller: Advanced Micro Devices [AMD] 79c970 [PCnet32 LANCE] (rev 40)
00:04.0 System peripheral: InnoTek Systemberatung GmbH VirtualBox Guest Service
00:05.0 Multimedia audio controller: Intel Corporation 82801AA AC'97 Audio Controller (rev 01)
00:06.0 USB Controller: Apple Computer Inc. KeyLargo/Intrepid USB
00:07.0 Bridge: Intel Corporation 82371AB/EB/MB PIIX4 ACPI (rev 08)
00:0b.0 USB Controller: Intel Corporation 82801FB/FBM/FR/FW/FRW (ICH6 Family) USB2 EHCI Controller
```
