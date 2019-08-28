const fs = require("fs");
const mkdirp = require("mkdirp");
const inquirer = require("inquirer");
const { argv } = require("yargs")
  .usage("Usage: $0 [options]")
  .example(
    "$0 -u emilia_clarke",
    "Downloads the last 100 Instagram posts for user emilia_clarke."
  )
  // -u or --username.
  .alias("u", "username")
  .nargs("u", 1)
  .describe("u", "Instagram username.")
  .string("u")
  // -o or --override.
  .alias("o", "override")
  .describe("o", "Override data if they already exist.")
  .boolean("o")
  // -a or --all.
  .alias("a", "all")
  .describe("a", "Download all posts. Otherwise, downloads the last 100.")
  .boolean("a")
  .default("a", false)
  // -h or --help.
  .alias("h", "help")
  // --version. Add a comma, lol.
  .describe("version", "Show version number.");

const getData = require("./getData");

(async () => {
  let downloadData = true;

  let { username, override, all } = argv;
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
    const limit = !all && 100;
    const { userData, posts } = await getData(username, limit);

    const userDataFilePath = `data/${username}/user-data.json`;
    fs.writeFile(userDataFilePath, JSON.stringify(userData, null, 2), err => {
      if (err) throw err;
      console.log(`Successfully created ${userDataFilePath}`);
    });
    const postsFilePath = `data/${username}/posts.json`;
    fs.writeFile(postsFilePath, JSON.stringify(posts, null, 2), err => {
      if (err) throw err;
      console.log(`Successfully created ${postsFilePath}`);
    });
  }
})();
