from flask import Flask, jsonify, request
from flask_cors import CORS
from uart_simulator import text_to_uart_frames, simulate_uart_error
from i2c_simulator import text_to_i2c_frames, simulate_i2c_error
# YENİ EKLENEN IMPORT:
from spi_simulator import text_to_spi_frames

app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return jsonify({"message": "Protocol Simulator Backend çalışıyor!"})

@app.route('/api/protocols')
def get_protocols():
    protocols = [
        {"id": 1, "name": "UART", "description": "Universal Asynchronous Receiver Transmitter"},
        {"id": 2, "name": "I2C",  "description": "Inter-Integrated Circuit"},
        {"id": 3, "name": "SPI",  "description": "Serial Peripheral Interface"} # YENİ EKLENDİ
    ]
    return jsonify(protocols)

@app.route('/api/uart/simulate', methods=['POSpT'])
def uart_simulate():
    data = request.get_json()
    text      = data.get("text", "Hello")
    baud_rate = data.get("baud_rate", 9600)
    parity    = data.get("parity", "none")
    stop_bits = data.get("stop_bits", 1)
    error     = data.get("error", None)
    
    frames = text_to_uart_frames(text, baud_rate, parity, stop_bits)
    if error:
        frames = simulate_uart_error(frames, error)
    return jsonify({"frames": frames})

@app.route('/api/i2c/simulate', methods=['POST'])
def i2c_simulate():
    data = request.get_json()
    text    = data.get("text", "Hi")
    address = data.get("address", 0x50)
    error   = data.get("error", None)
    
    frames = text_to_i2c_frames(text, address)
    if error:
        frames = simulate_i2c_error(frames, error)
    return jsonify({"frames": frames})

# YENİ EKLENEN SPI ROUTE'U:
@app.route('/api/spi/simulate', methods=['POST'])
def spi_simulate():
    data = request.get_json()
    text = data.get("text", "Hi")
    # SPI şimdilik temel ayarda çalışıyor, hata simülasyonu opsiyonel eklenebilir.
    frames = text_to_spi_frames(text)
    return jsonify({"frames": frames})

if __name__ == '__main__':
    app.run(debug=True, port=5000)