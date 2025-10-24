from sqlalchemy import create_engine, Column, Integer, String, DateTime, Text, Enum, ForeignKey
from sqlalchemy.orm import sessionmaker, declarative_base, relationship
from datetime import datetime
from sqlalchemy import func, extract, desc, case

# Configuración de la base de datos
DB_NAME = "tarea2"
DB_USERNAME = "cc5002"
DB_PASSWORD = "programacionweb" 
DB_HOST = "localhost"
DB_PORT = 3306

DATABASE_URL = f"mysql+pymysql://{DB_USERNAME}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

engine = create_engine(DATABASE_URL, echo=False, future=True)
SessionLocal = sessionmaker(bind=engine)

Base = declarative_base()

# --- Modelos ---

class Region(Base):
    __tablename__ = 'region'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(200), nullable=False)
    
    comunas = relationship("Comuna", back_populates="region")


class Comuna(Base):
    __tablename__ = 'comuna'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(200), nullable=False)
    region_id = Column(Integer, ForeignKey('region.id'), nullable=False)
    
    region = relationship("Region", back_populates="comunas")
    avisos = relationship("AvisoAdopcion", back_populates="comuna")


class AvisoAdopcion(Base):
    __tablename__ = 'aviso_adopcion'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    fecha_ingreso = Column(DateTime, nullable=False, default=datetime.now)
    comuna_id = Column(Integer, ForeignKey('comuna.id'), nullable=False)
    sector = Column(String(100))
    nombre = Column(String(200), nullable=False)
    email = Column(String(100), nullable=False)
    celular = Column(String(15))
    tipo = Column(Enum('gato', 'perro'), nullable=False)
    cantidad = Column(Integer, nullable=False)
    edad = Column(Integer, nullable=False)
    unidad_medida = Column(Enum('a', 'm'), nullable=False)
    fecha_entrega = Column(DateTime, nullable=False)
    descripcion = Column(Text)
    
    comuna = relationship("Comuna", back_populates="avisos")
    fotos = relationship("Foto", back_populates="aviso", cascade="all, delete-orphan")
    contactos = relationship("ContactarPor", back_populates="aviso", cascade="all, delete-orphan")


class Foto(Base):
    __tablename__ = 'foto'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    ruta_archivo = Column(String(300), nullable=False)
    nombre_archivo = Column(String(300), nullable=False)
    actividad_id = Column(Integer, ForeignKey('aviso_adopcion.id'), nullable=False)
    
    aviso = relationship("AvisoAdopcion", back_populates="fotos")


class ContactarPor(Base):
    __tablename__ = 'contactar_por'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(Enum('whatsapp', 'telegram', 'X', 'instagram', 'tiktok', 'otra'), nullable=False)
    identificador = Column(String(150), nullable=False)
    actividad_id = Column(Integer, ForeignKey('aviso_adopcion.id'), nullable=False)
    
    aviso = relationship("AvisoAdopcion", back_populates="contactos")

class Comentario(Base):
    __tablename__ = 'comentario'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(80), nullable=False)
    texto = Column(String(300), nullable=False)
    fecha = Column(DateTime, nullable=False, default=datetime.now)
    aviso_id = Column(Integer, ForeignKey('aviso_adopcion.id'), nullable=False)
    
    aviso = relationship("AvisoAdopcion", back_populates="comentarios")

    # Actualizar el modelo AvisoAdopcion para incluir la relación 'comentarios'
AvisoAdopcion.comentarios = relationship("Comentario", back_populates="aviso", cascade="all, delete-orphan")

# --- Funciones de Base de Datos ---

def get_all_regions():
    """Obtiene todas las regiones"""
    session = SessionLocal()
    try:
        regiones = session.query(Region).order_by(Region.nombre).all()
        result = [{"id": r.id, "nombre": r.nombre} for r in regiones]
        return result
    finally:
        session.close()


def get_comunas_by_region(region_id):
    """Obtiene comunas de una región específica"""
    session = SessionLocal()
    try:
        comunas = session.query(Comuna).filter_by(region_id=region_id).order_by(Comuna.nombre).all()
        result = [{"id": c.id, "nombre": c.nombre} for c in comunas]
        return result
    finally:
        session.close()


