# Sales Insights Analytics app/API


### deployment

- from root `$ docker-compose up --build -d`
- `docker-compose push`(yml already pushes images to registry)
- azure container registry - foobar.azurecr.io
- backend docker image `foobarbe`
- frontend docker image `foobarfe`

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
- #### Frontend serving with ngnix

# description

## NEW:

- play with classification and correlation models via React front end
- live and deployed 

### 1. **_measure the correlation/importance of relationship between each `metric X` and `target Y ` for one-hot encoded dataset (0,1)_** using

- **Decision Tree classifier feature importance** score `importance` AKA gini importance
- **Phi coefficient** aka Matthews correlation coefficient `phi_correlation`
- **Point biserial** correlation `biserial_correlation`
- **P-value** `p_value` (aka statistical importance)
- **Predictive power score** `pred_power` (similar to gini importance measure)

### 2. **_train on dataset and get prediction probablities on unseen one-hot encoded dataset with support vector machine (also ready to integrate KNN)_**

## Installation

#

#### install ui dependencies

## Frontend

##### - make sure to install node modules inside `frontend` directory

`yarn --cwd ./frontend `

#

## Backend

- Python == `python 3.7`

  _from root of proj dir_

- install virtual env
  `$ virtualenv env`
- activate virtual env
  `$ source env/bin/activate`
- install packages in virtual env
  `$ pip install -r app/requirements.txt`

### for local running:

- to double check style and all routes before running locally (good for pre deployment \*_just need to add jest_ )
- `$ python run_local.py`

## Run Tests and aggressively Auto Format Pep8

(ignores E501 line length reports but tries to adhere to shortening lines as much as possible)

- `$ sh format_and_test.sh`

## Auto-Documentation to view api endpoints and params

once server started go to `/redoc` for redoc documentation or `/docs` for interactive swagger ui documentation

#

## Docker

- frontend binds to port 1337 (ngnix) --see `frontend/nginx/nginx.conf` & `frontend/Dockerfile`
- backend binds to port 8000

##

from root -- dev environment

- `$ docker-compose -f docker-compose.dev.yml build`
- `$ docker-compose -f docker-compose.dev.yml up` | `docker-compose -f docker-compose.dev.yml up --remove-orphans`
