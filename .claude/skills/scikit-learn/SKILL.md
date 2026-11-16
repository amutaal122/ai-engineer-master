---
name: scikit-learn
description: scikit-learn — ML pipelines, preprocessing, classification, regression, clustering, model selection, evaluation, and production patterns for data scientists.
triggers: [scikit-learn, sklearn, machine learning, classifier, regressor, pipeline, cross_val, GridSearchCV, RandomForest, XGBoost, model training, feature engineering, preprocessing]
version: "1.0"
source: https://scikit-learn.org/stable/
---

# scikit-learn

## Pipeline (always use — prevents data leakage)
```python
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier

numeric_features = ["age", "income", "score"]
cat_features = ["category", "region"]

preprocessor = ColumnTransformer([
    ("num", StandardScaler(), numeric_features),
    ("cat", OneHotEncoder(handle_unknown="ignore", sparse_output=False), cat_features),
])

pipeline = Pipeline([
    ("preprocessor", preprocessor),
    ("model", RandomForestClassifier(n_estimators=200, random_state=42, n_jobs=-1))
])

pipeline.fit(X_train, y_train)
y_pred = pipeline.predict(X_test)
y_proba = pipeline.predict_proba(X_test)[:, 1]
```

## Model selection
| Task | Algorithm | When |
|---|---|---|
| Classification | `LogisticRegression` | Baseline, interpretable |
| Classification | `RandomForestClassifier` | Tabular, feature importance |
| Classification | `GradientBoostingClassifier` | Best accuracy on tabular |
| Regression | `Ridge` / `Lasso` | Linear + regularization |
| Regression | `RandomForestRegressor` | Non-linear tabular |
| Clustering | `KMeans` | Known k, spherical clusters |
| Clustering | `DBSCAN` | Unknown k, noise |
| Dimensionality | `PCA` | Linear reduction |
| Dimensionality | `UMAP` (umap-learn) | Non-linear, visualization |

## Cross-validation + evaluation
```python
from sklearn.model_selection import cross_val_score, StratifiedKFold
from sklearn.metrics import classification_report, roc_auc_score, mean_squared_error

cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
scores = cross_val_score(pipeline, X, y, cv=cv, scoring="roc_auc", n_jobs=-1)
print(f"ROC-AUC: {scores.mean():.3f} ± {scores.std():.3f}")

# Full report
print(classification_report(y_test, y_pred))
print(f"ROC-AUC: {roc_auc_score(y_test, y_proba):.4f}")
print(f"RMSE: {mean_squared_error(y_test, y_pred, squared=False):.4f}")
```

## Hyperparameter tuning
```python
from sklearn.model_selection import RandomizedSearchCV
from scipy.stats import randint

param_dist = {
    "model__n_estimators": randint(100, 500),
    "model__max_depth": [None, 5, 10, 20],
    "model__min_samples_leaf": randint(1, 10),
}

search = RandomizedSearchCV(
    pipeline, param_dist,
    n_iter=50, cv=5, scoring="roc_auc",
    n_jobs=-1, random_state=42, verbose=1
)
search.fit(X_train, y_train)
best_model = search.best_estimator_
```

## Preprocessing patterns
```python
from sklearn.preprocessing import LabelEncoder, MinMaxScaler, RobustScaler
from sklearn.impute import SimpleImputer, KNNImputer
from sklearn.feature_selection import SelectFromModel, RFECV

# Imputation
imputer = KNNImputer(n_neighbors=5)  # better than mean for small datasets

# Feature selection
selector = SelectFromModel(RandomForestClassifier(n_estimators=100, random_state=42))
X_selected = selector.fit_transform(X_train, y_train)
selected_features = X_train.columns[selector.get_support()]
```

## Class imbalance
```python
from sklearn.utils.class_weight import compute_class_weight

weights = compute_class_weight("balanced", classes=np.unique(y), y=y)
class_weight = dict(zip(np.unique(y), weights))
model = RandomForestClassifier(class_weight=class_weight)

# Or use SMOTE (imbalanced-learn)
from imblearn.over_sampling import SMOTE
X_res, y_res = SMOTE(random_state=42).fit_resample(X_train, y_train)
```

## Save + load model
```python
import joblib

joblib.dump(pipeline, "model_v1.joblib")       # save
pipeline = joblib.load("model_v1.joblib")       # load
```

## Feature importance
```python
# Tree-based models
importances = pd.Series(
    pipeline.named_steps["model"].feature_importances_,
    index=pipeline.named_steps["preprocessor"].get_feature_names_out()
).sort_values(ascending=False)

# SHAP (model-agnostic)
import shap
explainer = shap.TreeExplainer(pipeline.named_steps["model"])
shap_values = explainer.shap_values(X_test_transformed)
shap.summary_plot(shap_values, X_test_transformed)
```

## Rules
- Always use `Pipeline` — never fit preprocessor on full dataset (data leakage)
- Use `StratifiedKFold` for classification (preserves class balance)
- `RandomizedSearchCV` over `GridSearchCV` for >3 hyperparameters
- Save with `joblib` not `pickle` (handles numpy arrays better)
- Set `random_state=42` everywhere for reproducibility
- `n_jobs=-1` to use all CPU cores
