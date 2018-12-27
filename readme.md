# Menoum
If you're lazy like me and you never know what to eat, or what recipe you can do with what you already have in your fridge, Menoum is for you. Simply add the ingredients in that search bar and we will give you a list of all the recipes you can do.

## Installation on Ubuntu 18
### Python 3 modules
Install pip
``` console
sudo apt update
sudo apt -y upgrade
sudo apt install -y python3-pip
```
Then the packages
``` console
pip3 install beautifulsoup4 python-slugify isodate mysql-connector python-dotenv nltk
```

Install nltk ressources from the console
``` console
python3
import nltk
nltk.download('stopwords')
nltk.download('punkt')
nltk.download('averaged_perceptron_tagger')
exit()
```

## Laravel requirements
PHP and MariaDB
``` console
sudo apt update
sudo apt -y upgrade
sude apt install php mariadb-server
```
