import { exec } from "child_process";
import dotenv from "dotenv";

dotenv.config();

exec(
  `source ${process.env.LAMBDA_VENV_PATH} && python3 ../back-end/lambda_dev_server.py`,
  execOutput
);

function execOutput(error, stdout, stderr) {
  if (error) {
    console.error(error);
  }
  if (stderr) {
    console.warn(stderr);
  }
  console.log(stdout);
}
