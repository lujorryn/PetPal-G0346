#!/bin/bash
source venv/bin/activate
python3 petpal/manage.py loaddata petpal/initial_data.json
python3 petpal/manage.py runserver
