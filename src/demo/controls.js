const palettes = [
  "black",
  "pink",
  "aquamarine",
  "blue",
  "darkblue",
  "grey",
  "white",
  "orange",
];

export function getPaletteFromParams(defaultPalette = "black") {
  let search = new URLSearchParams(window.location.search);
  return search.get("palette") == null ? defaultPalette : search.get("palette");
}

export function setupControls(palette) {
  window.addEventListener("keydown", (ev) => {
    let currentI = palettes.indexOf(palette);

    switch (ev.key) {
      case "ArrowLeft":
        let prevPalette =
          currentI - 1 < 0 ? palettes.length - 1 : currentI - 1;
        console.log(palettes[prevPalette]);
        window.location.search = "?palette=" + palettes[prevPalette];
        break;
      case "ArrowRight":
        let nextPalette = (currentI + 1) % palettes.length;
        console.log(palettes[nextPalette]);
        window.location.search = "?palette=" + palettes[nextPalette];
        break;
    }
  });
}
