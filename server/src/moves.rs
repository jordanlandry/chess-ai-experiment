use crate::{bitboard::{Bitboard, FILE_H, RANK_8, FILE_A, RANK_5, RANK_4, RANK_1, rook_moves}, minimax::make_move }; 

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
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

// pub fn get_rook_moves_1(rook_pos: usize, white_to_move: bool, white_pieces: u64, black_pieces: u64) -> u64 {
//     let mut moves: u64 = 0;

//     let friendly_pieces = if white_to_move { white_pieces } else { black_pieces };


//     // Up
//     let mask: u64 = 1 << rook_pos;
//     let mut up: u64 = mask;
//     while up < RANK_8 && ((up & (white_pieces | black_pieces)) == 0) {
//         moves |= up;
//         up <<= 8;
//         if up & friendly_pieces != 0 { break; }
//     }

//     // Down
//     let mut down: u64 = mask;
//     while down > RANK_1 && ((down & (white_pieces | black_pieces)) == 0) {
//         moves |= down;
//         down >>= 8;
//         if down & friendly_pieces != 0 { break; }
//     }

//     // Left
//     let mut left: u64 = mask;
//     while left & FILE_H == 0 && ((left & (white_pieces | black_pieces)) == 0) {
//         moves |= left;
//         left >>= 1;
//         if left & friendly_pieces != 0 { break; }
//     }

//     // Right
//     let mut right: u64 = mask;
//     while right & FILE_A == 0 && ((right & (white_pieces | black_pieces)) == 0) {
//         moves |= right;
//         right <<= 1;
//         if right & friendly_pieces != 0 { break; }
//     }

//     moves
// }

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

        moves |= 1 << i;
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

        moves |= 1 << i;
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

        moves |= 1 << i;
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

        moves |= 1 << i;
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

        moves |= 1 << i;
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

        moves |= 1 << i;
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

        moves |= 1 << i;
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

        moves |= 1 << i;
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


pub fn get_white_pawn_moves(bb: Bitboard, other_team: u64, empty: u64) -> Vec<Move> {
    let mut moves: Vec<Move> = Vec::new();

    // Capture left
    let mut pawn_moves = (bb.white_pawns >> 7) & other_team &! RANK_8 & !FILE_A;
    for i in pawn_moves.trailing_zeros()..64 - pawn_moves.leading_zeros() {
        if ((pawn_moves >> i) &1) == 1 {
            moves.push( Move { to: i as u8, from: i as u8 + 7 as u8 });
        }
    }

    // Capture right
    pawn_moves = (bb.white_pawns >> 9) & other_team &! RANK_8 & !FILE_H;
    for i in pawn_moves.trailing_zeros()..64 - pawn_moves.leading_zeros() {
        if ((pawn_moves >> i) &1) == 1 {
            moves.push( Move { to: i as u8, from: i as u8 + 9 as u8 });
        }
    }

    // Move forward
    pawn_moves = (bb.white_pawns >> 8) & empty &! RANK_8;
    for i in pawn_moves.trailing_zeros()..64 - pawn_moves.leading_zeros() {
        if ((pawn_moves >> i) &1) == 1 {
            moves.push( Move { to: i as u8, from: i as u8 + 8 as u8 });
        }
    }

    pawn_moves = (bb.white_pawns >> 16) & empty & (empty >> 8) & RANK_5;
    for i in pawn_moves.trailing_zeros()..64 - pawn_moves.leading_zeros() {
        if ((pawn_moves >> i) &1) == 1 {
            moves.push( Move { to: i as u8, from: i as u8 + 16 as u8 });
        }
    }

    moves
}

