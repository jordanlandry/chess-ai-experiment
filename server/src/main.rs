use bitboard::{Bitboard, rook_moves, init_rook_moves};
use minimax::get_best_move;

// use moves::{init_slider_attacks, init_magics};
use rocket::{*, fairing::{Fairing, Info, Kind}, http::{ Header},};
use ::serde::Serialize;
use serde_json::Value;

pub mod moves;
pub mod minimax;
pub mod bitboard;

fn set_bitboard(board: Vec<Vec<char>>) -> (u64, u64, u64, u64, u64, u64, u64, u64, u64, u64, u64, u64) {
    let mut white_pawns: u64 = 0; let mut white_rooks: u64 = 0; let mut white_knights: u64 = 0; let mut white_bishops: u64 = 0; let mut white_queens: u64 = 0; let mut white_king: u64 = 0;
    let mut black_pawns: u64 = 0; let mut black_rooks: u64 = 0; let mut black_knights: u64 = 0; let mut black_bishops: u64 = 0; let mut black_queens: u64 = 0; let mut black_king: u64 = 0;

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
            if bitboard & (1 << (i * 8 + j)) != 0 { print!("1"); } 
            else { print!("0"); }
        }
        println!("");
    }
}


#[derive(Serialize)]
struct MinimaxMove {
    score: i32,
    from: u8,
    to: u8,
    depth: u8,
}

#[get("/best_move/<b>/<max_time>/<thread_count>")]
fn best_move(b: String, max_time: String, thread_count: String) -> String {
    let white_pawns: u64; let white_rooks: u64; let white_knights: u64; let white_bishops: u64; let white_queens: u64; let white_king: u64;
    let black_pawns: u64; let black_rooks: u64; let black_knights: u64; let black_bishops: u64; let black_queens: u64; let black_king: u64;

    let mut readable_board: Vec<Vec<char>> = vec![vec![' '; 8]; 8];

    let parsed_array: Value = serde_json::from_str(&b).unwrap();
    for i in 0..64 {
        let x = i % 8;
        let y = i / 8;

        let piece = &parsed_array[i];
        if piece == 1 { readable_board[y][x] = 'R'; } 
        else if piece == 2 { readable_board[y][x] = 'N'; }
        else if piece == 4 { readable_board[y][x] = 'B'; }
        else if piece == 8 { readable_board[y][x] = 'Q'; }
        else if piece == 16 { readable_board[y][x] = 'K'; }
        else if piece == 32 { readable_board[y][x] = 'P'; }
        else if piece == -1 { readable_board[y][x] = 'r'; }
        else if piece == -2 { readable_board[y][x] = 'n'; }
        else if piece == -4 { readable_board[y][x] = 'b'; }
        else if piece == -8 { readable_board[y][x] = 'q'; }
        else if piece == -16 { readable_board[y][x] = 'k'; }
        else if piece == -32 { readable_board[y][x] = 'p'; }
        else { readable_board[y][x] = ' '; }
    }
    
    (white_pawns, white_rooks, white_knights,white_bishops,white_queens,white_king,black_pawns,black_rooks,black_knights,black_bishops,black_queens,black_king) 
    = set_bitboard(readable_board);
    
    let bitboard = Bitboard { white_pawns, white_rooks, white_knights, white_bishops, white_queens, white_king, black_pawns, black_rooks, black_knights, black_bishops, black_queens, black_king};
    let parsed_thread_count = thread_count.parse::<usize>().unwrap();

    // let parsed_depth = depth.parse::<u8>().unwrap();
    let best_move = get_best_move(bitboard, false, max_time.parse::<u64>().unwrap() as u128, parsed_thread_count);
    let mv = MinimaxMove {
        score: best_move.score,
        from: best_move.mv.from,
        to: best_move.mv.to,
        depth: best_move.depth,
    };

    let json = serde_json::to_string(&mv).unwrap();
    json
}

pub struct CORS;

#[rocket::async_trait] 
impl Fairing for CORS {
    fn info(&self) -> Info {
        Info {
            name: "Add CORS headers to responses",
            kind: Kind::Response
        }
    }

    async fn on_response<'r>(&self, _request: &'r Request<'_>, response: &mut Response<'r>) {
        response.set_header(Header::new("Access-Control-Allow-Origin", "*"));
        response.set_header(Header::new("Access-Control-Allow-Methods", "POST, GET, PATCH, OPTIONS"));
        response.set_header(Header::new("Access-Control-Allow-Headers", "*"));
        response.set_header(Header::new("Access-Control-Allow-Credentials", "true"));
    }
}

#[launch]
fn rocket() -> _ {
    let occupancy: u64 = 0;
    init_rook_moves();
    print_bitboard(rook_moves(occupancy, 0));
    rocket::build().mount("/", routes![best_move]).attach(CORS)
}