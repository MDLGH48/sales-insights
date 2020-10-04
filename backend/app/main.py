# todo logging
# todo makeFaster (caching?)
import uvicorn
import json
from typing import Optional, List
import pandas as pd
from fastapi import FastAPI, Body, File, UploadFile, Request
from classify import Classifier, train_predict_svm_io
from classify.test import create_random_df, train_predict_svm_test, correlationTest
from pydantic import BaseModel

app = FastAPI(title='FastDeal', version='1.0',
              description='analytics api')


class TestRandomPred(BaseModel):
    train: int
    pred: int
    metrics: List[str]
    target: str
    trash: Optional[str] = None


class TestRandomCorr(BaseModel):
    input_size: int
    metrics: List[str]
    target: str


@app.get("/dtapi/")
def main():
    return {"message": "dealtale api"}


@app.post("/dtapi/test/prediction")
def test(testObj: TestRandomPred):
    print(dict(testObj))
    return train_predict_svm_test(**dict(testObj))


@app.post("/dtapi/test/correlation")
def test_corr(testObj: TestRandomCorr):
    print(dict(testObj))
    return {"response": correlationTest(**dict(testObj))}


@app.post("/dtapi/prediction")
def prediction(target: str,
               train_csv: UploadFile = File(...),
               predict_csv: UploadFile = File(...)):
    pred_dict = train_predict_svm_io(train_csv.file, predict_csv.file, target,
                                     train_size=0.9, ir_col="email", trash_col="Unnamed", prob_col="prob_yes")
    return {
        "response": pred_dict
    }


@app.post("/dtapi/corr")
def corr(metric: str,
         input_csv: UploadFile = File(...)):
    df = pd.read_csv(input_csv.file)
    columns = list(df.columns)
    if metric not in columns:
        return {"response": "target error", "hint": columns}
    else:
        classifier_obj = Classifier(df=df,
                                    y=metric,
                                    ir_col="email",
                                    test_size=None)

        return {
            "response": {
                "correlations": classifier_obj.get_corr(),
                "pred_power": classifier_obj.get_predictors()}
        }


if __name__ == "__main__":
    uvicorn.run("main:app", port=8000, reload=True)
