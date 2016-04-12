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

####Be sure to install latest stable Node js version.
    ```$ node --version```

####Execute instalation script specifying the desired Environment
    ```# install while setting a "development" environment
    $ ./install.sh development
    # In this case NODE_ENV will be set to "development"```

####How to Run application:

    # Set app configuration file located on config/app_config.json
    # The configuration file requires the settings and location of working
    # of keystone  and Ciao services.
