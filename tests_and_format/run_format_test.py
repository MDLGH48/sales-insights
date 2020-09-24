import os


def pep8_this_app(directories):
    for directory in directories:
        for file in os.scandir(directory):
            if file.path[-3:] == '.py':
                pycode_stream = os.popen(
                    f'pycodestyle --show-source --show-pep8 {file.path}')
                pycode_log = pycode_stream.read()
                reports = pycode_log.split("Reports error")
                print(file.path, " errors = ", len(reports) - 1)
                for report in reports:
                    if "E501" in report:
                        print("line length error\n")
                    elif len(reports) - 1 > 0 and "E501" not in report:
                        print(report)
                print(
                    "in order to be accepted to the pep8 cult... agressively auto pepping anyways")
                os.system(
                    f'autopep8 --in-place --aggressive --aggressive {file.path}')


if __name__ == '__main__':
    directories = ["./", 'classify/']
    pep8_this_app(directories)
