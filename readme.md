# Dealtale Analytics app/API

## Built with

#### Back End:

- FastApi <https://fastapi.tiangolo.com/>
- pandas <https://pandas.pydata.org/>
- scikitlearn <https://scikit-learn.org/stable/>
- SciPy <https://docs.scipy.org/doc/scipy/reference/>

#### Front End:

- React JS (Create react app <https://reactjs.org/docs/create-a-new-react-app.html#create-react-app>) <https://reactjs.org/>
- Material UI <https://material-ui.com/>
- Nivo Charting lib <https://nivo.rocks/>

# description

## NEW:

- play with classification and correlation models via React front end
- live and deployed on http://fatdealv1.francecentral.azurecontainer.io

### 1. **_measure the correlation/importance of relationship between each `metric X` and `target Y ` for one-hot encoded dataset (0,1)_** using

- **Decision Tree classifier feature importance** score `importance` AKA gini importance
- **Phi coefficient** aka Matthews correlation coefficient `phi_correlation`
- **Point biserial** correlation `biserial_correlation`
- **P-value** `p_value` (aka statistical importance)
- **Predictive power score** `pred_power` (similar to gini importance measure)

### 2. **_train on dataset and get prediction probablities on unseen one-hot encoded dataset with support vector machine (also ready to integrate KNN)_**

## Installation

- Python == `python 3.7`

  _from root of proj dir_

- install virtual env
  `$ virtualenv env`
- activate virtual env
  `$ source env/bin/activate`
- install packages in virtual env
  `$ pip install -r app/requirements.txt`

#### install ui dependencies

##### - make sure to install node modules inside `ui` directory

`yarn --cwd ./ui . `

### for local running:

- to double check style and all routes before running locally (good for pre deployment \*_just need to add jest_ ) `$ python run_local.py`
- `$ sh run.sh`

## Run Tests and aggressively Auto Format Pep8

(ignores E501 line length reports but tries to adhere to shortening lines as much as possible)

- `$ sh format_and_test.sh`

## Docker

### UPDATE : working on docker compose to integrate React frontend to fastapi backend

- Build image from Dockerfile
  - `docker build -t <image_name> .`
- Run container in detatched mode ... bind port to `localhost:8000`
  - `docker run -d -p 8000:80 <image_name>:<tag>`
- or
  - `docker run -d -p 80:80 <image_name>:<tag>`

## Auto-Documentation to view api endpoints and params

once server started go to `/redoc` for redoc documentation or `/docs` for interactive swagger ui documentation
