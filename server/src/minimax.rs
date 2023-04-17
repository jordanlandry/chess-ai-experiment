use std::collections::HashMap;

use std::thread;
use std::{time::Instant};

use crate::moves::square_is_attacked;
use crate::{bitboard::Bitboard, moves::{Move, get_white_moves, get_black_moves}}; 

const PAWN_VALUE: u32 = 1;
const KNIGHT_VALUE: u32 = 3;
const BISHOP_VALUE: u32 = 3;
const ROOK_VALUE: u32 = 5;
const QUEEN_VALUE: u32 = 9;

#[derive(Clone, Copy, Debug, PartialEq, Eq, Hash)]
pub struct Score {
    pub score: i32,
    pub mv: Move,
    pub depth: u8,
}

const INFINITY: i32 = 9999999;
// const MAX_TIME_MS: u128 = 2500;

#[derive(Clone, Copy, Debug, PartialEq, Eq, Hash)]
struct BoardHash {
    board: Bitboard,
    depth: u8,
}

#[derive(Clone)]
struct TranspositionTable {
    table: HashMap<BoardHash, Score>,
}

impl TranspositionTable {
    fn new() -> TranspositionTable {
        TranspositionTable {
            table: HashMap::new(),
        }
    }

    fn lookup(&self, board: Bitboard, depth: u8) -> Option<Score> {
        let hash = BoardHash { board, depth };
        self.table.get(&hash).cloned()
    }

    fn store(&mut self, board: Bitboard, depth: u8, score: Score) {
        let hash = BoardHash { board, depth };
        self.table.insert(hash, score);
    }

    const MAX_SIZE: usize = 512_000;

    fn clear(&mut self) {
        self.table.clear();
    }
}