def get_comuna_by_id(comuna_id):
    """Obtiene una comuna por ID"""
    session = SessionLocal()
    comuna = session.query(Comuna).filter_by(id=comuna_id).first()
    session.close()
    return comuna


def create_aviso(data, fotos_list, contactos_list):
    """
    Crea un nuevo aviso de adopción con sus fotos y contactos
    """
    session = SessionLocal()
    try:
        # Crear aviso
        nuevo_aviso = AvisoAdopcion(
            fecha_ingreso=data['fecha_ingreso'],
            comuna_id=data['comuna_id'],
            sector=data.get('sector', ''),
            nombre=data['nombre'],
            email=data['email'],
            celular=data.get('celular', ''),
            tipo=data['tipo'],
            cantidad=data['cantidad'],
            edad=data['edad'],
            unidad_medida=data['unidad_medida'],
            fecha_entrega=data['fecha_entrega'],
            descripcion=data.get('descripcion', '')
        )
        
        session.add(nuevo_aviso)
        session.flush()  # Para obtener el ID
        
        # Agregar fotos
        for foto_data in fotos_list:
            nueva_foto = Foto(
                ruta_archivo=foto_data['ruta_archivo'],
                nombre_archivo=foto_data['nombre_archivo'],
                actividad_id=nuevo_aviso.id
            )
            session.add(nueva_foto)
        
        # Agregar contactos
        for contacto_data in contactos_list:
            nuevo_contacto = ContactarPor(
                nombre=contacto_data['nombre'],
                identificador=contacto_data['identificador'],
                actividad_id=nuevo_aviso.id
            )
            session.add(nuevo_contacto)
        
        session.commit()
        aviso_id = nuevo_aviso.id
        session.close()
        return True, aviso_id, None
        
    except Exception as e:
        session.rollback()
        session.close()
        return False, None, str(e)


def get_ultimos_avisos(limit=5):
    """Obtiene los últimos avisos ordenados por fecha"""
    session = SessionLocal()
    avisos = session.query(AvisoAdopcion).order_by(AvisoAdopcion.fecha_ingreso.desc()).limit(limit).all()
    
    result = []
    for aviso in avisos:
        foto_principal = aviso.fotos[0].nombre_archivo if aviso.fotos else 'default.jpg'
        result.append({
            'id': aviso.id,
            'fecha_ingreso': aviso.fecha_ingreso,
            'fecha_publicacion': aviso.fecha_ingreso.strftime('%Y-%m-%d %H:%M'),
            'comuna': aviso.comuna.nombre,
            'sector': aviso.sector,
            'cantidad': aviso.cantidad,
            'tipo': aviso.tipo,
            'edad': aviso.edad,
            'unidad_medida': aviso.unidad_medida,
            'edad_formato': f"{aviso.edad} {'año(s)' if aviso.unidad_medida == 'a' else 'mes(es)'}",
            'foto': foto_principal
        })
    
    session.close()
    return result


def get_all_avisos():
    """Obtiene todos los avisos con información completa"""
    session = SessionLocal()
    try:
        avisos = session.query(AvisoAdopcion).order_by(AvisoAdopcion.fecha_ingreso.desc()).all()
        
        result = []
        for aviso in avisos:
            foto_principal = aviso.fotos[0].nombre_archivo if aviso.fotos else 'default.jpg'
            contacto_preferido = ""
            
            if aviso.contactos:
                c = aviso.contactos[0]
                contacto_preferido = f"{c.nombre.title()}: {c.identificador}"
            elif aviso.celular:
                contacto_preferido = f"Tel: {aviso.celular}"
            else:
                contacto_preferido = f"Email: {aviso.email}"
            
            result.append({
                'id': aviso.id,
                'fecha_ingreso': aviso.fecha_ingreso,
                'fecha_publicacion': aviso.fecha_ingreso.strftime('%Y-%m-%d<br>%H:%M'),
                'fecha_entrega': aviso.fecha_entrega,
                'fecha_entrega_formato': aviso.fecha_entrega.strftime('%Y-%m-%d<br>%H:%M'),
                'comuna': aviso.comuna.nombre,
                'region': aviso.comuna.region.nombre,
                'sector': aviso.sector,
                'cantidad': aviso.cantidad,
                'tipo': aviso.tipo,
                'edad': aviso.edad,
                'unidad_medida': aviso.unidad_medida,
                'edad_formato': f"{aviso.edad} {'año(s)' if aviso.unidad_medida == 'a' else 'mes(es)'}",
                'nombre_contacto': aviso.nombre,
                'celular': aviso.celular,
                'email': aviso.email,
                'foto': foto_principal,
                'contacto_preferido': contacto_preferido
            })
        
        return result
    finally:
        session.close()


