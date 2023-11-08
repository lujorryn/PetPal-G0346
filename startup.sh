virtualenv venv
source venv/bin/activate
# Prerequisites for Pillow, can someone confirm that this actually works on Ubuntu 22.04?
sudo apt-get install libtiff5-dev libjpeg8-dev libopenjp2-7-dev zlib1g-dev \
    libfreetype6-dev liblcms2-dev libwebp-dev tcl8.6-dev tk8.6-dev python3-tk \
    libharfbuzz-dev libfribidi-dev libxcb1-dev
pip3 install -r requirements.txt

rm ./petpal/*/migrations/0*.py
rm ./petpal/db.sqlite3
./petpal/manage.py makemigrations
./petpal/manage.py migrate