import os


def pep8_this_app(directories):
    for directory in directories:
        for file in os.scandir(directory):
            if file.path[-3:] == '.py':
                os.system(
                    f'autopep8 --max-line-length=72 --in-place --aggressive --aggressive  {file.path}')
                pycode_stream = os.popen(
                    f'pycodestyle --show-source --show-pep8 --ignore E501 {file.path}')
                pycode_log = pycode_stream.read()
                print(pycode_log)


if __name__ == '__main__':
    directories = [".", 'classify/']
    pep8_this_app(directories)