def get_avisos_paginados(page=1, per_page=5):
    """
    Obtiene avisos paginados
    """
    session = SessionLocal()
    try:
        # Contar total de avisos
        total = session.query(AvisoAdopcion).count()
        
        # Calcular offset
        offset = (page - 1) * per_page
        
        # Obtener avisos de la página actual
        avisos_query = session.query(AvisoAdopcion)\
            .order_by(AvisoAdopcion.fecha_ingreso.desc())\
            .limit(per_page)\
            .offset(offset)\
            .all()
        
        # Formatear avisos
        avisos = []
        for aviso in avisos_query:
            foto_principal = aviso.fotos[0].nombre_archivo if aviso.fotos else 'default.jpg'
            contacto_preferido = ""
            
            if aviso.contactos:
                c = aviso.contactos[0]
                contacto_preferido = f"{c.nombre.title()}: {c.identificador}"
            elif aviso.celular:
                contacto_preferido = f"Tel: {aviso.celular}"
            else:
                contacto_preferido = f"Email: {aviso.email}"
            
            avisos.append({
                'id': aviso.id,
                'fecha_ingreso': aviso.fecha_ingreso,
                'fecha_publicacion': aviso.fecha_ingreso.strftime('%Y-%m-%d<br>%H:%M'),
                'fecha_entrega': aviso.fecha_entrega,
                'fecha_entrega_formato': aviso.fecha_entrega.strftime('%Y-%m-%d<br>%H:%M'),
                'comuna': aviso.comuna.nombre,
                'region': aviso.comuna.region.nombre,
                'sector': aviso.sector,
                'cantidad': aviso.cantidad,
                'tipo': aviso.tipo,
                'edad': aviso.edad,
                'unidad_medida': aviso.unidad_medida,
                'edad_formato': f"{aviso.edad} {'año(s)' if aviso.unidad_medida == 'a' else 'mes(es)'}",
                'nombre_contacto': aviso.nombre,
                'celular': aviso.celular,
                'email': aviso.email,
                'foto': foto_principal,
                'contacto_preferido': contacto_preferido
            })
        
        # Calcular páginas totales
        total_pages = (total + per_page - 1) // per_page if total > 0 else 1
        
        return {
            'avisos': avisos,
            'total': total,
            'total_pages': total_pages,
            'current_page': page,
            'per_page': per_page,
            'has_prev': page > 1,
            'has_next': page < total_pages
        }
    finally:
        session.close()


def get_aviso_by_id(aviso_id):
    """Obtiene un aviso específico con todos sus detalles"""
    session = SessionLocal()
    aviso = session.query(AvisoAdopcion).filter_by(id=aviso_id).first()
    
    if not aviso:
        session.close()
        return None
    
    # Organizar fotos
    fotos = [foto.nombre_archivo for foto in aviso.fotos]
    foto_principal = fotos[0] if fotos else 'default.jpg'
    
    # Organizar contactos
    contacto_dict = {
        'nombre': aviso.nombre,
        'telefono': aviso.celular,
        'correo': aviso.email,
        'instagram': None,
        'telegram': None,
        'whatsapp': None,
        'x': None,
        'tiktok': None,
        'otra': None
    }
    
    for c in aviso.contactos:
        contacto_dict[c.nombre] = c.identificador
    
    result = {
        'id': aviso.id,
        'fecha_ingreso': aviso.fecha_ingreso,
        'fecha_publicacion': aviso.fecha_ingreso.strftime('%Y-%m-%d %H:%M'),
        'fecha_entrega': aviso.fecha_entrega,
        'fecha_entrega_formato': aviso.fecha_entrega.strftime('%Y-%m-%d %H:%M'),
        'comuna': aviso.comuna.nombre,
        'region': aviso.comuna.region.nombre,
        'sector': aviso.sector,
        'cantidad': aviso.cantidad,
        'tipo': aviso.tipo,
        'edad': aviso.edad,
        'unidad_medida': aviso.unidad_medida,
        'edad_formato': f"{aviso.edad} {'año(s)' if aviso.unidad_medida == 'a' else 'mes(es)'}",
        'descripcion': aviso.descripcion,
        'fotos': fotos,
        'foto_principal': foto_principal,
        'contacto': contacto_dict
    }
    
    session.close()
    return result

