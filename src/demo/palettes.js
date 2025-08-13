import { Color } from "three";
import * as THREE from "three";
THREE.ColorManagement.enabled = false

export const paletteList = ["black", "pink", "aquamarine", "blue", "darkblue", "grey", "white", "orange"]

export const palettes = {
  black: {
    "index": 0,
    "accentPalette": "black",
    "id": "black",
    "BG":             new Color("#100f10"),
    "BGLight":        new Color("#2a282a"),
    "text":           new Color("#b9bec2"),
    "highlightHover": new Color("#cccccc"),
    "inactive":       new Color("#6d6d6d"),
    "highlight":      new Color("#ffffff")
  },
  pink: {
    "index": 1,
    "accentPalette": "black",
    "id": "pink",
    "text":           new Color("#f0dede"),
    "inactive":       new Color("#e39393"),
    "BG":             new Color("#db7676"),
    "highlightHover": new Color("#f3c6c6"),
    "BGLight":        new Color("#d55f5f"),
    "highlight":      new Color("#ffffff")
  },
  aquamarine: {
    "index": 2,
    "accentPalette": "black",
    "id": "aquamarine",
    "BGLight":        new Color("#66a2a5"),
    "text":           new Color("#e0f1f1"),
    "highlightHover": new Color("#b5d6d8"),
    "inactive":       new Color("#56979b"),
    "BG":             new Color("#7fb9bc"),
    "highlight":      new Color("#ffffff")
  },
  blue: {
    "index": 3,
    "accentPalette": "black",
    "id": "blue",
    "BG":             new Color("#5963fa"),
    "BGLight":        new Color("#424bd3"),
    "highlight":      new Color("#f6f6f4"),
    "text":           new Color("#d2daf3"),
    "highlightHover": new Color("#c1c3e9"),
    "inactive":       new Color("#7b82e7")
  },
  darkblue:{
    "index": 4,
    "accentPalette": "black",
    "id": "darkblue",
    "BGLight":        new Color("#2c4570"),
    "BG":             new Color("#446091"),
    "text":           new Color("#a4b8db"),
    "highlightHover": new Color("#9fbae9"),
    "highlight":      new Color("#e7e6e4"),
    "inactive":       new Color("#6580ad")
  },
  grey: {
    "index": 5,
    "accentPalette": "white",
    "id": "grey",
    "inactive":       new Color("#7c8598"),
    "BG":             new Color("#ebebeb"),
    "BGLight":        new Color("#bcc2c9"),
    "highlight":      new Color("#122438"),
    "text":           new Color("#2a3e53"),
    "highlightHover": new Color("#3c526a")
  },
  white: {
    "index": 6,
    "accentPalette": "white",
    "id": "white",
    "BG":             new Color("#ffffff"),
    "BGLight":        new Color("#dfdfdf"),
    "text":           new Color("#3d3d3d"),
    "highlightHover": new Color("#333333"),
    "inactive":       new Color("#8d8d8d"),
    "highlight":      new Color("#000000"),
  },
  orange: {
    "index": 7,
    "accentPalette": "black",
    "id": "orange",
    "BG":             new Color("#f5e1ce"),
    "BGLight":        new Color("#f1d7c0"),
    "highlight":      new Color("#f04924"),
    "text":           new Color("#ff7657"),
    "highlightHover": new Color("#fd6e4e"),
    "inactive":       new Color("#ebaf92")
  }
}


export const sinPalettes = {
  black: {
    c0: new Color(0x404040),
    c1: new Color(0xcef316),
    c2: new Color(0x815903),
    c3: new Color(0xae00ff),
  },
  pink: {
    c0: new Color(0x949494),
    c1: new Color(0x9ccd32),
    c2: new Color(0x835a01),
    c3: new Color(0x7b6f80),
  },
  aquamarine: {
    c0: new Color(0x7df96c),
    c1: new Color(0xaccd32),
    c2: new Color(0x8f7338),
    c3: new Color(0xf52ee5),
  },
  blue: {
    c0: new Color(0.8 , 0.95, 0.4),
    c1: new Color(0.5 , 0.5, 0.35),
    c2: new Color(0.1 , 0.5, 0.4),
    c3: new Color(0.   , 0., 0.85),
  },
  darkblue: {
    c0: new Color(0xd8e3ba),
    c1: new Color(0x7f7f59),
    c2: new Color(0x197f66),
    c3: new Color(0x090953),
  },
  grey: {
    c0: new Color(0x878787),
    c1: new Color(0x83a59a),
    c2: new Color(0xebebeb),
    c3: new Color(0x00d6bd),
  },
  white: {
    c0: new Color(0x878787),
    c1: new Color(0x707070),
    c2: new Color(0xffffff),
    c3: new Color(0x4b7d95),
  },
  orange: {
    c0: new Color(0.5, 0.5, 0.5),
    c1: new Color(0.5, 0.5, 0.5),
    c2: new Color(0.5, 0.5, 0.5),
    c3: new Color(0.5, 0.5, 0.5),
  },
};

export const demoCustomSinPalette = {
      ...sinPalettes,
      black: {
        c0: new Color(
          0.7725490196078432,
          0.4666666666666667,
          0.5725490196078431
        ),
        c1: new Color(0.56, 0.78, 0.66),
        c2: new Color(0.5, 0.21, 0.32),
        c3: new Color(0.79, 0.1, 0.07),
      },
      pink: {
        c0: new Color(
          0.5803921568627451,
          0.5803921568627451,
          0.5803921568627451
        ),
        c1: new Color(0.36, 0.33, 0.24),
        c2: new Color(0.5137254901960784, 0.35294117647058826, 0.2),
        c3: new Color(
          0.4823529411764706,
          0.43529411764705883,
          0.5019607843137255
        ),
      },

      aquamarine: {

        c0: new Color(
          0.3254901960784314,
          0.6509803921568628,
          0.6745098039215687
        ),
        c1: new Color(0.61, 0.33, 0.27),
        c2: new Color(0.54, 0.2, 0.42),
        c3: new Color(0.42, 0.37, 0.18),
      },
      blue: {
        c0: new Color(
          0.5607843137254902,
          0.5647058823529412,
          0.2980392156862745
        ),
        c1: new Color(1, 0.59, 1),
        c2: new Color(0.12, 0.19, 0.06),
        c3: new Color(0, 0.14, 0.18),
      },
      darkblue: {
        c0: new Color(
          0.6588235294117647,
          0.49019607843137253,
          0.9686274509803922
        ),
        c1: new Color(1, 0.45, 0.69),
        c2: new Color(0.54, 0.48, 0.37),
        c3: new Color(0, 0, 1),
      },
}
