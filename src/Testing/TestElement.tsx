import AvailableMoves from "./AvailableMoves";
import { testSpeed } from "./testBoard";

type Props = {};

export default function TestElement({}: Props) {
  return (
    <>
      <AvailableMoves />
      <button onClick={testSpeed}>Test Speed</button>
    </>
  );
}
