---
name: Music Follower Application
route: app
---

## Music Follower Application
This package holds the code of the app.


### Todos

1. scrape search, users, playlists channels from youtube, soundcloud, mixcloud
1. normalize the data to follow our schema
1. add musicbrainz apis or copy whole musicbrainz data to mongo
1. store in mongodb
1. add functionality for follow-scraping
1. add authentication
1. create frontend
1. create desktop electron app 
1. create extension functionality (spotify, google music) 
1. index user music folder
1. create soulseek extension


### Install

In the packages/app folder run

    npm install

### Test

To test all scrapers run 

    npm run test

To test a specific scraper

    npm run test -- -g "Youtube" // or the part of the name that is in the describe(...) of the test file

 