from flask import Flask, render_template, send_from_directory, jsonify, request
import webbrowser
import json
import os
import subprocess

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/data')
def data():
    try:
        if not os.path.isfile('output.json'):
            return jsonify({})
        with open('output.json', encoding='utf-8') as f:
            data = json.load(f)
        return jsonify(data)
    except Exception:
        return jsonify({})

@app.route('/static/<path:filename>')
def static_files(filename):
    return send_from_directory('static', filename)

@app.route('/run-main', methods=['POST'])
def run_main():
    try:
        result = subprocess.run(['python', 'main.py'], capture_output=True, text=True, timeout=300)
        if result.returncode == 0:
            return jsonify({"status": "ok"})
        else:
            print("main.py error:", result.stderr)
            return jsonify({"status": "error", "output": result.stderr}), 500
    except Exception as e:
        return jsonify({"status": "error", "output": str(e)}), 500

if __name__ == '__main__':
    webbrowser.open("http://127.0.0.1:5000/")
    app.run(debug=False)