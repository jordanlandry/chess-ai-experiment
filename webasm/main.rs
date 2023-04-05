use minimax::get_best_move;

use crate::{moves::Move, minimax::make_move};

pub mod moves;
pub mod minimax;
pub mod bitboard;

fn main() {
    let board: [[char; 8]; 8] = [
        ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
        ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
        ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
    ];

    // let white_king_castle: bool = true;
    // let white_queen_castle: bool = true;
    // let black_king_castle: bool = true;
    // let black_queen_castle: bool = true;
    
    let white_to_move: bool = true;
    // let en_passant: u64 = 0x0000000000000000;
    
    let white_pawns: u64;
    let white_rooks: u64;
    let white_knights: u64;
    let white_bishops: u64;
    let white_queens: u64;
    let white_king: u64;

    let black_pawns: u64;
    let black_rooks: u64;
    let black_knights: u64;
    let black_bishops: u64;
    let black_queens: u64;
    let black_king: u64;

    (white_pawns, white_rooks, white_knights, white_bishops, white_queens, white_king, black_pawns, black_rooks, black_knights, black_bishops, black_queens, black_king) = set_bitboard(board);
    // let white_pieces: u64 = white_pawns | white_rooks | white_knights | white_bishops | white_queens | white_king;
    // let black_pieces: u64 = black_pawns | black_rooks | black_knights | black_bishops | black_queens | black_king;

    // let pawn_moves = moves::get_pawn_moves(17, white_to_move, white_pieces, black_pieces);
    // print_bitboard(pawn_moves);


    let bitboard = bitboard::Bitboard {
        white_pawns,
        white_rooks,
        white_knights,
        white_bishops,
        white_queens,
        white_king,
        black_pawns,
        black_rooks,
        black_knights,
        black_bishops,
        black_queens,
        black_king,
    };

    let best_move = get_best_move(bitboard, white_to_move);

    println!("Score: {:?}", best_move.score);
    println!("from: {:?}, to {:?}", best_move.mv.from, best_move.mv.to);
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

pub fn print_bitboard(bitboard: u64) {
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
