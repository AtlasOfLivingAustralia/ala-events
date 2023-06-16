import React from 'react';
import { MemoryRouter as Router, Route } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';
import AddressBar from '../../StorybookAddressBar';
import Annotations from './Annotations';

export default {
  title: 'Tools/Annotations',
  component: Annotations
};

export const Example = () => <Router initialEntries={[`/annotations`]}>
  <QueryParamProvider ReactRouterRoute={Route}>
    <AddressBar />
    <Annotations />
  </QueryParamProvider>
</Router>;

Example.story = {
  name: 'WIP - Annotations',
};