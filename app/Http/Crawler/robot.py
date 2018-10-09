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
import database


# def get_urls(url, tags):
# 	urls = set()
# 	source_code = requests.get(url)
# 	plain_text = source_code.text
# 	soup = BeautifulSoup(plain_text, 'html.parser')

# 	elements = soup.findAll('ul', {'class': 'item-list'})

# 	for tag in tags:
# 		elements = soup.findAll(tag['name'], {tag['selectorType']: tag['selectorName']})
# 		for element in elements
# 		soup = elements

# 	print(soup)
# 	sys.exit()

# 	for el2 in el1('h2'):
# 		for el3 in el2('a'):
# 			linkHref = link.get('href')
# 			urls.add(linkHref)

# 	return urls


def recipes_spider(crawling, max_pages=1, max_cat=1):
    # This is the crawling code of Ricardo's website.
    if crawling is 'ricardo':
        # category_urls = get_category_urls()
        # recipe_urls = list()
        recipe_urls = database.all()

        # for x in range(0, max_cat):
        #     recipe_urls = recipe_urls + get_recipe_urls(category_urls[x], max_pages)

        recipes = get_recipes(recipe_urls)
        return recipes
        sys.exit()

        cat = 1  # Max number of categories to crawl.

        return data
    # cat = 1 # Max number of categories to crawl.
    # url = 'http://www.ricardocuisine.com/recipes/' # URL of all the recipes categories.
    # source_code = requests.get(url)
    # plain_text = source_code.text
    # soup = BeautifulSoup(plain_text)
    # itemList = soup.find('div', {'class': 'itemList'})
    #
    # print(soup)
    # # For every h2 found in the recipes categories.
    # for h2 in itemList.findAll('h2', {'class': 'title'}):
    #     # For every link found in the recipes categories.
    #     for link in h2.findAll('a'):
    #         page = 1
    #         href_cat = link.get('href')
    #
    #         if href_cat is not None:
    #             # Now go to all the recipes of one category.
    #             while page <= max_pages:
    #                 url = 'http://www.ricardocuisine.com/' + href_cat + 'page/' + str(page)
    #                 source_code = requests.get(url)
    #                 plain_text = source_code.text
    #                 soup = BeautifulSoup(plain_text)
    #                 itemList = soup.find('div', {'class': 'itemList'})
    #
    #                 iA = 0
    #                 data = {}
    #
    #                 for h2 in itemList.findAll('h2', {'class': 'title'}):
    #                     for link in h2.findAll('a'):
    #                         href = link.get('href')
    #                         if href is not None:
    #                             cooking = go_to('http://www.ricardocuisine.com/' + href + '/full')
    #                             data[iA] = cooking
    #                             iA += 1
    #
    #                 page += 1
    #
    #     cat += 1
    #     return data
    #
    #     # Break the For loop if the max number of category is exceeded.
    #     if cat > max_cat:
    #         break

    # return data
    # This is the crawling code of food.com's website (for ingredients).
    elif crawling is 'ingredients':
        data = []
        page = 1

        for i in range(ord('a'), ord('z') + 1):

            url = 'http://www.bbc.co.uk/food/ingredients/by/letter/' + chr(i)  # URL of all the ingredients by letter.
            source_code = requests.get(url)
            plain_text = source_code.text
            soup = BeautifulSoup(plain_text.encode('latin-1'))
            itemList = soup.find('ol', {'class': 'foods'})

            # For every h2 found in the recipes categories.
            if itemList is not None:
                for link in itemList.findAll('a'):
                    # For every link found in the recipes categories.
                    ingredient = link.text.strip().lower()
                    if 'related' not in ingredient:
                        data += [(ingredient, slugify(ingredient))]
                # print(ingredient)

                page += 1
            if page > max_cat:
                break

        return data
    #else:
        #print('Nothing to crawl')


