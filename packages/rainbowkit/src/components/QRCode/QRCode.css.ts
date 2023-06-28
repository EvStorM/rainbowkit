import { keyframes, style } from '@vanilla-extract/css';

const skeletonLoading = keyframes({
  '0% ': {
    backgroundPosition: '100% 50%',
  },
  '100%': {
    backgroundPosition: '0 50%',
  },
});
export const qrSkeleton = style({
  animation: 'skeletonLoading 1.4s ease infinite',
  animationName: skeletonLoading,
  backgroundImage:
    'linear-gradient(90deg, #f2f2f2 25%, #c6c6c6 37%, #f2f2f2 63%)',
  backgroundPosition: '100% 50%',
  backgroundSize: '400% 100%',
  borderRadius: '0.6rem',
  height: '0.6rem',
  listStyle: 'none',
});
