import "./App.css";
import React, { useEffect, useState } from "react";
import {
  Viewer,
  Entity,
  EntityDescription,
  PolylineGraphics,
  PolygonGraphics,
} from "resium";
import { Cartesian3, Color, createWorldTerrain } from "cesium";
import * as Cesium from "cesium";
import { getDataXmlAPI, handlerData } from "./data/loadXML";

const terrainProvider = createWorldTerrain();

function getPointFL(l, points) {
  let arr = [];
  l.map((ii) =>
    Object.entries(points).map(
      ([k, v]) => k === ii && v.map((vp) => arr.push(parseFloat(vp)))
    )
  );
  return arr;
}
function getPointFF(ll, points, lines) {
  let arr = [];
  ll.map((l) =>
    Object.entries(lines).map(
      ([k, v]) => k === l && arr.push(getPointFL(v, points))
    )
  );
  return arr
    .join()
    .split(",")
    .map((p) => parseFloat(p));
}

function App() {
  const [data, setData] = useState(null);
  const [lines, setLines] = useState(null);
  const [points, setPoints] = useState(null);
  const [faces, setFaces] = useState(null);

  useEffect(() => {
    const temp = async () => {
      let d = await getDataXmlAPI();
      setData(d);
    };
    temp();
    data && setLines(handlerData(data, "LINE", "path"));
    data && setPoints(handlerData(data, "POINT", "data"));
    data && setFaces(handlerData(data, "POLYGON", "path"));
  }, [data]);

  const Line =
    lines &&
    points &&
    Object.values(lines).map((i) => {
      return (
        <Entity name="BoxGraphics">
          <PolylineGraphics
            positions={Cartesian3.fromDegreesArrayHeights(
              getPointFL(i, points)
            )}
            width={5}
            material={Color.WHITE}
          />
          <EntityDescription>
            <h1>{i}</h1>
          </EntityDescription>
        </Entity>
      );
    });

  const Face =
    faces &&
    Object.values(faces).map((i) => {
      return (
        <Entity name="BoxGraphics">
          <PolygonGraphics
            hierarchy={Cartesian3.fromDegreesArrayHeights(
              getPointFF(i, points, lines)
            )}
            outline={true}
            outlineWidth={10}
            outlineColor={Color.WHITE.withAlpha(1.0)}
            material={Color.YELLOWGREEN.withAlpha(0.2)}
            perPositionHeight={true}
          />
          <EntityDescription>
            <h1>{i}</h1>
          </EntityDescription>
        </Entity>
      );
    });

  return (
    <Viewer full terrainProvider={terrainProvider}>
      {Face}

      {Line}
    </Viewer>
  );
}

export default App;
