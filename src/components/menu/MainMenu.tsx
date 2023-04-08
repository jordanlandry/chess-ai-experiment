// import React, { useContext } from "react";
// // import { BotColor, BotDifficulty } from "./BotMenu";

// import "../_scss/mainMenu.scss";
// import Logo from "./Logo";
// import PuzzleMenu from "./PuzzleMenu";

// export enum MenuState {
//   Main,
//   Bot_Difficulty,
//   Bot_Color,
//   Analyze,
//   Puzzle,
//   Settings,
// }

// export const SetMenuStateContext = React.createContext<React.Dispatch<React.SetStateAction<MenuState>>>(() => {});
// export default function MainMenu() {
//   const [menuState, setMenuState] = React.useState(MenuState.Main);

//   return (
//     <div className="main-menu-outter">
//       <div className="main-menu-wrapper">
//         <SetMenuStateContext.Provider value={setMenuState}>
//           <Logo />
//           {menuState === MenuState.Main ? (
//             <Main />
//           ) : menuState === MenuState.Bot_Difficulty ? (
//             <BotDifficulty />
//           ) : menuState === MenuState.Bot_Color ? (
//             <BotColor />
//           ) : menuState === MenuState.Puzzle ? (
//             <PuzzleMenu />
//           ) : null}
//         </SetMenuStateContext.Provider>
//       </div>
//     </div>
//   );
// }

// function Main() {
//   const setMenuState = useContext(SetMenuStateContext);

//   return (
//     <>
//       <h1>Jannin Chess</h1>
//       {/* <img src="../../assets/images/logo.png"></img> */}
//       <button onClick={() => setMenuState(MenuState.Bot_Difficulty)}>Play Bot</button>
//       <button onClick={() => setMenuState(MenuState.Puzzle)}>Puzzles</button>
//       <button onClick={() => setMenuState(MenuState.Analyze)}>Analyze Moves</button>
//       <button onClick={() => setMenuState(MenuState.Settings)}>Settings</button>
//     </>
//   );
// }
