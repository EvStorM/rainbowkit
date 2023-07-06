import { isMobile, isSmallIOS } from './isMobile';

const openApp = (url: string, callback: Function) => {
  if (isMobile()) {
    let hasApp = true,
      t = 2000,
      t1 = Date.now(),
      ifr = document.createElement('iframe');
    setTimeout(function () {
      if (!hasApp) {
        callback?.();
      }
      document.body.removeChild(ifr);
    }, 2000);

    ifr.setAttribute('src', url);
    ifr.setAttribute('style', 'display:none');
    document.body.appendChild(ifr);
    setTimeout(function () {
      //启动app时间较长处理
      let t2 = Date.now();
      if (t2 - t1 < t + 100) {
        hasApp = false;
      }
    }, t);
  }
  if (isSmallIOS()) {
    location.href = url;
    setTimeout(function () {
      callback?.();
    }, 250);
    setTimeout(function () {
      // location.reload();
    }, 1000);
  }
};

export default openApp;
