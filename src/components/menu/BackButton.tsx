import React, { useContext } from "react";
import { MenuState, SetMenuStateContext } from "./MainMenu";

type Props = {
  customMenuState?: MenuState;
};

export default function BackButton({ customMenuState }: Props) {
  const setMenuState = useContext(SetMenuStateContext);

  return (
    <button className="back-btn" onClick={() => setMenuState(customMenuState ?? MenuState.Main)}>
      Back
    </button>
  );
}
