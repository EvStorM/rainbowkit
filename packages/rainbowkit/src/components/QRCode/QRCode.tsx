import QRCodeUtil from 'qrcode';
import React, { ReactElement, useMemo } from 'react';
import { AsyncImage } from '../AsyncImage/AsyncImage';
import { Box, BoxProps } from '../Box/Box';
import { QRCodeBackgroundClassName } from '../ConnectOptions/DesktopOptions.css';
import { qrSkeleton } from './QRCode.css';

const generateMatrix = (
  value: string,
  errorCorrectionLevel: QRCodeUtil.QRCodeErrorCorrectionLevel
) => {
  const arr = Array.prototype.slice.call(
    QRCodeUtil.create(value, { errorCorrectionLevel }).modules.data,
    0
  );
  const sqrt = Math.sqrt(arr.length);
  return arr.reduce(
    (rows, key, index) =>
      (index % sqrt === 0
        ? rows.push([key])
        : rows[rows.length - 1].push(key)) && rows,
    []
  );
};

type Props = {
  ecl?: QRCodeUtil.QRCodeErrorCorrectionLevel;
  logoBackground?: string;
  logoUrl?: string | (() => Promise<string>);
  logoMargin?: number;
  logoSize?: number;
  size?: number;
  uri?: string;
  padding?: BoxProps['padding'];
};

export function QRCode({
  ecl = 'Q',
  logoBackground,
  logoMargin = 10,
  logoSize = 50,
  logoUrl,
  padding,
  size: sizeProp = 200,
  uri,
}: Props) {
  const paddingProp: NonNullable<BoxProps['padding']> = padding ?? '20';
  const size = sizeProp - parseInt(paddingProp, 10) * 2;

  const dots = useMemo(() => {
    const dots: ReactElement[] = [];
    const matrix = generateMatrix(uri ?? '', ecl);
    const cellSize = size / matrix.length;
    let qrList = [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
    ];

    qrList.forEach(({ x, y }) => {
      const x1 = (matrix.length - 7) * cellSize * x;
      const y1 = (matrix.length - 7) * cellSize * y;
      for (let i = 0; i < 3; i++) {
        dots.push(
          <rect
            fill={i % 2 !== 0 ? 'white' : 'black'}
            height={cellSize * (7 - i * 2)}
            key={`${i}-${x}-${y}`}
            rx={(i - 2) * -5 + (i === 0 ? 2 : 0)} // calculated border radius for corner squares
            ry={(i - 2) * -5 + (i === 0 ? 2 : 0)} // calculated border radius for corner squares
            width={cellSize * (7 - i * 2)}
            x={x1 + cellSize * i}
            y={y1 + cellSize * i}
          />
        );
      }
    });

    const clearArenaSize = Math.floor((logoSize + 25) / cellSize);
    const matrixMiddleStart = matrix.length / 2 - clearArenaSize / 2;
    const matrixMiddleEnd = matrix.length / 2 + clearArenaSize / 2 - 1;

    matrix.forEach((row: QRCodeUtil.QRCode[], i: number) => {
      row.forEach((_: any, j: number) => {
        if (matrix[i][j]) {
          if (
            !(
              (i < 7 && j < 7) ||
              (i > matrix.length - 8 && j < 7) ||
              (i < 7 && j > matrix.length - 8)
            )
          ) {
            if (
              !(
                i > matrixMiddleStart &&
                i < matrixMiddleEnd &&
                j > matrixMiddleStart &&
                j < matrixMiddleEnd
              )
            ) {
              dots.push(
                <circle
                  cx={i * cellSize + cellSize / 1.5}
                  cy={j * cellSize + cellSize / 1.5}
                  fill="black"
                  key={`circle-${i}-${j}`}
                  r={cellSize / 2} // calculate size of single dots
                />
              );
            }
          }
        }
      });
    });

    return dots;
  }, [ecl, logoSize, size, uri]);

  const logoPosition = size / 2 - logoSize / 2;
  const logoWrapperSize = logoSize + logoMargin * 2;

  return (
    <Box
      // borderColor="generalBorder"
      borderRadius="10"
      // borderStyle="solid"
      // borderWidth="1"
      className={QRCodeBackgroundClassName}
      width="max"
    >
      <Box
        className={uri === 'null' ? qrSkeleton : ''}
        padding={paddingProp}
        style={{
          height: size + parseInt(paddingProp, 10) * 2,
          userSelect: 'none',
          width: size + parseInt(paddingProp, 10) * 2,
        }}
      >
        {uri === 'null' ? (
          <Box
            style={{
              height: size,
              userSelect: 'none',
              width: size,
            }}
            userSelect="none"
          />
        ) : (
          <Box
            style={{
              height: size,
              userSelect: 'none',
              width: size,
            }}
            userSelect="none"
          >
            <Box
              display="flex"
              justifyContent="center"
              position="relative"
              style={{
                height: 0,
                top: logoPosition,
                width: size,
              }}
              width="full"
            >
              <AsyncImage
                background={logoBackground}
                borderColor={{ custom: 'rgba(0, 0, 0, 0.06)' }}
                borderRadius="13"
                height={logoSize}
                src={logoUrl}
                width={logoSize}
              />
            </Box>
            <svg height={size} style={{ all: 'revert' }} width={size}>
              <defs>
                <clipPath id="clip-wrapper">
                  <rect height={logoWrapperSize} width={logoWrapperSize} />
                </clipPath>
                <clipPath id="clip-logo">
                  <rect height={logoSize} width={logoSize} />
                </clipPath>
              </defs>
              <rect fill="transparent" height={size} width={size} />
              {dots}
            </svg>
          </Box>
        )}
      </Box>
    </Box>
  );
}
