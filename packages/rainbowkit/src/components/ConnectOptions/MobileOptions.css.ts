import { style } from '@vanilla-extract/css';

export const scroll = style({
  overflow: 'auto',
  scrollbarWidth: 'none',
  selectors: {
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
  transform: 'translateZ(0)',
});
export const GridBox = style({
  alignItems: 'start',
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gridTemplateRows: 'repeat(3, 1fr)',
  justifyContent: 'center',
  minWidth: '100%',
  width: '100%',
});
