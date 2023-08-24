import { ConnectButton } from 'deme-login';

const Test = () => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const showmodal = () => {
          openConnectModal();
        };
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === 'authenticated');
        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              'style': {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {!connected ? (
              <div className="text-lg" color="light" onClick={showmodal}>
                <div className="pt-5 pb-5 pr-9 pl-9">loginBtn</div>
              </div>
            ) : chain && chain.unsupported ? (
              <div className="text-lg" color="light" onClick={() => {}}>
                <div className="pt-5 pb-5 pr-9 pl-9">Wrong network</div>
              </div>
            ) : (
              <div id="LoginBox">
                <div
                // onOpenChange={(v: boolean) => setModalOpen(v)}
                >
                  <div className="group">
                    <div
                      className="text-lg"
                      color="light"
                      onClick={() => {
                        // setModalOpen(true);
                      }}
                    >
                      <div className="pr-4 pl-4 pt-2 pb-2 flex flex-row w-[200px] h-[60px] justify-between items-center">
                        <div className="flex flex-row items-center justify-start">
                          <div className="min-w-fit">
                            <img
                              className="rounded-full"
                              src={userInfo?.avatar ?? chain?.iconUrl}
                              style={{ width: 32, height: 32 }}
                            />
                          </div>
                          <div className="pl-2 text-[14px] text-left w-full flex-shrink">
                            <p className="w-24 overflow-hidden truncate whitespace-nowrap ">
                              {userInfo?.nickname ??
                                hideMiddle(
                                  userInfo?.loginAddress ?? '',
                                  [4, 3]
                                )}
                            </p>
                            {userInfo?.nickname &&
                              (userInfo?.mobile ? (
                                <p
                                  className={classNames(
                                    'group-hover:text-white overflow-hidden truncate whitespace-nowrap '
                                  )}
                                >
                                  {hideMiddle(
                                    userInfo?.loginAddress ??
                                      userInfo?.address ??
                                      ''
                                  )}
                                </p>
                              ) : (
                                <p
                                  className={classNames(
                                    'group-hover:text-white overflow-hidden truncate whitespace-nowrap '
                                  )}
                                >
                                  {userInfo?.loginAddress}
                                </p>
                              ))}
                          </div>
                        </div>
                        <div className="transition-all group-hover:rotate-180"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
