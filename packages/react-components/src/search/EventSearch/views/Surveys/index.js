import React from "react";
import PredicateDataFetcher from '../../../PredicateDataFetcher';
import { List } from './List';
import {ErrorBoundary} from "../../../../components";

const SURVEYS_QUERY = `
query list($predicate: Predicate, $offset: Int, $limit: Int){
  results: eventSearch(
    predicate:$predicate,
    size: $limit, 
    from: $offset
    ) {
    documents {
      total
    }
    facet(size: 100, from: 0) {
      surveyID {
        key
        count
      }
    } 
  }
}
`;

function Table() {
    return <PredicateDataFetcher
        queryProps={{ throwAllErrors: true }}
        graphQuery={SURVEYS_QUERY}
        queryTag='surveys'
        limit={50}
        presentation={List}
    />
}

export default props => <ErrorBoundary><Table {...props} /></ErrorBoundary>;