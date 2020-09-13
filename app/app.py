import pandas as pd
from fastapi import FastAPI, Body, File, UploadFile
from classify import Classifier
import time


app = FastAPI(title='FastDeal', version='1.0',
              description='analytics api')


@app.get("/")
async def main():
    return "main"


@app.post("/prediction/{y}")
def main(y: str, data: UploadFile = File(...), pred_data: UploadFile = File(...)):
    seconds_csv1_start = time.time()
    clsf = Classifier(df=pd.read_csv(data.file), y=y,
                      ir_col="email", test_size=0.5)
    seconds_csv1_end = time.time()
    clsf_predict = Classifier(df=pd.read_csv(pred_data.file), y=y,
                      ir_col="email", test_size=0.5)
    seconds_csv2_end = time.time()
    print(f'done with csvs \ntime : {seconds_csv1_end-seconds_csv1_start} sec train csv \n {seconds_csv2_end - seconds_csv1_end} sec predict csv \n')
    seconds_train_start = time.time()
    svm = clsf.svm_predict()
    seconds_train_end = time.time()
    print(f'done training \n time: {seconds_train_end- seconds_train_start} secs \n')
    seconds_predict_start = time.time()
    prediction = svm["svm_model"].predict(clsf_predict.get_inputs()["X"])
    seconds_predict_end = time.time()
    print(f'done with prediction \n time: {seconds_predict_end - seconds_predict_start} secs \n')
    return {
        "response": pd.Series(prediction).to_json(orient='records')
    }
