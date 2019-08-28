# Scrape Instagram Data

## TODO

- [x] User inquirer to get username and override permission.
- [x] Create user directories.
- [x] Remove the date in the JSON filename, and instead, if the file exists ask for input(y/n) to overwrite it.
- [x] If an image exists, don't download it.
- [x] ESLint for node?
- [x] Yargs?
- [x] Error handling in the fs.
- [ ] Learn about promises and async/await, and answer why it takes so long to exit after downloading.

## Optional

- [ ] More scraping for video/gallery types—available types: **GraphImage**, **GraphVideo**, or **GraphSidecar**. The data we get don't provide links for gallery images and videos, and as a result, we need to make a new request, and I don't think I want to support that.
