fn main() {
    let mut board: [[char; 8]; 8] = [
        ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
        ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
        ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
    ];
    
    let mut white_king_castle: bool = true;
    let mut white_queen_castle: bool = true;
    let mut black_king_castle: bool = true;
    let mut black_queen_castle: bool = true;
    
    let mut white_to_move: bool = true;
    let mut en_passant: u64 = 0x0000000000000000;
    
    let mut white_pawns: u64;
    let mut white_rooks: u64;
    let mut white_knights: u64;
    let mut white_bishops: u64;
    let mut white_queens: u64;
    let mut white_king: u64;

    let mut black_pawns: u64;
    let mut black_rooks: u64;
    let mut black_knights: u64;
    let mut black_bishops: u64;
    let mut black_queens: u64;
    let mut black_king: u64;

    (white_pawns, white_rooks, white_knights, white_bishops, white_queens, white_king, black_pawns, black_rooks, black_knights, black_bishops, black_queens, black_king) = set_bitboard(board);
    let mut white_pieces: u64 = white_pawns | white_rooks | white_knights | white_bishops | white_queens | white_king;
    let mut black_pieces: u64 = black_pawns | black_rooks | black_knights | black_bishops | black_queens | black_king;

    let mut rook_moves = get_rook_moves(0, white_to_move, white_pieces, black_pieces);
    print_bitboard(rook_moves);
}

fn set_bitboard(board: [[char; 8]; 8]) -> (u64, u64, u64, u64, u64, u64, u64, u64, u64, u64, u64, u64) {
    let mut white_pawns: u64 = 0x0000000000000000;
    let mut white_rooks: u64 = 0x0000000000000000;
    let mut white_knights: u64 = 0x0000000000000000;
    let mut white_bishops: u64 = 0x0000000000000000;
    let mut white_queens: u64 = 0x0000000000000000;
    let mut white_king: u64 = 0x0000000000000000;

    let mut black_pawns: u64 = 0x0000000000000000;
    let mut black_rooks: u64 = 0x0000000000000000;
    let mut black_knights: u64 = 0x0000000000000000;
    let mut black_bishops: u64 = 0x0000000000000000;
    let mut black_queens: u64 = 0x0000000000000000;
    let mut black_king: u64 = 0x0000000000000000;

    for i in 0..8 {
        for j in 0..8 {
            match board[i][j] {
                'P' => white_pawns |= 1 << (i * 8 + j),
                'R' => white_rooks |= 1 << (i * 8 + j),
                'N' => white_knights |= 1 << (i * 8 + j),
                'B' => white_bishops |= 1 << (i * 8 + j),
                'Q' => white_queens |= 1 << (i * 8 + j),
                'K' => white_king |= 1 << (i * 8 + j),
                'p' => black_pawns |= 1 << (i * 8 + j),
                'r' => black_rooks |= 1 << (i * 8 + j),
                'n' => black_knights |= 1 << (i * 8 + j),
                'b' => black_bishops |= 1 << (i * 8 + j),
                'q' => black_queens |= 1 << (i * 8 + j),
                'k' => black_king |= 1 << (i * 8 + j),
                _ => (),
            }
        }
    }

    (white_pawns, white_rooks, white_knights, white_bishops, white_queens, white_king, black_pawns, black_rooks, black_knights, black_bishops, black_queens, black_king)
}

