import { CallAppInstance } from '../index';
import {
  checkOpen,
  evokeByIFrame,
  evokeByLocation,
  evokeByTagA,
} from '../libs/evoke';
import {
  isAndroid,
  isBaidu,
  isIos,
  isLow7WX,
  isLow9Ios,
  isOriginalChrome,
  isQQ,
  isQQBrowser,
  isQuark,
  isQzone,
  isWechat,
  isWeibo,
  // isThan12Ios,
} from '../libs/platform';
import { logInfo, showMask } from '../libs/utils';

let tempIosPlatRegList: any = null;
// 获取方法
export const getIosPlatRegList = (ctx: CallAppInstance) =>
  tempIosPlatRegList || (tempIosPlatRegList = getDefaultIosPlatRegList(ctx));

// 扩展方法
export const addIosPlatReg = (
  ctx: CallAppInstance,
  item: Record<string, any>
) => {
  if (item) {
    const list = getDefaultIosPlatRegList(ctx);
    list.splice(-1, 0, item as any);
    tempIosPlatRegList = [...list];
  }
  return tempIosPlatRegList;
};

export const getDefaultIosPlatRegList = (ctx: CallAppInstance) => {
  const { options, universalLink, urlScheme: schemeURL } = ctx;
  const {
    callError = () => {},
    callFailed = () => {},
    callSuccess = () => {},
    delay = 2500,
    universal = false,
  } = options;

  const handleCheck = (delay = 2500) =>
    checkOpen(
      () => {
        callFailed();
        // ctx.download();
      },
      callSuccess,
      callError,
      delay
    );

  return [
    {
      handler: (instance: CallAppInstance) => {
        logInfo(
          'isIos - isWeibo || isWechat < 7.0.5',
          instance,
          isIos && isWechat && isLow7WX
        );
        showMask();
        callFailed();
      },
      name: 'wxSub',
      platReg: () => isWechat && isLow7WX,
    },
    {
      handler: () => {
        handleCheck(3000);
        schemeURL && evokeByIFrame(schemeURL);
      },
      name: 'low9',
      platReg: () => isLow9Ios,
    },
    {
      handler: () => {
        handleCheck(3000);
        showMask();
      },
      name: 'bd',
      platReg: () => !universal && isBaidu,
    },
    {
      handler: () => {
        showMask();
        callFailed();
      },
      name: 'weibo',
      platReg: () => !universal && (isWeibo || isWechat),
    },
    {
      handler: () => {
        handleCheck(3000);
        schemeURL && evokeByTagA(schemeURL);
      },
      name: 'qq',
      platReg: () => !universal || isQQ || isQQBrowser || isQzone,
    },
    {
      handler: () => {
        handleCheck(3000);
        schemeURL && evokeByTagA(schemeURL);
      },
      name: 'quark',
      platReg: () => isQuark,
    },
    {
      handler: () => {
        handleCheck(delay);
        universalLink && evokeByLocation(universalLink);
      },
      name: 'ul',
      platReg: () => isIos,
    },
  ];
};

export const getDefaultAndroidPlatRegList = (ctx: CallAppInstance) => {
  const { intentLink, options, urlScheme: schemeURL } = ctx;
  const {
    callError = () => {},
    callFailed = () => {},
    callSuccess = () => {},
    delay = 2500,
    intent = false,
  } = options;

  const handleCheck = (delay = 2500) =>
    checkOpen(
      () => {
        callFailed();
        ctx.download();
      },
      callSuccess,
      callError,
      delay
    );

  return [
    {
      handler: () => {
        handleCheck(delay);
        // app-links 无法处理 失败回调， 原因同 universal-link
        intentLink && evokeByLocation(intentLink);
      },
      name: 'intent',
      platReg: () => isOriginalChrome && intent,
    },
    {
      handler: () => {
        handleCheck(delay);
        // app-links 无法处理 失败回调， 原因同 universal-link
        schemeURL && evokeByLocation(schemeURL);
      },
      name: 'chrome',
      platReg: () => isOriginalChrome,
    },
    {
      handler: () => {
        // 不支持 scheme, 显示遮罩 请在浏览器打开
        showMask();
        callFailed();
      },
      name: 'wx',
      platReg: () => isWechat || isBaidu || isWeibo || isQzone,
    },
    {
      handler: () => {
        handleCheck(delay);
        schemeURL && evokeByLocation(schemeURL);
      },
      name: 'android',
      platReg: () => isAndroid,
    },
  ];
};
//
let tempAndroidPlatRegList: any = null;
// 获取方法
export const getAndroidPlatRegList = (ctx: CallAppInstance) =>
  tempAndroidPlatRegList ||
  (tempAndroidPlatRegList = getDefaultAndroidPlatRegList(ctx));
