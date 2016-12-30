---
date: 2010-05-21 09:00:00 -3000
layout: post
title: Migrado a Lighttpd
authors: leandro
categories: servidores
tags: [apache, benchmarks, lighttpd, performance, web]
permalink: /2010/05/21/migrado-a-lighttpd/

---

Siempre trabajé con [Apache](http://httpd.apache.org/) y es el servidor web que
más conozco. No obstante, en esta oportunidad y debido a los repetidos problemas
de rendimiento que estaba experimentando en el servidor decidí migrar a
[Lighttpd](http://www.lighttpd.net/) y me llevé una muy grata sorpresa en cuanto
a la facilidad de configuración y la buena documentación existente en Internet.
<!-- more -->En sólo cuestión de 2 horas realicé la migración completa (no es
sólo NetStorming lo único que tengo hosteado en este servidor) sin tener ningún
conocimiento previo de Lighttpd.

Debajo dejo unos benchmark que realicé para probar el rendimiento. Lógicamente
son resultados aproximados pero sirven para dar una idea del funcionamiento.

El primer caso es con Apache, realizando un total de 1000 requerimientos con 20
requerimientos concurrentes.

```
scarlet:~ leandro$ ab -c 20 -n 1000 http://www.netstorming.com.ar/
This is ApacheBench, Version 2.3 <$Revision: 655654 $>
Copyright 1996 Adam Twiss, Zeus Technology Ltd, http://www.zeustech.net/
Licensed to The Apache Software Foundation, http://www.apache.org/

Benchmarking www.netstorming.com.ar (be patient)
Completed 100 requests
Completed 200 requests
Completed 300 requests
Completed 400 requests
Completed 500 requests
Completed 600 requests
Completed 700 requests
Completed 800 requests
Completed 900 requests
Completed 1000 requests
Finished 1000 requests

Server Software:        Apache/2.2.3
Server Hostname:        www.netstorming.com.ar
Server Port:            80

Document Path:          /
Document Length:        66636 bytes

Concurrency Level:      20
Time taken for tests:   130.533 seconds
Complete requests:      1000
Failed requests:        5
   (Connect: 0, Receive: 0, Length: 5, Exceptions: 0)
Write errors:           0
Total transferred:      66835655 bytes
HTML transferred:       66546077 bytes
Requests per second:    7.66 [#/sec] (mean)
Time per request:       2610.652 [ms] (mean)
Time per request:       130.533 [ms] (mean, across all concurrent requests)
Transfer rate:          500.02 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:       12  269 684.2     31    6355
Processing:   107 2145 4548.3    789   46182
Waiting:       14  442 2047.6     38   33040
Total:        120 2414 4734.8   1016   46251

Percentage of the requests served within a certain time (ms)
  50%   1016
  66%   1736
  75%   2334
  80%   3034
  90%   4816
  95%   9787
  98%  15225
  99%  23594
 100%  46251 (longest request)
```

En el segundo caso hice la prueba contra Lighttpd, en las mismas condiciones que
en la prueba anterior.

```
scarlet:~ leandro$ ab -c 20 -n 1000 http://www.netstorming.com.ar/
This is ApacheBench, Version 2.3 <$Revision: 655654 $>
Copyright 1996 Adam Twiss, Zeus Technology Ltd, http://www.zeustech.net/
Licensed to The Apache Software Foundation, http://www.apache.org/

Benchmarking www.netstorming.com.ar (be patient)
Completed 100 requests
Completed 200 requests
Completed 300 requests
Completed 400 requests
Completed 500 requests
Completed 600 requests
Completed 700 requests
Completed 800 requests
Completed 900 requests
Completed 1000 requests
Finished 1000 requests

Server Software:        lighttpd/1.4.22
Server Hostname:        www.netstorming.com.ar
Server Port:            80

Document Path:          /
Document Length:        66636 bytes

Concurrency Level:      20
Time taken for tests:   44.020 seconds
Complete requests:      1000
Failed requests:        0
Write errors:           0
Total transferred:      66944310 bytes
HTML transferred:       66638613 bytes
Requests per second:    22.72 [#/sec] (mean)
Time per request:       880.390 [ms] (mean)
Time per request:       44.020 [ms] (mean, across all concurrent requests)
Transfer rate:          1485.14 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:       11   98 234.6     53    4021
Processing:    99  753 1052.0    452   10156
Waiting:       14  150 426.5     61    3222
Total:        125  851 1087.1    518   11139

Percentage of the requests served within a certain time (ms)
  50%    518
  66%    685
  75%    833
  80%   1014
  90%   1481
  95%   3488
  98%   4159
  99%   4679
 100%  11139 (longest request)
```

En el tercer caso hice la prueba contra el mismo Lighttpd pero aumenté de 20 a
30 la cantidad de requerimientos concurrentes.

```
scarlet:~ leandro$ ab -c 30 -n 1000 http://www.netstorming.com.ar/
This is ApacheBench, Version 2.3 <$Revision: 655654 $>
Copyright 1996 Adam Twiss, Zeus Technology Ltd, http://www.zeustech.net/
Licensed to The Apache Software Foundation, http://www.apache.org/

Benchmarking www.netstorming.com.ar (be patient)
Completed 100 requests
Completed 200 requests
Completed 300 requests
Completed 400 requests
Completed 500 requests
Completed 600 requests
Completed 700 requests
Completed 800 requests
Completed 900 requests
Completed 1000 requests
Finished 1000 requests

Server Software:        lighttpd/1.4.22
Server Hostname:        www.netstorming.com.ar
Server Port:            80

Document Path:          /
Document Length:        66636 bytes

Concurrency Level:      30
Time taken for tests:   44.389 seconds
Complete requests:      1000
Failed requests:        0
Write errors:           0
Total transferred:      67034669 bytes
HTML transferred:       66727905 bytes
Requests per second:    22.53 [#/sec] (mean)
Time per request:       1331.679 [ms] (mean)
Time per request:       44.389 [ms] (mean, across all concurrent requests)
Transfer rate:          1474.76 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:       11  125 331.9     51    4048
Processing:   114 1078 2221.6    445   33317
Waiting:       14  225 767.8     57    9178
Total:        135 1203 2255.5    535   33372

Percentage of the requests served within a certain time (ms)
  50%    535
  66%    795
  75%   1223
  80%   1452
  90%   2829
  95%   4159
  98%   5553
  99%  10425
 100%  33372 (longest request)
```

Se puede ver que Lighttpd responde mucho más rápido que Apache incluso con 30
requerimientos concurrentes. Eso sin realizar ningún tipo de tunning en
lighttpd, con la instalación por defecto. Veré en los próximos días si el
consumo de memoria del servidor es menor y si deja de quedarse fuera de
servicio. Por lo pronto estoy conforme con los resultados obtenidos.
