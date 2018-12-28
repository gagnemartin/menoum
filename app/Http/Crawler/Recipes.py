import re
import requests
from bs4 import BeautifulSoup
from slugify import slugify
import functions
import json
import isodate
import nltk
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
        ]).max(50).all()

    #####################################################################################
    def get_recipes(self):
        """
        Fetch the recipes from the urls.

        :return: List of dictionaries
        """

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
                ingredients_list_and_raw = self.get_ingredients()
                instructions = self.get_instructions()

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
                    'ingredients': ingredients_list_and_raw['ingredients'],
                    'instructions': instructions,
                    'source': url,
                    'servings': self.structured_data['recipeYield'],
                    'ingredient_count': None,
                    'raw': ingredients_list_and_raw['raw']
                })

        return self.recipes

    #####################################################################################
    def get_ingredients(self):
        """
        Get the ingredients from the structured data.

        :return: Dictionary
        """

        data = {
            'ingredients': [],
            'raw': []
        }

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
            # regex_exclude = self.build_exclude_regex(ingredient)

            ingredients = self.ingredients_wrap.findAll(text=re.compile(ingredient_regex, flags=re.IGNORECASE))

            for ingredient_string in ingredients:
                ingredient_string = self.clean_ingredient_string(ingredient_string)

                if ingredient_string is not None:
                    salt_and_pepper = self.get_salt_and_pepper(ingredient_string)

                    if len(salt_and_pepper['ingredients']) > 0:
                        # Insert salt and pepper separately in the raw list
                        # data['raw'].extend(['Salt', 'Pepper'])
                        data['ingredients'].extend(salt_and_pepper['ingredients'])
                        data['raw'].extend(salt_and_pepper['raw'])
                    else:
                        data['ingredients'].append(self.get_ingredient_data(ingredient, ingredient_string))
                        data['raw'].append(ingredient_string)

        return data

    #####################################################################################
    def get_salt_and_pepper(self, ingredient_string):
        """
        Find if the ingredient_string is salt and pepper.
        If yes, add them both separately

        :param ingredient_string: String ingredient in the source code
        :return: List
        """

        data = {
            'ingredients': [],
            'raw': []
        }

        salt_and_pepper = re.findall('salt and pepper|^salt$|^pepper$', ingredient_string, flags=re.IGNORECASE)

        # Found Salt and Pepper
        if len(salt_and_pepper) > 0:
            salt_and_pepper = [k.lower() for k in salt_and_pepper]

            salt = {
                'name': 'salt',
                'slug': 'salt',
                'optional': False,
                'main': False,
                'quantity': {
                    'amount': None,
                    'unit': 'taste',
                }
            }

            pepper = {
                'name': 'pepper',
                'slug': 'pepper',
                'optional': False,
                'main': False,
                'quantity': {
                    'amount': None,
                    'unit': 'taste',
                }
            }

            if 'salt and pepper' in salt_and_pepper:
                data['ingredients'].extend([salt, pepper])
                data['raw'].extend(['salt', 'pepper'])

            elif 'salt' in salt_and_pepper:
                data['ingredients'].append(salt)
                data['raw'].append('salt')

                # data['raw'].append('Salt')
            elif 'pepper' in salt_and_pepper:
                data['ingredients'].append(pepper)
                data['raw'].append('pepper')

                # data['raw'].append('Pepper')

        return data

    #####################################################################################
    def get_ingredient_data(self, ingredient, ingredient_string):
        """
        Get the ingredient's data in a dictionary

        :param ingredient: The ingredient as it is in the structured data
        :param ingredient_string: The ingredient as is it in the HTML with the quantity
        :return: dictionary of the ingredient
        """

        ingredient_data = {
            'name': ingredient,
            'slug': slugify(ingredient),
            'optional': self.is_ingredient_optional(ingredient_string),
            'main': False,
            'quantity': self.get_ingredient_quantity(ingredient, ingredient_string),
            'section': None
        }

        return ingredient_data

    #####################################################################################
    def get_ingredient_quantity(self, ingredient, ingredient_string):
        """
        Get the ingredient amount and unit

        :param ingredient: The ingredient as it is in the structured data
        :param ingredient_string: The ingredient as is it in the HTML with the quantity
        :return: dictionary of the amount and unit
        """

        ingredient_tokentize = nltk.word_tokenize(ingredient_string)
        ingredient_tags = nltk.pos_tag(ingredient_tokentize)

        tagger = nltk.PerceptronTagger()
        ingredient_tags = tagger.tag(ingredient_tokentize)

        grammar = 'Quantity: {<CD>+(<JJ>?<NN|NNS>)?}'
        parser = nltk.RegexpParser(grammar)
        tags = [tree.leaves() for tree in parser.parse(ingredient_tags).subtrees() if
                    tree.label() == 'Quantity']

        if len(tags) > 1:
            values = self.get_quantity_metric(tags, ingredient)

            if values is None:
                values = {
                    'amount': None,
                    'unit': None
                }

            return values

        return {
            'amount': None,
            'unit': None
        }

    #####################################################################################
    def clean_ingredient_string(self, ingredient_string):
        """
        Clean the ingredient string and convert the fractional symbols to fractional strings

        :param ingredient_string:
        :return: string
        """

        ingredient_string = re.sub(r'(?<=[0-9])(?=[^\s^0-9.\/])', ' ', ingredient_string)

        return ingredient_string\
            .replace(',', '')\
            .replace(' / ', '/')\
            .replace('¼', '1/4')\
            .replace('½', '1/2')\
            .replace('¾', '3/4')\
            .replace('⅐', '1/7')\
            .replace('⅑', '1/9')\
            .replace('⅒', '1/10')\
            .replace('⅓', '1/3')\
            .replace('⅔', '2/3')\
            .replace('⅕', '1/5')\
            .replace('⅖', '2/5')\
            .replace('⅗', '3/5')\
            .replace('⅘', '4/5')\
            .replace('⅙', '1/6')\
            .replace('⅚', '5/6')\
            .replace('⅛', '1/8')\
            .replace('⅜', '3/8')\
            .replace('⅝', '5/8')\
            .replace('⅞', '7/8')\
            .replace('⅟', '1/')\
            .replace('↉', '0/3')

    #####################################################################################
    def get_quantity_imperial(self, ingredient, ingredient_string):
        """
        Get the ingredient imperial amount and unit

        :param ingredient: The ingredient as it is in the structured data
        :param ingredient_string: The ingredient as is it in the HTML with the quantity
        :return: dictionary of the amount and unit
        """

        ingredient_regex = self.build_ingredient_regex(ingredient)
        regex_exclude = self.build_exclude_regex(ingredient)
        regex_amount = "(?P<amount>[0-9\s]*[0-9]*/?[0-9]*\s*¼*½*¾*)"
        regex_unit = "(?P<unit>\\bm?l\)?\\b|\\bk?g\)?\\b|\\btb?sp\\b|\\bk?g\\b|\\bcups?\\b|" \
                     "\\bwhole\\b|\\bpinch\\b|\\btaste\\b|\\bwedges?\\b|\\bslices?\\b|\\bpieces?\\b|" \
                     "(?P<whole>" + ingredient_regex + ")).*"
        regex = '(' + regex_amount + "(.?|.*)" + regex_unit + regex_exclude + ')'

        if ingredient == 'garlic cloves':
            print(regex)

        quantity = re.search(regex, ingredient_string, flags=re.IGNORECASE)

        if quantity is not None:
            unit = quantity.group('unit').strip()

            if quantity.group('whole'):
                unit = 'whole'

            amount = quantity.group('amount')
            unit = unit.strip('(').strip(')')

            if unit is ingredient:
                unit = 'whole'

            return {
                'amount': amount,
                'unit': unit
            }

        return None

    def get_quantity_metric(self, tags, ingredient):
        """
        Get the ingredient metric amount and unit

        :param tags: The ingredient as it is in the structured data
        :return: dictionary of the amount and unit
        """

        if type(tags) is not str:
            values = {
                'amount': None,
                'unit': None
            }

            if type(tags) is tuple:
                if tags[1] == 'NN' or tags[1] == 'NNS':
                    metric = ['l', 'litre', 'litres', 'ml', 'kg', 'g', 'gram', 'grams']
                    ingredient = ingredient.split(' ')

                    if any(t in tags for t in metric):
                        values['unit'] = tags[0]
                    elif any(t in tags for t in ingredient):
                        values['unit'] = 'whole'
                elif tags[1] == 'CD':
                    values['amount'] = tags[0]

                return values

                # return {
                #     'amount': index[0][0],
                #     'unit': index[1][0]
                # }
            else:
                for index in tags:
                    if len(index) >= 1:
                        data = self.get_quantity_metric(index, ingredient)

                        if data is not None:
                            if data['amount'] is not None:
                                values['amount'] = data['amount']
                            if data['unit'] is not None:
                                values['unit'] = data['unit']

                            if values['amount'] is not None and values['unit'] is not None:
                                return values

        # regex = "(?P<amount>\(?[0-9]+.?[0-9]+?)\s" \
        #         "(?P<unit>\\bm?l\)?\\b|\\bk?g\)?\\b|" \
        #         "\\bwhole\\b|\\bpinch\\b|\\btaste\\b|\\bwedges?\\b).*"
        #
        # # First regex qui try to find for metric units in parenthesis or not (250 ml, 250 g)
        # quantity = re.search(regex, ingredient_string, flags=re.IGNORECASE)
        #
        # if quantity:
        #     unit = quantity.group('unit').strip()
        #
        #     amount = quantity.group('amount')
        #     amount = amount.strip('(').strip(')')
        #     unit = unit.strip('(').strip(')')
        #
        #     if unit is ingredient:
        #         unit = 'whole'
        #
        #     return {
        #         'amount': amount,
        #         'unit': unit,
        #     }
        #
        # return None

    def is_ingredient_optional(self, ingredient_string):
        """
        Find the word (optional) in the string and return a boolean

        :param ingredient_string: The ingredient as it is in the HTML
        :return: boolean
        """

        return re.search('(optional)', ingredient_string, flags=re.IGNORECASE) is not None

    #####################################################################################
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

    #####################################################################################
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

    #####################################################################################
    def get_total_prep(self):
        """
        Get the total preparation time from the structured data

        :return: Integer
        """

        if self.structured_data['prepTime'] is not None:
            return int(isodate.parse_duration(self.structured_data['prepTime']).total_seconds())
        else:
            return 0

    #####################################################################################
    def get_total_cook(self):
        """
        Get the total cooking time from the structured data

        :return: Integer
        """

        if self.structured_data['cookTime'] is not None:
            return int(isodate.parse_duration(self.structured_data['cookTime']).total_seconds())
        else:
            return 0

    #####################################################################################
    def get_instructions(self):
        """
        Get the instructions from the structured data

        :return: List
        """

        instructions = []
        sd_instructions = self.structured_data['recipeInstructions']

        if sd_instructions:
            for instruction in sd_instructions:
                section = {
                    'section': instruction['name'],
                    'steps': []
                }
                for item_list_element in instruction['itemListElement']:
                    section['steps'].append(item_list_element['text'])

                instructions.append(section)

        # data['instructions'] = '||'.join(data['instructions'])
        return instructions

    #####################################################################################
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

    #####################################################################################
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


data = json.dumps(Recipes().get_recipes())
print(data)