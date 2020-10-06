import os
import main
from fastapi.testclient import TestClient
from classify.test import create_random_df
import http.client
client = TestClient(main.app)


res = conn.getresponse()
data = res.read()

print(data.decode("utf-8"))


def test_index():
    response = client.get("/api/")
    assert response.status_code == 200, f'response error ={response.json()["detail"]}'


def test_front_end_dash_predict():
    test_payload = {
        "train": 1000,
        "pred": 100,
        "metrics": ["a", "b"],
        "target": "c"}
    response = client.post('/api/test/prediction', json=test_payload)
    assert response.status_code == 200, f'response error ={response.json()["detail"]}'


def test_front_end_dash_corr():
    test_payload = {"input_size": 1000, "metrics": ["a", "b"], "target": "c"}
    response = client.post('/api/test/correlation', json=test_payload)
    assert response.status_code == 200, f'response error ={response.json()["detail"]}'


def test_prediction_io():
    create_random_df(10, ["x1", "x2"], "y").to_csv(
        'backend/app/tests_and_format/pytest_data/test_t.csv', index=False)
    create_random_df(10, ["x1", "x2"], "y").to_csv(
        'backend/app/tests_and_format/pytest_data/test_p.csv', index=False)
    test_t = open('app/app/tests_and_format/pytest_data/test_t.csv', 'rb')
    test_p = open('app/app/tests_and_format/pytest_data/test_p.csv', 'rb')
    response = client.post(
        "/api/prediction?target=y",
        files={
            "train_csv": (
                "filename",
                test_t,
                "csv"),
            "predict_csv": (
                "filename",
                test_p,
                "csv")})
    assert response.status_code == 200, f'response error ={response.json()["detail"]}'


def test_corr_io():
    create_random_df(10, ["x1", "x2"], "y").to_csv(
        'backend/app/tests_and_format/pytest_data/test_input.csv', index=False)
    response = client.post(
        "/api/corr?metric=y",
        files={
            "input_csv": (
                "filename",
                open(
                    'app/app/tests_and_format/pytest_data/test_input.csv',
                    'rb'),
                "csv")})
    assert response.status_code == 200, f'response error ={response.json()["detail"]}'
