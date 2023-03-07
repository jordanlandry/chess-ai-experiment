import React, { useContext } from "react";
import { Store } from "../../App";
import { difficulties, minimaxProperties } from "../../game/ai/minimax";
import { Teams } from "../../properties";
import BackButton from "./BackButton";
import { MenuState, SetMenuStateContext } from "./MainMenu";

export function BotDifficulty() {
  const setMenuState = useContext(SetMenuStateContext);

  const handleClick = (difficulty: keyof typeof difficulties) => {
    minimaxProperties.maxDepth = difficulties[difficulty].maxDepth;
    minimaxProperties.movesPercent = difficulties[difficulty].movesPercent;

    setMenuState(MenuState.Bot_Color);
  };

  return (
    <>
      <h1>Select Difficulty</h1>
      {Object.keys(difficulties).map((difficulty) => (
        <button key={difficulty} onClick={() => handleClick(difficulty as keyof typeof difficulties)}>
          {difficulty} ({difficulties[difficulty].elo} Elo)
        </button>
      ))}
      <BackButton />
    </>
  );
}

export function BotColor() {
  const { setGameStarted } = useContext(Store);

  const handleClick = (team: Teams) => {
    console.log(team);
    setGameStarted(true);
  };

  return (
    <>
      <h1>Select your team</h1>
      <button onClick={() => handleClick(Teams.White)}>White</button>
      <button onClick={() => handleClick(Teams.Black)}>Black (Not implemented yet)</button>
      <button onClick={() => handleClick(Teams.None)}>Random (Not implemented yet)</button>
      <BackButton customMenuState={MenuState.Bot_Difficulty} />
    </>
  );
}