// TODO En passant
pub fn get_black_pawn_moves(bb: Bitboard, other_team: u64, empty: u64) -> Vec<Move> {
    let mut moves: Vec<Move> = Vec::new();

    // Capture left
    let mut pawn_moves = (bb.black_pawns << 9) & other_team &! RANK_1 & !FILE_A;
    for i in pawn_moves.trailing_zeros()..64 - pawn_moves.leading_zeros() {
        if ((pawn_moves >> i) &1) == 1 {
            moves.push( Move { to: i as u8, from: i as u8 - 9 as u8 });
        }
    }

    // Capture right
    pawn_moves = (bb.black_pawns << 7) & other_team &! RANK_1 & !FILE_H;
    for i in pawn_moves.trailing_zeros()..64 - pawn_moves.leading_zeros() {
        if ((pawn_moves >> i) &1) == 1 {
            moves.push( Move { to: i as u8, from: i as u8 - 7 as u8 });
        }
    }

    // Move forward
    pawn_moves = (bb.black_pawns << 8) & empty &! RANK_1;
    for i in pawn_moves.trailing_zeros()..64 - pawn_moves.leading_zeros() {
        if ((pawn_moves >> i) &1) == 1 {
            moves.push( Move { to: i as u8, from: i as u8 - 8 as u8 });
        }
    }

    pawn_moves = (bb.black_pawns << 16) & empty & (empty << 8) & RANK_4;
    for i in pawn_moves.trailing_zeros()..64 - pawn_moves.leading_zeros() {
        if ((pawn_moves >> i) &1) == 1 {
            moves.push( Move { to: i as u8, from: i as u8 - 16 as u8 });
        }
    }

    moves
}


pub fn get_white_moves(board: Bitboard, look_for_checks: bool) -> Vec<Move> {    
    let white_pieces = board.white_pawns | board.white_rooks | board.white_knights | board.white_bishops | board.white_queens | board.white_king;
    let black_pieces = board.black_pawns | board.black_rooks | board.black_knights | board.black_bishops | board.black_queens | board.black_king;
    let empty = !black_pieces & !white_pieces;

    // let mut moves: Vec<Move> = get_white_pawn_moves(board, black_pieces, empty);

    let mut moves: Vec<Move> = Vec::new();

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
        let m = rook_moves(white_pieces | black_pieces, *pos as u8);

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

    // Remove all moves that put the king in check
    // if look_for_checks {
    //     moves.retain(|m| !is_king_in_check_after_move(board, *m, true));
    // }

    moves
}

pub fn get_black_moves(board: Bitboard, look_for_checks: bool) -> Vec<Move> {
    
    let white_pieces = board.white_pawns | board.white_rooks | board.white_knights | board.white_bishops | board.white_queens | board.white_king;
    let black_pieces = board.black_pawns | board.black_rooks | board.black_knights | board.black_bishops | board.black_queens | board.black_king;
    let empty = !black_pieces & !white_pieces;

    // let mut moves: Vec<Move> = get_black_pawn_moves(board, white_pieces, empty);

    let mut moves: Vec<Move> = Vec::new();

    let mut pawn_positions: Vec<u32> = Vec::new();
    let mut bishop_positions: Vec<u32> = Vec::new();
    let mut knight_positions: Vec<u32> = Vec::new();
    let mut rook_positions: Vec<u32> = Vec::new();
    let mut queen_positions: Vec<u32> = Vec::new();
    let king_position = board.black_king.trailing_zeros();

    let mut bb = board;

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

    // if bb.black_king != 0 {
    //     bb.black_king &= bb.black_king - 1;
    // }

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

    // Remove all of the moves that put the king in check
    // TODO Change this
    // if look_for_checks {
    //     moves.retain(|m| !is_king_in_check_after_move(board, *m, false));
    // }

    moves
}

fn is_king_in_check_after_move(board: Bitboard, m: Move, is_white: bool) -> bool {
    let new_board = make_move(board, m, is_white);

    let king_position = if is_white {
        new_board.white_king.trailing_zeros()
    } else {
        new_board.black_king.trailing_zeros()
    };

    square_is_attacked(new_board, king_position as i8, is_white)
}

pub fn square_is_attacked(board: Bitboard, pos: i8, is_white: bool) -> bool {
    let mut moves:Vec<Move> = Vec::new();

    // Get available moves for the opponent
    if is_white {
        moves.append(&mut get_black_moves(board, false));
    } else {
        moves.append(&mut get_white_moves(board, false));
    }

    for m in moves.iter() {
        if m.to == pos as u8 {
            return true;
        }
    }


    false
}


// pub struct Magics {
//     magic_numbers: [u64; 64],
//     masks: [u64; 64],
//     attacks: Vec<Vec<u64>>,
//     relevant_bits: [usize; 64],
// }

