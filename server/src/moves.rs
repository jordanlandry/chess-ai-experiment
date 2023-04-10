use crate::{bitboard::Bitboard}; 

#[derive(Debug, Clone, Copy)]
pub struct Move {
    pub from: u8,
    pub to: u8,
}

pub fn get_pawn_moves(pawn_pos: usize, white_to_move: bool, white_pieces: u64, black_pieces: u64) -> u64 {
    let mut moves: u64 = 0;
    
    if white_to_move {
        if pawn_pos > 7 && (white_pieces | black_pieces) & (1 << (pawn_pos - 8)) == 0 {
            moves |= 1 << (pawn_pos - 8);
        }

        if pawn_pos >= 48 && pawn_pos <= 55 && (white_pieces | black_pieces) & (1 << (pawn_pos - 8)) == 0 && (white_pieces | black_pieces) & (1 << (pawn_pos - 16)) == 0 {
            moves |= 1 << (pawn_pos - 16);
        }

        if pawn_pos > 7 && pawn_pos % 8 != 0 && (black_pieces & (1 << (pawn_pos - 9))) != 0 {
            moves |= 1 << (pawn_pos - 9);
        }

        if pawn_pos > 7 && pawn_pos % 8 != 7 && (black_pieces & (1 << (pawn_pos - 7))) != 0 {
            moves |= 1 << (pawn_pos - 7);
        }

    } else {
        if pawn_pos < 56 && (white_pieces | black_pieces) & (1 << (pawn_pos + 8)) == 0 {
            moves |= 1 << (pawn_pos + 8);
        }

        if pawn_pos >= 8 && pawn_pos <= 15 && (white_pieces | black_pieces) & (1 << (pawn_pos + 8)) == 0 && (white_pieces | black_pieces) & (1 << (pawn_pos + 16)) == 0 {
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


pub fn get_rook_moves(rook_pos: usize, white_to_move: bool, white_pieces: u64, black_pieces: u64) -> u64 {
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

pub fn get_bishop_moves(bishop_pos: usize, white_to_move: bool, white_pieces: u64, black_pieces: u64) -> u64 {
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



pub fn get_knight_moves(knight_pos: usize, white_to_move: bool, white_pieces: u64, black_pieces: u64) -> u64 {
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

pub fn get_queen_moves(queen_pos: usize, white_to_move: bool, white_pieces: u64, black_pieces: u64) -> u64 {
    let mut moves: u64 = 0;

    // Get rook and bishop moves
    moves |= get_rook_moves(queen_pos, white_to_move, white_pieces, black_pieces);
    moves |= get_bishop_moves(queen_pos, white_to_move, white_pieces, black_pieces);

    moves
}

pub fn get_king_moves(king_pos: usize, white_to_move: bool, white_pieces: u64, black_pieces: u64) -> u64 {
    let mut moves: u64 = 0;

    if king_pos > 63 {
        return moves;
    }

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


pub fn get_white_moves(board: Bitboard) -> Vec<Move> {
    let mut moves: Vec<Move> = Vec::new();

    let white_pieces = board.white_pawns | board.white_rooks | board.white_knights | board.white_bishops | board.white_queens | board.white_king;
    let black_pieces = board.black_pawns | board.black_rooks | board.black_knights | board.black_bishops | board.black_queens | board.black_king;

    let mut pawn_positions: Vec<u32> = Vec::new();
    let mut bishop_positions: Vec<u32> = Vec::new();
    let mut knight_positions: Vec<u32> = Vec::new();
    let mut rook_positions: Vec<u32> = Vec::new();
    let mut queen_positions: Vec<u32> = Vec::new();
    let king_position = board.white_king.trailing_zeros();

    let mut bb = board;
    while bb.white_pawns != 0 {
        let pos = bb.white_pawns.trailing_zeros();
        pawn_positions.push(pos);
        bb.white_pawns &= bb.white_pawns - 1;
    }

    while bb.white_bishops != 0 {
        let pos = bb.white_bishops.trailing_zeros();
        bishop_positions.push(pos);
        bb.white_bishops &= bb.white_bishops - 1;
    }

    while bb.white_knights != 0 {
        let pos = bb.white_knights.trailing_zeros();
        knight_positions.push(pos);
        bb.white_knights &= bb.white_knights - 1;
    }

    while bb.white_rooks != 0 {
        let pos = bb.white_rooks.trailing_zeros();
        rook_positions.push(pos);
        bb.white_rooks &= bb.white_rooks - 1;
    }

    while bb.white_queens != 0 {
        let pos = bb.white_queens.trailing_zeros();
        queen_positions.push(pos);
        bb.white_queens &= bb.white_queens - 1;
    }

    
    if bb.white_king != 0 {
        bb.white_king &= bb.white_king - 1;
    }


    for pos in pawn_positions.iter() {
        let m = get_pawn_moves(*pos as usize, true, white_pieces, black_pieces);

        // All of the 1 bits in m, are valid moves for the to property of the move, while from is the current position
        let mut i = m;
        while i != 0 {
            let to = i.trailing_zeros();
            let m = Move {
                from: *pos as u8,
                to: to as u8,
            };

            moves.push(m);
            i &= i - 1;
        }
    }

    for pos in bishop_positions.iter() {
        let m = get_bishop_moves(*pos as usize, true, white_pieces, black_pieces);

        // All of the 1 bits in m, are valid moves for the to property of the move, while from is the current position
        let mut i = m;
        while i != 0 {
            let to = i.trailing_zeros();
            let m = Move {
                from: *pos as u8,
                to: to as u8,
            };

            moves.push(m);
            i &= i - 1;
        }
    }

    for pos in knight_positions.iter() {
        let m = get_knight_moves(*pos as usize, true, white_pieces, black_pieces);


        // All of the 1 bits in m, are valid moves for the to property of the move, while from is the current position
        let mut i = m;
        while i != 0 {
            let to = i.trailing_zeros();
            let m = Move {
                from: *pos as u8,
                to: to as u8,
            };

            moves.push(m);
            i &= i - 1;
        }
    }

    for pos in rook_positions.iter() {
        let m = get_rook_moves(*pos as usize, true, white_pieces, black_pieces);

        // All of the 1 bits in m, are valid moves for the to property of the move, while from is the current position
        let mut i = m;
        while i != 0 {
            let to = i.trailing_zeros();
            let m = Move {
                from: *pos as u8,
                to: to as u8,
            };

            moves.push(m);
            i &= i - 1;
        }
    }

    for pos in queen_positions.iter() {
        let m = get_queen_moves(*pos as usize, true, white_pieces, black_pieces);

        // All of the 1 bits in m, are valid moves for the to property of the move, while from is the current position
        let mut i = m;
        while i != 0 {
            let to = i.trailing_zeros();
            let m = Move {
                from: *pos as u8,
                to: to as u8,
            };

            moves.push(m);
            i &= i - 1;
        }
    }


    let king_moves = get_king_moves(king_position as usize, true, white_pieces, black_pieces);
    let mut i = king_moves;

    while i != 0 {
        let to = i.trailing_zeros();
        let m = Move {
            from: king_position as u8,
            to: to as u8,
        };

        moves.push(m);
        i &= i - 1;
    }

    moves
}

pub fn get_black_moves(board: Bitboard) -> Vec<Move> {
    let mut moves: Vec<Move> = Vec::new();

    let white_pieces = board.white_pawns | board.white_rooks | board.white_knights | board.white_bishops | board.white_queens | board.white_king;
    let black_pieces = board.black_pawns | board.black_rooks | board.black_knights | board.black_bishops | board.black_queens | board.black_king;

    let mut pawn_positions: Vec<u32> = Vec::new();
    let mut bishop_positions: Vec<u32> = Vec::new();
    let mut knight_positions: Vec<u32> = Vec::new();
    let mut rook_positions: Vec<u32> = Vec::new();
    let mut queen_positions: Vec<u32> = Vec::new();
    let king_position = board.black_king.trailing_zeros();

    let mut bb = board;

    // Get all of the positions of the pieces
    while bb.black_pawns != 0 {
        let pos = bb.black_pawns.trailing_zeros();
        pawn_positions.push(pos);
        bb.black_pawns &= bb.black_pawns - 1;
    }

    while bb.black_bishops != 0 {
        let pos = bb.black_bishops.trailing_zeros();
        bishop_positions.push(pos);
        bb.black_bishops &= bb.black_bishops - 1;
    }

    while bb.black_knights != 0 {
        let pos = bb.black_knights.trailing_zeros();
        knight_positions.push(pos);
        bb.black_knights &= bb.black_knights - 1;
    }

    while bb.black_rooks != 0 {
        let pos = bb.black_rooks.trailing_zeros();
        rook_positions.push(pos);
        bb.black_rooks &= bb.black_rooks - 1;
    }

    while bb.black_queens != 0 {
        let pos = bb.black_queens.trailing_zeros();
        queen_positions.push(pos);
        bb.black_queens &= bb.black_queens - 1;
    }

    // bb.black_king &= bb.black_king - 1;

    // Get the moves for each position
    for pos in pawn_positions.iter() {
        let m = get_pawn_moves(*pos as usize, false,white_pieces, black_pieces);

        // All of the 1 bits in m, are valid moves for the to property of the move, while from is the current position
        let mut i = m;
        while i != 0 {
            let to = i.trailing_zeros();
            let m = Move {
                from: *pos as u8,
                to: to as u8,
            };

            moves.push(m);
            i &= i - 1;
        }
    }

    for pos in bishop_positions.iter() {
        let m = get_bishop_moves(*pos as usize, false, white_pieces, black_pieces);

        // All of the 1 bits in m, are valid moves for the to property of the move, while from is the current position
        let mut i = m;
        while i != 0 {
            let to = i.trailing_zeros();
            let m = Move {
                from: *pos as u8,
                to: to as u8,
            };

            moves.push(m);
            i &= i - 1;
        }
    }

    for pos in knight_positions.iter() {
        let m = get_knight_moves(*pos as usize, false,white_pieces, black_pieces);

        // All of the 1 bits in m, are valid moves for the to property of the move, while from is the current position
        let mut i = m;
        while i != 0 {
            let to = i.trailing_zeros();
            let m = Move {
                from: *pos as u8,
                to: to as u8,
            };

            moves.push(m);
            i &= i - 1;
        }

    }

    for pos in rook_positions.iter() {
        let m = get_rook_moves(*pos as usize, false,white_pieces, black_pieces);

        // All of the 1 bits in m, are valid moves for the to property of the move, while from is the current position
        let mut i = m;
        while i != 0 {
            let to = i.trailing_zeros();
            let m = Move {
                from: *pos as u8,
                to: to as u8,
            };

            moves.push(m);
            i &= i - 1;
        }
    }

    for pos in queen_positions.iter() {
        let m = get_queen_moves(*pos as usize, false,white_pieces, black_pieces);

        // All of the 1 bits in m, are valid moves for the to property of the move, while from is the current position
        let mut i = m;
        while i != 0 {
            let to = i.trailing_zeros();
            let m = Move {
                from: *pos as u8,
                to: to as u8,
            };

            moves.push(m);
            i &= i - 1;
        }
    }

    let king_moves = get_king_moves(king_position as usize, false,white_pieces, black_pieces);

    let mut i = king_moves;

    while i != 0 {
        let to = i.trailing_zeros();
        let m = Move {
            from: king_position as u8,
            to: to as u8,
        };

        moves.push(m);
        i &= i - 1;
    }

    moves
}