from flask import Flask, request, render_template, redirect, url_for, flash, jsonify
from werkzeug.utils import secure_filename
from utils.validations import validate_aviso_form
import database.db as db
import hashlib
import filetype
import os
from datetime import datetime

UPLOAD_FOLDER = 'static/uploads'

app = Flask(__name__)

app.secret_key = "s3cr3t_k3y_cambiar_en_produccion"
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB


# --- Routes ---

@app.route("/")
def index():
    """Página principal con últimos avisos"""
    ultimos_avisos = db.get_ultimos_avisos(limit=5)
    return render_template('portada.html', ultimos_avisos=ultimos_avisos)


@app.route("/crear-aviso", methods=["GET", "POST"])
def crear_aviso():
    """Formulario para crear aviso de adopción"""
    
    if request.method == "POST":
        # Validar formulario
        is_valid, errors = validate_aviso_form(request.form, request.files)
        
        if not is_valid:
            for error in errors:
                flash(error, 'error')
            regiones = db.get_all_regions()
            return render_template('crear_aviso_adopcion.html', regiones=regiones)
        
        # Preparar datos del aviso
        unidad_medida = 'a' if request.form.get('select-edad') == 'Año(s)' else 'm'
        tipo_mascota = request.form.get('select-tipo').lower()
        fecha_entrega = datetime.strptime(request.form.get('entrega'), '%Y-%m-%dT%H:%M')
        
        aviso_data = {
            'fecha_ingreso': datetime.now(),
            'comuna_id': int(request.form.get('select-comuna')),
            'sector': request.form.get('sector', ''),
            'nombre': request.form.get('nombre'),
            'email': request.form.get('email'),
            'celular': request.form.get('phone', ''),
            'tipo': tipo_mascota,
            'cantidad': int(request.form.get('cantidad')),
            'edad': int(request.form.get('edad')),
            'unidad_medida': unidad_medida,
            'fecha_entrega': fecha_entrega,
            'descripcion': request.form.get('descripcion', '')
        }
        
        # Procesar fotos
        fotos_list = []
        for i in range(1, 6):
            foto = request.files.get(f'foto{i}')
            if foto and foto.filename and validate_file(foto):
                # Generar nombre único con hash
                _filename = hashlib.sha256(
                    (secure_filename(foto.filename) + str(datetime.now().timestamp()))
                    .encode("utf-8")
                ).hexdigest()
                _extension = filetype.guess(foto).extension
                img_filename = f"{_filename}.{_extension}"
                
                # Guardar archivo
                filepath = os.path.join(app.config['UPLOAD_FOLDER'], img_filename)
                foto.save(filepath)
                
                fotos_list.append({
                    'ruta_archivo': filepath,
                    'nombre_archivo': img_filename
                })
        
        # Procesar contactos
        contactos_list = []
        contactos_seleccionados = request.form.getlist('select-contacto')
        for contacto_tipo in contactos_seleccionados:
            identificador = request.form.get(f'contacto-{contacto_tipo}', '').strip()
            if identificador:
                contactos_list.append({
                    'nombre': contacto_tipo.lower(),
                    'identificador': identificador
                })
        
        # Crear aviso en la base de datos
        success, aviso_id, error = db.create_aviso(aviso_data, fotos_list, contactos_list)
        
        if success:
            flash('¡Aviso creado exitosamente!', 'success')
            return redirect(url_for('mensaje_final'))
        else:
            flash(f'Error al crear el aviso: {error}', 'error')
            regiones = db.get_all_regions()
            return render_template('crear_aviso_adopcion.html', regiones=regiones)
    
    # GET request
    regiones = db.get_all_regions()
    return render_template('crear_aviso_adopcion.html', regiones=regiones)


@app.route('/api/comunas/<int:region_id>')
def api_get_comunas(region_id):
    """API endpoint para obtener comunas por región"""
    comunas = db.get_comunas_by_region(region_id)
    return jsonify({'comunas': comunas})


@app.route("/listado")
def listado():
    """Listado de avisos de adopción con paginación (5 por página)"""
    page = request.args.get('page', 1, type=int)
    data = db.get_avisos_paginados(page=page, per_page=5)
    return render_template('listado.html', **data)


@app.route("/detalles/<int:id>")
def detalles(id):
    """Detalles de un aviso específico"""
    aviso = db.get_aviso_by_id(id)
    
    if not aviso:
        flash('Aviso no encontrado', 'error')
        return redirect(url_for('listado'))
    
    return render_template('detalles_listado.html', aviso=aviso)


@app.route("/estadisticas")
def estadisticas():
    """Página de estadísticas"""
    return render_template('estadisticas.html')


@app.route("/mensaje-final")
def mensaje_final():
    """Mensaje de confirmación después de crear aviso"""
    return render_template('mensaje_final.html')


if __name__ == "__main__":
    app.run(debug=True)