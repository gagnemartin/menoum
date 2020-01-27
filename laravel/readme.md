
# On Ubuntu 16
## Python modules
``` console
sudo apt-get update
sudo apt-get -y upgrade
sudo apt-get install -y python3-pip
pip3 install beautifulsoup4
pip3 install python-slugify
pip3 install isodate
pip3 install mysql-connector
pip3 install python-dotenv
pip3 install nltk
```

To install nltk ressources
``` console
python3
import nltk
nltk.download('stopwords')
nltk.download('punkt')
exit()
```
