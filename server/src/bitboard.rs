use std::collections::HashMap;


#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub struct Bitboard {
    pub white_pawns: u64,
    pub white_knights: u64,
    pub white_bishops: u64,
    pub white_rooks: u64,
    pub white_queens: u64,
    pub white_king: u64,

    pub black_pawns: u64,
    pub black_knights: u64,
    pub black_bishops: u64,
    pub black_rooks: u64,
    pub black_queens: u64,
    pub black_king: u64,
}



// I got these values by running a python script that creates the bitboard for each file and rank
// Then converts it to a u64 and prints it out as a rust constant (see below)
// See: from the base directory: './python_helpers/get_rank_file_val.py'

// Files
pub const FILE_A: u64 = 72340172838076673;
pub const FILE_B: u64 = 144680345676153346;
pub const FILE_C: u64 = 289360691352306692;
pub const FILE_D: u64 = 578721382704613384;
pub const FILE_E: u64 = 1157442765409226768;
pub const FILE_F: u64 = 2314885530818453536;
pub const FILE_G: u64 = 4629771061636907072;
pub const FILE_H: u64 = 9259542123273814144;

// Ranks
pub const RANK_1: u64 = 255;
pub const RANK_2: u64 = 65280;
pub const RANK_3: u64 = 16711680;
pub const RANK_4: u64 = 4278190080;
pub const RANK_5: u64 = 1095216660480;
pub const RANK_6: u64 = 280375465082880;
pub const RANK_7: u64 = 71776119061217280;
pub const RANK_8: u64 = 18374686479671623680;


// Generate all rook attacks for each square to use as a lookup table instead of calculating them each time

// The way I'm going to index them, is by getting all of the relevant bits for each square, then indexing into a hashmap
// with the key being the relevant bits and the value being the attack bitboard
// fn get_relevant_bits(board: Bitboard, square: usize) -> u64 {
//     let mut relevant_bits: u64 = 0;
// }

// pub fn generate_rook_moves() {
//     let mut vertical_moves: HashMap<u64, u64> = HashMap::new();
//     let mut horizontal_moves: HashMap<u64, u64> = HashMap::new();


//     // Generate all vertical moves
//     for rook_bit in 0..64 {
//         for occupied_bit in 0..8 {
//             let mut relevant_bits: u64 = 0;
//             let mut attack_bitboard: u64 = 0;

//             // Get the relevant bits for the rook
//             for i in 0..8 {
//                 relevant_bits |= 1 << (occupied_bit + (i * 8));
//             }



//             vertical_moves.insert(relevant_bits, attack_bitboard);
//         }
//     }

//     println!("{:?}", vertical_moves);
// }