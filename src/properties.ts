export interface KeyStringObject {
  [key: string]: any;
}

const properties = {
  styles: {
    brown: {
      light: "#f0d9b5",
      dark: "#b58863",
    },

    green: {
      light: "#eeeed2",
      dark: "#769656",
    },

    grey: {
      light: "#ababab",
      dark: "#dcdcdc",
    },

    red: {
      light: "#ffdddd",
      dark: "#bb4444",
    },
  } as KeyStringObject,

  pieceStyles: ["cartoon", "wood", "jannin"],

  // When AI is black
  numPairBlack:  {
    0: "r",
    1: "n",
    2: "b",
    3: "q",
    4: "k",
    5: "b",
    6: "n",
    7: "r",
    8: "p",
    9: "p",
    10: "p",
    11: "p",
    12: "p",
    13: "p",
    14: "p",
    15: "p",

    48: "P",
    49: "P",
    50: "P",
    51: "P",
    52: "P",
    53: "P",
    54: "P",
    55: "P",
    56: "R",
    57: "N",
    58: "B",
    59: "Q",
    60: "K",
    61: "B",
    62: "N",
    63: "R",
  } as KeyStringObject,

  // When AI is white
  numPairWhite: {
    0: "R",
    1: "N",
    2: "B",
    3: "K",
    4: "Q",
    5: "B",
    6: "N",
    7: "R",
    8: "P",
    9: "P",
    10: "P",
    11: "P",
    12: "P",
    13: "P",
    14: "P",
    15: "P",

    48: "p",
    49: "p",
    50: "p",
    51: "p",
    52: "p",
    53: "p",
    54: "p",
    55: "p",
    56: "r",
    57: "n",
    58: "b",
    59: "k",
    60: "q",
    61: "b",
    62: "n",
    63: "r",
  } as KeyStringObject,
  
  aiIsWhite: Math.random() < 0.5,
  // aiIsWhite: true,
  // aiIsWhite: false,
};

export default properties;
