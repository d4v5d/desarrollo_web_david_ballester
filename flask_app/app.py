from flask import Flask, request, render_template, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from database import db
from werkzeug.utils import secure_filename
import filetype
import os

UPLOAD_FOLDER = 'static/IMG'

app = Flask(__name__)


app.secret_key = "s3cr3t_k3y"
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

