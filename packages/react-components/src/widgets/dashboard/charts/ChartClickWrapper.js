import React, { useCallback, useContext } from 'react';
import qs from 'query-string';
import { useLocation, useHistory } from 'react-router-dom';
import { FilterContext } from '../../Filter/state';
import { mergeDeep } from '../../../utils/util';

export default function ChartClickWrapper({children, ...props}) {
  const { detailsRoute } = props;

  const location = useLocation();
  const history = useHistory();
  const { filter: filterContext, setFilter } = useContext(FilterContext);
  
  const handleRedirect = useCallback(({ filter }) => {
    if (!filter) return;

    const mergedFilter = mergeDeep({}, filterContext, { must: filter });
    if (detailsRoute) {
      const newLocation = `${detailsRoute || location.pathname}?${qs.stringify(filter)}`;
      history.push(newLocation);
    } else {
      setFilter(mergedFilter);
    }
  }, [detailsRoute, location.pathname, filterContext]);

  return React.cloneElement(children, { handleRedirect, ...props })
}
