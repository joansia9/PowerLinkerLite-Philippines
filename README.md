## Project title

Power Linker Lite

## Motivation

To quickly and efficiently link NUMIDENT records to the people mentioned in them.

## Build status

Ongoing

## Tech/framework used

<b>Built with</b>

- [React](https://reactjs.org/)

## How to run

## front end:
cd front-end
npm install
npm run start-front-end

## back end:
cd back-end
source venv/bin/activate
pip install -r requirements.txt 
echo "DEPLOYMENT_BRANCH=\"stg\"" >> lambda/.env
- input aws keys before --
python3 lambda_dev_server.py

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