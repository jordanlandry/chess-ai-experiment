import React from "react";
import BackButton from "./BackButton";
import { SetMenuStateContext } from "./MainMenu";

export default function PuzzleMenu() {
  const setMenuState = React.useContext(SetMenuStateContext);

  return (
    <>
      PuzzleMenu
      <BackButton />
    </>
  );
}
