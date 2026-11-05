import os, sys, pikepdf
from PyQt6.QtWidgets import (
    QApplication,
    QMainWindow,
    QWidget,
    QVBoxLayout,
    QHBoxLayout,
    QPushButton,
    QFileDialog,
    QLabel,
    QLineEdit,
    QTextEdit,
    QComboBox,
)
from PyQt6.QtCore import (
    Qt,
)

class VentanaPrincipal(QMainWindow):
    def __init__(self):
        super().__init__(parent=None)
        self.setWindowTitle("metadatos.py")
        self.setGeometry(200, 200, 620, 550)
        
        contenedor = QWidget(self)
        vboxlayout = QVBoxLayout()
        contenedor.setLayout(vboxlayout)
        self.setCentralWidget(contenedor)

        btn_archivo = QPushButton("Seleccionar archivo PDF...")
        btn_archivo.clicked.connect(self.seleccionar_archivo)
        vboxlayout.addWidget(btn_archivo)

        self.lbl_archivo = QLabel("No hay archivo seleccionado.")
        self.lbl_archivo.setWordWrap(True)
        self.lbl_archivo.setAlignment(Qt.AlignmentFlag.AlignCenter)
        vboxlayout.addWidget(self.lbl_archivo)

        self.ipt_title = QLineEdit()
        self.ipt_title.setPlaceholderText("Título")
        vboxlayout.addWidget(self.ipt_title)

        self.lbl_titleinfo = QLabel("pdf:\t\ndc:\t")
        self.lbl_titleinfo.setWordWrap(True)   
        vboxlayout.addWidget(self.lbl_titleinfo)

        self.ipt_autor = QLineEdit()
        self.ipt_autor.setPlaceholderText("Autores (separados por ,)")
        vboxlayout.addWidget(self.ipt_autor)

        self.lbl_autorinfo = QLabel("pdf:\t\ndc:\t")
        self.lbl_autorinfo.setWordWrap(True)   
        vboxlayout.addWidget(self.lbl_autorinfo)

        self.ipt_palabra = QLineEdit()
        self.ipt_palabra.setPlaceholderText("Palabras clave (separadas por ,)")
        vboxlayout.addWidget(self.ipt_palabra)

        self.lbl_palabra = QLabel("pdf:\t\ndc:\t")
        self.lbl_palabra.setWordWrap(True)   
        vboxlayout.addWidget(self.lbl_palabra)

        self.cbox_idioma = QComboBox()
        self.cbox_idioma.addItems(['en', 'es', 'fr', 'de'])
        vboxlayout.addWidget(self.cbox_idioma)

        self.lbl_other = QLabel("dc:description:\ndc:rights:\nxmpRights:Marked:\nxmpRights:WebStatement:")
        self.lbl_other.setWordWrap(True)
        vboxlayout.addWidget(self.lbl_other)

        btn_guardar = QPushButton("Guardar")
        btn_guardar.clicked.connect(self.guardar_metadatos)
        vboxlayout.addWidget(btn_guardar)
    
    def seleccionar_archivo(self):
        ruta, _ = QFileDialog.getOpenFileName(
            self,
            "Seleccione un archivo .pdf.",
            "./",
            "Archivo PDF (*.pdf)"
        )

        if ruta:
            archivo = os.path.basename(ruta)
            self.lbl_archivo.setText(archivo)
            self.manejador = Manejador(ruta)
            self.popular_metadatos(self.manejador.cargar_metadatos())
        else:
            self.info_label.setText("Error al abrir el archivo.")

    def popular_metadatos(self, meta):
        self.lbl_titleinfo.setText(
            f"pdf:\t{meta.get('pdf:title')}\ndc:\t{meta.get('dc:title')}")
        self.lbl_autorinfo.setText(
            f"pdf:\t{meta.get('pdf:author')}\ndc:\t{meta.get('dc:creator')}")
        self.lbl_palabra.setText(
            f"pdf:\t{meta.get('pdf:keywords')}\ndc:\t{meta.get('dc:subject')}")
        self.lbl_other.setText(
            f"dc:description: {meta.get('dc:description')}\ndc:rights: {meta.get('dc:rights')}\nxmpRights:Marked: {meta.get('xmpRights:Marked')}\nxmpRights:WebStatement: {meta.get('xmpRights:WebStatement')}")

    def guardar_metadatos(self):
        self.manejador.guardar_metadatos(
            self.cbox_idioma.currentText(),
            self.ipt_title.text(),
            self.ipt_autor.text(),
            self.ipt_palabra.text(),
        )
        self.popular_metadatos(self.manejador.cargar_metadatos())
    
class Manejador():
    def __init__(self, nombre_archivo):
        self.pdf = nombre_archivo
        self.copyright = {
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

    def cargar_metadatos(self):
        with pikepdf.Pdf.open(self.pdf) as articulo:
            with articulo.open_metadata() as meta:
                print(meta)
                return meta
    
    def guardar_metadatos(self, idioma, titulo, autores, palabras):
        asunto = 'Artículo'
        autores_array = [autor.strip() for autor in autores.split(',')]
        palabras_array = [palabra.strip() for palabra in palabras.split(',')]

        print(autores)
        print(palabras)

        with pikepdf.Pdf.open(self.pdf, allow_overwriting_input=True) as articulo:
            with articulo.open_metadata() as meta:
                meta['pdf:title'] = titulo
                meta['pdf:author'] = autores_array
                meta['pdf:keywords'] = palabras_array
                meta['pdf:subject'] = asunto

                meta['dc:title'] = titulo
                meta['dc:creator'] = autores_array
                meta['dc:subject'] = palabras_array
                meta['dc:description'] = asunto
                meta['dc:rights'] = self.copyright[idioma]['text']

                meta['xmpRights:Marked'] = 'True'
                meta['xmpRights:WebStatement'] = self.copyright[idioma]['url']

            articulo.remove_unreferenced_resources()
            articulo.save()

def main():
    app = QApplication([])
    ventana = VentanaPrincipal()
    ventana.show()
    sys.exit(app.exec())

if __name__ == "__main__":
    main()
