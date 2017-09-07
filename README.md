# Irma Response Bot API

An API for the purposes of creating a chatbot connecting Floridians with shelters and help requests.

This is a simple API which converts queries for a ZIP code into a lat/long, and then queries the Irma API with that lat/long.

Demo:
https://us-central1-irma-response-bot.cloudfunctions.net/sheltersByZip?zip=34972

## Installation (Mac osx with Homebrew)
You will need a version of nodejs installed.

```bash
brew cask install google-cloud-sdk
npm install

gcloud components update && gcloud components install beta
```

## Deploying the Cloud function
First, create a project in Google Developers Console:
https://console.developers.google.com

Then, you will need to deploy the cloud function to your project. There is [a quickstart here](https://cloud.google.com/functions/docs/quickstart) and also you might find [the cloud console](https://console.cloud.google.com/functions/list) helpful.

Log in from the command line:
```bash
gcloud auth login
gcloud config set project irma-response-bot
```

You will need to make a bucket to store the build artifact:
```bash
gsutil mb -p [PROJECT_ID] gs://[BUCKET_NAME]
```

Deploy the app:
```bash
# TODO: this needs to dynamically look up the project ID and bucket name
make deploy
```