def create_comentario(nombre, texto, aviso_id):
    """Inserta un nuevo comentario en la base de datos."""
    session = SessionLocal()
    try:
        nuevo_comentario = Comentario(
            nombre=nombre,
            texto=texto,
            aviso_id=aviso_id,
            fecha=datetime.now()
        )
        session.add(nuevo_comentario)
        session.commit()
        return True, None
    except Exception as e:
        session.rollback()
        return False, str(e)
    finally:
        session.close()


def get_comentarios_by_aviso(aviso_id):
    """Obtiene todos los comentarios para un aviso específico, ordenados por fecha."""
    session = SessionLocal()
    try:
        comentarios = session.query(Comentario).filter_by(aviso_id=aviso_id).order_by(Comentario.fecha.asc()).all()
        result = [{
            'id': c.id,
            'nombre': c.nombre,
            'texto': c.texto,
            'fecha': c.fecha
        } for c in comentarios]
        return result
    finally:
        session.close()

def get_stats_by_day():
    """Gráfico de Líneas: Cantidad de avisos de adopción por día."""
    session = SessionLocal()
    try:
        # Agrupa por la fecha de ingreso (solo el día) y cuenta
        stats = session.query(
            func.date(AvisoAdopcion.fecha_ingreso).label('dia'),
            func.sum(AvisoAdopcion.cantidad).label('count') # Suma la cantidad, no solo el aviso
        ).group_by('dia').order_by('dia').all()
        
        # Formato de salida: [{'dia': 'YYYY-MM-DD', 'count': N}]
        return [{'dia': row.dia.strftime('%Y-%m-%d'), 'count': row.count} for row in stats]
    finally:
        session.close()


def get_stats_by_type():
    """Gráfico de Torta: Total de avisos de adopción por tipo (perro/gato)."""
    session = SessionLocal()
    try:
        # Agrupa por tipo y suma la cantidad de mascotas
        stats = session.query(
            AvisoAdopcion.tipo,
            func.sum(AvisoAdopcion.cantidad).label('total')
        ).group_by(AvisoAdopcion.tipo).all()
        
        # Formato de salida: [{'tipo': 'gato', 'total': N}, ...]
        return [{'tipo': row.tipo, 'total': row.total} for row in stats]
    finally:
        session.close()


def get_stats_by_month_and_type():
    """Gráfico de Barras: Cantidad de perros vs gatos por mes."""
    session = SessionLocal()
    try:
        # Agrupa por año y mes
        stats = session.query(
            extract('year', AvisoAdopcion.fecha_ingreso).label('year'),
            extract('month', AvisoAdopcion.fecha_ingreso).label('month'),
            func.sum(case((AvisoAdopcion.tipo == 'perro', AvisoAdopcion.cantidad), else_=0)).label('perros'),
            func.sum(case((AvisoAdopcion.tipo == 'gato', AvisoAdopcion.cantidad), else_=0)).label('gatos')
        ).group_by('year', 'month').order_by('year', 'month').all()

        # Formato de salida: [{'month_label': 'YYYY-MM', 'perros': N, 'gatos': M}, ...]
        result = []
        for row in stats:
            # Crea una etiqueta de mes legible (ej: 2025-10)
            month_label = f"{int(row.year)}-{int(row.month):02d}"
            result.append({
                'month_label': month_label,
                'perros': row.perros,
                'gatos': row.gatos
            })
        return result
    finally:
        session.close()