
import { css, jsx } from '@emotion/react';
import ThemeContext from '../../style/themes/ThemeContext';
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Button as ButtonA11y } from "reakit/Button";
import * as styles from './Button.styles';
import { getClasses } from '../../utils/util';
import { MdMoreHoriz, MdClose } from 'react-icons/md';
import { Menu, MenuAction } from '../Menu/Menu';

const truncateStyle = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap'
};

export const Button = React.forwardRef(({
  className = '',
  loading = false,
  isFullWidth = false,
  isIcon = false,
  appearance,
  look = 'primary',
  children,
  truncate,
  ...props
}, ref) => {
  appearance = appearance || look;
  const theme = useContext(ThemeContext);
  const { classesToApply, classNames } = getClasses(theme.prefix, 'button', { appearance, loading, isFullWidth }, className);
  return <ButtonA11y ref={ref} {...classNames} css={css`
        ${styles.button(theme)}
        ${classesToApply.map(x => styles[x](theme))};
`} {...props}>
    {truncate ? <span style={truncateStyle}>{children}</span> : children}
    {/* <span style={truncate ? truncateStyle : {}}>
      {children}
    </span> */}
  </ButtonA11y>
});

Button.displayName = 'Button'

Button.propTypes = {
  as: PropTypes.oneOf(['button', 'a', 'input', 'span', 'div']),
  className: PropTypes.string,
  appearance: PropTypes.oneOf(['primary', 'primaryOutline', 'outline', 'ghost', 'danger', 'link', 'text']),
  loading: PropTypes.bool,
  block: PropTypes.bool,
}

export const ButtonGroup = ({
  ...props
}) => {
  const theme = useContext(ThemeContext);
  return <div css={styles.group({ theme })} {...props} />
};

ButtonGroup.displayName = 'ButtonGroup'

export const FilterButton = React.forwardRef(({
  isActive,
  onClearRequest = () => { },
  onClick,
  loading,
  children,
  title,
  truncate,
  isNegated = false,
  ...props
}, ref) => {
  if (!isActive) {
    return <ButtonGroup {...props}>
      <Button {...props} ref={ref} loading={loading} appearance="primaryOutline" onClick={onClick}>{children}</Button>
    </ButtonGroup>
  }
  return <ButtonGroup style={{ maxWidth: '100%' }}>
    {isNegated && <Button {...props} title="Negated filter" appearance="primary" onClick={onClick} loading={loading}><span>Exclude</span></Button>}
    <Button {...props} style={{ maxWidth: 400 }} title={title} truncate={truncate} appearance="primary" ref={ref} onClick={onClick} loading={loading}>{children}</Button>
    <Button appearance="primary" onClick={onClearRequest} style={{ flex: '0 0 auto' }}>
      <MdClose style={{ verticalAlign: 'middle' }} />
    </Button>
  </ButtonGroup>
});

FilterButton.propTypes = {
  isActive: PropTypes.bool,
  onClearRequest: PropTypes.func,
  onClick: PropTypes.func,
  children: PropTypes.any,
}

export const TextButton = React.forwardRef(({ look, ...props }, ref) => {
  const theme = useContext(ThemeContext);
  return <ButtonA11y ref={ref} css={css`${styles.text(theme)} ${look ? styles[look](theme) : null}`} {...props} />
});

export const DropdownButton = React.forwardRef(({
  isActive,
  onClick,
  loading,
  title,
  label,
  children,
  ariaLabel = "Menu",
  menuItems = () => [],
  look,
  style,
  truncate,
  ...props
}, ref) => {

  return <ButtonGroup style={style}>
    {children && <Button {...props} style={{ maxWidth: 400 }} truncate={truncate} look={look} ref={ref} onClick={onClick} loading={loading}>{children}</Button>}
    {menuItems.length > 0 && <Menu
      aria-label={ariaLabel}
      trigger={<Button look={look} style={{ flex: '0 0 auto' }}>
        {label} <MdMoreHoriz style={{ marginInlineStart: label ? '6px' : 0, verticalAlign: 'middle' }} />
      </Button>}
      items={menuItems}
    />}
  </ButtonGroup>
});

DropdownButton.propTypes = {
  onClick: PropTypes.func,
  children: PropTypes.any,
}

DropdownButton.MenuAction = MenuAction;