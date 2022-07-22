import { Cartesian3, Color } from "cesium";
import React from "react";
import {
  Entity,
  EntityDescription,
  Label,
  LabelCollection,
  PolylineGraphics,
} from "resium";
import * as Cesium from "cesium";
import { displayLabelLineLength } from "../data/utils";

function LineGraph({ id, name, arrayPoint, measurement, focusPlane }) {
  return (
    <Entity id={id} name="BoxGraphics">
      <PolylineGraphics
        positions={Cartesian3.fromDegreesArrayHeights(arrayPoint)}
        width={5}
        material={Color.WHITE}
      />
      <EntityDescription>
        <h1>{name}</h1>
      </EntityDescription>
      <LabelCollection show={true}>
        <Label
          show={focusPlane ? true : false}
          text={`${
            displayLabelLineLength(arrayPoint, measurement).distance
          } ${measurement}`}
          font={"17px Bold Arial"}
          outlineColor={Cesium.Color.CYAN}
          position={displayLabelLineLength(arrayPoint, measurement).middle}
          fillColor={Cesium.Color.YELLOW}
        />
      </LabelCollection>
    </Entity>
  );
}

export default LineGraph;
