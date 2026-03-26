from flask import Flask, jsonify, request
from flask_cors import CORS
import uart_simulator
import i2c_simulator
import spi_simulator

app = Flask(__name__)
CORS(app)

@app.route('/api/protocols', methods=['GET'])
def get_protocols():
    return jsonify([
        {"id": 1, "name": "UART", "description": "Universal Asynchronous Receiver Transmitter"},
        {"id": 2, "name": "I2C", "description": "Inter-Integrated Circuit"},
        {"id": 3, "name": "SPI", "description": "Serial Peripheral Interface"}
    ])

# BURAYA methods=['POST'] EKLENDİ
@app.route('/api/uart/simulate', methods=['POST'])
def simulate_uart():
    data = request.json
    text = data.get('text', 'Hi')
    baud_rate = data.get('baud_rate', 9600)
    parity = data.get('parity', 'none')
    stop_bits = data.get('stop_bits', 1)
    error_type = data.get('error', None)
    
    frames = uart_simulator.simulate_uart(text, baud_rate, parity, stop_bits, error_type)
    return jsonify({'frames': frames})

# BURAYA methods=['POST'] EKLENDİ
@app.route('/api/i2c/simulate', methods=['POST'])
def simulate_i2c():
    data = request.json
    text = data.get('text', 'Hi')
    
    frames = i2c_simulator.simulate_i2c(text)
    return jsonify({'frames': frames})

# BURAYA methods=['POST'] EKLENDİ
@app.route('/api/spi/simulate', methods=['POST'])
def simulate_spi():
    data = request.json
    text = data.get('text', 'Hi')
    
    frames = spi_simulator.simulate_spi(text)
    return jsonify({'frames': frames})

if __name__ == '__main__':
    app.run(debug=True, port=5000)