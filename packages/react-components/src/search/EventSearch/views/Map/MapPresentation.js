
import { jsx } from '@emotion/react';
import React, { useContext, useState, useEffect, useCallback } from "react";
import {Col, DetailsDrawer, Row, Tabs} from '../../../../components';
import { OccurrenceSidebar } from '../../../../entities';
import ThemeContext from '../../../../style/themes/ThemeContext';
import { useDialogState } from "reakit/Dialog";
import ListBox from './ListBox';
import { ViewHeader } from '../ViewHeader';
import MapboxMap from './MapboxMap';
import * as css from './map.styles';
import {MdClose, MdInfo, MdInsertPhoto} from "react-icons/md";
import {ClusterIcon} from "../../../../components/Icons/Icons";
import {ImageDetails} from "../../../../entities/OccurrenceSidebar/details/ImageDetails";
import {Intro} from "../../../../entities/OccurrenceSidebar/details/Intro";
import {Cluster} from "../../../../entities/OccurrenceSidebar/details/Cluster";
import {EventSidebar} from "../../../../entities/EventSidebar/EventSidebar";

function Map({ labelMap, query, pointData, pointError, pointLoading, loading, total, predicateHash, registerPredicate, loadPointData, defaultMapSettings, mapLoaded, ...props }) {
  const dialog = useDialogState({ animated: true, modal: false });
  const theme = useContext(ThemeContext);

  const [activeId, setActive] = useState();
  const [activeItem, setActiveItem] = useState();

  const [listVisible, showList] = useState(false);

  const items = pointData?.eventSearch?.documents?.results || [];

  useEffect(() => {
    setActiveItem(items[activeId]);
  }, [activeId, items]);

  const nextItem = useCallback(() => {
    setActive(Math.min(items.length - 1, activeId + 1));
  }, [items, activeId]);

  const previousItem = useCallback(() => {
    setActive(Math.max(0, activeId - 1));
  }, [items, activeId]);

  return <>
    <DetailsDrawer href={`${activeItem?.eventID}`} dialog={dialog} nextItem={nextItem} previousItem={previousItem}>
      <EventSidebar
          eventID={activeItem?.eventID}
          datasetKey={activeItem?.datasetKey}
          defaultTab='details'
          style={{ maxWidth: '100%', width: 700, height: '100%' }}
          onCloseRequest={() => dialog.setVisible(false)}
          setActiveEventID={() => console.log('Fix me')}
      />
    </DetailsDrawer>
    <div css={css.mapArea({theme})}>
      <ViewHeader message="counts.nResultsWithCoordinates" loading={loading} total={total} />
      <div style={{position: 'relative', height: '100%', flex: '1 1 auto', display: 'flex', flexDirection: 'column'}}>
        {listVisible && <ListBox  onCloseRequest={e => showList(false)} 
                                  labelMap={labelMap}
                                  onClick={({ index }) => { dialog.show(); setActive(index) }} 
                                  data={pointData} error={pointError} 
                                  loading={pointLoading} 
                                  css={css.resultList({})} 
                                  />}
        <MapboxMap
            defaultMapSettings={defaultMapSettings}
            predicateHash={predicateHash}
            css={css.mapComponent({theme})}
            theme={theme}
            query={query}
            onMapClick={e => showList(false)}
            onPointClick={data => { showList(true); loadPointData(data) }}
            registerPredicate={registerPredicate}
        />
      </div>
    </div>
  </>;
}

export default Map;