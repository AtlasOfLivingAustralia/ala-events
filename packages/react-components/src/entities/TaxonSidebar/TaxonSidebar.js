import React, { useContext, useState, useEffect } from 'react';
import ThemeContext from '../../style/themes/ThemeContext';
import * as css from './styles';
import { Row, Col, Tabs } from '../../components';
import { useQuery } from '../../dataManagement/api';
import { Header } from './Header';
import { MdClose, MdInfo, MdImage } from 'react-icons/md';

const { TabList, Tab, TapSeperator } = Tabs;
const { TabPanel } = Tabs;

export function TaxonSidebar({
  onCloseRequest,
  specimen,
  defaultTab,
  className,
  style,
  ...props
}) {
  const { data, error, loading, load } = useQuery(EVENT, { lazyLoad: true });
  const [activeId, setTab] = useState('details');
  const { catalogNumber } = specimen;
  const theme = useContext(ThemeContext);

  useEffect(() => {
    if (typeof catalogNumber !== 'undefined') {
      load({
        variables: {
          predicate: {
            type: 'and',
            predicates: [
              {
                type: 'equals',
                key: 'catalogNumber',
                value: catalogNumber,
              },
            ],
          },
        },
        size: 50,
        from: 0,
      });
    }
  }, [specimen]);

  useEffect(() => {
    if (!loading) {
      setTab('details');
    }
  }, [data, loading]);

  const isLoading = loading || !data;
  console.log(loading, data);

  return (
    <Tabs activeId={activeId} onChange={(id) => setTab(id)}>
      <Row wrap='nowrap' style={style} css={css.sideBar({ theme })}>
        <Col shrink={false} grow={false} css={css.detailDrawerBar({ theme })}>
          <TabList style={{ paddingTop: '12px' }} vertical>
            {onCloseRequest && (
              <>
                <Tab direction='left' onClick={onCloseRequest}>
                  <MdClose />
                </Tab>
                <TapSeperator vertical />
              </>
            )}
            <Tab tabId='details' direction='left'>
              <MdInfo />
            </Tab>
          </TabList>
        </Col>
        <Col
          shrink={false}
          grow={false}
          css={css.detailDrawerContent({ theme })}
        >
          {isLoading && (
            <Col
              style={{ padding: '12px', paddingBottom: 50, overflow: 'auto' }}
              grow
            >
              <h2>{catalogNumber} - Loading trial information...</h2>
            </Col>
          )}
          {!isLoading && (
            <>
              <Header data={specimen} error={error} />
              {(() => {
                const trials = data.results.documents.results.filter(
                  ({ eventType }) => eventType.concept === 'Trial'
                );
                return trials.length > 0 ? (
                  <TabPanel tabId='details'>Hello world!</TabPanel>
                ) : (
                  <>No trial data found.</>
                );
              })()}
            </>
          )}
        </Col>
      </Row>
    </Tabs>
  );
}

const EVENT = `
query list($predicate: Predicate, $offset: Int, $limit: Int){
  results: eventSearch(
    predicate:$predicate,
    size: $limit, 
    from: $offset
    ) {
    documents {
      size
      from
      total
      results {
        eventID
        samplingProtocol
        eventType {
          concept
        }
        parentEventID
        locationID
        month
        year
        datasetTitle
        datasetKey
        formattedCoordinates
        stateProvince
        countryCode
        measurementOrFactTypes
        occurrenceCount
        speciesCount
        eventTypeHierarchyJoined
        locality
        measurementOrFacts {
          measurementID
          measurementType
          measurementUnit
          measurementValue
          measurementMethod
          measurementRemarks
          measurementAccuracy
          measurementDeterminedBy
          measurementDeterminedDate
        }
      }
    }
  }
}
`;
