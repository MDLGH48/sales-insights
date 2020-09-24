import os
import main
from fastapi.testclient import TestClient
from classify.test import create_random_df
client = TestClient(main.app)


def test_index():
    response = client.get("/")
    assert response.status_code == 200


def test_front_end_dash():
    test_payload = {
        "train": 1000,
        "pred": 100,
        "metrics": ["a", "b"],
        "target": "c"}
    response = client.post('/test/prediction', json=test_payload)
    assert response.status_code == 200


def test_prediction_io():
    create_random_df(5, ["x1", "x2"], "y").to_csv(
        'tests_and_format/pytest_data/test_t.csv', index=False)
    create_random_df(5, ["x1", "x2"], "y").to_csv(
        'tests_and_format/pytest_data/test_p.csv', index=False)
    test_t = open('tests_and_format/pytest_data/test_t.csv', 'rb')
    test_p = open('tests_and_format/pytest_data/test_p.csv', 'rb')
    response = client.post(
        "/prediction?target=y",
        files={
            "train_csv": (
                "filename",
                test_t,
                "csv"),
            "predict_csv": (
                "filename",
                test_p,
                "csv")})
    # os.remove('tests_and_format/pytest_data/test_t.csv')
    # os.remove('tests_and_format/pytest_data/test_p.csv')
    assert response.status_code == 200


def test_corr_io():
    create_random_df(5, ["x1", "x2"], "y").to_csv(
        'tests_and_format/pytest_data/test_input.csv', index=False)
    response = client.post(
        "/corr?metric=y",
        files={
            "input_csv": (
                "filename",
                open(
                    'tests_and_format/pytest_data/test_input.csv',
                    'rb'),
                "csv")})
    # os.remove('tests_and_format/pytest_data/test_input.csv')
    assert response.status_code == 200
