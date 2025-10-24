import re
import filetype
from datetime import datetime



def validate_text(text, min_length, max_length):
    """Valida que un texto tenga longitud entre min y max"""
    if not text:
        return False
    text = text.strip()
    return min_length <= len(text) <= max_length


def validate_email(email):
    """Valida formato y longitud de email"""
    if not email:
        return False
    
    # Longitud mínima 15, máxima 100
    if not (15 < len(email) <= 100):
        return False
    
    # Formato: usuario@dominio.ext
    pattern = r'^[\w.]+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$'
    return bool(re.match(pattern, email))


def validate_phone(phone):
    """Valida formato de teléfono chileno: +569 XXXXXXXX"""
    if not phone:
        return True  # Opcional
    
    phone = phone.strip()
    # Formato: +569 seguido de 8 dígitos (puede tener espacios)
    pattern = r'^\+569.(?:\s?\d){8}$'
    return bool(re.match(pattern, phone))


def validate_select(value):
    """Valida que un select tenga valor"""
    return bool(value)


def validate_number(value, min_val, max_val):
    """Valida que un número esté en rango y sea entero"""
    if not value:
        return False
    try:
        num = int(value)
        return min_val <= num <= max_val and num == float(value)
    except (ValueError, TypeError):
        return False


def validate_fecha_futura(fecha_str):
    """Valida que una fecha sea futura"""
    if not fecha_str:
        return False
    
    try:
        fecha = datetime.strptime(fecha_str, '%Y-%m-%dT%H:%M')
        ahora = datetime.now()
        return fecha > ahora
    except ValueError:
        return False


def validate_contactos(contactos_seleccionados, form_data):
    """
    Valida que cada medio de contacto seleccionado tenga su identificador
    """
    if not contactos_seleccionados:
        return False
    
    for contacto in contactos_seleccionados:
        field_name = f'contacto-{contacto}'
        identificador = form_data.get(field_name, '').strip()
        
        # Validar que tenga contenido y longitud adecuada
        if not identificador or not (4 <= len(identificador) <= 50):
            return False
    
    return True


def validate_aviso_form(form_data, files):
    """
    Valida todos los campos del formulario de aviso
    """
    errors = []
    
    # Ubicación
    if not validate_select(form_data.get('select-region')):
        errors.append("Debe seleccionar una región")
    
    if not validate_select(form_data.get('select-comuna')):
        errors.append("Debe seleccionar una comuna")
    
    sector = form_data.get('sector', '')
    if sector and not validate_text(sector, 0, 100):
        errors.append("El sector debe tener máximo 100 caracteres")
    
    # Contacto
    if not validate_text(form_data.get('nombre', ''), 3, 200):
        errors.append("El nombre debe tener entre 3 y 200 caracteres")
    
    if not validate_email(form_data.get('email', '')):
        errors.append("Email inválido (debe tener más de 15 caracteres y formato válido)")
    
    if not validate_phone(form_data.get('phone', '')):
        errors.append("Teléfono inválido (formato: +569 XXXXXXXX)")
    
    # Validar contactos múltiples
    contactos_seleccionados = form_data.getlist('select-contacto')
    if not validate_contactos(contactos_seleccionados, form_data):
        errors.append("Debe seleccionar al menos un medio de contacto y completar sus datos")
    
    # Mascota
    if not validate_select(form_data.get('select-tipo')):
        errors.append("Debe seleccionar el tipo de mascota")
    
    if not validate_number(form_data.get('cantidad', ''), 1, 99):
        errors.append("La cantidad debe ser entre 1 y 99")
    
    if not validate_number(form_data.get('edad', ''), 1, 100):
        errors.append("La edad debe ser entre 1 y 100")
    
    if not validate_select(form_data.get('select-edad')):
        errors.append("Debe seleccionar la unidad de medida de la edad")
    
    if not validate_text(form_data.get('descripcion', ''), 10, 500):
        errors.append("La descripción debe tener entre 10 y 500 caracteres")
    
    if not validate_fecha_futura(form_data.get('entrega', '')):
        errors.append("La fecha de entrega debe ser futura")
    
    # Fotos
    
    for i in range(1, 6):
        foto = files.get(f'foto{i}')

    is_valid = len(errors) == 0
    return is_valid, errors