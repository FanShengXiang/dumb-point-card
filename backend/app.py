
from flask import Flask, jsonify, request
from flask_cors import CORS
import psycopg2
import json
from dotenv import load_dotenv
import os

# 載入環境變數
load_dotenv()

USER = os.getenv("user")
PASSWORD = os.getenv("password")
HOST = os.getenv("host")
PORT = os.getenv("port")
DBNAME = os.getenv("dbname")

def get_connection():
    """每次需要時才建立新的資料庫連線"""
    return psycopg2.connect(
        user=USER,
        password=PASSWORD,
        host=HOST,
        port=PORT,
        dbname=DBNAME,
        sslmode='require'
    )

app = Flask(__name__)
CORS(app)



### =========================
### 集點卡A API
### =========================

@app.route('/pointsA', methods=['GET'])
def get_pointsA():
    conn = get_connection() 
    cursor = conn.cursor()
    cursor.execute('SELECT points_a FROM users WHERE id = 1')
    row = cursor.fetchone()
    cursor.close()
    if row and row[0]:
        return jsonify(row[0])
    else:
        return jsonify([])

@app.route('/pointsA', methods=['POST'])
def update_pointsA():
    conn = get_connection() 
    new_points = request.json.get('points')
    cursor = conn.cursor()
    cursor.execute('UPDATE users SET points_a = %s WHERE id = 1', (json.dumps(new_points),))
    conn.commit()
    cursor.close()
    return jsonify({'message': 'PointsA updated!'})

### =========================
### 集點卡B API
### =========================

@app.route('/pointsB', methods=['GET'])
def get_pointsB():
    conn = get_connection() 
    cursor = conn.cursor()
    cursor.execute('SELECT points_b FROM users WHERE id = 1')
    row = cursor.fetchone()
    cursor.close()
    if row and row[0]:
        return jsonify(row[0])
    else:
        return jsonify([])

@app.route('/pointsB', methods=['POST'])
def update_pointsB():
    conn = get_connection() 
    new_points = request.json.get('points')
    cursor = conn.cursor()
    cursor.execute('UPDATE users SET points_b = %s WHERE id = 1', (json.dumps(new_points),))
    conn.commit()
    cursor.close()
    return jsonify({'message': 'PointsB updated!'})

### =========================
### Server啟動
### =========================

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)