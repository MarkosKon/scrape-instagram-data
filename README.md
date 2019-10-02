# Scrape Instagram data

A CLI tool that downloads data and photos for an Instagram user.

## Usage

- Install it with: `npm i -g scrape-instagram-data`.
- You can then run it with: `scrape -u ig_username`.
- For more options type: `scrape --help` or answer the questions.

It creates a folder `data/ig_username/` that contains:

- A `posts.json` file with the post data.
- A `user-data.json` file with the user data.
- An `images` folder with the images.

## Disclaimers

- This tool violates the Instagram terms of use, and you may not be able to create new accounts from your current IP.
- The script may hang at the last few posts. You can either wait to finish/timeout, or you can cancel it and download again. It will download and overwrite the 2 JSON files but it won't download the images again—only those that failed.

## TODO but probably won't happen

- [ ] More scraping for video/gallery types—available types: **GraphImage**, **GraphVideo**, or **GraphSidecar**. The data don't provide links for gallery images and videos; we'll have to use a different API.
