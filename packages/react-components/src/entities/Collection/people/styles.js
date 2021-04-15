import { css } from '@emotion/react';
// import { focusStyle } from '../../style/shared';

export const people = ({ ...props }) => css`
  display: flex;
`;

export const navItem = ({ isActive, ...props }) => css`
  padding: 5px 10px;
  background: ${isActive ? '#ddd' : null};
  font-weight: ${isActive ? '500' : null};
  line-height: 1em;
  cursor: pointer;
`;

export const search = ({ ...props }) => css`
  display: flex;
  margin: 12px;
  margin-left: 0;
  width: 400px;
  max-width: 100%;
  input {
    margin-right: 12px;
    height: auto;
  }
`;

export const nav = ({ ...props }) => css`
  flex: 0 0 280px;
  padding-right: 12px;
  font-size: 14px;
  ul {
    list-style: none;
    padding: 0;
    margin-left: -10px;
  }
`;

export const staffList = ({ ...props }) => css`
  flex: 1 1 100%;
`;

export const staffPosition = ({ ...props }) => css`
  margin-bottom: 18px;
  font-size: 85%;
  color: #888;
`;

export const staffDesc = ({ ...props }) => css`
  flex: 1 1 auto;
  margin: 12px;
  h4 {
    margin: 0;
  }
`;

export const staffContact = ({ ...props }) => css`
  flex: 0 0 220px;
  display: flex;
  text-align: center;
  flex-direction: column;
  >div {
    flex: 1 1 auto;
  }
  background: #eee;
  padding: 12px;
`;

export const staffImage = ({ ...props }) => css`
  margin: 12px;
  flex: 0 0 auto;
`;
export const person = ({ ...props }) => css`
  background: white;
  margin: 12px;
  display: flex;
  flex-wrap: nowrap;
  border: 1px solid #eee;
`;
