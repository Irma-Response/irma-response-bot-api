data/zipcodes.csv:
	wget -O data/US.zip http://download.geonames.org/export/zip/US.zip
	unzip -d data data/US.zip
	rm -f data/readme.txt data/US.zip
	mv data/US.txt data/zipcodes.csv