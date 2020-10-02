#! /bin/sh
sh format_and_test.sh
python ./app/app/main.py  & yarn --cwd ./ui start