import json
from flask import Flask, jsonify, abort

app = Flask(__name__)

def carregar_carros():
    try:
        with open('db.json', 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        return []

@app.route('/api/carros', methods=['GET'])
def get_carros():
    carros = carregar_carros()
    return jsonify(carros)

@app.route('/api/carros/<int:carro_id>', methods=['GET'])
def get_carro(carro_id):
    carros = carregar_carros()
    carro = next((carro for carro in carros if carro['id'] == carro_id), None)
    if carro is None:
        abort(404, description="Carro não encontrado")
    return jsonify(carro)

if __name__ == '__main__':
    app.run(debug=True)
