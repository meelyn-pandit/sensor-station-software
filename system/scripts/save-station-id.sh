#!/bin/bash
# get station-id from chip or read from disk
/usr/local/bin/node /lib/ctt/sensor-station-software/src/id-driver/station-revision.js
typeset -i version=$(cat /etc/ctt/station-revision)
RADIO_MAP=/etc/ctt/radio-map.json
if test -h $RADIO_MAP; then
	echo 'deleting current radio map'
	rm $RADIO_MAP
fi
if test $version -ge 3; then
	echo 'linking v3 radio map'
	ln -s /lib/ctt/sensor-station-software/system/radios/v3-radio-map.js $RADIO_MAP
else
	echo 'linking v2 radio map'
	ln -s /lib/ctt/sensor-station-software/system/radios/v2-radio-map.js $RADIO_MAP
fi
