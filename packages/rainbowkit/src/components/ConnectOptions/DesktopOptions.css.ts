import { style } from '@vanilla-extract/css';
import { largeScreenMinWidth, sprinkles } from '../../css/sprinkles.css';
export const QRCodeBackgroundClassName = style([
  {
    background: 'white',
  },
]);

export const ScrollClassName = style([
  sprinkles({
    paddingX: '18',
  }),
  {
    maxHeight: 454,
    overflowY: 'auto',
  },
]);

export const sidebar = style({
  '@media': {
    [`screen and (min-width: ${largeScreenMinWidth}px)`]: {
      minWidth: '287px',
    },
  },
  'minWidth': '368px',
  'padding-left': '18px',
  'padding-top': '18px',
});

export const sidebarCompactMode = style({
  minWidth: '100%',
});
