# System Design Capstone Project
**Questions & Answers Service | Project Atelier**

**Overview**
*Hack Reactor Cohort - RPP29*

* Questions & Answers Module - Louis La

This Hack Reactor backend project involved building a RESTFUL API with a scalable backend architecture to support a front-end client. The goal was to deploy and scale a service to support (a minimum of) 100 requests per second to 10,000 requests per second on EC2 using a t2.micro instance.

* Scaled the backend to support up to 10k requests per second using NGINX Load Balancer
* Designed and built an API server that provided data to the client
* Optimized service by analyzing query times and server responses
* Deployed the service and successfully integrated it with the legacy code of the Front-end capstone application

*Tools used*

* POSTMAN
* AWS EC2
* Express
* NGINX
* K6
* MySQL
* loader io
---

**Description**

*Relational Database*

The service uses a MySQL DBMS with 2+ million of entries. For the ETL process, SCP copy was used to load the csv data into the database.
* Indexed tables in database and to improve query times from 4 seconds to 5 - 7 miliseconds

*RESTFUL API*

* Defined routes according to the expected data by the client application
* Used POSTMAN to test routes and query times

*Local Stress Testing*

* Used K6 to stress test locally
* Monitored and recorded response times and latency reported by New Relic
* Tested the ability to reach 1k response per second (RPS) locally

*Deployment*

* Deployed database and server/service into EC2 t2.micro instances
* Stress tested using loader.io and was able to reach upwards to 1k RPS with latency below 2000 ms

*Scaling the application*

* Deployed additional instance to incorporate NGINX for load balancing
* Deployed 2 additional instances for servers to use with the round robin load balancing in NGINX (total 3 servers)
* Achieved 10,000 RPS with average latency below 2000 ms

---

[Link to System Design Progress Journal](https://louis-systemdesign.blogspot.com/)