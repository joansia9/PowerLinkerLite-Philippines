import { exec } from "child_process";
import dotenv from "dotenv";

dotenv.config();

// Use the correct path to the virtual environment
const venvPath = process.env.LAMBDA_VENV_PATH || "../back-end/venv/bin/activate";

exec(
  `source ${venvPath} && python3 ../back-end/lambda_dev_server.py`,
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
