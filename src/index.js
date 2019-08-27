const fs = require("fs");
const mkdirp = require("mkdirp");
const inquirer = require("inquirer");

const getData = require("./getData");

(async () => {
  let downloadData = true;
  const { username } = await inquirer.prompt([
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

  const userFolder = `data/${username}`;

  if (fs.existsSync(userFolder)) {
    const { override } = await inquirer.prompt([
      {
        type: "confirm",
        name: "override",
        message: `It seems that you already downloaded data for ${username}. Do you want to download again?`,
        default: false
      }
    ]);
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
  console.log("End?");
})();
