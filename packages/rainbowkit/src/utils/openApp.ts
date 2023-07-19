import CallApp from './callApp/index';

interface IOpenApp {
  callFailed?: () => void;
  callStart?: () => void;
  callSuccess?: () => void;
  landingPage?: string;
}

const openApp = (
  url: string,
  { callFailed, callStart, callSuccess, landingPage }: IOpenApp
) => {
  const callApp = new CallApp({
    callFailed: () => {
      callFailed?.();
    },
    callStart: () => {
      callStart?.();
    },
    callSuccess: () => {
      callSuccess?.();
    },
    customConfig: {
      landingPage: landingPage,
      schemeUrl: url,
    },
    // 后台配置项
  });
  // 执行 唤起方法
  callApp.start();
};

export default openApp;
