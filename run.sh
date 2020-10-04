#! /bin/sh
sh format_and_test.sh
python ./backend/app/main.py  & yarn --cwd ./frontend start