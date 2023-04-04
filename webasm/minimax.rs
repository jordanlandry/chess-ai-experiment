use crate::{bitboard::Bitboard, moves::{Move, get_white_moves, get_black_moves}}; 

const PAWN_VALUE: u32 = 1;
const KNIGHT_VALUE: u32 = 3;
const BISHOP_VALUE: u32 = 3;
const ROOK_VALUE: u32 = 5;
const QUEEN_VALUE: u32 = 9;

pub struct Score {
    pub score: i32,
    pub mv: Move,
}

const INFINITY: i32 = 9999999;

pub fn get_best_move(board: Bitboard, white_to_move: bool) -> Score {
    let m = minimax(board, 6, white_to_move, -INFINITY, INFINITY);

    m
}

pub fn evaluate_board(board: Bitboard) -> i32 {
    let mut score: i32 = 0;

    // White pieces
    score += (board.white_pawns.count_ones() as u32 * PAWN_VALUE) as i32;
    score += (board.white_knights.count_ones() as u32 * KNIGHT_VALUE) as i32;
    score += (board.white_bishops.count_ones() as u32 * BISHOP_VALUE) as i32;
    score += (board.white_rooks.count_ones() as u32 * ROOK_VALUE) as i32;
    score += (board.white_queens.count_ones() as u32 * QUEEN_VALUE) as i32;

    // Black pieces
    score -= (board.black_pawns.count_ones() as u32 * PAWN_VALUE) as i32;
    score -= (board.black_knights.count_ones() as u32 * KNIGHT_VALUE) as i32;
    score -= (board.black_bishops.count_ones() as u32 * BISHOP_VALUE) as i32;
    score -= (board.black_rooks.count_ones() as u32 * ROOK_VALUE) as i32;
    score -= (board.black_queens.count_ones() as u32 * QUEEN_VALUE) as i32;
    

    score
}

fn minimax(board: Bitboard, depth: u8, white_to_move: bool, alpha: i32, beta: i32) -> Score {
    if depth == 0 {
        return Score { mv: Move { from: 0, to: 0 }, score: evaluate_board(board) }  ;
    }

    let mut best_score: i32;
    let mut best_move: Move = Move { from: 0, to: 0 };

    if white_to_move {
        best_score = -INFINITY;

        let moves = get_white_moves(board);

        let mut new_alpha = alpha;
        for m in moves.iter() {
            let new_board = make_move(board, *m, true);
            let next_iter = minimax(new_board, depth - 1, false, new_alpha, beta);
            
            if best_score < next_iter.score {
                best_move = *m;
                best_score = next_iter.score;
            }
            
            new_alpha = alpha.max(next_iter.score);

            if beta <= new_alpha {
                break;
            }
        }
    }

    else {
        best_score = INFINITY;

        let moves = get_black_moves(board);

        let mut new_beta = beta;
        for m in moves.iter() {
            let new_board = make_move(board, *m, false);
            let next_iter = minimax(new_board, depth - 1, true, alpha, new_beta);
        
            if best_score > next_iter.score {
                best_move = *m;
                best_score = next_iter.score;
            }

            new_beta = beta.min(next_iter.score);

            if new_beta <= alpha {
                break;
            }
        }
    }

    Score { mv: best_move, score: best_score }
}


fn get_bitboard_at_pos(board: Bitboard, pos: u8) -> u64 {
    let mut bitboard: u64 = 0;

    if board.white_pawns & (1 << pos) != 0 {
        bitboard = board.white_pawns;
    }
    else if board.white_knights & (1 << pos) != 0 {
        bitboard = board.white_knights;
    }
    else if board.white_bishops & (1 << pos) != 0 {
        bitboard = board.white_bishops;
    }
    else if board.white_rooks & (1 << pos) != 0 {
        bitboard = board.white_rooks;
    }
    else if board.white_queens & (1 << pos) != 0 {
        bitboard = board.white_queens;
    }
    else if board.white_king & (1 << pos) != 0 {
        bitboard = board.white_king;
    }
    else if board.black_pawns & (1 << pos) != 0 {
        bitboard = board.black_pawns;
    }
    else if board.black_knights & (1 << pos) != 0 {
        bitboard = board.black_knights;
    }
    else if board.black_bishops & (1 << pos) != 0 {
        bitboard = board.black_bishops;
    }
    else if board.black_rooks & (1 << pos) != 0 {
        bitboard = board.black_rooks;
    }
    else if board.black_queens & (1 << pos) != 0 {
        bitboard = board.black_queens;
    }
    else if board.black_king & (1 << pos) != 0 {
        bitboard = board.black_king;
    }

    bitboard
}