pub fn get_best_move(board: Bitboard, white_to_move: bool, max_time_ms: u128, thread_count: usize) -> Score {
    let now = std::time::Instant::now();

    let mut table = TranspositionTable::new();
    let mut best_move: Score = Score { score: 0, mv: Move { from: 0, to: 0 }, depth: 0 };

    let mut depth = 2;

    while now.elapsed().as_millis() < max_time_ms {
        // let new_move = minimax(board, depth, white_to_move, -INFINITY, INFINITY, now, max_time_ms, best_move.mv, &mut table);
        // let new_move = parallel_search(board, depth, white_to_move, -INFINITY, INFINITY, now, max_time_ms, best_move.mv, &mut table, thread_count);


        let new_move = minimax(board, depth, white_to_move, -INFINITY, INFINITY, now, max_time_ms, best_move.mv, &mut table);

        if new_move.mv.from == 0 && new_move.mv.to == 0 {
            break;
        }

        best_move = new_move;

        if table.table.len() > TranspositionTable::MAX_SIZE {
            table.clear();
        }

        if (best_move.score == INFINITY || best_move.score == -INFINITY) && depth > 1 {
            break;
        }

        depth += 1;
    }

    best_move
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

// The steps to do this in multi-threading are as follows:
// 1. Generate the possible moves
// 2. Assign each move to a thread
// 3. Make the move on a copy of the board
// 4. Run minimax on each copy of the board
// 5. Pick the best move from the results
// This way we don't initialize new threads on each minimax iteration, just on the first call
fn parallel_search(board: Bitboard, depth: u8, white_to_move: bool, alpha: i32, beta: i32, now: Instant, max_time_ms: u128, prev_best_move: Move, table: &mut TranspositionTable, thread_count: usize) -> Score {
    let mut results: Vec<Score> = Vec::new();
    let possible_moves = if white_to_move { get_white_moves(board, true) } else { get_black_moves(board, true) };
    let possible_moves_copy: Vec<Move> = possible_moves.clone(); // make a copy that lives for 'static

    let chunks = possible_moves_copy.chunks((possible_moves_copy.len() / thread_count).max(1));
    let mut handles = Vec::new();

    for chunk in chunks {

        for mv in chunk {
            let board_copy = board.clone();
            let mut table = table.clone();
            let mv = mv.clone();

            let handle = thread::spawn(move || {
                // Make the move
                let new_board = make_move(board_copy, mv, white_to_move.clone());

                // Run minimax on the new board
                let result = minimax(new_board, depth - 1, !white_to_move, alpha, beta, now, max_time_ms, prev_best_move, &mut table);

                Score { mv, score: result.score, depth }
            });

            handles.push(handle);
        }
    }

    for handle in handles {
        results.push(handle.join().unwrap());
    }

    let best_score = if white_to_move {results.iter().map(|x| x.score).max().unwrap() } else { results.iter().map(|x| x.score).min().unwrap() };
    let best_move = results.iter().find(|x| x.score == best_score).unwrap().mv.clone();
    
    Score { mv: best_move, score: best_score, depth }
}

fn minimax(board: Bitboard, depth: u8, white_to_move: bool, alpha: i32, beta: i32, now: Instant, max_time_ms: u128, prev_best_move: Move, table: &mut TranspositionTable) -> Score {
    if depth == 0 {
        return Score { mv: Move { from: 0, to: 0 }, score: evaluate_board(board), depth: 0 };
    }

    if now.elapsed().as_millis() > max_time_ms {
        return Score { mv: Move { from: 0, to: 0 }, score: evaluate_board(board), depth: 0 };
    }

    if let Some(score) = table.lookup(board, depth) {
        return score;
    }

    if table.table.len() > TranspositionTable::MAX_SIZE {
        table.clear();
    }

    let mut best_score: i32;
    let mut best_move: Move = Move { from: 0, to: 0 };

    if white_to_move {
        best_score = -INFINITY;

        let moves = get_white_moves(board, true);
        let ordered_moves = order_moves(board, moves, white_to_move, prev_best_move);

        if ordered_moves.len() == 0 {
            return if in_stalemate(board, white_to_move) { Score { mv: Move { from: 0, to: 0 }, score: 0, depth: 0, } } 
            else { Score { mv: Move { from: 0, to: 0 }, score: -INFINITY, depth: 0, } };
        }

        let mut new_alpha = alpha;
        for m in ordered_moves.iter() {
            let new_board = make_move(board, *m, true);

            let next_iter = minimax(new_board, depth - 1, false, new_alpha, beta, now, max_time_ms, prev_best_move, table);

            // Add move to table
            table.store(new_board, depth - 1, next_iter);

            // Update best move
            if best_score < next_iter.score {
                best_move = *m;
                best_score = next_iter.score;
            }

            // Update alpha-beta
            new_alpha = alpha.max(next_iter.score);
            if beta <= new_alpha {
                break;
            }
        }
    }

    else {
        best_score = INFINITY;

        let moves = get_black_moves(board, true);
        let ordered_moves = order_moves(board, moves, white_to_move, prev_best_move);

        if ordered_moves.len() == 0 {
            return if in_stalemate(board, white_to_move) { Score { mv: Move { from: 0, to: 0 }, score: 0, depth: 0} } 
            else { Score { mv: Move { from: 0, to: 0 }, score: INFINITY, depth: 0} };
        }

        let mut new_beta = beta;
        for m in ordered_moves.iter() {
            let new_board = make_move(board, *m, false);
            let next_iter = minimax(new_board, depth - 1, true, alpha, new_beta, now, max_time_ms, prev_best_move, table);

            table.store(new_board, depth - 1, next_iter);
        
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

    Score { mv: best_move, score: best_score, depth: depth }
}

fn get_bitboard_at_pos(board: Bitboard, pos: u8) -> u64 {
    let mut bitboard: u64 = 0;

    if board.white_pawns        & (1 << pos) != 0 { bitboard = board.white_pawns;   }
    else if board.white_knights & (1 << pos) != 0 { bitboard = board.white_knights; }
    else if board.white_bishops & (1 << pos) != 0 { bitboard = board.white_bishops; }
    else if board.white_rooks   & (1 << pos) != 0 { bitboard = board.white_rooks;   }
    else if board.white_queens  & (1 << pos) != 0 { bitboard = board.white_queens;  }
    else if board.white_king    & (1 << pos) != 0 { bitboard = board.white_king;    }
    else if board.black_pawns   & (1 << pos) != 0 { bitboard = board.black_pawns;   }
    else if board.black_knights & (1 << pos) != 0 { bitboard = board.black_knights; }
    else if board.black_bishops & (1 << pos) != 0 { bitboard = board.black_bishops; }
    else if board.black_rooks   & (1 << pos) != 0 { bitboard = board.black_rooks;   }
    else if board.black_queens  & (1 << pos) != 0 { bitboard = board.black_queens;  }
    else if board.black_king    & (1 << pos) != 0 { bitboard = board.black_king;    }

    bitboard
}

// This will only be called if the player has no moves left
// We need to check if the king is in check or not
pub fn in_stalemate(board: Bitboard, white_to_move: bool) -> bool {
    let king_pos = if white_to_move { board.white_king.trailing_zeros() as i8 } else { board.black_king.trailing_zeros() as i8 };
    return !square_is_attacked(board, king_pos, white_to_move);
}

// The steps to make a move are as follows:
// set the moving bitboard position from, to 0
// set the moving bitboard position to, to 1
// set the target bitboard position to, to 0
pub fn make_move(board: Bitboard, mv: Move, white_to_move: bool) -> Bitboard {
    let mut moving_bitboard = get_bitboard_at_pos(board, mv.from);
    let mut target_bitboard = get_bitboard_at_pos(board, mv.to);


    moving_bitboard &= !(1 << mv.from);
    moving_bitboard |= 1 << mv.to;
    target_bitboard &= !(1 << mv.to);


    // Create a new board with the new bitboards
    let mut new_board = Bitboard {
        white_pawns:    if board.white_pawns   & (1 << mv.from) != 0 { moving_bitboard } else { board.white_pawns   },
        white_knights:  if board.white_knights & (1 << mv.from) != 0 { moving_bitboard } else { board.white_knights },
        white_bishops:  if board.white_bishops & (1 << mv.from) != 0 { moving_bitboard } else { board.white_bishops },
        white_rooks:    if board.white_rooks   & (1 << mv.from) != 0 { moving_bitboard } else { board.white_rooks   },
        white_queens:   if board.white_queens  & (1 << mv.from) != 0 { moving_bitboard } else { board.white_queens  },
        white_king:     if board.white_king    & (1 << mv.from) != 0 { moving_bitboard } else { board.white_king    },
        black_pawns:    if board.black_pawns   & (1 << mv.from) != 0 { moving_bitboard } else { board.black_pawns   },
        black_knights:  if board.black_knights & (1 << mv.from) != 0 { moving_bitboard } else { board.black_knights },
        black_bishops:  if board.black_bishops & (1 << mv.from) != 0 { moving_bitboard } else { board.black_bishops },
        black_rooks:    if board.black_rooks   & (1 << mv.from) != 0 { moving_bitboard } else { board.black_rooks   },
        black_queens:   if board.black_queens  & (1 << mv.from) != 0 { moving_bitboard } else { board.black_queens  },
        black_king:     if board.black_king    & (1 << mv.from) != 0 { moving_bitboard } else { board.black_king    },
    };
    
    // Change the bitboard of the target piece to the new bitboard
    if white_to_move {
        new_board.black_pawns   = if board.black_pawns      & (1 << mv.to) != 0 { target_bitboard } else { board.black_pawns    };
        new_board.black_knights = if board.black_knights    & (1 << mv.to) != 0 { target_bitboard } else { board.black_knights  };
        new_board.black_bishops = if board.black_bishops    & (1 << mv.to) != 0 { target_bitboard } else { board.black_bishops  };
        new_board.black_rooks   = if board.black_rooks      & (1 << mv.to) != 0 { target_bitboard } else { board.black_rooks    };
        new_board.black_queens  = if board.black_queens     & (1 << mv.to) != 0 { target_bitboard } else { board.black_queens   };
        new_board.black_king    = if board.black_king       & (1 << mv.to) != 0 { target_bitboard } else { board.black_king     };
    }
    else {
        new_board.white_pawns   = if board.white_pawns      & (1 << mv.to) != 0 { target_bitboard } else { board.white_pawns    };
        new_board.white_knights = if board.white_knights    & (1 << mv.to) != 0 { target_bitboard } else { board.white_knights  };
        new_board.white_bishops = if board.white_bishops    & (1 << mv.to) != 0 { target_bitboard } else { board.white_bishops  };
        new_board.white_rooks   = if board.white_rooks      & (1 << mv.to) != 0 { target_bitboard } else { board.white_rooks    };
        new_board.white_queens  = if board.white_queens     & (1 << mv.to) != 0 { target_bitboard } else { board.white_queens   };
        new_board.white_king    = if board.white_king       & (1 << mv.to) != 0 { target_bitboard } else { board.white_king     };
    }

    new_board
}

fn order_moves(board: Bitboard, moves: Vec<Move>, white_to_move: bool, prev_best_move: Move) -> Vec<Move> {
    let mut ordered_moves = Vec::new();

    // If you capture a piece, increase the score
    for mv in moves {
        if mv.from == prev_best_move.from && mv.to == prev_best_move.to {
            ordered_moves.push((mv, 100));
            continue;
        }

        if white_to_move {
            if board.black_pawns        & (1 << mv.to) != 0 { ordered_moves.push((mv, 1)); }
            else if board.black_knights & (1 << mv.to) != 0 { ordered_moves.push((mv, 3)); }
            else if board.black_bishops & (1 << mv.to) != 0 { ordered_moves.push((mv, 3)); }
            else if board.black_rooks   & (1 << mv.to) != 0 { ordered_moves.push((mv, 5)); }
            else if board.black_queens  & (1 << mv.to) != 0 { ordered_moves.push((mv, 9)); }
            else { ordered_moves.push((mv, 0)); }
        }
        else {
            if board.white_pawns        & (1 << mv.to) != 0 { ordered_moves.push((mv, 1)); }
            else if board.white_knights & (1 << mv.to) != 0 { ordered_moves.push((mv, 3)); }
            else if board.white_bishops & (1 << mv.to) != 0 { ordered_moves.push((mv, 3)); }
            else if board.white_rooks   & (1 << mv.to) != 0 { ordered_moves.push((mv, 5)); }
            else if board.white_queens  & (1 << mv.to) != 0 { ordered_moves.push((mv, 9)); }
            else { ordered_moves.push((mv, 0)); }
        }
    }

    ordered_moves.sort_by(|a, b| b.1.cmp(&a.1));

    let mut ordered_moves_vec = Vec::new();

    for mv in ordered_moves {
        ordered_moves_vec.push(mv.0);
    }

    ordered_moves_vec

}