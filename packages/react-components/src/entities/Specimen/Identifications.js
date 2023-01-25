import { jsx, css } from '@emotion/react';
import React, { useState } from 'react';
import { Classification, Properties, Button, Switch } from '../../components';
import { Term, Value } from '../../components/Properties/Properties';
import { Card, CardHeader2 } from '../shared';
import { ImBook as ReferenceIcon } from 'react-icons/im'
import { MdEdit } from 'react-icons/md';
import { TbCircleDot } from 'react-icons/tb';
import { prettifyString } from '../../utils/labelMaker/config2labels';
import { FormattedDate } from '../shared/header';
import { FormattedMessage } from 'react-intl';

export function Identifications({
  specimen,
  ...props
}) {
  const [showHistory, setHistoryState] = useState(false);
  if (!specimen) return null;
  const identifiedBy = specimen.identifications.current.identifiedBy;
  return <Card padded={false} css={css`position: relative;`} {...props}>
    <MdEdit css={css`position: absolute; top: 0; right: 0; margin: 12px; font-size: 18px;`} />
    <div css={css`padding: 12px 24px;`}>
      <CardHeader2>Identification</CardHeader2>
      <div css={css`margin-top: 12px;`}>
        <Properties>
          <Term>Scientific name</Term>
          <div>
            <Value>
              <div>{specimen.identifications.current.taxa[0].scientificName}</div>
            </Value>
            {specimen.identifications.current.taxa[0].scientificName !== specimen.identifications.current.taxa[0].gbif.usage.name && <Value>
              {specimen.identifications.current.taxa[0].gbif.usage.name} <span css={css`color: #aaa;`}><ReferenceIcon style={{ verticalAlign: 'middle', margin: '0 4' }} /> GBIF</span>
            </Value>}
          </div>

          {identifiedBy && <>
            <Term>Identified by</Term>
            <Value>{specimen.identifications.current.identifiedBy.join(', ')}</Value>
          </>}

          <Term>Nature of ID</Term>
          <Value>{prettifyString(specimen.identifications.current.identificationType)}</Value>

          <Term>Classification</Term>
          <div>
            <Value>
              <Classification>
                {['kingdom', 'phylum', 'class', 'order', 'family', 'genus'].map(rank => {
                  const rankName = specimen.identifications.current.taxa[0]?.[rank];
                  if (!rankName) return null;
                  return <span key={rank}>{rankName}</span>
                })}
              </Classification>
            </Value>
            <Value>
              <Classification css={css`display: inline-block; margin-inline-end: 4px;`}>
                {specimen.identifications.current.taxa[0].gbif.classification.map(rank => <span key={rank.key}>{rank.name}</span>)}
              </Classification>
              <span css={css`color: #aaa; display: inline-block;`}><ReferenceIcon style={{ verticalAlign: 'middle' }} /> GBIF</span>
            </Value>
          </div>
        </Properties>
        <label style={{ display: 'block', textAlign: 'end', fontSize: '0.9em' }}>
          <FormattedMessage id="material.showHistory" defaultMessage="Show history" />
          <Switch checked={showHistory} onChange={() => setHistoryState(!showHistory)} style={{ marginInlineStart: 8 }} />
        </label>
      </div>
    </div>
    {showHistory && <div css={css`padding: 12px 24px; background: var(--paperBackground800); border-top: 1px solid var(--paperBorderColor);`}>
      <h3 css={css`color: var(--color400); font-weight: normal; font-size: 16px;`}>Identifications history</h3>
      <ul css={css`margin: 0; padding: 0; list-style: none;`}>

        {specimen.identifications.history.map(identification => {
          return <li key={identification.identificationId} css={css`display: flex; margin-bottom: 12px;`}>
            <div css={css`flex: 0 0 150px; margin-inline-end: 24px; color: var(--color400); margin-top: 18px;`}>
              <FormattedDate value={identification.dateIdentified}
                year="numeric"
                month="long"
                day="2-digit" />
            </div>
            <div css={css`flex: 1 1 auto;`}>
              <Card padded={false} css={css`padding: 12px;`}>
                <Identification identification={identification} />
              </Card>
            </div>
          </li>
        })}


        {/* 
        ITEM WITH SOURCE LISTED ABOVE
        <li css={css`display: flex;`}>
          <div css={css`flex: 0 0 auto; margin-inline-end: 24px; color: var(--color400); margin-top: 1em;`}>
            24 June 2019
          </div>
          <div css={css`flex: 1 1 auto;`}>
            <Card padded={false}>
              <div css={css`padding: 8px 12px; border-bottom: 1px solid var(--paperBorderColor); display: flex; align-items: center;`}>
                <Properties dense css={css`flex: 1 1 auto;`}>
                  <Term>Source</Term>
                  <Value>Plazi</Value>
                </Properties>
                <div css={css`flex: 0 0 auto;`}>
                  <div css={css`padding: 3px; background: #ffd41e; box-shadow: 0 1px 2px rgba(0,0,0,.05); border-radius: var(--borderRadiusPx);`}>
                    <TbCircleDot css={css`font-size: 18px; vertical-align: middle;`} />
                  </div>
                </div>
              </div>
              <div css={css`padding: 12px;`}>
                <Properties dense>
                  <Term>Scientific name</Term>
                  <Value>Netta</Value>

                  <Term>Identified by</Term>
                  <Value>John R. Demboski</Value>

                  <Term>Nature of ID</Term>
                  <Value>Molecular</Value>

                  <Term>Classification</Term>
                  <Value>
                    <Classification>
                      <span>Animalia</span>
                      <span>Chordata</span>
                      <span>Mam.</span>
                      <span>Sciuro.</span>
                      <span>Tamias</span>
                    </Classification>
                  </Value>
                </Properties>
              </div>
            </Card>
          </div>
        </li> */}


      </ul>
    </div>}

  </Card>
};

function Identification({ identification, ...props }) {
  return <Properties>
    <Term>Scientific name</Term>
    <div>
      <Value>
        <div>{identification.taxa[0].scientificName}</div>
      </Value>
    </div>

    {identification.identifiedBy && <>
      <Term>Identified by</Term>
      <Value>{identification.identifiedBy.join(', ')}</Value>
    </>}

    <Term>Nature of ID</Term>
    <Value>{prettifyString(identification.identificationType)}</Value>

    <Term>Classification</Term>
    <div>
      <Value>
        <Classification>
          {['kingdom', 'phylum', 'class', 'order', 'family', 'genus'].map(rank => {
            const rankName = identification.taxa[0]?.[rank];
            if (!rankName) return null;
            return <span key={rank}>{rankName}</span>
          })}
        </Classification>
      </Value>
    </div>
  </Properties>
}