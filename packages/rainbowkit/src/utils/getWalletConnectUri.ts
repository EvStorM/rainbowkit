import type { Connector } from 'wagmi/connectors';

export async function getWalletConnectUri(
  connector: Connector,
  version: '1' | '2'
): Promise<string> {
  const provider = await connector.getProvider();
  return version === '2'
    ? new Promise<string>(resolve => {
        console.log(
          '%c [ resolve ]-15-「getWalletConnectUri.ts」',
          'font-size:13px; background:#FFE47F; color:#000000;',
          resolve
        );
        return provider.once('display_uri', resolve);
      })
    : provider.connector.uri;
}
