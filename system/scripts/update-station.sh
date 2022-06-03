#!/bin/bash
home='/lib/ctt'
sudo mkdir -p $home
cd $home
git_url='https://github.com/cellular-tracking-technologies/sensor-station-software.git'

check_run() {
  echo "$changed_files" | grep --quiet "$1" && eval "$2"
}

sudo systemctl stop station-hardware-server
sudo systemctl stop station-lcd-interface
sudo systemctl stop station-radio-interface
sudo systemctl stop station-web-interface

dir="$home/sensor-station-software"
# check if the software directory exists
if [ -d $dir ]; then
  # directory exists - stash any changes and do a git pull
  cd $dir
  sudo git stash
  sudo git pull
  # checking if package.json has changed
  changed_files="$(git diff-tree -r --name-only --no-commit-id ORIG_HEAD HEAD)" 
  check_run package.json "npm update"
else
  cd $home
  echo "cloning sensor-station-software repo to $dir"
  sudo git clone $git_url
  cd $dir
  npm update
fi

sudo systemctl restart station-hardware-server
sudo systemctl restart station-lcd-interface
sudo systemctl restart station-radio-interface
sudo systemctl restart station-web-interface

sudo sh -c "date -u +'%Y-%m-%d %H:%M:%S' > /etc/ctt/station-software"

echo 'Sensor Station Update Complete'
echo