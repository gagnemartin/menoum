import re
import requests
from bs4 import BeautifulSoup
from slugify import slugify
import functions
import json
import isodate
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from Connection import Connection


class Recipes:
    def __init__(self):
        self.structured_data = {}
        self.ingredients_wrap = {}
        self.ingredients_sections = []
        self.recipes = []

        self.urls = Connection('urls').select('url').where([
            ['crawled', None],
        ]).max(20).all()

    def get_recipes(self):
        """
        Fetch the recipes from the urls.

        :return: List of dictionaries
        """
        i = 0

        for url in self.urls:
            url = url['url']

            source_code = requests.get(url)
            plain_text = source_code.text
            soup = BeautifulSoup(plain_text, 'html.parser')
            self.ingredients_wrap = soup.find('form', {'id': 'formIngredients'})
            self.ingredients_sections = self.ingredients_wrap.findAll('h3')
            item_list = soup.find('script', {'type': 'application/ld+json'})

            if item_list is not None:
                self.structured_data = json.loads(item_list.text)

                total_prep = self.get_total_prep()
                total_cook = self.get_total_cook()

                self.recipes.append({
                    'name': self.structured_data['name'],
                    'slug': slugify(self.structured_data['name']),
                    'media': {
                        'url': self.structured_data['image'],
                        'name': self.structured_data['name']
                    },
                    'nutrition': self.structured_data['nutrition'],
                    'preparation': total_prep,
                    'cooking': total_cook,
                    'total_time': total_prep + total_cook,
                    'ingredients': self.get_ingredients(),
                    'instructions': [],
                    'source': url,
                    'servings': self.structured_data['recipeYield'],
                    'ingredient_count': None,
                    'raw': []
                })

                i += 1

        return self.recipes

    def get_ingredients(self):
        """
        Get the ingredients from the structured data.

        :return: Dictionary
        """

        data = []

        # "ingredient" key is not in structured data. Look for recipeIngredient
        if 'ingredients' not in self.structured_data:
            self.structured_data['ingredients'] = self.structured_data['recipeIngredient']

        # TODO allow the same ingredient multiple times for different sections
        # Make ingredients unique in the list
        self.structured_data['ingredients'] = list(set(filter(None, self.structured_data['ingredients'])))
        # print(structuredData['ingredients'])

        # Ingredients
        # https://stackoverflow.com/questions/12413705/parsing-natural-language-ingredient-quantities-for-recipes
        for ingredient in self.structured_data['ingredients']:
            # Replace ingredients with correct alias (tumeric => turmeric)
            ingredient = self.ingredient_aliases(ingredient)

            ingredient_regex = self.build_ingredient_regex(ingredient)
            regex_exclude = self.build_exclude_regex(ingredient)

            ingredients = self.ingredients_wrap.findAll(text=re.compile(ingredient_regex, flags=re.IGNORECASE))

            for ingredient_string in ingredients:
                ingredient_string = ingredient_string.replace(',', '')

                salt_and_pepper = self.get_salt_and_pepper(ingredient_string)

                if len(salt_and_pepper) > 0:
                    # Insert salt and pepper separately in the raw list
                    # data['raw'].extend(['Salt', 'Pepper'])
                    data.extend(salt_and_pepper)

                data.append(self.get_ingredient_data(ingredient, ingredient_string))

        return data

    def get_salt_and_pepper(self, ingredient_string):
        """
        Find if the ingredient_string is salt and pepper.
        If yes, add them both separately

        :param ingredient_string: String ingredient in the source code
        :return: List
        """
        data = []
        salt_and_pepper = re.findall('^salt and pepper$|^salt$|^pepper$', ingredient_string, flags=re.IGNORECASE)

        # Found Salt and Pepper
        if len(salt_and_pepper) > 0:
            salt_and_pepper = [k.lower() for k in salt_and_pepper]

            salt = {
                'name': 'Salt',
                'slug': 'salt',
                'optional': False,
                'main': False,
                'quantity': {
                    'amount': None,
                    'unit': 'taste',
                }
            }

            pepper = {
                'name': 'Pepper',
                'slug': 'pepper',
                'optional': False,
                'main': False,
                'quantity': {
                    'amount': None,
                    'unit': 'taste',
                }
            }

            if 'salt and pepper' in salt_and_pepper:
                data.extend([salt, pepper])

            elif 'salt' in salt_and_pepper:
                data.append(salt)

                # data['raw'].append('Salt')
            elif 'pepper' in salt_and_pepper:
                data.append(pepper)

                # data['raw'].append('Pepper')

        return data

    def get_ingredient_data(self, ingredient, ingredient_string):
        ingredient_data = {
            'name': ingredient,
            'slug': slugify(ingredient),
            'optional': False,
            'main': False,
            'quantity': {
                'amount': None,
                'unit': None,
            },
            'section': None
        }

        return ingredient_data

    def build_ingredient_regex(self, ingredient):
        """
        Build the first regex for an ingredient

        :param ingredient: String of the ingredient
        :return: String regex of the ingredient
        """
        regex = ingredient
        # Add optional plural to ingredient
        if regex.endswith('s'):
            regex += '?'

        # Split spaces in the ingredient (ex: garlic cloves)
        ingredient_split = self.remove_stop_words(ingredient).split(' ')

        if len(ingredient_split) > 1:
            regex += '|'

            # Search for the words in any order but all must the present
            for ingredient_part in ingredient_split:

                # Add optional plural to ingredient
                if ingredient_part.endswith('s'):
                    ingredient_part += '?'

                    regex += '(?=.*' + ingredient_part + ')'

            for index1, ingredient1 in enumerate(ingredient_split):
                for index2, ingredient2 in enumerate(ingredient_split):

                    # Add optional plural to ingredient
                    if ingredient2.endswith('s'):
                        ingredient2 += '?'

                    if index1 == index2:
                        regex += '(?=.*(' + ingredient2 + ')?)'
                    else:
                        regex += '(?=.*' + ingredient2 + ')'

                if index1 < (len(ingredient_split) - 1):
                    regex += '|'

        return regex

    def build_exclude_regex(self, ingredient):
        """
        Build a regex to exclude an ingredient if its name is found somewhere else

        :param ingredient: String of the ingredient
        :return: String regex of the excluded ingredient
        """
        regex = ''
        for index, ingredient_test in enumerate(self.structured_data['ingredients']):
            if ingredient_test is not ingredient:
                split = ingredient.split(ingredient_test)
                if len(split) > 1:
                    # ((?!\s?fresh\s?)mozzarella(?!\s?di bufala\s?))
                    regex = "((?!\s?" + split[0] + "\s?)" + ingredient + "(?!\s?" + split[1] + "\s?))"
                    break

        return regex

    def get_total_prep(self):
        """
        Get the total preparation time from the structured data

        :return: Integer
        """

        if self.structured_data['prepTime'] is not None:
            return int(isodate.parse_duration(self.structured_data['prepTime']).total_seconds())
        else:
            return 0

    def get_total_cook(self):
        """
        Get the total cooking time from the structured data

        :return: Integer
        """

        if self.structured_data['cookTime'] is not None:
            return int(isodate.parse_duration(self.structured_data['cookTime']).total_seconds())
        else:
            return 0

    def ingredient_aliases(self, ingredient):
        """
        Change the name of an ingredient to its aliases

        :param ingredient: String
        :return: String
        """
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

    def remove_stop_words(self, sentence):
        state_words = {
            'fresh', 'sprigs', 'shelled', 'leaves', 'freshly', 'grated', '(', ')'
        }
        stop_words = set(stopwords.words('english'))
        stop_words = stop_words | state_words

        word_tokens = word_tokenize(sentence)

        filtered_sentence = []

        for w in word_tokens:
            if w not in stop_words:
                filtered_sentence.append(w)

        return ' '.join(filtered_sentence)


print(Recipes().get_recipes())