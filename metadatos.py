import pikepdf

copyright = {
    'en': {
        'text': 'Creative Commons Licence Attribution-NonCommercial-NoDerivatives 4.0 International.',
        'url': 'https://creativecommons.org/licenses/by-nc-nd/4.0/deed'
    },
    'es': {
        'text': 'Licencia Creative Commons Atribución-NoComercial- SinDerivar 4.0 Internacional.',
        'url': 'https://creativecommons.org/licenses/by-nc-nd/4.0/deed.es' 
    },
    'fr': {
        'text': 'Licence Creative Commons Attribution-Utilisation non commerciale-Pas d’Œuvre dérivée 4.0 International.',
        'url': 'https://creativecommons.org/licenses/by-nc-nd/4.0/deed.fr'
    },
    'de': {
        'text': 'Creative-Commons-Lizenz Namensnennung-Nicht kommerziell-Keine Bearbeitungen 4.0 International.',
        'url': 'https://creativecommons.org/licenses/by-nc-nd/4.0/deed.de'
    }
}

asunto = 'Artículo'

pdffile = input("Path to the PDF file (with .pdf extension): ")

idioma = input('Language (en, es, fr, de): ')
titulo = input('Title: ')

autores_input = input('Authors (comma separated): ').split(',')
autores = []
for autor in autores_input:
    autores.append(autor.strip())

print(autores)

palabras_input = input('Keywords (comma separated): ')
palabras = []
for palabra in palabras_input:
    palabras.append(palabra.strip())

with pikepdf.Pdf.open(pdffile, allow_overwriting_input=True) as articulo:
    with articulo.open_metadata() as meta:
        # print(meta)
        meta['pdf:title'] = titulo
        meta['pdf:author'] = autores
        meta['pdf:keywords'] = palabras
        meta['pdf:subject'] = asunto

        meta['dc:title'] = titulo
        meta['dc:creator'] = autores
        meta['dc:subject'] = palabras
        meta['dc:description'] = asunto
        meta['dc:rights'] = copyright[idioma]['text']

        meta['xmpRights:Marked'] = 'True'
        meta['xmpRights:WebStatement'] = copyright[idioma]['url']

    articulo.remove_unreferenced_resources()
    articulo.save()
