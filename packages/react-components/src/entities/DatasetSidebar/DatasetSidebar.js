
import { jsx } from '@emotion/react';
import React, { useContext, useState, useEffect } from 'react';
import { MdInfo, MdClose } from 'react-icons/md'
import ThemeContext from '../../style/themes/ThemeContext';
import * as css from './styles';
import { Row, Col, Tabs } from "../../components";
import { useQuery } from '../../dataManagement/api';
import { Dataset } from '../Dataset/Dataset'
import RouteContext from '../../dataManagement/RouteContext';
import { MemoryRouter } from 'react-router-dom';

const { TabList, Tab, TabPanel, TapSeperator } = Tabs;

export function DatasetSidebar({
  onImageChange,
  onCloseRequest,
  id,
  defaultTab,
  className,
  style,
  ...props
}) {
  const routeConfig = useContext(RouteContext);
  const { data, error, loading, load } = useQuery(DATASET, { lazyLoad: true });
  const [activeId, setTab] = useState(defaultTab || 'details');
  const theme = useContext(ThemeContext);

  useEffect(() => {
    if (typeof id !== 'undefined') {
      load({ variables: { key: id } });
    }
  }, [id]);


  return <RouteContext.Provider value={{ ...routeConfig, alwaysUseHrefs: true }}>
    <MemoryRouter initialEntries={['/']}>
      <Tabs activeId={activeId} onChange={id => setTab(id)}>
        <Row wrap="nowrap" style={style} css={css.sideBar({ theme })}>
          <Col shrink={false} grow={false} css={css.detailDrawerBar({ theme })}>
            <TabList style={{ paddingTop: '12px' }} vertical>
              {onCloseRequest && <>
                <Tab direction="left" onClick={onCloseRequest}>
                  <MdClose />
                </Tab>
                <TapSeperator vertical />
              </>}
              <Tab tabId="details" direction="left">
                <MdInfo />
              </Tab>
            </TabList>
          </Col>
          <Col shrink={false} grow={false} css={css.detailDrawerContent({ theme })} >
            <TabPanel tabId='details'>
              <Row direction="column">
                <Dataset id={id} disableCatalog style={{maxWidth: '100%'}}/>
              </Row>
            </TabPanel>
          </Col>
        </Row>
      </Tabs>
    </MemoryRouter>
  </RouteContext.Provider>
};

const DATASET = `
query dataset($key: ID!){
  dataset(key: $key) {
    title
    created
    description
    temporalCoverages
    logoUrl
    publishingOrganizationKey
    publishingOrganizationTitle
    volatileContributors {
      firstName
      lastName
      position
      organization
      address
      userId
      type
      _highlighted
      roles
    }
    geographicCoverages {
      description
      boundingBox {
        minLatitude
        maxLatitude
        minLongitude
        maxLongitude
        globalCoverage
      }
    }
    taxonomicCoverages {
      description
      coverages {
        scientificName
        rank {
          interpreted
        }
      }
    }
    bibliographicCitations {
      identifier
      text
    }
    samplingDescription {
      studyExtent
      sampling
      qualityControl
      methodSteps
    } 
    citation {
      text
    }
    license
  }
}
`;

