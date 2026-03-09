# Deploying the Polynomial Regression Model to EC2

This guide walks you through deploying the `Polynomial Regression` model onto an AWS EC2 instance. It assumes you already have an EC2 instance (Ubuntu Server 22.04 LTS or similar) up and running and you have uploaded this project folder to it.

## 1. Prerequisites

- An **AWS EC2 Ubuntu** instance with port `5000` open in its Security Group (Custom TCP / Port 5000 / Source: Anywhere `0.0.0.0/0`).
- This directory `poly` pushed to a GitHub repository OR securely copied to the EC2 via `scp`.

## 2. Server Configuration

Simply run the automated setup script. This script installs Python 3, pip, creates a virtual environment, installs the dependencies, trains the model, and configures an auto-starting `systemd` service for the Flask API via Gunicorn.

```bash
cd poly/
chmod +x setup.sh
./setup.sh
```

## 3. Verify Deployment

Once the script finishes, you can check the status of the service:
```bash
sudo systemctl status poly_flask
```
It should say `active (running)`.

### Check from Browser
If your EC2 public IPv4 is `3.14.15.92`, open your browser to:
```
http://3.14.15.92:5000/
```
You should see the beautiful new Polynomial Regression UI frontend.

### Test the API endpoint (JSON)
You can directly ping the API via `curl`:
```bash
curl -X POST http://localhost:5000/predict -H "Content-Type: application/json" -d '{"years_experience": 5.5}'
```

*(Expected output: `{"predicted_salary": 78000.00}` or similar depending on the curve).*

## 4. Troubleshooting

If you change code and need to restart the app:
```bash
sudo systemctl restart poly_flask
```

If you need to view the logs:
```bash
sudo journalctl -u poly_flask -f
```
