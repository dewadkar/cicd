#!/bin/bash

export PATH=$PATH:/home/dpeuser/dd/node/node-v4.2.2-linux-x64/bin/
npm install
nohup node app.js &
