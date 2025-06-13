import { exec } from "child_process";
import dotenv from "dotenv";

dotenv.config();

exec(
  `source ${process.env.GROWTH_SPURT_VENV_PATH} && ` +
    `cd ${process.env.GROWTH_SPURT_PATH}/src && ` +
    `git checkout dev && ` +
    `git pull && ` +
    `pip install -r requirements.txt -q && ` +
    `python manage.py runserver`,
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
