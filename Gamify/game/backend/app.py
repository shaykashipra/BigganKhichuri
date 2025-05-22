import eventlet
eventlet.monkey_patch() 

from flask import Flask
from flask_socketio import SocketIO
import eventlet
from socket_events import register_socket_events




app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret-key-for-dev'
socketio = SocketIO(app, cors_allowed_origins="*")

register_socket_events(socketio)

if __name__ == '__main__':
    print("✅ Flask-SocketIO server running on http://localhost:5000")
    socketio.run(app, host='0.0.0.0', port=5000)
