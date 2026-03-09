"""
Flask API for Polynomial Regression (Salary Prediction)
Predicts salary based on years of experience capturing non-linear relationships.
"""

from flask import Flask, request, jsonify, render_template
import joblib
import numpy as np
import os

app = Flask(__name__)

# Load the trained model pipeline
MODEL_PATH = os.path.join(os.path.dirname(__file__), "pr_model.pkl")
model = joblib.load(MODEL_PATH)


@app.route("/")
def home():
    """Render the prediction UI."""
    return render_template("index.html")


@app.route("/predict", methods=["POST"])
def predict():
    """
    JSON API endpoint.
    Request:  { "years_experience": 5.0 }
    Response: { "predicted_salary": 76349.12 }
    """
    data = request.get_json(force=True)
    years = float(data["years_experience"])
    # The pipeline automatically applies PolynomialFeatures then predicts
    prediction = model.predict(np.array([[years]]))[0]
    return jsonify({"predicted_salary": round(prediction, 2)})


@app.route("/health")
def health():
    """Health-check endpoint (useful for load balancers)."""
    return jsonify({"status": "ok"})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5002, debug=False)
