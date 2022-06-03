#!/usr/bin/bash
typeset -i version=$(cat /etc/ctt/station-revision)
if test $version -ge 3
then
  /usr/local/bin/node /lib/ctt/sensor-station-software/src/id-driver/v3-driver.js
else
  /usr/local/bin/hashlet serial-num | cut -c5-16 
fi