// const ROOK_MAGIC_NUMBERS: [u64; 64] = [0x8a80104000800020,0x140002000100040,0x2801880a0017001,0x100081001000420,0x200020010080420,0x3001c0002010008,0x8480008002000100,0x2080088004402900,0x800098204000,0x2024401000200040,0x100802000801000,0x120800800801000,0x208808088000400,0x2802200800400,0x2200800100020080,0x801000060821100,0x80044006422000,0x100808020004000,0x12108a0010204200,0x140848010000802,0x481828014002800,0x8094004002004100,0x4010040010010802,0x20008806104,0x100400080208000,0x2040002120081000,0x21200680100081,0x20100080080080,0x2000a00200410,0x20080800400,0x80088400100102,0x80004600042881,0x4040008040800020,0x440003000200801,0x4200011004500,0x188020010100100,0x14800401802800,0x2080040080800200,0x124080204001001,0x200046502000484,0x480400080088020,0x1000422010034000,0x30200100110040,0x100021010009,0x2002080100110004,0x202008004008002,0x20020004010100,0x2048440040820001,0x101002200408200,0x40802000401080,0x4008142004410100,0x2060820c0120200,0x1001004080100,0x20c020080040080,0x2935610830022400,0x44440041009200,0x280001040802101,0x2100190040002085,0x80c0084100102001,0x4024081001000421,0x20030a0244872,0x12001008414402,0x2006104900a0804,0x1004081002402];
// const BISHOP_MAGIC_NUMBERS: [u64; 64] = [0x40040844404084,0x2004208a004208,0x10190041080202,0x108060845042010,0x581104180800210,0x2112080446200010,0x1080820820060210,0x3c0808410220200,0x4050404440404,0x21001420088,0x24d0080801082102,0x1020a0a020400,0x40308200402,0x4011002100800,0x401484104104005,0x801010402020200,0x400210c3880100,0x404022024108200,0x810018200204102,0x4002801a02003,0x85040820080400,0x810102c808880400,0xe900410884800,0x8002020480840102,0x220200865090201,0x2010100a02021202,0x152048408022401,0x20080002081110,0x4001001021004000,0x800040400a011002,0xe4004081011002,0x1c004001012080,0x8004200962a00220,0x8422100208500202,0x2000402200300c08,0x8646020080080080,0x80020a0200100808,0x2010004880111000,0x623000a080011400,0x42008c0340209202,0x209188240001000,0x400408a884001800,0x110400a6080400,0x1840060a44020800,0x90080104000041,0x201011000808101,0x1a2208080504f080,0x8012020600211212,0x500861011240000,0x180806108200800,0x4000020e01040044,0x300000261044000a,0x802241102020002,0x20906061210001,0x5a84841004010310,0x4010801011c04,0xa010109502200,0x4a02012000,0x500201010098b028,0x8040002811040900,0x28000010020204,0x6000020202d0240,0x8918844842082200,0x4010011029020020];

// const ROOK_RELEVANT_BITS: [usize; 64] = [
//     12, 11, 11, 11, 11, 11, 11, 12, 
//     11, 10, 10, 10, 10, 10, 10, 11, 
//     11, 10, 10, 10, 10, 10, 10, 11, 
//     11, 10, 10, 10, 10, 10, 10, 11, 
//     11, 10, 10, 10, 10, 10, 10, 11, 
//     11, 10, 10, 10, 10, 10, 10, 11, 
//     11, 10, 10, 10, 10, 10, 10, 11, 
//     12, 11, 11, 11, 11, 11, 11, 12
// ];

// const BISHOP_RELEVANT_BITS: [usize; 64] = [
//     6, 5, 5, 5, 5, 5, 5, 6, 
//     5, 5, 5, 5, 5, 5, 5, 5, 
//     5, 5, 7, 7, 7, 7, 5, 5, 
//     5, 5, 7, 9, 9, 7, 5, 5, 
//     5, 5, 7, 9, 9, 7, 5, 5, 
//     5, 5, 7, 7, 7, 7, 5, 5, 
//     5, 5, 5, 5, 5, 5, 5, 5, 
//     6, 5, 5, 5, 5, 5, 5, 6
// ];

// pub fn init_magics() {
    
//     let rook_attacks: Vec<Vec<u64>> = vec![vec![0; 4096]; 64];
//     let bishop_attacks: Vec<Vec<u64>> = vec![vec![0; 512]; 64];
    
//     let mut magic_rook = Magics {
//         magic_numbers: ROOK_MAGIC_NUMBERS,
//         masks: [0; 64],
//         relevant_bits: ROOK_RELEVANT_BITS,
//         attacks: rook_attacks,
//     };
    
