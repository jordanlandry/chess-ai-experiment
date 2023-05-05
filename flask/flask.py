from stockfish import Stockfish
from flask import Flask, jsonify

stockfish = Stockfish(path="stockfish-windows-2022-x86-64-avx2.exe", depth=18, parameters={"Threads": 4, "Minimum Thinking Time": 30})

app = Flask(__name__)

# Test for using stockfish to evaluate the position and move
@app.route('/get_best_move')
def get_best_move():
    stockfish.set_fen_position("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR")
    return jsonify(stockfish.get_best_move())


if __name__ == '__main__':
    app.run()

