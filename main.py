# todo logging
# todo makeFaster (caching?)

import pandas as pd
from fastapi import FastAPI, Body, File, UploadFile, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from classify import Classifier, train_predict_svm_io

app = FastAPI(title='FastDeal', version='1.0',
              description='analytics api')

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")


@app.get("/", response_class=HTMLResponse)
def main(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


@app.post("/prediction")
def prediction(target: str,
               train_csv: UploadFile = File(...),
               predict_csv: UploadFile = File(...)):
    pred_dict = train_predict_svm_io(train_csv.file, predict_csv.file, target, train_size=0.9, ir_col="email",
                                     trash_col="Unnamed",
                                     prob_col="prob_yes")
    return {
        "response": pred_dict
    }


@app.post("/corr")
def corr(metric: str,
         input_csv: UploadFile = File(...)):
    classifier_obj = Classifier(df=pd.read_csv(input_csv.file),
                                y=metric,
                                ir_col="email",
                                test_size=None)
    return {
        "response": {
            "correlations": classifier_obj.get_corr(),
            "pred_power": classifier_obj.get_predictors()}
    }
