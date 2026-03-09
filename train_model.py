"""
Train the Polynomial Regression model and save it as pr_model.pkl.
Run this script if you need to retrain the model on the EC2 instance.

Usage:
    python train_model.py
"""

import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import PolynomialFeatures
from sklearn.linear_model import LinearRegression
from sklearn.pipeline import make_pipeline
from sklearn.metrics import r2_score
import joblib
import os

DATA_PATH = os.path.join(os.path.dirname(__file__), "Salary.csv")
MODEL_PATH = os.path.join(os.path.dirname(__file__), "pr_model.pkl")

# Load data
data = pd.read_csv(DATA_PATH)
X = data[["YearsExperience"]]
y = data["Salary"]

# Split
# For parity with SLR, 20% test size and a random_state
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Train using a pipeline
degree = 2 # Best fit polynomial degree from the research
model = make_pipeline(PolynomialFeatures(degree), LinearRegression())
model.fit(X_train, y_train)

# Evaluate
y_pred = model.predict(X_test)
r2 = r2_score(y_test, y_pred)
print(f"Polynomial Degree: {degree}")
print(f"R² Score: {r2:.4f}")

# Save
joblib.dump(model, MODEL_PATH)
print(f"Model saved to {MODEL_PATH}")
