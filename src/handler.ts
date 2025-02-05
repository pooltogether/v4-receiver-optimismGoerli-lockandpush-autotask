import { Relayer } from 'defender-relay-client';
import { receiverDrawLockAndNetworkTotalSupplyPush } from '@pooltogether/v4-autotask-lib';
import { testnet as contracts } from '@pooltogether/v4-pool-data';

export async function handler(event: any) {
  const relayer = new Relayer(event);
  const config = {
    beaconChain: {
      chainId: 5,
      providerUrl: event.secrets.ethereumGoerliProviderURL,
    },
    receiverChain: {
      chainId: 420,
      providerUrl: event.secrets.optimismGoerliProviderURL,
    },
    allPrizePoolNetworkChains: [
      {
        chainId: 5,
        providerUrl: event.secrets.ethereumGoerliProviderURL,
      },
      {
        chainId: 80001,
        providerUrl: event.secrets.polygonMumbaiProviderURL,
      },
      {
        chainId: 420,
        providerUrl: event.secrets.optimismGoerliProviderURL,
      },
      {
        chainId: 421613,
        providerUrl: event.secrets.arbitrumGoerliProviderURL,
      },
    ],
  };

  try {
    const transactionPopulated = await receiverDrawLockAndNetworkTotalSupplyPush(contracts, config);

    if (transactionPopulated) {
      let transactionSentToNetwork = await relayer.sendTransaction({
        data: transactionPopulated.data,
        to: transactionPopulated.to,
        gasLimit: 500000,
        speed: 'fast',
      });

      console.log('TransactionHash:', transactionSentToNetwork.hash);
    } else {
      throw new Error('DrawBeacon: Transaction not populated');
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}
