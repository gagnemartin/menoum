import re
import requests
from bs4 import BeautifulSoup
from slugify import slugify
import functions
import json
import isodate
import sys
from datetime import timedelta
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

def get_category_urls():
    urls = set()
    url = 'https://www.ricardocuisine.com/en/recipes/main-dishes/'
    source_code = requests.get(url)
    plain_text = source_code.text
    soup = BeautifulSoup(plain_text, 'html.parser')

    categoriesWrap = soup.find('ul', {'class': 'item-list'})

    for categoryH2 in categoriesWrap('h2'):
        for link in categoryH2('a'):
            linkHref = link.get('href')
            urls.add(linkHref)

    return list(urls)


def get_recipe_urls(category_url, max_pages):
    urls = set()
    for page in range(1, max_pages + 1):
        url = 'https://www.ricardocuisine.com/' + category_url + '/page/' + str(page)
        source_code = requests.get(url)

        if source_code.status_code is not 206:
            plain_text = source_code.text
            soup = BeautifulSoup(plain_text, 'html.parser')

            recipesWrap = soup.find('ul', {'class': 'item-list'})
            if recipesWrap is not None:
                for recipeH2 in recipesWrap('h2'):
                    for link in recipeH2('a'):
                        link_href = link.get('href')
                        urls.add('https://www.ricardocuisine.com' + link_href)
            else:
                break
        else:
            if page <= 1:
                urls = None
            break

    return list(urls)


def recipes_spider(max_pages=1, max_cat=1):
    # This is the crawling code of Ricardo's website.
    category_urls = get_category_urls()
    category_len = len(category_urls) if len(category_urls) < max_cat else max_cat
    recipe_urls = list()

    for x in range(0, category_len):
        recipe_urls = recipe_urls + get_recipe_urls(category_urls[x], max_pages)

    return recipe_urls
    sys.exit()


urls = recipes_spider(100, 100)
urls = json.dumps(urls)
print(urls)

