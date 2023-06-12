import { jsx, css } from '@emotion/react';
import React, { useContext, useState, useEffect, useCallback } from "react";
import { Button } from '../../../../components';
import ThemeContext from '../../../../style/themes/ThemeContext';
import { MdZoomIn, MdZoomOut } from 'react-icons/md'

import * as mapCss from '../../../OccurrenceSearch/views/Map/map.styles';
import env from '../../../../../.env.json';
import SiteContext from '../../../../dataManagement/SiteContext';
import { ViewHeader } from '../../../OccurrenceSearch/views/ViewHeader';
import MercatorPointMap from './MercatorPointMap';
import { ResourceAction, ResourceLink } from '../../../../components/resourceLinks/resourceLinks';
import LocaleContext from '../../../../dataManagement/LocaleProvider/LocaleContext';
import RouteContext from '../../../../dataManagement/RouteContext';
const pixelRatio = parseInt(window.devicePixelRatio) || 1;

const defaultLayerOptions = {
  // ARCTIC: ['NATURAL', 'BRIGHT', 'DARK'],
  // PLATE_CAREE: ['NATURAL', 'BRIGHT', 'DARK'],
  MERCATOR: ['BRIGHT', 'NATURAL'],
  // ANTARCTIC: ['NATURAL', 'BRIGHT', 'DARK']
};

function Map({ total, geojsonData, filterHash, labelMap, query, q, loading, defaultMapSettings, ...props }) {
  const theme = useContext(ThemeContext);
  const localeContext = useContext(LocaleContext);
  const routeContext = useContext(RouteContext);
  const [latestEvent, broadcastEvent] = useState();

  const FeatureComponent = ({data}) => <ResourceLink localeContext={localeContext} routeContext={routeContext} type='institutionKey' id={data.key}>{data.name}</ResourceLink>;

  return <>
    <div css={mapCss.mapArea({ theme })}>
      <ViewHeader message="counts.nResultsWithCoordinates" loading={loading} total={total} />
      <div style={{ position: 'relative', height: '200px', flex: '1 1 auto', display: 'flex', flexDirection: 'column' }}>
        <div css={mapCss.mapControls({ theme })}>
          <Button appearance="text" onClick={() => broadcastEvent({ type: 'ZOOM_IN' })}><MdZoomIn /></Button>
          <Button appearance="text" onClick={() => broadcastEvent({ type: 'ZOOM_OUT' })}><MdZoomOut /></Button>
        </div>
        <MercatorPointMap
          defaultMapSettings={defaultMapSettings}
          loading={loading}
          geojsonData={geojsonData}
          filterHash={filterHash}
          latestEvent={latestEvent}
          FeatureComponent={FeatureComponent}
          getComponent={() => data => <ResourceLink type='institutionKey' id={data.key}>{data.name}</ResourceLink>}
          style={{ width: '100%', height: '100%' }} />
      </div>
    </div>
  </>;
}

export default Map;