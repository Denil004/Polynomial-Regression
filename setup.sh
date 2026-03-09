#!/bin/bash
# -------------------------------------------------------------------
# Deployment Script for Polynomial Regression API on AWS EC2 (Ubuntu)
# -------------------------------------------------------------------

# 1. Update system
echo "updating system packages..."
sudo apt update -y
sudo apt upgrade -y

# 2. Install Python, pip, and venv
echo "Installing Python3, pip, and venv..."
sudo apt install python3 -y
sudo apt install python3-pip -y
sudo apt install python3-venv -y

# 3. Create a Virtual Environment and activate it
echo "Setting up virtual environment in 'venv'..."
python3 -m venv venv
source venv/bin/activate

# 4. Install requirements
echo "Installing dependencies from requirements.txt..."
pip install -r requirements.txt

# 5. Ensure the model is trained (just in case the .pkl isn't present)
echo "Training model to ensure pr_model.pkl is present..."
python3 train_model.py

# 6. Set up Gunicorn Systemd Service
echo "Configuring systemd service for Gunicorn..."

# Get current path (must be run from project directory)
PROJ_DIR=$(pwd)
USER_NAME=$USER

# Create service file
SERVICE_FILE="/etc/systemd/system/poly_flask.service"
sudo bash -c "cat > $SERVICE_FILE" <<EOL
[Unit]
Description=Gunicorn instance to serve Polynomial Regression API
After=network.target

[Service]
User=$USER_NAME
Group=www-data
WorkingDirectory=$PROJ_DIR
Environment="PATH=$PROJ_DIR/venv/bin"
ExecStart=$PROJ_DIR/venv/bin/gunicorn --workers 3 --bind 0.0.0.0:5002 app:app

[Install]
WantedBy=multi-user.target
EOL

# 7. Start and enable service
echo "Starting and enabling poly_flask.service..."
sudo systemctl daemon-reload
sudo systemctl start poly_flask
sudo systemctl enable poly_flask

# 8. Finished
echo "=========================================================="
echo "Deployment Complete!"
echo "The Polynomial Regression API is running via Gunicorn on port 5002."
echo "Check status with: sudo systemctl status poly_flask"
echo "=========================================================="
