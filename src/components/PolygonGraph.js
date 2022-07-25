import { Cartesian3, Color } from "cesium";
import React, { useState } from "react";
import {
  Entity,
  EntityDescription,
  Label,
  LabelCollection,
  PolygonGraphics,
} from "resium";
import { area, calPerimeter } from "../data/utils";
import * as Cesium from "cesium";

function PolygonGraph({
  id,
  name,
  arrayPoint,
  handleClickPlane,
  measurement,
  focusPlane,
}) {
  return (
    <Entity
      id={id}
      name="BoxGraphics"
      onClick={(e) => {
        handleClickPlane(e);
      }}
    >
      <PolygonGraphics
        hierarchy={Cartesian3.fromDegreesArrayHeights(arrayPoint)}
        outline={true}
        outlineWidth={10}
        outlineColor={Color.WHITE.withAlpha(1.0)}
        material={
          !focusPlane
            ? Color.YELLOWGREEN.withAlpha(0.2)
            : Color.BLUE.withAlpha(0.2)
        }
        perPositionHeight={true}
      />
      <EntityDescription>
        <h1>{name}</h1>
      </EntityDescription>
      <LabelCollection show={true}>
        <Label
          show={focusPlane ? true : false}
          text={`plane: ${name}\narea: ${area(
            arrayPoint,
            measurement
          )} ${measurement}2\nperimeter: ${
            calPerimeter(arrayPoint, measurement).perimeter
          } ${measurement}`}
          font={"17px Bold Arial"}
          outlineColor={Cesium.Color.CYAN}
          position={calPerimeter(arrayPoint, measurement).midPoint}
          showBackground={true}
          fillColor={Cesium.Color.YELLOW}
        />
      </LabelCollection>
    </Entity>
  );
}

export default PolygonGraph;
