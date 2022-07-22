import "./App.css";
import React, { useEffect, useState } from "react";
import {
  Viewer,
  Entity,
  EntityDescription,
  PolylineGraphics,
  PolygonGraphics,
  Label,
  LabelCollection
} from "resium";
import { Cartesian3, Color, createWorldTerrain, Transforms } from "cesium";
import * as Cesium from "cesium";
import { getDataXmlAPI, handlerData } from "./data/loadXML";
import {getPointFF,getPointFL,displayLabelLineLength,area, calPerimeter} from './data/utils'

const terrainProvider = createWorldTerrain();

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
          <LabelCollection show={true}>
            <Label
              text= {`${displayLabelLineLength(getPointFL(i, points)).distance}ft`}
              font={"17px Bold Arial"}
              outlineColor={Cesium.Color.CYAN}
              position={
                // new Cesium.Cartesian3.fromDegrees(
                displayLabelLineLength(getPointFL(i, points)).middle
                //)
              }
              fillColor={Cesium.Color.YELLOW}
            />
          </LabelCollection>
        </Entity>
      );
    });

  const Face =
    faces &&
    Object.values(faces).map((i) => {
      //console.log()
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
          <LabelCollection show={true}>
            <Label
              text= {`area: ${area(getPointFF(i, points, lines))}\nplane: ${i}\nperimeter: ${calPerimeter(getPointFF(i, points, lines)).perimeter}ft`}
              font={"17px Bold Arial"}
              outlineColor={Cesium.Color.CYAN}
              position={
                // new Cesium.Cartesian3.fromDegrees(
                  calPerimeter(getPointFF(i, points, lines)).midPoint
                //)
              }
              showBackground={true}
              fillColor={Cesium.Color.YELLOW}
            />
          </LabelCollection>
        </Entity>
      );
    });

  return (
    <Viewer full terrainProvider={terrainProvider}
    >
      {Face}

      {Line}
    </Viewer>
  );
}

export default App;
