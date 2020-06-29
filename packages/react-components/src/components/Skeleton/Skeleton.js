/** @jsx jsx */
import { jsx } from '@emotion/core';
import ThemeContext from '../../style/themes/ThemeContext';
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
// import { oneOfMany } from '../../utils/util';
import styles from './styles';

export const Skeleton = ({
  width = '100%',
  ...props
}) => {
  const theme = useContext(ThemeContext);
  let w;
  if (width === 'random') {
    w = `${Math.floor(Math.random()*50+50)}%`;
  } else if (typeof w === 'number') {
    w = `${Math.floor(Math.random()*50+50)}px`;
  } else {
    w = width;
  }
  return <span css={styles.skeleton({theme, width: w})} {...props} />
};

Skeleton.displayName = 'Skeleton';

Skeleton.propTypes = {
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};