fn get_pawn_moves(pawn_pos: usize, white_to_move: bool, white_pieces: u64, black_pieces: u64) -> u64 {
    let mut moves: u64 = 0;

    if white_to_move {
        if pawn_pos > 7 && (white_pieces & (1 << (pawn_pos - 8))) == 0 {
            moves |= 1 << (pawn_pos - 8);
        }
        if pawn_pos > 15 && (white_pieces & (1 << (pawn_pos - 8))) == 0 && (white_pieces & (1 << (pawn_pos - 16))) == 0 {
            moves |= 1 << (pawn_pos - 16);
        }
        if pawn_pos > 7 && pawn_pos % 8 != 0 && (black_pieces & (1 << (pawn_pos - 9))) != 0 {
            moves |= 1 << (pawn_pos - 9);
        }
        if pawn_pos > 7 && pawn_pos % 8 != 7 && (black_pieces & (1 << (pawn_pos - 7))) != 0 {
            moves |= 1 << (pawn_pos - 7);
        }
    } else {
        if pawn_pos < 56 && (black_pieces & (1 << (pawn_pos + 8))) == 0 {
            moves |= 1 << (pawn_pos + 8);
        }
        if pawn_pos < 48 && (black_pieces & (1 << (pawn_pos + 8))) == 0 && (black_pieces & (1 << (pawn_pos + 16))) == 0 {
            moves |= 1 << (pawn_pos + 16);
        }
        if pawn_pos < 56 && pawn_pos % 8 != 0 && (white_pieces & (1 << (pawn_pos + 7))) != 0 {
            moves |= 1 << (pawn_pos + 7);
        }
        if pawn_pos < 56 && pawn_pos % 8 != 7 && (white_pieces & (1 << (pawn_pos + 9))) != 0 {
            moves |= 1 << (pawn_pos + 9);
        }
    }

    moves
}

fn get_rook_moves(rook_pos: usize, white_to_move: bool, white_pieces: u64, black_pieces: u64) -> u64 {
    let mut moves: u64 = 0;

    // up
    let mut i = rook_pos;
    while i % 8 != 0 {
        i -= 1;
        if white_to_move {
            if (white_pieces & (1 << i)) != 0 {
                break;
            }
            if (black_pieces & (1 << i)) != 0 {
                moves |= 1 << i;
                break;
            }
        } else {
            if (black_pieces & (1 << i)) != 0 {
                break;
            }
            if (white_pieces & (1 << i)) != 0 {
                moves |= 1 << i;
                break;
            }
        }
    }

    // down
    i = rook_pos;
    while i % 8 != 7 {
        i += 1;
        if white_to_move {
            if (white_pieces & (1 << i)) != 0 {
                break;
            }
            if (black_pieces & (1 << i)) != 0 {
                moves |= 1 << i;
                break;
            }
        } else {
            if (black_pieces & (1 << i)) != 0 {
                break;
            }
            if (white_pieces & (1 << i)) != 0 {
                moves |= 1 << i;
                break;
            }
        }
    }

    // left
    i = rook_pos;
    while i > 7 {
        i -= 8;
        if white_to_move {
            if (white_pieces & (1 << i)) != 0 {
                break;
            }
            if (black_pieces & (1 << i)) != 0 {
                moves |= 1 << i;
                break;
            }
        } else {
            if (black_pieces & (1 << i)) != 0 {
                break;
            }
            if (white_pieces & (1 << i)) != 0 {
                moves |= 1 << i;
                break;
            }
        }
    }

    // right
    i = rook_pos;
    while i < 56 {
        i += 8;
        if white_to_move {
            if (white_pieces & (1 << i)) != 0 {
                break;
            }
            if (black_pieces & (1 << i)) != 0 {
                moves |= 1 << i;
                break;
            }
        } else {
            if (black_pieces & (1 << i)) != 0 {
                break;
            }
            if (white_pieces & (1 << i)) != 0 {
                moves |= 1 << i;
                break;
            }
        }
    }

    moves
}

