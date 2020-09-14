# todo pep8
# todo logging
#

import pandas as pd
from fastapi import FastAPI, Body, File, UploadFile
from classify import train_predict_svm_io
import json
import time

app = FastAPI(title='FastDeal', version='1.0',
              description='analytics api')


@app.get("/")
def main():
    return "main"


@app.post("/prediction_probs/{y}")
def prediction_probs(y: str,
                     train_csv: UploadFile = File(...),
                     predict_csv: UploadFile = File(...)):
    pred_dict = train_predict_svm_io(train_csv.file, predict_csv.file, y, train_size=0.9, ir_col="email",
                                     trash_col="Unnamed",
                                     prob_col="prob_yes")
    return {
        "response": pred_dict
    }
