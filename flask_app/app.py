from flask import Flask, request, render_template, redirect, url_for, flash, jsonify
from werkzeug.utils import secure_filename
from utils.validations import validate_aviso_form
import database.db as db
from database.db import AvisoAdopcion, Nota, SessionLocal
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
            if foto and foto.filename:
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
@app.route("/listado")
def listado():
    """Listado de avisos de adopción con paginación (5 por página) y evaluación."""
    page = request.args.get('page', 1, type=int)
    
    # 1. Obtener datos paginados (resultado del dict original)
    data = db.get_avisos_paginados(page=page, per_page=5) 
    
    session = SessionLocal()
    try:
        # 2. Obtener los IDs de los avisos de la página actual
        aviso_ids = [a['id'] for a in data['avisos']]
        # 3. Consultar los objetos SQLAlchemy correspondientes (para usar la propiedad hybrid_property)
        avisos_obj = session.query(AvisoAdopcion).filter(AvisoAdopcion.id.in_(aviso_ids)).all()
        
        # 4. Mapear y adjuntar el promedio de nota a cada aviso
        for aviso_obj in avisos_obj:
            promedio = aviso_obj.nota_promedio 
            promedio_str = str(promedio) if promedio is not None else '-'
            
            # Buscar el diccionario original en 'data['avisos']' y adjuntarle la nota promedio
            original_aviso = next(item for item in data['avisos'] if item['id'] == aviso_obj.id)
            original_aviso['nota_promedio'] = promedio_str
            
        # data['avisos'] ahora tiene la clave 'nota_promedio'
        
        return render_template('listado.html', **data)
    except Exception as e:
        flash(f'Error al cargar listado con evaluación: {e}', 'error')
        # Si falla, se intenta renderizar sin el promedio (o redirigir)
        return render_template('listado.html', **data) 
    finally:
        session.close()


@app.route("/detalles/<int:id>")
def detalles(id):
    """Detalles de un aviso específico y sus comentarios asociados."""
    aviso = db.get_aviso_by_id(id)
    
    if not aviso:
        flash('Aviso no encontrado', 'error')
        return redirect(url_for('listado'))
    
    # Obtener comentarios para el listado inicial
    comentarios = db.get_comentarios_by_aviso(id)
    
    return render_template('detalles_listado.html', aviso=aviso, comentarios=comentarios)


@app.route("/estadisticas")
def estadisticas():
    """Página de estadísticas"""
    return render_template('estadisticas.html')


@app.route("/mensaje-final")
def mensaje_final():
    """Mensaje de confirmación después de crear aviso"""
    return render_template('mensaje_final.html')


# Nueva ruta API para agregar comentarios
@app.route('/api/comentarios', methods=['POST'])
def api_create_comentario():
    """Recibe y valida datos del comentario, luego inserta en DB."""
    try:
        data = request.get_json()
        nombre = data.get('nombre', '').strip()
        texto = data.get('texto', '').strip()
        aviso_id = data.get('aviso_id')
        
        # 1. Validación del lado del servidor (Requerida en Tarea 3) [cite: 21]
        errors = []
        if not (3 <= len(nombre) <= 80):
            errors.append('El nombre debe tener entre 3 y 80 caracteres.')
        if not (len(texto) >= 5 and len(texto) <= 300):
            errors.append('El comentario debe tener entre 5 y 300 caracteres.')
        if not aviso_id:
            errors.append('ID de aviso es requerido.')
        
        if errors:
            return jsonify({'success': False, 'errors': errors}), 400
        
        # 2. Inserción en la base de datos
        success, error = db.create_comentario(nombre, texto, aviso_id) 
        
        if success:
            # Retorna el nuevo comentario o un mensaje de éxito
            return jsonify({'success': True, 'message': 'Comentario agregado.'}), 201
        else:
            return jsonify({'success': False, 'message': f'Error DB: {error}'}), 500

    except Exception as e:
        # Manejo de errores de JSON o servidor
        return jsonify({'success': False, 'message': 'Error interno del servidor.'}), 500


@app.route('/api/estadisticas')
def api_estadisticas():
    """API endpoint para obtener datos dinámicos de los 3 gráficos."""
    try:
        data = {
            'by_day': db.get_stats_by_day(),
            'by_type': db.get_stats_by_type(),
            'by_month_and_type': db.get_stats_by_month_and_type()
        }
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': 'Error al obtener estadísticas', 'details': str(e)}), 500

@app.route('/api/notas/evaluar', methods=['POST'])
def api_evaluar_aviso():
    """Recibe la nota de 1 a 7 asíncronamente, la guarda y devuelve el nuevo promedio."""
    session = SessionLocal()
    try:
        data = request.get_json()
        aviso_id = data.get('aviso_id')
        nota_valor = data.get('nota')
        
        # 1. Validación del lado del servidor (entero entre 1 y 7)
        if not (isinstance(nota_valor, int) and 1 <= nota_valor <= 7):
            return jsonify({'success': False, 'message': 'La nota debe ser un número entero entre 1 y 7.'}), 400

        aviso = session.query(AvisoAdopcion).get(aviso_id)
        if not aviso:
            return jsonify({'success': False, 'message': 'Aviso de adopción no encontrado.'}), 404

        # 2. Guardar la Nota
        nueva_nota = Nota(aviso_id=aviso_id, nota=nota_valor)
        session.add(nueva_nota)
        session.commit()

        # 3. Recalcular Promedio
        # Accedemos al promedio usando la propiedad híbrida que ya actualizó la BD.
        nuevo_promedio = aviso.nota_promedio
        
        # Formato de salida para JS (redondeado a un decimal)
        promedio_str = str(nuevo_promedio) if nuevo_promedio is not None else '-'

        # 4. Devolver respuesta JSON
        return jsonify({
            'success': True,
            'nuevo_promedio': promedio_str
        }), 200

    except Exception as e:
        session.rollback()
        print(f"Error al evaluar: {e}")
        return jsonify({'success': False, 'message': 'Error interno del servidor al guardar la nota.'}), 500
    finally:
        session.close()

if __name__ == "__main__":
    app.run(debug=True)