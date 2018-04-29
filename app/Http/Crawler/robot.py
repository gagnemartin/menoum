import re
import requests
from bs4 import BeautifulSoup
from slugify import slugify
import functions
import json
import isodate
from datetime import timedelta

def recipes_spider(crawling, max_pages = 1, max_cat = 1):
	# This is the crawling code of Ricardo's website.
	if crawling is 'ricardo':
		cat = 1 # Max number of categories to crawl.
		url = 'https://www.ricardocuisine.com/en/recipes/7700-colombian-style-empanadas' # URL of all the recipes categories.
		source_code = requests.get(url)
		plain_text = source_code.text
		soup = BeautifulSoup(plain_text, 'html.parser')
		ingredientsWrap = soup.find('form', {'id': 'formIngredients'})
		itemList = soup.find('script', {'type': 'application/ld+json'})
		structuredData = json.loads(itemList.text)
		totalPrep = isodate.parse_duration(structuredData['prepTime']).total_seconds()
		totalCook = isodate.parse_duration(structuredData['cookTime']).total_seconds()

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
			'ingredient_count': None,

		}

		i = 0
		# Ingredients
		for ingredient in structuredData['ingredients']:
			data['ingredients'].insert(i, {
				'name': ingredient,
				'slug': slugify(ingredient),
				'quantity': {
					'quantity': None,
					'unit': None
				}
			})

			for ingredientString in ingredientsWrap.findAll(text=re.compile(ingredient, flags=re.IGNORECASE)):
				# print(ingredientString)
				regex = "(\([\w\s ]+\)|[0-9]+ tbsp|[0-9]+ tsp|[0-9]+ " + ingredient + ")"
				quantity = re.search(regex, ingredientString, flags=re.IGNORECASE)
				#print(quantity)
				if quantity:
					quantity = quantity.group(0)
					quantity = quantity.strip('(').strip(')')
					quantity = re.split('([0-9]+)', quantity)

					volume = int(quantity[1])
					unit = quantity[2].strip().lower()

					if unit is ingredient:
						unit = 'whole'

					data['ingredients'][i]['quantity'] = {
						'quantity': volume,
						'unit': unit
					}
			i = i + 1

		data['ingredient_count'] = len(data['ingredients'])

		# Instructions
		i = 0
		instructions = re.split('([1-9]+ - )', structuredData['recipeInstructions'])

		if instructions:
			for instruction in instructions:
				instructionMatch = re.search('([1-9]+ - )', instruction)

				if instructionMatch is None and instruction:
					data['instructions'].append(instructions[i].strip())

				i = i + 1

		data['instructions'] = '||'.join(data['instructions'])

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

		#return data
	# This is the crawling code of food.com's website (for ingredients).
	elif crawling is 'ingredients':
		data = []
		page = 1

		for i in range(ord('a'), ord('z')+1):

			url = 'http://www.bbc.co.uk/food/ingredients/by/letter/' + chr(i) # URL of all the ingredients by letter.
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
						print(ingredient)

				page += 1
			if page > max_cat:
				break

		return data
	else:
		print('Nothing to crawl')

def go_to(url):
	source_code = requests.get(url)
	plain_text = source_code.text
	soup = BeautifulSoup(plain_text)

	data = {}

	# This is the title
	data['url'] = url
	data['name'] = soup.find('h1').text

	prep = soup.find(text = 'Preparation time')
	if prep is not None:
		prep = prep.findNext('dd').text
		prep = functions.hoursToMins(prep)
	else:
		prep = 0

	# ****************************************************** INSERT THE PREPARATION TIME
	data['preparation'] = prep

	cooking = soup.find(text = 'Cooking time')
	if cooking is not None:
		cooking = cooking.findNext('dd').text
		cooking = functions.hoursToMins(cooking)
	else:
		cooking = 0

	# ****************************************************** INSERT THE COOKING TIME
	data['cooking'] = cooking

	portions = soup.find(text = 'Output')
	if portions is not None:
		portions = portions.findNext('dd').text.split(' ')
		portions = portions[0]
	else:
		portions = soup.find(text = 'Servings')
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