fn make_move(board: Bitboard, mv: Move, white_to_move: bool) -> Bitboard {
    let mut moving_bitboard = get_bitboard_at_pos(board, mv.from);
    let mut target_bitboard = get_bitboard_at_pos(board, mv.to);

    // set the moving bitboard position from, to 0
    // set the moving bitboard position to, to 1
    // set the target bitboard position to, to 0

    moving_bitboard &= !(1 << mv.from);
    moving_bitboard |= 1 << mv.to;
    target_bitboard &= !(1 << mv.to);


    // Create a new board with the new bitboards
    let mut new_board = Bitboard {
        white_pawns: if board.white_pawns & (1 << mv.from) != 0 { moving_bitboard } else { board.white_pawns },
        white_knights: if board.white_knights & (1 << mv.from) != 0 { moving_bitboard } else { board.white_knights },
        white_bishops: if board.white_bishops & (1 << mv.from) != 0 { moving_bitboard } else { board.white_bishops },
        white_rooks: if board.white_rooks & (1 << mv.from) != 0 { moving_bitboard } else { board.white_rooks },
        white_queens: if board.white_queens & (1 << mv.from) != 0 { moving_bitboard } else { board.white_queens },
        white_king: if board.white_king & (1 << mv.from) != 0 { moving_bitboard } else { board.white_king },
        black_pawns: if board.black_pawns & (1 << mv.from) != 0 { moving_bitboard } else { board.black_pawns },
        black_knights: if board.black_knights & (1 << mv.from) != 0 { moving_bitboard } else { board.black_knights },
        black_bishops: if board.black_bishops & (1 << mv.from) != 0 { moving_bitboard } else { board.black_bishops },
        black_rooks: if board.black_rooks & (1 << mv.from) != 0 { moving_bitboard } else { board.black_rooks },
        black_queens: if board.black_queens & (1 << mv.from) != 0 { moving_bitboard } else { board.black_queens },
        black_king: if board.black_king & (1 << mv.from) != 0 { moving_bitboard } else { board.black_king },
    };
    
    // Change the bitboard of the target piece to the new bitboard
    if white_to_move {
        new_board.black_pawns = if board.black_pawns & (1 << mv.to) != 0 { target_bitboard } else { board.black_pawns };
        new_board.black_knights = if board.black_knights & (1 << mv.to) != 0 { target_bitboard } else { board.black_knights };
        new_board.black_bishops = if board.black_bishops & (1 << mv.to) != 0 { target_bitboard } else { board.black_bishops };
        new_board.black_rooks = if board.black_rooks & (1 << mv.to) != 0 { target_bitboard } else { board.black_rooks };
        new_board.black_queens = if board.black_queens & (1 << mv.to) != 0 { target_bitboard } else { board.black_queens };
        new_board.black_king = if board.black_king & (1 << mv.to) != 0 { target_bitboard } else { board.black_king };
    }
    else {
        new_board.white_pawns = if board.white_pawns & (1 << mv.to) != 0 { target_bitboard } else { board.white_pawns };
        new_board.white_knights = if board.white_knights & (1 << mv.to) != 0 { target_bitboard } else { board.white_knights };
        new_board.white_bishops = if board.white_bishops & (1 << mv.to) != 0 { target_bitboard } else { board.white_bishops };
        new_board.white_rooks = if board.white_rooks & (1 << mv.to) != 0 { target_bitboard } else { board.white_rooks };
        new_board.white_queens = if board.white_queens & (1 << mv.to) != 0 { target_bitboard } else { board.white_queens };
        new_board.white_king = if board.white_king & (1 << mv.to) != 0 { target_bitboard } else { board.white_king };
    }

    new_board
}

// fn undo_move(board: Bitboard, mv: Move) -> Bitboard {
//     board
// }
