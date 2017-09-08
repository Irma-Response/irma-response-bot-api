serve:
	node --inspect devServer.js

deploy:
	gcloud beta functions deploy sheltersByZip --stage-bucket irma-response-bot-api --trigger-http

devdeploy:
	gcloud beta functions deploy sheltersByZip --stage-bucket irbd-20170907 --trigger-http

data/zipcodes.csv:
	wget -O data/US.zip http://download.geonames.org/export/zip/US.zip
	unzip -d data data/US.zip
	rm -f data/readme.txt data/US.zip
	mv data/US.txt data/zipcodes.csv
