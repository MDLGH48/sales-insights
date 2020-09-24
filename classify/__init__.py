import numpy as np
import pandas as pd
from scipy import stats
from sklearn.model_selection import train_test_split
from sklearn import metrics
from sklearn.neighbors import KNeighborsClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn import svm
import ppscore as pps


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
        return {"X_train": X_train,
                "X_test": X_test,
                "y_train": y_train,
                "y_test": y_test,
                "X": X,
                "y": y}

    def get_predictors(self):
        df = self.df
        return pps.predictors(
            df[[col for col in df.columns if col != self.ir_col]],
            self.y)[['x', 'y', 'ppscore']].to_dict(orient="records")

    def get_corr(self):
        full_df_obj = self.get_inputs()
        X = full_df_obj["X"]
        y = full_df_obj["y"]
        y_col = self.y
        tree_info = list(DecisionTreeClassifier().fit(
            X, y).feature_importances_)
        ptb_corr_list = []
        phi_list = []
        p_list = []
        Xcols = []
        for col in X.columns:
            pbs = stats.pointbiserialr(list(X[col].values), list(y))
            phi = metrics.matthews_corrcoef(list(X[col].values), list(y))
            ptb_corr_list.append(pbs.correlation)
            phi_list.append(phi)
            p_list.append(pbs.pvalue)
            Xcols.append(col)
        return pd.DataFrame(
            {
                "metric": Xcols,
                "importance": tree_info,
                "phi_correlation": phi_list,
                "biserial_correlation": ptb_corr_list,
                "p_value": p_list,
                "target": [y_col] *
                len(Xcols)}).sort_values(
            by="phi_correlation",
            ascending=False).to_dict(
                orient="records")

    def knn_best(self, ks):
        test_train = self.get_inputs()
        X_train = test_train["X_train"]
        y_train = test_train["y_train"]
        X_test = test_train["X_test"]
        y_test = test_train["y_test"]
        mean_acc = np.zeros((ks - 1))
        std_acc = np.zeros((ks - 1))
        for n in range(1, ks):
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
        svm_model = svm.SVC(kernel=kernel, gamma=gamma,
                            probability=probability, **kwargs)
        svm_model.fit(X_train, y_train)
        yhat = svm_model.predict(X_test)
        return {
            "svm_model": svm_model,
            "svm_yhat": yhat,
            "accuracy": metrics.accuracy_score(
                y_test,
                yhat)}


def combine_good_cols(row):
    good_cols = []
    for k, v in row.items():
        if v == 1:
            good_cols.append(k)
    return str(good_cols)


def train_predict_svm_io(
        train_csv,
        predict_csv,
        y,
        train_size=0.9,
        ir_col="email",
        trash_col="Unnamed",
        **kwargs):
    train_csv = pd.read_csv(train_csv)
    predict_csv = pd.read_csv(predict_csv)
    test_size = 1 - train_size
    clean_cols_train = [
        col for col in train_csv.columns if trash_col not in col]
    train_df = train_csv[clean_cols_train]
    # saving input_x Obj for later in case we need it for decision function
    input_x = Classifier(
        predict_csv[train_df.columns], y, ir_col, test_size=None).get_inputs()["X"]
    # this will be response df turned into dictionary
    predict_input_df = input_x
    train_obj = Classifier(train_df, y, ir_col, test_size)
    svm_obj = train_obj.svm_predict()
    svm_model = svm_obj["svm_model"]
    svm_model_accuracy = svm_obj["accuracy"]
    if kwargs.get("mode") == "predict":
        input_prediction = svm_model.predict(predict_input_df)
        predict_input_df[[f"predicted_{y}"]] = input_prediction
        return predict_input_df.to_dict(orient="records")
    else:
        input_prediction = svm_model.predict_proba(predict_input_df)
        predict_input_df[[f"prob_yes_{y}"]], predict_input_df[[f"prob_no_{y}"]] = [
            prob[1] for prob in input_prediction], [prob[0] for prob in input_prediction]
        predict_input_df["action_group"] = predict_input_df.apply(
            lambda x: combine_good_cols(x[train_obj.get_inputs()["X"].columns]), axis=1)
        prob_col = f'{kwargs.get("prob_col")}_{y}'
        prob_df = predict_input_df.groupby("action_group").mean().sort_values(
            by=prob_col, ascending=False)[[f"prob_yes_{y}", f"prob_no_{y}"]]
        model_output = {
            "model_accuracy": svm_model_accuracy,
            "results": prob_df.reset_index(
                level="action_group").to_dict(
                orient="records")}
        # if needed get decision array --> need to reshape
        if kwargs.get("decision"):
            model_output["decision_eval"] = list(
                svm_model.decision_function(input_x))

        return model_output


def svm_predict_test(
        X_train,
        y_train,
        X_test,
        y_test,
        kernel="rbf",
        gamma=4,
        probability=True,
        **kwargs):
    svm_model = svm.SVC(kernel=kernel, gamma=gamma,
                        probability=probability, **kwargs)
    svm_model.fit(X_train, y_train)
    yhat = svm_model.predict(X_test)
    return {
        "svm_model": svm_model,
        "svm_yhat": yhat,
        "accuracy": metrics.accuracy_score(
            y_test,
            yhat)}
