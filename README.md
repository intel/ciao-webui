# Ciao WebUI

Ciao Web UI is the user interface for [Ciao](https://github.com/01org/ciao)
built using the [express](http://expressjs.com/) web framework on top of
[Node.js](https://nodejs.org/en/), a lightweight JavaScript runtime.
It allows user's to take advantage of a simple and friendly design to
easily manage a running Ciao cluster.

## Requirements:

Running Ciao Web UI requires Node.js v5.9.0 or greater.
Third party sofware packages can be found in the package.json file.


## Setup Instructions

#### Install latest stable Node js version.

    $ node --version
    
#### Fill required information on the ciao_config.json file

The ciao_config.json file is a file in JSON format which contains the
information of the ciao-controller and keystone servers the Web UI is 
going to connect to.
The root of the ciao_config.json is the "environment", and should match
the NODE_ENV environment variable. Then the parameters **controller**, 
**keystone** and **ui** will follow.

######controller

Refers to the ciao-controller that the Web UI will connect to, it has the following parameters:
1. host - may be the hostname or ip address of ciao-controller (Ex. 127.0.0.1)
2. port - port in which the ciao-controller services are reachable.
3. protocol - lowercase protocol used by ciao-controller (currently only https is supported).

######keystone
1. host - may be the hostname or ip address of ciao-controller (Ex. 127.0.0.1)
2. port - port in which keystone's services are reachable.
3. protocol - lowercase protocol that keystone uses to provide it's services (http and https are supported).
4. uri - The uri in which keystone will provide tokens. (this should be "/v3/auth/tokens").

######ui
The following fields will determine how the Ciao Web UI will beconfigured.

    Note: if https protocol is set on ui options, Web UI will require a signed ssl certificate
    with a passphrase.
    A self-signed certificate may be generated using the following command:
    
    openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365
    
    

1. protocol - the protocol that the Web UI will use to run, this can be http or https. 
   If the protocol used is http, then certificates field isn't required.
2. certificates - this is field is required for https protocol, pem key and certificate files will also be required.
  * key - this field holds the absolute path to a valid key.pem file.
  * cert - this field holds the absolute path to a valid cert.pem file (must match key.pem).
  * passphrase - the passphrase assign to key.pem file.
  * trusted - array of trusted certificates. Each element in the array must contain the absolute path of a trusted cert.pem file.

#### Execute instalation script specifying the desired Environment

    # install while setting a "development" environment
    $ ./install.sh development
    # In this case NODE_ENV will be set to "development"

#### Run application:

Configuration file located on config/ciao_config.json must have proper configuration.
Executing the install.sh script will start the application.
To skip full installation and just run the application use:

    $ npm start
    
App will then run on protocol://localhost:3000
To serve the UI on an alternativa port set the PORT environment variable with the value of the desired port.
Ex.

    $ export PORT=80
    $ npm start
