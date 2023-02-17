import { jsx, css } from '@emotion/react';
import React from 'react';
import { Classification, HyperText, Properties } from '../../components';
import { Term as T, Value as V, Property } from '../../components/Properties/Properties';
import { Card, CardHeader2 } from '../shared';
import { ImBook as ReferenceIcon } from 'react-icons/im'
import { MdEdit } from 'react-icons/md';
import { TbCircleDot } from 'react-icons/tb';
import { prettifyEnum, prettifyString } from '../../utils/labelMaker/config2labels';

export function Organism({
  specimen,
  ...props
}) {
  if (!specimen) return null;
  return <Card padded={false} {...props}>
    <div css={css`padding: 12px 24px;`}>
      <CardHeader2>Organism</CardHeader2>
      <div css={css`margin-top: 12px;`}>
        <Properties dense>
          <Property label="Name" value="Bill 'Seagull' Jonez" />
          <Property label="Scope" value="Individual" />
          <Property label="Observations" value="322" />

          {/* {['associatedSequences',
            'preparations',
            'catalogNumber',
            'otherCatalogNumbers',
            'recordedBy',
            'recordedById',
            'disposition',
            'recordNumber',
            'associatedReferences',
            'institutionCode',
            'collectionCode',
            'ownerInstitutionCode',]
            .filter(x => !!specimen.catalogItem[x]).map(x => <Property label={prettifyString(x)} key={x} value={specimen.catalogItem[x]} />)} */}
        </Properties>
      </div>
    </div>
  </Card>
};
