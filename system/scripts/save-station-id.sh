#!/bin/bash
# get station-id from chip or read from disk
/usr/local/bin/node /lib/ctt/sensor-station-software/src/id-driver/station-revision.js
typeset -i version=$(cat /etc/ctt/station-revision)
RADIO_MAP=/etc/ctt/radio-map.json
if test -f $RADIO_MAP; then
	rm $RADIO_MAP
fi
if test $version -ge 3; then
	echo 'linking v3 radio map'
	ln -s /etc/ctt/radios/v3-radio-map.js $RADIO_MAP
else
	echo 'lniking v2 radio map'
	ln -s /etc/ctt/radios/v2-radio-map.js $RADIO_MAP
fi
