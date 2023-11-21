#!/bin/bash
# If this script gives "-bash: ./startup.sh: /bin/bash^M: bad interpreter: No such file or directory", run dos2unix startup.sh
sudo apt update
sudo apt install -y python3-pip
sudo apt install python3-virtualenv
virtualenv venv
source venv/bin/activate
sudo apt-get install libtiff5-dev libjpeg8-dev libopenjp2-7-dev zlib1g-dev \
    libfreetype6-dev liblcms2-dev libwebp-dev tcl8.6-dev tk8.6-dev python3-tk \
    libharfbuzz-dev libfribidi-dev libxcb1-dev
pip3 install -r requirements.txt

rm backend/*/migrations/0*.py
rm backend/db.sqlite3
python3 backend/manage.py makemigrations
python3 backend/manage.py migrate
python3 backend/script.py
