import os
import re


def make_solid_run():
    f_test = os.popen('sh format_and_test.sh').read().split("\n")
    test_stream = " ".join(f_test[([i for i, item in enumerate(
        f_test) if re.search('test session starts', item)][0] + 1):])
    if "fail" not in test_stream and "format issues" not in test_stream:
        print("passed style and testing \n starting app \n ----->\n\n")
        os.system("python ./backend/app/main.py  & yarn --cwd ./ui start")
    else:
        print("\n".join(f_test))


if __name__ == "__main__":
    make_solid_run()
