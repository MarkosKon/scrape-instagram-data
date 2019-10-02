#!/usr/bin/env node
const fs = require("fs");
const mkdirp = require("mkdirp");
const inquirer = require("inquirer");
const ProgressBar = require("progress");
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

const downloadPostImage = require("./downloadPostImage");
const getData = require("./getData");
const getPosts = require("./getPosts");

const bar = new ProgressBar(
  "Downloading instagram posts [:bar] :current/:total :elapsed secs :percent",
  {
    total: 0,
    width: 30
  }
);

const writeFile = (path, data) => {
  fs.writeFile(path, JSON.stringify(data, null, 2), err => {
    if (err) throw err;
    console.log(`Data saved in ${path}.`);
  });
};

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
    mkdirp(userFolder, function userFolderLogger(err) {
      if (err) {
        console.log(err);
        throw err;
      } else console.log(`Created directory "${userFolder}".`);
    });
    const imagesFolder = `${userFolder}/images`;
    mkdirp(imagesFolder, function imagesFolderLogger(err) {
      if (err) {
        console.log(err);
        throw err;
      } else console.log(`Created directory "${imagesFolder}".`);
    });
  }

  if (downloadData) {
    const limit = !all && 100;
    try {
      const { userData, initialPosts, endCursor } = await getData(username);
      writeFile(`data/${username}/user-data.json`, userData);
      bar.total = userData.postCount;

      for (const post of initialPosts) {
        downloadPostImage({ post, username, bar });
      }
      // initialPosts.forEach(post => downloadPostImage({ post, username, bar }));

      let posts = initialPosts;
      if (endCursor)
        posts = await getPosts({
          lastPageId: endCursor,
          userId: userData.id,
          username,
          bar,
          result: posts,
          limit,
          downloadedSoFar: initialPosts.length
        });

      writeFile(`data/${username}/posts.json`, posts);
    } catch (e) {
      console.log(`\nSomething went wrong: ${e}\n`);
    }
  }
})();
