import { css } from '@emotion/core';
import { focusStyle, placeholder } from '../../style/shared';

export const input = props => css`
  -webkit-box-sizing: border-box;
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-variant: tabular-nums;
    list-style: none;
    font-feature-settings: 'tnum';
    position: relative;
    display: inline-block;
    width: 100%;
    height: 32px;
    padding: 4px 11px;
    color: ${props.theme.color900};
    font-size: inherit;
    line-height: 1.5;
    background-color: ${props.theme.paperBackground600};
    background-image: none;
    border: 1px solid #88888855;
    border-radius: ${props.theme.borderRadius}px;
    transition: all 0.3s;
    ${focusStyle(props)};
    ${placeholder(props)};
`;

export default {
  input
}