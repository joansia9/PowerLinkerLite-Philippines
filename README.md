## Project title

Power Linker Lite

## Motivation

To quickly and efficiently link NUMIDENT records to the people mentioned in them.

## Build status

Ongoing

## Tech/framework used

<b>Built with</b>

- [React](https://reactjs.org/)

## Installation

Clone the repository, go into the `front-end` folder, and run `npm install` to install node_modules. Then, run `echo "REACT_APP_LAMBDA_URL=\"http://localhost:8001\"" >> .env`

### Running the Local Lambda server
`back-end/lambda_dev_server.py` allows you to run lambdas locally for testing purposes. It uses `python-lambda-local` to execute lambdas without the validation of the production server, allowing access from localhost. It uses `python-dotenv` to access an `.env` file that decides whether you are interacting with stg or prd backend. 

From within a virtual environment, enter the `back-end` directory then run `pip install -r requirements.txt`, `echo "DEPLOYMENT_BRANCH=\"stg\"" >> lambda/.env`, and finally  `python3 lambda_dev_server.py` to host the server on `localhost:8000` with lambdas that interact with the stg backend.

### Configure Lambda URL Mappings
To use this server, edit `URL_MAPPINGS` in `lambda_server_settings.py` with your URL-to-handler mappings as they are set up in API Gateway. 

`URL_MAPPINGS` is a dictionary where each key is a URL path. These paths *do not* include a leading slash, such as `"my-endpoint"` (corresponding to `https://my-app.com/my-endpoint`) or `"service/specific-endpoint"` (corresponding to `https://my-app.com/service/specific-endpoint`). 

That key maps to a dictionary of key-value pairs where the key is a protocol (`GET`, `POST`, `PUT`, or `DELETE`) and the value is the path to a lambda in `back-end/lambda`. The name of the function in the lambda directory must match the name of the file (`back-end/lambda/my_lambda.py` must contain a method called `my_lambda`). Subfolders in the `lambda` directory are not supported.

### Configure Port
`SERVER_PORT` in `lambda_server_settings.py` allows you to specify which port the lambda server runs on.

## Credits

Zarin Loosli, Sam Carlsen, Molly Remer

## License

BYU © 2023 Record Linking Lab

cd back-end
source venv/bin/activate
pip install -r requirements.txt 
echo "DEPLOYMENT_BRANCH=\"stg\"" >> lambda/.env
python3 lambda_dev_server.py

lsof -i :3000  # Development React
lsof -i :3004  # Production build
lsof -i :8001  # Backend APIxt