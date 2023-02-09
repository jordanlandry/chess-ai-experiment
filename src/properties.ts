export interface KeyStringObject {
  [key: string]: any;
}

const properties: KeyStringObject = {
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
  },

  pieceStyles: ["cartoon", "wood"],

  numToPiece: {
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
  },
};

export default properties;
