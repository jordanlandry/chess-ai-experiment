import Piece from "./Piece";

export default function Pieces() {
  return (
    <div>
      {Array.from({ length: 64 }, (_, i) => (
        <Piece key={i} idx={i} />
      ))}
    </div>
  );
}
