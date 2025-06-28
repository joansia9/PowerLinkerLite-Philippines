#!/bin/bash

# Set AWS credentials
export AWS_ACCESS_KEY_ID="ASIATHMMC23XLOSELCP6"
export AWS_SECRET_ACCESS_KEY="DgNMFTd2+C8NH+44DhxQ4LXONqE7vpDw0axDxvkF"
export AWS_SESSION_TOKEN="IQoJb3JpZ2luX2VjEJz//////////wEaCXVzLXdlc3QtMiJHMEUCIQCCadbfMqiiHeY3SVP7WhASHoCpG+y2QnRMt4HW56UGIAIgPJf5T7qr5oogVWpXOKm9XEIHvZ0/jRpK5AIczCUqQAMqhwMIlf//////////ARADGgwyMjIwMjE0NzQwMzAiDHFDTT6hlar7fH/bJSrbAoX92JLNc58uWjCVK38KrZLxqXoT0jShER+AV+vK6xn3WYlF+dCwk8+O3d3UbIqPeVp4FwB0wSvVfzAouEdaqwqKsRtKZy+FQkUDG5Zez2bjoTcrCETb80Vp9k3Q5CRq2DjO69+GcrlaKRnZFL81bPcP++1vRcdJudAnar/IfVmY7HJgH93Dwqi9LoNsUWVIQotH2qF4FEy9uDIPCDoQdZ6yeIG8rTtCCorpMQ6MvQGv0gZs1nBVAM6duU2Z04Cv6V/K10sLw7LuYqESi2uCSpDwUiYl3ta2FT4skDrDOVZE/YdAncgxoVIVvBwOKTlD8wDxtygtQdEa8LcM9u5M/7FTBikAaEvUSggpgyPgyHhWKPlwB2LjrxWd7cEbTRGUr2wHV5ozBDrZfkPHyG78tRrpbXkf24n06LxQHBstCjpxa/LQPJh6Yb36JTjbkKtOGlLLzGAmLMxLfea/MP2IgcMGOqcBncu1rxnf7e/Ao/MqqixjIBbcgofCz0cPw+1UUT+2yyhe7Q8K7w7DYgf0l7zGJZA09VfxlfOhzFaQG58rDLwfER9hpJ8BTTFbnXNAhfqPd/8qR8pc/wSoCTs6VInXsMfeYZAvzECxmDPz4MwA7uwsLxHC7TvzqfSmFxY/l0qTvOwFrkcbqYGroQRPhEP+MDoR5Opq8oFjfRJLZfkHOEk5uwVKfuW/tSE="

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