import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn import metrics
from sklearn.neighbors import KNeighborsClassifier
from sklearn import svm


class Classifier:
    def __init__(self, df, y, ir_col, test_size):
        self.df = df
        # self.x = x
        self.y = y
        self.ir_col = ir_col
        self.test_size = test_size

    def get_inputs(self):
        df = self.df
        y = self.y
        ir_col = self.ir_col
        X = df[[col for col in df.columns if col not in [y, ir_col]]]
        y = df[y].values
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=self.test_size)
        # print ('Train set:', X_train.shape,  y_train.shape)
        # print ('Test set:', X_test.shape,  y_test.shape)
        return {"X_train": X_train,
                "X_test": X_test,
                "y_train": y_train,
                "y_test": y_test,
                "X": X}

    def knn_best(self, Ks):
        test_train = self.get_inputs()
        X_train = test_train["X_train"]
        y_train = test_train["y_train"]
        X_test = test_train["X_test"]
        y_test = test_train["y_test"]
        mean_acc = np.zeros((Ks - 1))
        std_acc = np.zeros((Ks - 1))
        for n in range(1, Ks):
            # Train Model and Predict
            neigh = KNeighborsClassifier(n_neighbors=n).fit(X_train, y_train)
            yhat = neigh.predict(X_test)
            mean_acc[n - 1] = metrics.accuracy_score(y_test, yhat)
            std_acc[n - 1] = np.std(yhat == y_test) / np.sqrt(yhat.shape[0])
        kn = mean_acc.argmax() + 1
        knn = KNeighborsClassifier(n_neighbors=kn).fit(X_train, y_train)
        yhat = knn.predict(X_test)
        print(
            f"The best accuracy was with {mean_acc.max()} -->model: {kn} neighbors")
        return {"knn_model": knn, "knn_yhat": yhat}

    def svm_predict(self, kernel="rbf", gamma=4, probability=True, **kwargs):
        test_train = self.get_inputs()
        X_train = test_train["X_train"]
        y_train = test_train["y_train"]
        X_test = test_train["X_test"]
        y_test = test_train["y_test"]
        svm_model = svm.SVC(kernel='rbf', gamma=4, probability=True, **kwargs)

        svm_model.fit(X_train, y_train)
        yhat = svm_model.predict(X_test)
        return {"svm_model": svm_model, "svm_yhat": yhat}


def combine_good_cols(row):
    good_cols = []
    for k, v in row.items():
        if v == 1:
            good_cols.append(k)
    return " | ".join(good_cols)


def train_predict_svm_io(train_csv, predict_csv, y, train_size=0.9, ir_col="email", trash_col="Unnamed", **kwargs):
    test_size = 1 - train_size
    train_csv, predict_csv = pd.read_csv(train_csv), pd.read_csv(predict_csv)
    clean_cols_train = [col for col in train_csv.columns if trash_col not in col]
    train_df = train_csv[clean_cols_train]
    predict_input = Classifier(predict_csv[train_df.columns], y, ir_col, test_size=None).get_inputs()["X"]
    train_obj = Classifier(train_df, y, ir_col, test_size)
    svm_model = train_obj.svm_predict()["svm_model"]
    if kwargs.get("mode") == "predict":
        pred = svm_model.predict(predict_input)
        predict_input[[f"predicted_{y}"]] = pred
        return predict_input.to_dict(orient="records")
    else:
        pred = svm_model.predict_proba(predict_input)
        predict_input[[f"prob_yes_{y}"]], predict_input[[f"prob_no_{y}"]] = [prob[1] for prob in pred], [prob[0] for
                                                                                                         prob in pred]
        predict_input["action_group"] = predict_input.apply(
            lambda x: combine_good_cols(x[train_obj.get_inputs()["X"].columns]), axis=1)
        prob_col = f'{kwargs.get("prob_col")}_{y}'
        prob_df = predict_input.groupby("action_group").mean().sort_values(by=prob_col, ascending=False)[[prob_col]]
        return prob_df.reset_index(level="action_group").to_dict(orient="records")
