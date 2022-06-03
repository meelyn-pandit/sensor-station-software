#!/bin/bash
if [ -z "$1" ]; then
  # no input argument - use default fw
  fw_file="/etc/ctt/fw/default"
else
  fw_file=$1
fi

program-radio 1 $fw_file
program-radio 2 $fw_file
program-radio 3 $fw_file
program-radio 4 $fw_file
program-radio 5 $fw_file