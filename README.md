# WEB103 Prework - *Simmer Deeds*

Submitted by: **Ricki Beckless**

**[https://simmerdeeds.netlify.app](https://simmerdeeds.netlify.app)**

About this web app: **Simmer Deeds is a platform that allows users to upload their favorite YouTubers who make The Sims content (Simmers). This React app utilizes Google's YouTube API to search for YouTubers by name. Users can add Simmers by manually adding their username, image, description (provided by the Simmer), and custom description (provided by the user). Users can also save time by using the Simmer Search to search for the top five YouTubers who match the provided username. Users can select one of the results, which fills out the Add Simmer form with all needed information! Also featured is the ability to give a Plumbob and 'vote' for a Simmer, view an extended version of the Simmer's information in their own custom page, and edit/delete a Simmer and their information.**

Time spent: **50** hours

## Required Features

The following **required** functionality is completed:

<!-- 👉🏿👉🏿👉🏿 Make sure to check off completed functionality below -->
- [X] **A logical component structure in React is used to create the frontend of the app**
- [X] **At least five content creators are displayed on the homepage of the app**
- [X] **Each content creator item includes their name, a link to their channel/page, and a short description of their content**
- [X] **API calls use the async/await design pattern via Axios or fetch()**
- [X] **Clicking on a content creator item takes the user to their details page, which includes their name, url, and description**
- [X] **Each content creator has their own unique URL**
- [X] **The user can edit a content creator to change their name, url, or description**
- [X] **The user can delete a content creator**
- [X] **The user can add a new content creator by entering a name, url, or description and then it is displayed on the homepage**

The following **optional** features are implemented:

- [ ] Picocss is used to style HTML elements
- [X] The content creator items are displayed in a creative format, like cards instead of a list
- [X] An image of each content creator is shown on their content creator card

The following **additional** features are implemented:

* [X] User can add new content creator by also searching for the YouTubers name and having information automatically fill in
* [X] User can add content creators image via URL or File
* [X] User can vote on content creators by giving them 'Plumbobs'

## Video Walkthrough

Here's a walkthrough of implemented required features:

<img src='./CodePathSimmerDeeds_Walkthrough.gif' title='Simmer Deeds Video Walkthrough' width='' alt='Simmer Deeds Video Walkthrough' />

GIF also found at [Simmer Deeds](https://i.ibb.co/DVfL234/Code-Path-Simmer-Deeds-Walkthrough.gif) on ImgBB

GIF created with [ScreenToGif](https://www.screentogif.com/) for Windows

## Notes

There was a slight learning curve for using Google APIs. The quota limit turned out to be a great benefit as I was made aware of the overabundance of calls to the API being made. I was able to shorten this by only calling when necessary, or by using debounce to stagger the call.

## License

Copyright 2024 Ricki Beckless

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

> http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
