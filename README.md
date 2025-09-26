# Netlify functions for Swiss Tchoukball

[![Netlify Status](https://api.netlify.com/api/v1/badges/4992bb85-8e27-4f72-8572-40ca9fc62c57/deploy-status)](https://app.netlify.com/sites/awesome-sinoussi-30f6c3/deploys)

This repository currently contains a single Netlify function.

## `simple-standings`

This function retrieve a competition standings from Clupik (formerly Leverade) a process it to return a simplified JSON of it.

It is notably useful to have the standing processed more easily by some CMS plugins that transform JSON into tables.

### Usage

Call `https://swiss-tchoukball.netlify.app/.netlify/functions/simple-standings?groupId={groupId}`
and replace `{groupId}` with the corresponding Clupik Group ID.

Example: to get the standings matching the 2025-2026 league A, we can navigate to that standings on the Swiss Tchoukball
website and observe the URL: https://tchoukball.ch/competitions/ligue-a/2025-2026/3638419/classement.
In there, the group ID is the number after the season: `3638419`. To get the JSON representation of that standing,
we can go to https://swiss-tchoukball.netlify.app/.netlify/functions/simple-standings?groupId=3638419.
