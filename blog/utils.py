import random
import string

from bs4 import BeautifulSoup


def get_first_image_url_in_html(html):
    bs = BeautifulSoup(html, 'html.parser')

    images = bs.find_all('img')
    for img in images:
        if img.has_attr('src'):
            return img['src']
def rand_slug():
    return ''.join(random.choice(string.ascii_letters + string.digits) for _ in range(6))
