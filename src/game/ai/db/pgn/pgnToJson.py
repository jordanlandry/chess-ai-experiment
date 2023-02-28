import json


def main():
    path = "Carlsen"
    moves = pgn_to_json(f'{path}.pgn')
    add_to_json(moves, f"{path}.json")

def add_to_json(moves, json_file):
    with open(json_file, 'w') as f:
        f.write(moves)

def pgn_to_json(pgn_file):
    with open(pgn_file) as f:
        pgn = f.read()

    games = []
    game = {}

    for line in pgn.splitlines():
        if line.startswith('['):
            key, value = line[1:-1].split(' ', 1)
            game[key] = value.strip('"')
        elif line.strip() == '':
            games.append(game)
            game = {}
        else:
            game_moves = game.get('moves', '')
            game['moves'] = f'{game_moves} {line}'

    # Add the last game to the list
    games.append(game)

    # Convert the list of games to JSON format
    json_data = json.dumps(games)

    return json_data


if __name__ == "__main__":
    main()