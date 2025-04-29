from flask import Flask, jsonify, request
from flask_cors import CORS
import psycopg2
import json
from dotenv import load_dotenv
import os

# 載入 .env 檔案中的環境變數
load_dotenv()

# 從環境變數中取得資料庫連線資訊
USER = os.getenv("user")
PASSWORD = os.getenv("password")
HOST = os.getenv("host")
PORT = os.getenv("port")
DBNAME = os.getenv("dbname")

# 建立 Flask 應用程式實例
app = Flask(__name__)
CORS(app)

# 建立資料庫連線
conn = psycopg2.connect(
    user=USER,
    password=PASSWORD,
    host=HOST,
    port=PORT,
    dbname=DBNAME,
    sslmode='require'  # Supabase 要求 SSL 連線
)

@app.route('/points', methods=['GET'])
def get_points():
    cursor = conn.cursor()
    cursor.execute('SELECT points FROM users WHERE id = 1')
    row = cursor.fetchone()
    cursor.close()
    if row:
        return jsonify(row[0])
    else:
        return jsonify([])

@app.route('/points', methods=['POST'])
def update_points():
    new_points = request.json.get('points')
    cursor = conn.cursor()
    cursor.execute('UPDATE users SET points = %s WHERE id = 1', (json.dumps(new_points),))
    conn.commit()
    cursor.close()
    return jsonify({'message': 'Points updated!'})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True)