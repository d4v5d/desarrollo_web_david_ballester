from db import Base, engine

if __name__ == "__main__":
    print("Creando tablas en la base de datos.")
    Base.metadata.create_all(engine)