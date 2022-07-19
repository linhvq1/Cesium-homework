import axios from "axios";
export const getDataXmlAPI = async () => {
  const respon = await axios.get(
    "https://s3.amazonaws.com/CMSTest/squaw_creek_container_info.xml",
    {
      "Content-Type": "application/xml; charset=utf-8",
    }
  );
  return respon && respon.data;
};

const convertStringToHtml = (str) => {
    const parser = new DOMParser();
    const doc3 = parser.parseFromString(str, "application/xml");
    return doc3;
  };
  export const handlerData = (respon, element, atribute) => {
    const $ = convertStringToHtml(respon).querySelectorAll.bind(
      convertStringToHtml(respon)
    );
    let data = {};
    Object.values($(element)).map(
      (item) =>
        (data = {
          ...data,
          [item.id]: item.getAttribute(atribute).replace(/\s/g, "").split(","),
        })
    );
    return data;
  };

export function xmlToJson(xml) {
    // Create the return object
    var obj = {}, i, j, attribute, item, nodeName, old;

    if (xml.nodeType === 1) { // element
        // do attributes
        if (xml.attributes.length > 0) {
            obj["attributes"] = {};
            for (j = 0; j < xml.attributes.length; j = j + 1) {
                attribute = xml.attributes.item(j);
                obj["attributes"][attribute.nodeName] = attribute.nodeValue;
            }
        }
    }
    // do children
    if (xml.hasChildNodes()) {
        for (i = 0; i < xml.childNodes.length; i = i + 1) {
            item = xml.childNodes.item(i);
            nodeName = item.nodeName;
            if (nodeName !== '#text') {
                if ((obj[nodeName]) === undefined) {
                    obj[nodeName] = xmlToJson(item);
                } else {
                    if ((obj[nodeName].push) === undefined) {
                        old = obj[nodeName];
                        obj[nodeName] = [];
                        obj[nodeName].push(old);
                    }
                    obj[nodeName].push(xmlToJson(item));
                }
            }
        }
    }
    return obj;
};

export function parseXml(xml) {
    const parser = new DOMParser();

    const doc = parser.parseFromString(xml, "application/xml");
    const errorNode = doc.querySelector('parsererror');
    if (errorNode) {
        console.log('failed to load')
    } else {
        console.log('ok ok')
    }
    return doc
    }

export default async function getData() {
    const response = await fetch(
        "https://s3.amazonaws.com/CMSTest/squaw_creek_container_info.xml"
    );
    const data = await response.text();
    const dom = parseXml(data);
    const dataXML = xmlToJson(dom);
    
    return dataXML["STRUCTURES"]["ROOF"];
    }
      


export async function handleData(dataTypes, atrribute) {
    const Roof = await getData();
    if (dataTypes === "FACES")
      return Roof[dataTypes][dataTypes.replace('S','')].map((i) =>
        atrribute
          ? i["POLYGON"]["attributes"][atrribute]
          : i["POLYGON"]["attributes"]
      );

    return Roof[dataTypes][dataTypes.replace('S', '')].map((i) =>
      atrribute ? i["attributes"][atrribute] : i["attributes"]
    );
  }
  
  export async function getPointFromLine2(l, setData) {
    const lines = await handleData("LINES");
    const points = await handleData("POINTS");
    let lol = [];
    lines
      .filter((i) => i["id"] === l)[0]["path"].replace(" ", "")
      .split(",")
      .map((p) =>
        points
          .filter((ii) => ii["id"] === p)[0]["data"].replace(" ", "")
          .split(",")
          .map((pp) => lol.push(parseFloat(pp)))
      );

      setData(lol)
    return lol;
  }
