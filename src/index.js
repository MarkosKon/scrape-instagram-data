const fs = require("fs");
const mkdirp = require("mkdirp");
const inquirer = require("inquirer");
const { argv } = require("yargs")
  .usage("Usage: $0 [options]")
  .example(
    "$0 -u emilia_clarke",
    "Download Instagram posts for user emilia_clarke"
  )
  .alias("u", "username")
  .nargs("u", 1)
  .describe("u", "Instagram username")
  .string("u")
  .alias("o", "override")
  .describe("o", "Override data if they exist.")
  .boolean("o")
  .alias("h", "help");

const getData = require("./getData");

(async () => {
  let downloadData = true;

  let { username, override } = argv;
  if (!username) {
    const answers = await inquirer.prompt([
      {
        type: "input",
        name: "username",
        message: "Enter the username",
        validate: value => {
          if (value) return true;
          return "The Instagram username is required.";
        }
      }
    ]);
    username = answers.username;
  }
  const userFolder = `data/${username}`;

  if (fs.existsSync(userFolder) && !override) {
    const answers = await inquirer.prompt([
      {
        type: "confirm",
        name: "override",
        message: `It seems that you already downloaded data for ${username}. Do you want to download again?`,
        default: false
      }
    ]);
    override = answers.override;
    if (!override) downloadData = false;
  } else {
    console.log(`Creating directory for user ${username} in ${userFolder} ...`);
    mkdirp(userFolder);
    mkdirp(`${userFolder}/images`);
  }

  if (downloadData) {
    const { userData, posts } = await getData(username);

    fs.writeFileSync(
      `data/${username}/user-data.json`,
      JSON.stringify(userData, null, 2)
    );
    fs.writeFileSync(
      `data/${username}/posts.json`,
      JSON.stringify(posts, null, 2)
    );
  }
})();
