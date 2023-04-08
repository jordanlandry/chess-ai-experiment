from stockfish import Stockfish

def generateOpenings():

    stockfish = Stockfish("stockfish_13_win_x64_avx2\stockfish_13_win_x64_avx2.exe")
    stockfish.set_depth(20)

    openings = []

    print("Generating openings...")
    for i in range(1000):
        stockfish.set_fen_position("startpos")
        stockfish.set_position(openings)
        move = stockfish.get_best_move()
        openings.append(move)
        print(f"Opening {i+1} generated: {move}")

    print("Openings generated!")

    return openings

generateOpenings()