fn get_bishop_moves(bishop_pos: usize, white_to_move: bool, white_pieces: u64, black_pieces: u64) -> u64 {
    let mut moves: u64 = 0;

    // up left
    let mut i = bishop_pos;
    while i % 8 != 0 && i > 7 {
        i -= 9;
        if white_to_move {
            if (white_pieces & (1 << i)) != 0 {
                break;
            }
            if (black_pieces & (1 << i)) != 0 {
                moves |= 1 << i;
                break;
            }
        } else {
            if (black_pieces & (1 << i)) != 0 {
                break;
            }
            if (white_pieces & (1 << i)) != 0 {
                moves |= 1 << i;
                break;
            }
        }
    }

    // up right
    i = bishop_pos;
    while i % 8 != 7 && i > 7 {
        i -= 7;
        if white_to_move {
            if (white_pieces & (1 << i)) != 0 {
                break;
            }
            if (black_pieces & (1 << i)) != 0 {
                moves |= 1 << i;
                break;
            }
        } else {
            if (black_pieces & (1 << i)) != 0 {
                break;
            }
            if (white_pieces & (1 << i)) != 0 {
                moves |= 1 << i;
                break;
            }
        }
    }

    // down left
    i = bishop_pos;
    while i % 8 != 0 && i < 56 {
        i += 7;
        if white_to_move {
            if (white_pieces & (1 << i)) != 0 {
                break;
            }
            if (black_pieces & (1 << i)) != 0 {
                moves |= 1 << i;
                break;
            }
        } else {
            if (black_pieces & (1 << i)) != 0 {
                break;
            }
            if (white_pieces & (1 << i)) != 0 {
                moves |= 1 << i;
                break;
            }
        }
    }

    // down right
    i = bishop_pos;
    while i % 8 != 7 && i < 56 {
        i += 9;
        if white_to_move {
            if (white_pieces & (1 << i)) != 0 {
                break;
            }
            if (black_pieces & (1 << i)) != 0 {
                moves |= 1 << i;
                break;
            }
        } else {
            if (black_pieces & (1 << i)) != 0 {
                break;
            }
            if (white_pieces & (1 << i)) != 0 {
                moves |= 1 << i;
                break;
            }
        }
    }

    moves
}

fn get_knight_moves(knight_pos: usize, white_to_move: bool, white_pieces: u64, black_pieces: u64) -> u64 {
    let mut moves: u64 = 0;

    let mut i = knight_pos;
    if i % 8 != 0 && i > 15 {
        i -= 17;
        if white_to_move {
            if (white_pieces & (1 << i)) == 0 {
                moves |= 1 << i;
            }
        } else {
            if (black_pieces & (1 << i)) == 0 {
                moves |= 1 << i;
            }
        }
    }

    i = knight_pos;
    if i % 8 != 7 && i > 15 {
        i -= 15;
        if white_to_move {
            if (white_pieces & (1 << i)) == 0 {
                moves |= 1 << i;
            }
        } else {
            if (black_pieces & (1 << i)) == 0 {
                moves |= 1 << i;
            }
        }
    }

    i = knight_pos;
    if i % 8 != 0 && i < 48 {
        i += 15;
        if white_to_move {
            if (white_pieces & (1 << i)) == 0 {
                moves |= 1 << i;
            }
        } else {
            if (black_pieces & (1 << i)) == 0 {
                moves |= 1 << i;
            }
        }
    }

    i = knight_pos;
    if i % 8 != 7 && i < 48 {
        i += 17;
        if white_to_move {
            if (white_pieces & (1 << i)) == 0 {
                moves |= 1 << i;
            }
        } else {
            if (black_pieces & (1 << i)) == 0 {
                moves |= 1 << i;
            }
        }
    }

    i = knight_pos;
    if i % 8 > 1 && i > 7 {
        i -= 10;
        if white_to_move {
            if (white_pieces & (1 << i)) == 0 {
                moves |= 1 << i;
            }
        } else {
            if (black_pieces & (1 << i)) == 0 {
                moves |= 1 << i;
            }
        }
    }

    i = knight_pos;
    if i % 8 < 6 && i > 7 {
        i -= 6;
        if white_to_move {
            if (white_pieces & (1 << i)) == 0 {
                moves |= 1 << i;
            }
        } else {
            if (black_pieces & (1 << i)) == 0 {
                moves |= 1 << i;
            }
        }
    }

    i = knight_pos;
    if i % 8 > 1 && i < 56 {
        i += 6;
        if white_to_move {
            if (white_pieces & (1 << i)) == 0 {
                moves |= 1 << i;
            }
        } else {
            if (black_pieces & (1 << i)) == 0 {
                moves |= 1 << i;
            }
        }
    }

    i = knight_pos;
    if i % 8 < 6 && i < 56 {
        i += 10;
        if white_to_move {
            if (white_pieces & (1 << i)) == 0 {
                moves |= 1 << i;
            }
        } else {
            if (black_pieces & (1 << i)) == 0 {
                moves |= 1 << i;
            }
        }
    }

    moves
}