def ingredientAliases(ingredient):
    aliases = {
        'tumeric': 'turmeric',
        'bread crumb': 'breadcrum',
        'kirsh': 'kirsch',
        'clove garlic': 'garlic clove',
        'cloves garlic': 'garlic cloves',
    }

    if ingredient in aliases:
        return aliases[ingredient]
    else:
        return ingredient

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
                        linkHref = link.get('href')
                        urls.add(linkHref)
            else:
                break
        else:
            if page <= 1:
                urls = None
            break

    return list(urls)


def get_recipes(urls):
    # print(urls)
    recipes = list()

    for url in urls:
        url = url['url']
        # url = 'https://www.ricardocuisine.com/' + url  # URL of all the recipes categories.
        # url = 'https://www.ricardocuisine.com/en/recipes/5436-swiss-cheese-fondue-the-best'   # URL of all the recipes categories.

        source_code = requests.get(url)
        plain_text = source_code.text
        soup = BeautifulSoup(plain_text, 'html.parser')
        ingredientsWrap = soup.find('form', {'id': 'formIngredients'})
        itemList = soup.find('script', {'type': 'application/ld+json'})

        if itemList is not None:
            structuredData = json.loads(itemList.text)

            if structuredData['prepTime'] is not None:
                totalPrep = isodate.parse_duration(structuredData['prepTime']).total_seconds()
            else:
                totalPrep = 0
            if structuredData['cookTime'] is not None:
                totalCook = isodate.parse_duration(structuredData['cookTime']).total_seconds()
            else:
                totalCook = 0

            data = {
                'name': structuredData['name'],
                'slug': slugify(structuredData['name']),
                'media': {
                    'url': structuredData['image'],
                    'name': structuredData['name']
                },
                'nutrition': structuredData['nutrition'],
                'preparation': int(totalPrep),
                'cooking': int(totalCook),
                'total_time': int(totalPrep + totalCook),
                'ingredients': [],
                'instructions': [],
                'source': url,
                'servings': structuredData['recipeYield'],
                'ingredient_count': None,
                'raw': []

            }

            if 'ingredients' not in structuredData:
                structuredData['ingredients'] = structuredData['recipeIngredient']

            # Make ingredients unique in the list
            structuredData['ingredients'] = list(set(filter(None, structuredData['ingredients'])))
            # print(structuredData['ingredients'])

            i = 0

            # Ingredients
            # https://stackoverflow.com/questions/12413705/parsing-natural-language-ingredient-quantities-for-recipes
            for ingredient in structuredData['ingredients']:
                # Replace ingredients with correct alias (tumeric => turmeric)
                ingredient = ingredientAliases(ingredient)

                data['ingredients'].insert(i, {
                    'name': ingredient,
                    'slug': slugify(ingredient),
                    'optional': False,
                    'main': False,
                    'quantity': {
                        'amount': None,
                        'unit': None,
                    },
                })

                # regexExclude = ''
                # regexSplitSpaces = ''
                #
                # for index, ingredientTest in enumerate(structuredData['ingredients']):
                #     if ingredientTest is not ingredient:
                #         split = ingredient.split(ingredientTest)
                #         if len(split) > 1:
                #             # ((?!\s?fresh\s?)mozzarella(?!\s?di bufala\s?))
                #             regexExclude = "((?!\s?" + split[0] + "\s?)" + ingredient + "(?!\s?" + split[1] + "\s?))"
                #             break
                #
                # # Split spaces and loop iterate to add optional word
                # # (ex: sharp cheddar chesse in structured data but shredded cheddar cheese in the source code)
                # splitSpaceNoStopWords = removeStopWord(ingredient)
                # splitSpaces = splitSpaceNoStopWords.split(' ')
                # if len(splitSpaces) > 1:
                #     for index, splitIngredient in enumerate(splitSpaces):
                #         for index2, splitIngredient2 in enumerate(splitSpaces):
                #             if splitIngredient2.endswith('s'):
                #                 splitIngredient2 += '?'
                #
                #
                #             if index is index2:
                #                 regexSplitSpaces += '.*(' + splitIngredient2 + ')?.*'
                #             else:
                #                 regexSplitSpaces += '.*' + splitIngredient2
                #         if (index + 1) < len(splitSpaces):
                #             regexSplitSpaces = regexSplitSpaces + '|'
                #
                # # Make the plural optional
                # if ingredient.endswith('s'):
                #     ingredient = ingredient + '?'
                #
                # ingredientNoStopWords = removeStopWord(ingredient)
                # ingredientNoStopWords = ingredientNoStopWords.replace(' ', '.*') + '.*'
                # ingredient = ingredient.replace(' ', '.*') + '.*'
                #
                # ingredientRegex = ingredient + '|' + ingredientNoStopWords
                # findIngredients = ingredient + '|' + ingredientNoStopWords
                #
                # if len(regexSplitSpaces) > 0:
                #     findIngredients = findIngredients + '|' + regexSplitSpaces
                #
                # if regexExclude:
                #     #ingredientRegex = findIngredients
                #     ingredientRegex = regexExclude
                #
                # ingredientRegex = findIngredients

                ingredient_regex = ingredient
                regex_exclude = ''

                for index, ingredient_test in enumerate(structuredData['ingredients']):
                    if ingredient_test is not ingredient:
                        split = ingredient.split(ingredient_test)
                        if len(split) > 1:
                            # ((?!\s?fresh\s?)mozzarella(?!\s?di bufala\s?))
                            regex_exclude = "((?!\s?" + split[0] + "\s?)" + ingredient + "(?!\s?" + split[1] + "\s?))"
                            break

                # Add optional plural to ingredient
                if ingredient_regex.endswith('s'):
                    ingredient_regex += '?'

                # Split spaces in the ingredient (ex: garlic cloves)
                ingredient_split = removeStopWord(ingredient).split(' ')

                if len(ingredient_split) > 1:
                    ingredient_regex += '|'

                    # Search for the words in any order but all must the present
                    for ingredient_part in ingredient_split:

                        # Add optional plural to ingredient
                        if ingredient_part.endswith('s'):
                            ingredient_part += '?'

                        ingredient_regex += '(?=.*' + ingredient_part + ')'

                    # Search for the words in any order but not all must be present
                    # (ex: sharp cheddar chesse in structured data but shredded cheddar cheese in the source code)
                    ingredient_regex += '|'

                    for index1, ingredient1 in enumerate(ingredient_split):
                        for index2, ingredient2 in enumerate(ingredient_split):

                            # Add optional plural to ingredient
                            if ingredient2.endswith('s'):
                                ingredient2 += '?'

                            if index1 == index2:
                                ingredient_regex += '(?=.*(' + ingredient2 + ')?)'
                            else:
                                ingredient_regex += '(?=.*' + ingredient2 + ')'

                        if index1 < (len(ingredient_split) - 1):
                            ingredient_regex += '|'

                ingredientRegex = ingredient_regex
                ingredients = ingredientsWrap.findAll(text=re.compile(ingredientRegex, flags=re.IGNORECASE))
                # print(ingredients)
                # continue

                for ingredientString in ingredients:
                    ingredientString = ingredientString.replace(',', '')

                    saltAndPepper = re.findall('^salt and pepper$|^salt$|^pepper$', ingredientString,
                                               flags=re.IGNORECASE)

                    if len(saltAndPepper) > 0:
                        saltAndPepper = [k.lower() for k in saltAndPepper]

                        if 'salt and pepper' in saltAndPepper:
                            data['ingredients'][i]['name'] = 'Salt'
                            data['ingredients'][i]['slug'] = 'salt'
                            data['ingredients'][i]['quantity']['unit'] = 'taste'

                            i += 1

                            data['ingredients'].insert(i, {
                                'name': 'pepper',
                                'slug': 'pepper',
                                'optional': False,
                                'main': False,
                                'quantity': {
                                    'amount': None,
                                    'unit': 'taste',
                                }
                            })

                            # Insert salt and pepper separately in the raw list
                            data['raw'].extend(['Salt', 'Pepper'])
                        elif 'salt' in saltAndPepper:
                            data['ingredients'][i]['name'] = 'Salt'
                            data['ingredients'][i]['slug'] = 'salt'
                            data['ingredients'][i]['quantity']['unit'] = 'taste'

                            data['raw'].append('Salt')
                        elif 'pepper' in saltAndPepper:
                            data['ingredients'][i]['name'] = 'Pepper'
                            data['ingredients'][i]['slug'] = 'pepper'
                            data['ingredients'][i]['quantity']['unit'] = 'taste'

                            data['raw'].append('Pepper')

                    else:
                        data['raw'].append(ingredientString)
                        # print(ingredientString)
                        # <amount> <unit> [of <ingredient>]
                        regexAmount1 = "(?P<amountMetric>\([0-9]+)"
                        regexAmount2 = "(?P<amount>[0-9\s]*[0-9]*/?[0-9]*\s*¼*½*¾*)"

                        regexUnit1 = "(?P<unitMetric>m?l\)?|k?g\)?|" \
                                     "\\bwhole\\b|\\bpinch\\b|\\btaste\\b|\\bwedges?\\b|" \
                                     "(?P<wholeMetric>" + ingredientRegex + ")).*"
                        regexUnit2 = "(?P<unit>\\bm?l\)?\\b|\\bk?g\)?\\b|\\btb?sp\\b|\\bk?g\\b|\\bcups?\\b|" \
                                     "\\bwhole\\b|\\bpinch\\b|\\btaste\\b|\\bwedges?\\b|\\bslices?\\b|\\bpieces?\\b|" \
                                     "(?P<whole>" + ingredientRegex + ")).*"
                        regexBuild = '(' + regexAmount2 + "(.?|.*)" + regexUnit2 + regex_exclude + ')'

                        # TODO Build one regex to match everything to include the group "whole"

                        # "(?P<amount>\(?[0-9]+)\s(?P<unit>m?l\)??|k?g\)?|tb?sp|k?g|cups?|"
                        regex = "(?P<amount>\(?[0-9]+.?[0-9]+?)\s" \
                                "(?P<unit>\\bm?l\)?\\b|\\bk?g\)?\\b|" \
                                "\\bwhole\\b|\\bpinch\\b|\\btaste\\b|\\bwedges?\\b).*"
                                #"(?P<whole>" + ingredientRegex + ").*"

                        # print(regex)
                        # First regex qui try to find for metric units in parenthesis or not (250 ml, 250 g)
                        quantity = re.search(regex, ingredientString, flags=re.IGNORECASE)

                        # No metric amount found, look for imperial units (2 tbs, 1 cup)
                        #if quantity is None:
                            #quantity = re.search(regexBuild, ingredientString, flags=re.IGNORECASE)

                        # if quantity:
                        #     print(test.group('amountMetric'), test.group('unitMetric'))
                        # quantity = re.search(regex, '1 tsp	dried mustard', flags=re.IGNORECASE)

                        # Optional ingredients
                        optional = re.search('(optional)', ingredientString, flags=re.IGNORECASE)

                        if quantity:
                            unit = quantity.group('unit').strip()
                            #print(unit)

                            #if quantity.group('whole'):
                                #unit = 'whole'

                            #print(quantity.group('whole'))


                            amount = quantity.group('amount')
                            amount = amount.strip('(').strip(')')
                            unit = unit.strip('(').strip(')')


                            # print(amount.strip(), unit, ingredient)
                            quantity = quantity.group(0)
                            quantity = quantity.strip('(').strip(')')
                            quantity = re.split('([0-9]+)', quantity)

                            #print(amount, unit, '******** ' + ingredientString)


                            if len(quantity) >= 2:
                                volume = int(quantity[1])
                            else:
                                volume = None

                            # if len(quantity) >= 3:
                            #     unit = quantity[2].strip().lower()
                            # else:
                            #     unit = None

                            if unit is ingredient:
                                unit = 'whole'

                            if (optional):
                                data['ingredients'][i]['optional'] = True

                            data['ingredients'][i]['quantity'] = {
                                'amount': amount,
                                'unit': unit
                            }
                            #print(data['ingredients'][i])
                        else:
                            # No metric amount found, look for imperial units (2 tbs, 1 cup)
                            quantity = re.search(regexBuild, ingredientString, flags=re.IGNORECASE)

                            if quantity is not None:
                                unit = quantity.group('unit').strip()
                                # print(unit)

                                if quantity.group('whole'):
                                    unit = 'whole'

                                amount = quantity.group('amount')
                                unit = unit.strip('(').strip(')')

                                if unit is ingredient:
                                    unit = 'whole'

                                if (optional):
                                    data['ingredients'][i]['optional'] = True

                                data['ingredients'][i]['quantity'] = {
                                    'amount': amount,
                                    'unit': unit
                                }
                            # else:
                            #     # print('BUGGGGGGGGGGGG', ingredientString, data['source'])

                i += 1

            data['ingredient_count'] = len(data['ingredients'])

            # Instructions
            i = 0
            # instructions = re.split('([1-9]+ - )', structuredData['recipeInstructions'])
            instructions = structuredData['recipeInstructions']

            if instructions:
                for instruction in instructions:
                    section = {
                        'section': instruction['name'],
                        'steps': []
                    }
                    for itemListElement in instruction['itemListElement']:
                        section['steps'].append(itemListElement['text'])

                    data['instructions'].append(section)
                    # instructionMatch = re.search('([1-9]+ - )', instruction)

                    # if instructionMatch is None and instruction:
                    # data['instructions'].append(instructions[i].strip().replace('\\s', ' '))

                    i = i + 1

            # data['instructions'] = '||'.join(data['instructions'])
            recipes.append(data)
            # print(recipes)
            # break
    return recipes


