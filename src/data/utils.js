import * as Cesium from "cesium";

export function getPointFL(l, points) {
  let arr = [];
  l.map((ii) =>
    Object.entries(points).map(
      ([k, v]) => k === ii && v.map((vp) => arr.push(parseFloat(vp)))
    )
  );
  return arr;
}
export function getPointFF(ll, points, lines) {
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
// muc dic cuoi la tinh ra khoang cach giua 2 diem va hien thi lên giua duong thăng
// array(6) ->

// eslint-disable-next-line no-extend-native
Number.prototype.round = function (places) {
  return +(Math.round(this + "e+" + places) + "e-" + places);
};

function meterToFeet(met) {
  return (met * 3.28084).round(2);
}

export function displayLabelLineLength(arrPoints, measurement) {
  const firstPoint = new Cesium.Cartesian3.fromDegrees(
    arrPoints.slice(0, 3)[0],
    arrPoints.slice(0, 3)[1],
    arrPoints.slice(0, 3)[2]
  );
  const endPoint = new Cesium.Cartesian3.fromDegrees(
    arrPoints.slice(3)[0],
    arrPoints.slice(3)[1],
    arrPoints.slice(3)[2]
  );
  const middlePoint = new Cesium.Cartesian3();
  Cesium.Cartesian3.midpoint(
    new Cesium.Cartesian3.fromArray(arrPoints.slice(0, 3)),
    new Cesium.Cartesian3.fromArray(arrPoints.slice(3)),
    middlePoint
  );

  return {
    distance:
      measurement === "feet"
        ? meterToFeet(Cesium.Cartesian3.distance(firstPoint, endPoint))
        : Cesium.Cartesian3.distance(firstPoint, endPoint).round(2),
    middle: new Cesium.Cartesian3.fromDegrees(
      middlePoint.x,
      middlePoint.y,
      middlePoint.z
    ),
  };
}

///////////////////////////// caculate area //////
/**
 * @param {Cesium.Cartesian3.fromDegreesArrayHeights} a point 1
 * @param {Cesium.Cartesian3.fromDegreesArrayHeights} b point 2
 * @param {Cesium.Cartesian3.fromDegreesArrayHeights} c point 3
 * @returns {Cesium.Cartesian3} nomarl vector of plane create by 3 points above
 *  **/
function unit_normal(a, b, c) {
  let x = Cesium.Matrix3.determinant(
    new Cesium.Matrix3(1, a.y, a.z, 1, b.y, b.z, 1, c.y, c.z)
  );

  let y = Cesium.Matrix3.determinant(
    new Cesium.Matrix3(a.x, 1, a.z, b.x, 1, b.z, c.x, 1, c.z)
  );

  let z = Cesium.Matrix3.determinant(
    new Cesium.Matrix3(a.x, a.y, 1, b.x, b.y, 1, c.x, c.y, 1)
  );
  let magnitude = (x ** 2 + y ** 2 + z ** 2) ** 0.5;
  return new Cesium.Cartesian3(x / magnitude, y / magnitude, z / magnitude);
}

/**
 * ham cat mang thanh cac mang con co do dai tuy chinh
 * @param {Array} arr aray input
 * @param {Int} slice slice number
 * @returns {Array} sliced array
 */
function sliceArrayPoints(arr, slice) {
  let newArr = [];
  for (let i = 0; i < arr.length; i += slice) {
    newArr.push(arr.slice(i, i + slice));
  }
  return newArr;
}

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}
/**
 * Cái tính toán này thì không thể có điểm trùng nhau được,
 * nó bắt buộc phải loại bỏ đi những điểm đó. Do vậy hàm này được sinh ra để giải quyết vấn đề trên
 * @param {Array} arr array wanna unique
 * @returns {Array} return unique array
 */
function uniqueArrayPoint(arr) {
  return sliceArrayPoints(arr, 3)
    .map((i) => i.join())
    .filter(onlyUnique)
    .map((i) => i.split(",").map((ii) => parseFloat(ii)));
}

/**
 * The problem originally was that I had oversimplified.
 * It needs to calculate the unit vector normal to the plane.
 * The area is half of the dot product of that and the total of all the cross products,
 * not half of the sum of all the magnitudes of the cross products.
 * solution: https://stackoverflow.com/questions/12642256/find-area-of-polygon-from-xyz-coordinates
 *
 * array -> unique array -> compute cross product -> dot (cross product, unit_nomarl) -> result
 * @param {Array} poly - array include all points of polygon
 * @returns {Float} return polygon area
 */
export function area(poly, measurement) {
  poly = uniqueArrayPoint(poly);

  if (poly.length < 3) return 0;

  let total = new Cesium.Cartesian3(0, 0, 0);
  for (let i in poly) {
    let vi1 = Cesium.Cartesian3.fromDegreesArrayHeights(poly[i])[0];

    // eslint-disable-next-line eqeqeq
    let vi2 = i == poly.length - 1 ? poly[0] : poly[parseInt(i) + 1];
    vi2 = Cesium.Cartesian3.fromDegreesArrayHeights(vi2)[0];
    let prod = Cesium.Cartesian3.cross(vi1, vi2, new Cesium.Cartesian3());

    total = Cesium.Cartesian3.add(total, prod, new Cesium.Cartesian3());
  }
  let result = Cesium.Cartesian3.dot(
    total,
    unit_normal(
      Cesium.Cartesian3.fromDegreesArrayHeights(poly[0])[0],
      Cesium.Cartesian3.fromDegreesArrayHeights(poly[1])[0],
      Cesium.Cartesian3.fromDegreesArrayHeights(poly[2])[0]
    )
  );
  return measurement === "feet"
    ? meterToFeet(Math.abs(result / 2))
    : Math.abs(result / 2).round(2);
}

////////////
///caculate perimeter

function calLineLength(arrPoints) {
  const firstPoint = new Cesium.Cartesian3.fromDegrees(
    arrPoints.slice(0, 3)[0],
    arrPoints.slice(0, 3)[1],
    arrPoints.slice(0, 3)[2]
  );
  const endPoint = new Cesium.Cartesian3.fromDegrees(
    arrPoints.slice(3)[0],
    arrPoints.slice(3)[1],
    arrPoints.slice(3)[2]
  );

  return meterToFeet(Cesium.Cartesian3.distance(firstPoint, endPoint));
}

function getMiddlePoint(arrPoints) {
  const middlePoint = Cesium.Cartesian3.midpoint(
    new Cesium.Cartesian3.fromArray(arrPoints.slice(0, 3)),
    new Cesium.Cartesian3.fromArray(arrPoints.slice(3)),
    new Cesium.Cartesian3()
  );
  return new Cesium.Cartesian3.fromDegrees(
    middlePoint.x + 0.00001,
    middlePoint.y,
    middlePoint.z
  );
}

export function calPerimeter(arr, measurement) {
  let lineArray = sliceArrayPoints(sliceArrayPoints(arr, 3), 2).map((i) =>
    i
      .join()
      .split(",")
      .map((p) => parseFloat(p))
  );

  let perimeter = 0;
  for (let i of lineArray) {
    perimeter += calLineLength(i);
  }

  return {
    perimeter:
      measurement === "feet" ? meterToFeet(perimeter) : perimeter.round(2),
    midPoint: getMiddlePoint(lineArray[0]),
  };
}