//     let mut magic_bishop = Magics {
//         magic_numbers: BISHOP_MAGIC_NUMBERS,
//         masks: [0; 64],
//         relevant_bits: BISHOP_RELEVANT_BITS,
//         attacks: bishop_attacks,
//     };

//     init_slider_attacks(false, &mut magic_bishop, &mut magic_rook);
//     // init_slider_attacks(true, &mut magic_bishop, &mut magic_rook);

//     for i in 0..64 {
//         magic_rook.masks[i] = find_magics(i, magic_rook.relevant_bits[i], false, &magic_bishop, &magic_rook);
//         // magic_bishop.masks[i] = find_magics(i, magic_bishop.relevant_bits[i], true, &magic_bishop, &magic_rook);
//     }


//     // get_bishop_attacks(0, 0, &magic_bishop);
//     print_bitboard(get_rook_attacks(61, 0, &magic_rook));
// }


// fn mask_bishop_attacks(square: usize) -> u64 {
//     let mut attacks: u64 = 0;

//     // Target rank and file
//     let tr = square / 8;
//     let tf = square % 8;

//     for (r, f) in (tr + 1..=6).zip(tf + 1..=6)                  { attacks |= 1 << (r * 8 + f); }
//     if tr > 0 {
//         for (r, f) in (1..=tr - 1).rev().zip(tf + 1..=6)            { attacks |= 1u64 << (r * 8 + f); }
//         for (r, f) in (1..=tr - 1).rev().zip((1..=tf - 1).rev())    { attacks |= 1u64 << (r * 8 + f); }
//     }
    
//     if tf > 0 {
//         for (r, f) in (tr + 1..=6).zip((1..=tf - 1).rev())          { attacks |= 1u64 << (r * 8 + f); }
//     }

//     attacks
// }

// fn mask_rook_attacks(square: usize) -> u64 {
//     let mut attacks = 0u64;

//     // Target rank and file
//     let tr = square / 8;
//     let tf = square % 8;

//     for r in  tr + 1..=6        {attacks |= 1u64 << (r * 8 + tf); }

//     if tr > 0 {
//         for r in (1..=tr - 1).rev() { attacks |= 1u64 << (r * 8 + tf); }   
//     }

//     for f in  tf + 1..=6        { attacks |= 1u64 << (tr * 8 + f); }

//     if tf > 0 {
//         for f in (1..=tf - 1).rev() { attacks |= 1u64 << (tr * 8 + f); }
//     }
//     // for f in (1..=tf - 1).rev() { attacks |= 1u64 << (tr * 8 + f); }

//     attacks
// }

// fn bishop_attacks(square: usize, block: u64) -> u64 {
//     let mut attacks: u64 = 0;

//     // Target rank and file
//     let tr = square / 8;
//     let tf = square % 8;

//     for (r, f) in (tr + 1..=7).zip(tf + 1..=7) {
//         attacks |= 1u64 << (r * 8 + f);

//         if block & (1u64 << (r * 8 + f)) != 0 {
//             break;
//         }
//     }

//     for (r, f) in (0..=tr - 1).rev().zip(tf + 1..=7) {
//         attacks |= 1u64 << (r * 8 + f);

//         if block & (1u64 << (r * 8 + f)) != 0 {
//             break;
//         }
//     }

//     for (r, f) in (tr + 1..=7).zip((0..=tf - 1).rev()) {
//         attacks |= 1u64 << (r * 8 + f);

//         if block & (1u64 << (r * 8 + f)) != 0 {
//             break;
//         }
//     }

//     for (r, f) in (0..=tr - 1).rev().zip((0..=tf - 1).rev()) {
//         attacks |= 1u64 << (r * 8 + f);

//         if block & (1u64 << (r * 8 + f)) != 0 {
//             break;
//         }
//     }

//     attacks

// }

// fn rook_attacks(square: usize, block: u64) -> u64 {
//     let mut attacks = 0u64;

//     // Target rank and file
//     let tr = square / 8;
//     let tf = square % 8;

//     for r in tr + 1..=7 {
//         attacks |= 1u64 << (r * 8 + tf);

//         if block & (1u64 << (r * 8 + tf)) != 0 {
//             break;
//         }
//     }

//     if tr > 0 {
//         for r in (0..=tr - 1).rev() {
//             attacks |= 1u64 << (r * 8 + tf);
            
//             if block & (1u64 << (r * 8 + tf)) != 0 {
//                 break;
//             }
//         }
//     }

