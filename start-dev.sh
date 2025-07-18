#!/bin/bash

# Set AWS credentials - USE YOUR OWN CREDENTIALS
# DO NOT COMMIT REAL CREDENTIALS TO GIT!
# Option 1: Set these environment variables before running this script
# Option 2: Use AWS CLI: aws configure
# Option 3: Use AWS SSO: aws sso login

if [ -z "$AWS_ACCESS_KEY_ID" ]; then
    echo "⚠️  AWS credentials not set!"
    echo "Please set your AWS credentials using one of these methods:"
    echo "1. aws configure"
    echo "2. aws sso login"
    echo "3. Set environment variables: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY"
    echo ""
    echo "For temporary credentials, also set: AWS_SESSION_TOKEN"
    echo ""
    echo "Continuing without AWS credentials - backend may not work properly..."
fi

# Kill any existing processes
pkill -f "lambda_dev_server.py"
pkill -f "npm start"

# Start backend in background
echo "Starting backend server..."
cd back-end
source venv/bin/activate
python3 lambda_dev_server.py &
BACKEND_PID=$!
    
# Start frontend in background
echo "Starting frontend server..."
cd ../front-end
npm start &
FRONTEND_PID=$!

echo "Both servers started!"
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:8001"
echo ""
echo "To stop servers: kill $BACKEND_PID $FRONTEND_PID"

# Wait for both processes
wait 