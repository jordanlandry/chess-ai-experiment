


# A function to get the relevant bits for each position for rooks and bishops.
# The relevant bits will be spots that change the outcome of the available moves.


# For example if my rook is on a1, then the relevant bits would be everything on the a file, and everything on the 1 rank (except a1 itself).
# The bitboard for that would look like:

# 1 0 0 0 0 0 0 0
# 1 0 0 0 0 0 0 0
# 1 0 0 0 0 0 0 0
# 1 0 0 0 0 0 0 0
# 1 0 0 0 0 0 0 0
# 1 0 0 0 0 0 0 0
# 1 0 0 0 0 0 0 0
# 0 1 1 1 1 1 1 1

# For a bishop on a1 would be:

# 0 0 0 0 0 0 0 1
# 0 0 0 0 0 0 1 0
# 0 0 0 0 0 1 0 0
# 0 0 0 0 1 0 0 0
# 0 0 0 1 0 0 0 0
# 0 0 1 0 0 0 0 0
# 0 1 0 0 0 0 0 0
# 0 0 0 0 0 0 0 0

# So I just need to generate these bitboards for each rook and bishop position on the board, and I will print them out as a rust constant so I can copy paste

def get_relevant_rook_bits():
    relevant_bits = []
    for i in range(64):
        relevant_bits.append(0)
        relevant_bits[i] |= 0x0101010101010101 << i % 8
        relevant_bits[i] |= 0x00000000000000ff << (i // 8) * 8
        relevant_bits[i] &= ~(1 << i)
    return relevant_bits

def get_relevant_bishop_bits():
    relevant_bits = []
    for i in range(64):
        relevant_bits.append(0)
        relevant_bits[i] |= 0x8040201008040201 << (i % 8) - (i // 8)
        relevant_bits[i] |= 0x0102040810204080 >> (i % 8) + (i // 8)
        relevant_bits[i] &= ~(1 << i)
    return relevant_bits


# This function will print out the relevant bits as a rust constant
def print_relevant_bits(relevant_bits, name):
    print("pub const " + name + ": [u64; 64] = [")
    for i in range(64):
        print("    0b" + "{0:064b}".format(relevant_bits[i]) + ",")
    print("];")

print_relevant_bits(get_relevant_rook_bits(), "ROOK_RELEVANT_BITS")
# print_relevant_bits(get_relevant_bishop_bits(), "BISHOP_RELEVANT_BITS")