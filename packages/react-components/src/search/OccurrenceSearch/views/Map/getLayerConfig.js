export function getLayerConfig({tileString, theme, color, name = 'occurrences'}) {
  return {
    id: name,
    type: "circle",
    source: {
      type: "vector",
      tiles: [tileString]
    },
    "source-layer": "occurrence",
    paint: {
      // make circles larger as the user zooms from z12 to z22
      "circle-radius": {
        property: "total",
        type: "interval",
        stops: [[0, 3], [10, 4], [100,5], [1000, 7], [10000, 10]]
      },
      "circle-color": color ? color : {
        property: "total",
        type: "interval",
        stops: [0, 10, 100, 1000, 10000].map((x, i) => [x, theme.mapDensityColors[i]])
      },
      "circle-opacity": {
        property: "total",
        type: "interval",
        stops: [[0, 1], [10, 0.8], [100, 0.8], [1000, 0.7], [10000, 0.7]]
      },
      "circle-stroke-color": color ? color : theme.mapDensityColors[2],
      "circle-stroke-width": {
        property: "total",
        type: "interval",
        stops: [[0, 1], [10, 1.5], [100, 0]]
      }
    }
  };
}