import random
import string
import pandas as pd
import numpy as np
from . import svm_predict_test, combine_good_cols


def random_char(y):
    return ''.join(random.choice(string.ascii_letters) for x in range(y))


def create_random_df(size, Xcols, ycol):
    df_size = size
    fake_df = pd.DataFrame({})
    print(Xcols)
    for col in Xcols:
        fake_df[col] = list(np.random.choice([1, 0], df_size, p=[3/7, 4/7]))
    fake_df[ycol] = list(np.random.choice([1, 0], df_size, p=[3/7, 4/7]))
    return fake_df


def create_fake_data(train_size, predict_size, Xcols, y):
    return {"train_df": create_random_df(train_size, Xcols, y),
            "predict_df": create_random_df(predict_size, Xcols, y)}


def train_predict_svm_test(train, pred, metrics, target, **kwargs):

    train_pred_set = create_fake_data(train, pred, metrics, target)
    train_df = train_pred_set["train_df"]
    predict_df = train_pred_set["predict_df"]
    train_frac = train_df.sample(frac=0.7, random_state=1)
    test_frac = train_df.sample(frac=0.3, random_state=1)

    svm_obj = svm_predict_test(
        train_frac[metrics], train_frac[target], test_frac[metrics], test_frac[target])
    svm_model = svm_obj["svm_model"]
    svm_model_accuracy = svm_obj["accuracy"]
    prediction_probabilities = svm_model.predict_proba(predict_df[metrics])
    predict_df[[f"prob_yes_{target}"]] = [prob[1]
                                          for prob in prediction_probabilities]
    predict_df[[f"prob_no_{target}"]] = [prob[0]
                                         for prob in prediction_probabilities]
    predict_df["action_group"] = predict_df.apply(
        lambda x: combine_good_cols(x[predict_df[metrics].columns]), axis=1)
    prob_df = predict_df.groupby("action_group").mean().sort_values(by=f"prob_yes_{target}", ascending=False)[
        [f"prob_yes_{target}",
         f"prob_no_{target}"]]
    model_output = {"model_accuracy": svm_model_accuracy,
                    "results": prob_df.reset_index(level="action_group").to_dict(orient="records")}

    return model_output
