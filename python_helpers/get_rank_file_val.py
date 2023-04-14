



# Gets the 64 bit value of each rank and file for the bitboard representation of the board

# for example
# rank 1 would look like this 
# 11111111
# 00000000
# 00000000
# 00000000
# 00000000
# 00000000
# 00000000
# 00000000

# Which is the same as 1111111100000000000000000000000000000000000000000000000000000000 

# And for File A it would be
# 10000000
# 10000000
# 10000000
# 10000000
# 10000000
# 10000000
# 10000000
# 10000000

# Which is the same as 1000000010000000100000001000000010000000100000001000000010000000

# So then we convert the binary to a decimal
def get_rank_val():
    rank_file_val = []
    for i in range(8):
        rank_file_val.append(0)
    for i in range(8):
        for j in range(8):
            rank_file_val[i] += 2**(i*8+j)
    return rank_file_val


def get_file_val():
    file_val = []
    for i in range(8):
        file_val.append(0)
    for i in range(8):
        for j in range(8):
            file_val[i] += 2**(j*8+i)
    return file_val


file_vals = get_file_val()
rank_vals = get_rank_val()


# Format the output as a rust variable
# So I can just copy and paste it into the rust code easy peasy

# Prints it like the following
# pub const FILE_A: u64 = ____;
print("// Files")
for i in range(8):
    file_letter = chr(ord('A') + i)
    print("pub const FILE_" + file_letter + ": u64 = " + str(file_vals[i]) + ";")

print("")
print("// Ranks")

for i in range(8):
    print("pub const RANK_" + str(i+1) + ": u64 = " + str(rank_vals[i]) + ";")

