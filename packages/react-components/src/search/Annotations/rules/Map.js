import React, { useRef, useCallback, useState, useEffect, useContext } from 'react';
import { css } from '@emotion/react';
import 'ol/ol.css';
import { Map, Overlay, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import { transform } from 'ol/proj';
import { Style, Fill, Stroke } from 'ol/style';
import { WKT } from 'ol/format';
import Select from 'ol/interaction/Select';
import { altKeyOnly, click, pointerMove } from 'ol/events/condition';
import { colorMap } from './colorMap';

import MapComponentOL from '../../OccurrenceSearch/views/Map/OpenlayersMap';
import MapPresentation from '../../OccurrenceSearch/views/Map/MapPresentation';
import SearchContext from '../../SearchContext';
import Draw from 'ol/interaction/Draw.js';
import { MdDelete, MdDeleteOutline, MdDraw } from 'react-icons/md';

import { FilterContext } from '../../../widgets/Filter/state';
import { filter2v1 } from '../../../dataManagement/filterAdapter';
import { Button } from '../../../components';

var format = new WKT();

function itemToFeature({ geometry, ...item }) {
  // Parse the WKT string using OpenLayers
  try {
    var feature = format.readFeature(geometry, {
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:4326',
    });

    // Set the color property on the feature's properties object
    feature.setProperties({ ...item, color: colorMap[item.annotation] || colorMap['OTHER'] });
    return { feature };
  } catch (e) {
    return { error: e }
  }
}

const mapConfig = {
  "basemapStyle": "https://graphql.gbif-staging.org/unstable-api/map-styles/4326/gbif-raster?styleName=geyser&background=%23e5e9cd&language=en&pixelRatio=2",
  "projection": "EPSG_4326"
};

const OpenLayersMap = ({ data, onPolygonSelect }) => {
  const [params, setParams] = useState({});
  const [polygons, setPolygons] = useState([]);
  const [drawActive, setDrawState] = useState(false);
  const [deleteActive, setDeleteState] = useState(false);
  const currentFilterContext = useContext(FilterContext);
  const { rootPredicate, predicateConfig } = useContext(SearchContext);
  const [map, setMap] = useState(null);

  const popupRef = useRef(null);
  const popupCloseRef = useRef(null);
  const [selectedFeatures, setSelectedFeatures] = React.useState(null);

  const handleMapCreation = useCallback((olMap) => {
    setMap(olMap);
  }, []);


  const handleLayerChange = useCallback((map) => {
    if (map) {
      // first remove the existing annotations layer
      map.getLayers().getArray()
        .filter(layer => layer.get('name') === 'Annotations')
        .forEach(layer => map.removeLayer(layer));

      // then add the new annotations layer
      const vectorLayer = new VectorLayer({
        source: new VectorSource({
          features: data.map(itemToFeature).filter(({ error }) => !error).map(({ feature }) => feature)
        }),
        name: 'Annotations',
        style: feature => {
          const { color } = feature.getProperties();
          return new Style({
            fill: new Fill({
              color: color + '40'
            }),
            stroke: new Stroke({
              color: color,
              width: 2
            })
          });
        }
      });
      vectorLayer.setZIndex(1000);
      map.addLayer(vectorLayer);
    }
  }, [map, data]);

  useEffect(() => {
    const { v1Filter, error } = filter2v1(currentFilterContext.filter, predicateConfig);
    const filter = { ...v1Filter, ...rootPredicate };
    setParams(filter);
    setSelectedFeatures();
  }, [currentFilterContext.filterHash]);

  useEffect(() => {
    handleLayerChange(map);
  }, [data, map]);

  useEffect(() => {
    let clickListener;
    if (map) {
      clickListener = function (e) {
        // if the draw is active, we don't want to show the popup
        if (drawActive) return;
        // Find the feature that was clicked on
        const clickedFeatures = [];
        // var feature = map.forEachFeatureAtPixel(e.pixel, function (feature, layer) {
        map.forEachFeatureAtPixel(e.pixel, function (feature, layer) {
          // return feature;
          clickedFeatures.push(feature);
        }, {
          layerFilter: function (layer) {
            return layer.get('name') === 'Annotations';
          }
        });

        const feature = clickedFeatures[0];
        // If we found a feature, create a popup and display its properties
        if (feature) {
          setSelectedFeatures(clickedFeatures.map(f => f.getProperties()));

          // Call your function with the feature properties
          onPolygonSelect(feature.getProperties(), clickedFeatures.map(f => f.getProperties().id));

          // Create the popup overlay
          var popupOverlay = new Overlay({
            element: popupRef.current,
            positioning: 'bottom-center',
            offset: [0, -15],
            autoPan: true,
            autoPanAnimation: {
              duration: 250
            }
          });

          popupCloseRef.current.onclick = function () {
            popupOverlay.setPosition(undefined);
            popupCloseRef.current.blur();
            setSelectedFeatures();
            selectClick.getFeatures().clear();
            return false;
          };


          // Add the popup overlay to the map and show it at the clicked location
          map.addOverlay(popupOverlay);
          popupOverlay.setPosition(e.coordinate);
        }
      }
      map.on('click', clickListener);
    }
    return function cleanup() {
      if (clickListener && map) {
        map.un('click', clickListener);
      }
    };
  }, [map, data, drawActive]);

  return <>
  <div>{polygons.length}</div>
    <MapPresentation mapConfig={mapConfig}
      params={params}
      query={params}
      css={css`width: 100%; height: 100%;`}
      mapProps={
        {
          onMapCreate: handleMapCreation,
          onLayerChange: handleLayerChange,
          polygons,
          onPolygonsChanged: (polygonList, { action } = {}) => {
            setPolygons(polygonList);
            if (action === 'DELETE') {
              setDeleteState(false);
            }
          },
          drawMode: drawActive,
          deleteMode: deleteActive
        }
      }
      AdditionalButtons={({emitEvent, ...props}) =>
        <>
          <Button look={drawActive ? 'primary' : 'ghost'} onClick={() => {
            setDrawState(!drawActive);
            setDeleteState(false);
          }}><MdDraw /></Button>
          <Button look={deleteActive ? 'danger' : 'ghost'} onClick={() => {
            setDeleteState(!deleteActive);
            setDrawState(false);
          }}><MdDeleteOutline /></Button>
        </>
      }
    />
    <div ref={popupRef} css={popup} style={{ display: selectedFeatures ? 'block' : 'none' }}>
      <a ref={popupCloseRef} href="#" id="popup-closer" css={popupCloser}></a>
      {selectedFeatures && <div id="popup-content">{selectedFeatures.map(x => x.annotation).join(', ')}</div>}
    </div>
  </>
};

export default OpenLayersMap;

const popup = css`
  position: absolute;
  background-color: white;
  box-shadow: 0 1px 4px rgba(0,0,0,0.2);
  padding: 15px;
  border-radius: 10px;
  border: 1px solid #cccccc;
  bottom: 12px;
  left: -50px;
  min-width: 50px;
  &:after, &:before {
    top: 100%;
    border: solid transparent;
    content: " ";
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
  }
  &:after {
    border-top-color: white;
    border-width: 10px;
    left: 48px;
    margin-left: -10px;
  }
  &:before {
    border-top-color: #cccccc;
    border-width: 11px;
    left: 48px;
    margin-left: -11px;
  }
`;

const popupCloser = css`
  text-decoration: none;
  position: absolute;
  top: 2px;
  right: 8px;
  
  &:after {
    content: "✖";
  }
`;