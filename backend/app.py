from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///finanzas.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
CORS(app)  # Permite solicitudes desde React (localhost:3000)

class Transaccion(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    tipo = db.Column(db.String(10), nullable=False)  # 'ingreso' o 'gasto'
    categoria = db.Column(db.String(50), nullable=False)
    monto = db.Column(db.Float, nullable=False)
    descripcion = db.Column(db.String(200), nullable=True)

    def to_dict(self):
        return {
            'id': self.id,
            'tipo': self.tipo,
            'categoria': self.categoria,
            'monto': self.monto,
            'descripcion': self.descripcion
        }

CATEGORIAS = [
    "Alimentación", "Transporte", "Entretenimiento", "Salud", "Educación",
    "Vivienda", "Inversiones", "Ahorro", "Deudas", "Otros"
]

@app.route('/transacciones', methods=['GET'])
def get_transacciones():
    transacciones = Transaccion.query.all()
    total_ingresos = sum(t.monto for t in transacciones if t.tipo == 'ingreso')
    total_gastos = sum(t.monto for t in transacciones if t.tipo == 'gasto')
    saldo = total_ingresos - total_gastos
    return jsonify({
        'transacciones': [t.to_dict() for t in transacciones],
        'saldo': saldo,
        'total_ingresos': total_ingresos,
        'total_gastos': total_gastos,
        'categorias': CATEGORIAS
    })

@app.route('/transacciones', methods=['POST'])
def agregar_transaccion():
    data = request.get_json()
    tipo = data['tipo']
    categoria = data['categoria']
    monto = float(data['monto'])
    descripcion = data.get('descripcion', '')
    nueva_transaccion = Transaccion(tipo=tipo, categoria=categoria, monto=monto, descripcion=descripcion)
    db.session.add(nueva_transaccion)
    db.session.commit()
    return jsonify({'message': 'Transacción agregada', 'transaccion': nueva_transaccion.to_dict()}), 201

@app.route('/transacciones/<int:id>', methods=['DELETE'])
def eliminar_transaccion(id):
    transaccion = Transaccion.query.get(id)
    if transaccion:
        db.session.delete(transaccion)
        db.session.commit()
        return jsonify({'message': 'Transacción eliminada'}), 200
    return jsonify({'message': 'Transacción no encontrada'}), 404

if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Crea la base de datos si no existe
    app.run(debug=True, port=5000)