import "./App.css";
import React, { useEffect, useRef, useState } from "react";
import { Scene, Viewer } from "resium";
import { createWorldTerrain } from "cesium";
import * as Cesium from "cesium";
import { getDataXmlAPI, handlerData } from "./data/loadXML";
import { getPointFF, getPointFL } from "./data/utils";
import LineGraph from "./components/LineGraph";
import PolygonGraph from "./components/PolygonGraph";

const terrainProvider = createWorldTerrain();

function App() {
  const [viewer, setviewer] = useState(null);
  const [data, setData] = useState(null);
  const [lines, setLines] = useState(null);
  const [points, setPoints] = useState(null);
  const [faces, setFaces] = useState(null);
  const [measurement, setMeasurement] = useState("feet");
  const [PlaneObj, setPlaneObj] = useState(null);
  const [lineObj, setLineObj] = useState(null);

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

  const viewer_meo = useRef(null);

  useEffect(() => {
    if (viewer_meo.current && viewer_meo.current.cesiumElement) {
      viewer_meo.current.cesiumElement.zoomTo(
        viewer_meo.current.cesiumElement.entities
      );
      setviewer(viewer_meo.current.cesiumElement);
    }
  }, [viewer, PlaneObj]);

  useEffect(() => {
    const Face =
      faces &&
      Object.entries(faces).map(([k, v]) => {
        return (
          <PolygonGraph
            key={k}
            name={k}
            id={k}
            focusPlane={false}
            lineCompo={v}
            measurement={measurement}
            arrayPoint={getPointFF(v, points, lines)}
            handleClickPlane={handleClickPlane}
          />
        );
      });
    Face && setPlaneObj(Face);
  }, [faces, measurement, lines, points]);

  useEffect(() => {
    const Line =
      lines &&
      points &&
      Object.entries(lines).map(([k, v]) => {
        return (
          <LineGraph
            id={k}
            key={k}
            name={k}
            focusPlane={false}
            measurement={measurement}
            arrayPoint={getPointFL(v, points)}
          />
        );
      });
    Line && setLineObj(Line);
  }, [faces, measurement, lines, points]);

  const handleClickPlane = (e) => {
    const feature = viewer.scene.pick(e.position);
    if (!Cesium.defined(feature)) {
      return;
    }
    let lineOfPlane;
    setPlaneObj((prevPlane) =>
      prevPlane.map((i) => {
        if (i.props.id === feature.id._id) lineOfPlane = i.props.lineCompo;
        return i.props.id === feature.id._id
          ? { ...i, props: { ...i.props, focusPlane: !i.props.focusPlane } }
          : { ...i, props: { ...i.props, focusPlane: false } };
      })
    );

    setLineObj((prevLine) =>
      prevLine.map((ii) => ({
        ...ii,
        props: { ...ii.props, focusPlane: false },
      }))
    );

    lineOfPlane.forEach((i) =>
      setLineObj((prevLine) =>
        prevLine.map((ii) =>
          ii.props.id === i
            ? {
                ...ii,
                props: { ...ii.props, focusPlane: !ii.props.focusPlane },
              }
            : { ...ii }
        )
      )
    );
  };

  return (
    <>
      <div className="absolute bg-white z-50 p-3 m-3 rounded-lg">
        <select
          className="focus:outline-none"
          value={measurement}
          onChange={(e) => setMeasurement(e.target.value)}
        >
          <option value="meter">meter</option>
          <option value="feet">feet</option>
        </select>
      </div>
      <Viewer
        className="relative"
        full
        terrainProvider={terrainProvider}
        ref={viewer_meo}
      >
        <Scene />

        {PlaneObj}

        {lineObj}
      </Viewer>
    </>
  );
}

export default App;
