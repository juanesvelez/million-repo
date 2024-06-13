from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/')
def home():
    return jsonify({"message": "¡Hola, mundo!"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80)