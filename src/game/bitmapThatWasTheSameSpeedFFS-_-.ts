export default function rookTestBitBoard() {
  const time1 = performance.now();
  let emptyBoard = BigInt("0b" + "1".repeat(64));
  for (let i = 0; i < 5_000_000; i++) {
    let firstRank = BigInt(255);
    let eighthRank = BigInt(255) << 56n;

    let firstFile: bigint = BigInt("72340172838076673");
    let eighthFile: bigint = BigInt("9259542123273814144");

    let rookPos = BigInt(63);

    let rookMoves = 0n;

    rookMoves |= (emptyBoard - (rookPos & firstRank)) ^ (emptyBoard - (rookPos & eighthRank));
    rookMoves |= ((emptyBoard - (rookPos & firstFile)) >> 0n) ^ ((emptyBoard - (rookPos & eighthFile)) >> 7n);
  }
  const time2 = performance.now();

  console.log("Time:", time2 - time1 + "ms");
}
