from flask import Flask

app = Flask(__name__)

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route("/mem")
def hello_cloud():
    return "<p>Hello, Cloud</p>"