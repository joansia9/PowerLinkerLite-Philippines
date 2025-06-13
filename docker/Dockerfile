# For more information, please refer to https://aka.ms/vscode-docker-python
FROM python:3.11.3-slim

# Keeps Python from generating .pyc files in the container
ENV PYTHONDONTWRITEBYTECODE=1

# Turns off buffering for easier container logging
ENV PYTHONUNBUFFERED=1

# Install pip requirements
WORKDIR /back-end
COPY requirements.txt .
RUN python -m pip install -r requirements.txt

WORKDIR /back-end/lambda
COPY ./lambda .
# Creates a non-root user with an explicit UID and adds permission to access the /app folder
# For more info, please refer to https://aka.ms/vscode-docker-python-configure-containers
RUN adduser -u 5678 --disabled-password --gecos "" appuser && chown -R appuser /back-end
USER appuser

# During debugging, this entry point will be overridden. For more information, please refer to https://aka.ms/vscode-docker-python-debug
ENTRYPOINT [ "/usr/local/bin/python", "-m", "awslambdaric" ]
CMD ["python", "main.py"]