//     for f in tf + 1..=7 {
//         attacks |= 1u64 << (tr * 8 + f);

//         if block & (1u64 << (tr * 8 + f)) != 0 {
//             break;
//         }
//     }

//     if tf > 0 {
//         for f in (0..=tf - 1).rev() {
//             attacks |= 1u64 << (tr * 8 + f);
            
//             if block & (1u64 << (tr * 8 + f)) != 0 {
//                 break;
//             }
//         }
//     }

//     attacks
// }

// fn find_magics(square: usize, relevant_bits: usize, bishop: bool, bishop_magic: &Magics, rook_magic: &Magics) -> u64 {
//     let mut occupancies: [u64; 4096] = [0; 4096];
//     let mut attacks: [u64; 4096] = [0; 4096];
//     let mut used_attacks: [u64; 4096] = [0; 4096];

//     let attack_mask = if bishop { bishop_magic.masks[square] } else { rook_magic.masks[square] };

//     let occupancy_indicies = 1 << relevant_bits;

//     for i in 0..occupancy_indicies {
//         occupancies[i] = set_occupancy(i, relevant_bits, attack_mask);

//         if bishop {
//             attacks[i] = bishop_attacks(square, occupancies[i]);
//         }

//         else {
//             attacks[i] = rook_attacks(square, occupancies[i]);
//         }
//     }

//     for magic in 0..u64::MAX {
//         let mut success = true;

//         for i in 0..occupancy_indicies {
//             let magic_index = (occupancies[i] * magic) >> (64 - relevant_bits);

//             if used_attacks[magic_index as usize] != 0 && used_attacks[magic_index as usize] != attacks[i] {
//                 success = false;
//                 break;
//             }

//             used_attacks[magic_index as usize] = attacks[i];
//         }

//         if success {
//             return magic;
//         }
//     }

//     0
// }

// fn set_occupancy(index: usize, bits_in_mask: usize, mut mask: u64) -> u64 {
//     let mut occupancy = 0u64;

//     for i in 0..bits_in_mask {
//         let bit = index & (1 << i);

//         if bit != 0 {
//             let square = mask.trailing_zeros() as usize;

//             if square > 63 {
//                 break;
//             }

//             occupancy |= 1u64 << square;

//             mask ^= 1u64 << square;
//         }
//     }

//     occupancy
// }

// pub fn init_slider_attacks(bishop: bool, bishop_magic: &mut Magics, rook_magic: &mut Magics) {
//     for square in 0..64 {
//         bishop_magic.masks[square] = mask_bishop_attacks(square);
//         rook_magic.masks[square] = mask_rook_attacks(square);

//         let attack_mask = if bishop { bishop_magic.masks[square] } else { rook_magic.masks[square] };
//         let relevant_bits = attack_mask.count_ones() as usize;
//         let occupancy_indicies = 1 << relevant_bits;

//         for index in 0..occupancy_indicies {
//             if bishop {
//                 let occupancy = set_occupancy(index, relevant_bits, attack_mask);

//                 let magic_index = (occupancy * bishop_magic.magic_numbers[square]) >> (64 - bishop_magic.relevant_bits[square]);

//                 bishop_magic.attacks[square][magic_index as usize] = bishop_attacks(square, occupancy);
//             }

//             else {
//                 let occupancy = set_occupancy(index, relevant_bits, attack_mask);
//                 println!("{}", rook_magic.magic_numbers[square]);
//                 let magic_index = (occupancy * rook_magic.magic_numbers[square]) >> (64 - rook_magic.relevant_bits[square]);

//                 rook_magic.attacks[square][magic_index as usize] = rook_attacks(square, occupancy);
//             }
//         }
//     }
// }

// pub fn get_bishop_attacks(square: usize, mut occupancy: u64, magic: &Magics) -> u64 {
//     occupancy &= magic.masks[square];
//     occupancy *= magic.magic_numbers[square];
//     occupancy >>= 64 - magic.relevant_bits[square];

//     magic.attacks[square][occupancy as usize]
// }

// pub fn get_rook_attacks(square: usize, mut occupancy: u64, magic: &Magics) -> u64 {
//     occupancy &= magic.masks[square];
//     occupancy *= magic.magic_numbers[square];
//     occupancy >>= 64 - magic.relevant_bits[square];

//     magic.attacks[square][occupancy as usize]
// }