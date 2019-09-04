# Scrape Instagram Data

The script may hang at the last few posts because it probably waits a delayed http response. You can either wait to finish or timeout, or you can cancel the script and start downloading again. It will download and overwrite the 2 data files (JSON) but it won't download the images again—only those that failed.

## TODO

- [x] User inquirer to get username and override permission.
- [x] Create user directories.
- [x] Remove the date in the JSON filename, and instead, if the file exists ask for input(y/n) to overwrite it.
- [x] If an image exists, don't download it.
- [x] ESLint for node?
- [x] Yargs?
- [x] Error handling in the fs.
- [x] Learn about promises and async/await, and answer why it takes so long to exit after downloading.

## Optional

- [ ] More scraping for video/gallery types—available types: **GraphImage**, **GraphVideo**, or **GraphSidecar**. The data we get don't provide links for gallery images and videos, and as a result, we need to make a new request, and I don't think I want to support that.
