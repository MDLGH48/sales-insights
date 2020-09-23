# Dealtale api

## description

### 1. **_measure the correlation/importance of relationship between each `metric X` and `target Y ` for one-hot encoded dataset (0,1)_** using

- **Decision Tree classifier feature importance** score `importance` AKA gini importance
- **Phi coefficient** aka Matthews correlation coefficient `phi_correlation`
- **Point biserial** correlation `biserial_correlation`
- **P-value** `p_value` (aka statistical importance)
- **Predictive power score** `pred_power` (similar to gini importance measure)

### 2. **_train on dataset and get prediction probablities on unseen one-hot encoded dataset with support vector machine (also ready to integrate KNN)_**

## Installation

- Python == `python 3.7`

### from root of proj dir

- install virtual env
  - `$ virtualenv myenv`
- activate virtual env
  - `$ source myenv/bin/activate`
- install packages in virtual env
  - `$ pip install -r requirements.txt`
- for local running:
  - from root of project dir `$ sh run.sh`

## Docker

- Build image from Dockerfile
  - `docker build -t <image_name> .`
- Run container in detatched mode ... bind port to `localhost:8000`
  - `docker run -d -p 8000:80 <image_name>:<tag>`
- or
  - `docker run -d -p 80:80 <image_name>:<tag>`

## Auto-Documentation to view api endpoints and params

once server started go to `/redoc` for redoc documentation or `/docs` for interactive swagger ui documentation
