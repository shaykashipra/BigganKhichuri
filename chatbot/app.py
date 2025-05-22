from flask import Flask,render_template,request,jsonify
from flask_cors import CORS
import requests
import os

# from chat import get_response

CHANNEL_TOKEN = os.getenv('CHANNEL_TOKEN', 'your_channel_token_here')
API_KEY = os.getenv('API_KEY', 'M2HzTIkO.uv2ZsrGjA5wnlS7ju8hzHwTBfiNupRJO')

url = f'https://payload.vextapp.com/hook/5HPVT0VC2C/catch/$(hamim90000)'

headers = {
    'Content-Type': 'application/json',
    'ApiKey': f'Api-Key {API_KEY}'
}

app = Flask(__name__)
CORS(app)

@app.get("/")
def index_get():
    return render_template("base.html")

@app.post("/predict")
def predict():
    text = request.get_json().get("message")
    #check errors

    data = {
    "payload": text,
    "env": "dev"
    }

    # response= get_response(text)
    response = requests.post(url, headers=headers, json=data)
    response=response.json()
    print("Response:", response["text"])
    message={"answer":response["text"]}

    return jsonify(message)

if __name__ =="__main__":
    app.run(debug=True)