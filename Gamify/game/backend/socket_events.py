from flask import request
from flask_socketio import emit, join_room
from game_logic import generate_question, check_answer

players = {}  # {sid: {username, score, current_question}}

def register_socket_events(socketio):
    @socketio.on('connect')
    def on_connect(auth):
        print(f"🔌 Client connected: {str(request.sid)}")

    @socketio.on('join')
    def on_join(data):
        username = data.get('username')
        sid = request.sid
        players[sid] = {'username': username, 'score': 0}
        join_room("game")
        print(f"🎮 {username} joined the game.")
        emit('player_joined', {'username': username}, room="game")

    @socketio.on('request_question')
    def on_request_question():
        question = generate_question()
        players[request.sid]['current_question'] = question
        emit('new_question', question)

    @socketio.on('submit_answer')
    def on_submit_answer(data):
        user = players.get(request.sid)
        if not user:
            return
        answer = data.get('answer')
        correct = check_answer(user['current_question'], answer)
        if correct:
            user['score'] += 1
            emit('answer_result', {'correct': True, 'score': user['score']})
        else:
            emit('answer_result', {'correct': False, 'score': user['score']})

    @socketio.on('disconnect')
    def on_disconnect():
        user = players.pop(request.sid, None)
        if user:
            print(f"❌ {user['username']} disconnected.")
            emit('player_left', {'username': user['username']}, room="game")