fn get_queen_moves(queen_pos: usize, white_to_move: bool, white_pieces: u64, black_pieces: u64) -> u64 {
    let mut moves: u64 = 0;

    // Get rook and bishop moves
    moves |= get_rook_moves(queen_pos, white_to_move, white_pieces, black_pieces);
    moves |= get_bishop_moves(queen_pos, white_to_move, white_pieces, black_pieces);

    moves
}

fn get_king_moves(king_pos: usize, white_to_move: bool, white_pieces: u64, black_pieces: u64) -> u64 {
    let mut moves: u64 = 0;

    let mut i = king_pos;
    if i % 8 != 0 && i > 7 {
        i -= 9;
        if white_to_move {
            if (white_pieces & (1 << i)) == 0 {
                moves |= 1 << i;
            }
        } else {
            if (black_pieces & (1 << i)) == 0 {
                moves |= 1 << i;
            }
        }
    }

    i = king_pos;
    if i % 8 != 7 && i > 7 {
        i -= 7;
        if white_to_move {
            if (white_pieces & (1 << i)) == 0 {
                moves |= 1 << i;
            }
        } else {
            if (black_pieces & (1 << i)) == 0 {
                moves |= 1 << i;
            }
        }
    }

    i = king_pos;
    if i % 8 != 0 && i < 56 {
        i += 7;
        if white_to_move {
            if (white_pieces & (1 << i)) == 0 {
                moves |= 1 << i;
            }
        } else {
            if (black_pieces & (1 << i)) == 0 {
                moves |= 1 << i;
            }
        }
    }

    i = king_pos;
    if i % 8 != 7 && i < 56 {
        i += 9;
        if white_to_move {
            if (white_pieces & (1 << i)) == 0 {
                moves |= 1 << i;
            }
        } else {
            if (black_pieces & (1 << i)) == 0 {
                moves |= 1 << i;
            }
        }
    }

    i = king_pos;
    if i % 8 != 0 {
        i -= 1;
        if white_to_move {
            if (white_pieces & (1 << i)) == 0 {
                moves |= 1 << i;
            }
        } else {
            if (black_pieces & (1 << i)) == 0 {
                moves |= 1 << i;
            }
        }
    }

    i = king_pos;
    if i % 8 != 7 {
        i += 1;
        if white_to_move {
            if (white_pieces & (1 << i)) == 0 {
                moves |= 1 << i;
            }
        } else {
            if (black_pieces & (1 << i)) == 0 {
                moves |= 1 << i;
            }
        }
    }

    i = king_pos;
    if i > 7 {
        i -= 8;
        if white_to_move {
            if (white_pieces & (1 << i)) == 0 {
                moves |= 1 << i;
            }
        } else {
            if (black_pieces & (1 << i)) == 0 {
                moves |= 1 << i;
            }
        }
    }

    i = king_pos;
    if i < 56 {
        i += 8;
        if white_to_move {
            if (white_pieces & (1 << i)) == 0 {
                moves |= 1 << i;
            }
        } else {
            if (black_pieces & (1 << i)) == 0 {
                moves |= 1 << i;
            }
        }
    }

    moves
}

fn print_bitboard(bitboard: u64) {
    for i in 0..8 {
        for j in 0..8 {
            if bitboard & (1 << (i * 8 + j)) != 0 {
                print!("1");
            } else {
                print!("0");
            }
        }
        println!("");
    }
}