def removeStopWord(sentence):
    stateWords = {
        'fresh', 'sprigs', 'shelled', 'leaves', 'freshly', 'grated', '(', ')'
    }
    stopWords = set(stopwords.words('english'))
    stopWords = stopWords | stateWords

    wordTokens = word_tokenize(sentence)

    filtered_sentence = []

    for w in wordTokens:
        if w not in stopWords:
            filtered_sentence.append(w)

    return ' '.join(filtered_sentence)


def go_to(url):
    source_code = requests.get(url)
    plain_text = source_code.text
    soup = BeautifulSoup(plain_text)

    data = {}

    # This is the title
    data['url'] = url
    data['name'] = soup.find('h1').text

    prep = soup.find(text='Preparation time')
    if prep is not None:
        prep = prep.findNext('dd').text
        prep = functions.hoursToMins(prep)
    else:
        prep = 0

    # ****************************************************** INSERT THE PREPARATION TIME
    data['preparation'] = prep

    cooking = soup.find(text='Cooking time')
    if cooking is not None:
        cooking = cooking.findNext('dd').text
        cooking = functions.hoursToMins(cooking)
    else:
        cooking = 0

    # ****************************************************** INSERT THE COOKING TIME
    data['cooking'] = cooking

    portions = soup.find(text='Output')
    if portions is not None:
        portions = portions.findNext('dd').text.split(' ')
        portions = portions[0]
    else:
        portions = soup.find(text='Servings')
        if portions is not None:
            portions = portions.findNext('dd').text
        else:
            portions = 1

    # ****************************************************** INSERT THE PORTIONS
    data['portions'] = int(portions)

    data['ingredients'] = {}
    i = 0
    ingredients = soup.find('section', {'class': 'ingredients'})
    for ingredient in ingredients.findAll('li'):
        data['ingredients'][i] = ingredient.text
        i += 1

    return data
