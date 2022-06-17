# Cross Chain Bridge Examples

This repository is intended to be a set of examples of how to use [@ericnordelo/cross-chain-bridge-helpers](https://github.com/ericnordelo/cross-chain-bridge-helpers) package together with the Openzeppelin cross-chain extensions to send cross-chain messages over different bridges.

For now it only support Arbitrum and Optimism L1-L2 bridges.

## How to use this package?

1. Clone the repository :

   ```sh
   $ git clone git@github.com:ericnordelo/cross-chain-bridge-examples.git
   ```

2. Get inside the directory and run `yarn install`

   ```sh
   $ cd cross-chain-bridge-examples && yarn install
   ```

3. Create a `.env` file following the `.env.example` provided in the repo

   ```sh
    MNEMONIC=
    ALCHEMY_ARBITRUM_RPC=
    ALCHEMY_OPTIMISM_RPC=
    INFURA_API_KEY=
   ```

4. If you want to use different providers, feel free to change the name of the environment variables, and update the `hardhat.config.js` file.

## TS helpers summary

### Generic usage on any project

1. Install the package:

   ```sh
   $ yarn add @ericnordelo/cross-chain-bridge-helpers
   ```

2. Import the `L2BridgeFactory` class, and load the providers after getting the instance:

   ```js
    import { L2BridgeFactory } from '@ericnordelo/cross-chain-bridge-helpers';

    (...)

    const bridge = L2BridgeFactory.get('Arbitrum-L1L2');
    await bridge.loadProviders({ l1Provider, l2Provider });
   ```

3. The providers should be loaded separately. This gives you the power to integrate with different frameworks and enviroments, just passing the providers through (ex: hardhat). For now, the library requires using `ethers` providers. Here is an example:

   ```js
   import { L2BridgeFactory } from '@ericnordelo/cross-chain-bridge-helpers';
   import { providers } from 'ethers';
   import { config } from 'dotenv';

   config({ path: './path/to/.env' });

   const l1Provider = new providers.JsonRpcProvider(process.env.ARBITRUM_L1_RPC);
   const l2Provider = new providers.JsonRpcProvider(process.env.ARBITRUM_L2_RPC);

   const bridge = L2BridgeFactory.get('Arbitrum-L1L2-Rinkeby');
   await bridge.loadProviders({ l1Provider, l2Provider });
   ```

4. Now, you can use either the `getCrossChainTxConfigParameters` or the `getCrossChainTxConfigBytes` helpers, that will return the appropriate parameters from the selected bridge:

   ```ts
    async getCrossChainTxConfigParameters(
      sender: string,
      destAddr: string,
      l2CallDataHex: string,
      l2CallValue: BigNumber,
    ) : Promise<object>;

    async getCrossChainTxConfigBytes(
      sender: string,
      destAddr: string,
      l2CallDataHex: string,
      l2CallValue: BigNumber,
    ): Promise<string>;
   ```

5. The `getCrossChainTxConfigBytes` result, can be used as bridgeConfig in the Openzeppelin library.

6. These are the accepted bridges in the current version:

   ```ts
   export type Bridge =
     | 'Arbitrum-L1L2'
     | 'Arbitrum-L2L1'
     | 'Optimism-L1L2'
     | 'Optimism-L2L1'
     | 'Arbitrum-L1L2-Rinkeby'
     | 'Arbitrum-L2L1-Rinkeby'
     | 'Optimism-L1L2-Kovan'
     | 'Optimism-L2L1-Kovan';
   ```

### Usage in this repository

Being this repository a set of predefined examples, this plugin is already imported, and used in different tasks that you can find inside the `tasks` folder in the source directory.

## Examples

We are going to use two contracts to test the message delivery: a Greeter.sol and a Sender.sol.

The Greeter's purpose is to store a message (string), and return it through a getter. This is the contract we are going to use to receive the message:

```ts
  contract Greeter {
    string private _greeting;

    constructor(string memory greeting_) {
        _greeting = greeting_;
    }

    function greet() public view returns (string memory) {
        return _greeting;
    }

    function setGreeting(string memory greeting_) public payable {
        _greeting = greeting_;
    }
  }
```

The Sender, as the name suggest is used to deliver the cross-chain message, and is the one that is going to implement the extensions from the Openzeppelin cross-chain library:

```ts
  import "../crosschain/arbitrum/CrossChainEnabledArbitrumL1.sol";

  contract SenderArbitrumL1 is CrossChainEnabledArbitrumL1 {
      // solhint-disable-next-line no-empty-blocks
      constructor(address bridge_) CrossChainEnabledArbitrumL1(bridge_) {}

      function sendCrossChainMessage(
          address destination,
          bytes memory data,
          bytes memory crossChainTxParams
      ) external payable {
          _sendCrossChainMessage(destination, data, crossChainTxParams);
      }
  }
```

The code above is a specific example for Arbitrum L1 to L2 channel, but different implementations are used for different bridges. The `CrossChainEnabledArbitrumL1` is one specific implementation of the `CrossChainEnabled` abstraction:

```ts
  abstract contract CrossChainEnabled {
      /**
       * @dev Throws if the current function call is not the result of a
       * cross-chain execution.
       */
      modifier onlyCrossChain() {
          if (!_isCrossChain()) revert NotCrossChainCall();
          _;
      }

      /**
       * @dev Throws if the current function call is not the result of a
       * cross-chain execution initiated by `account`.
       */
      modifier onlyCrossChainSender(address expected) {
          address actual = _crossChainSender();
          if (expected != actual) revert InvalidCrossChainSender(actual, expected);
          _;
      }

      /**
       * @dev Returns whether the current function call is the result of a
       * cross-chain message.
       */
      function _isCrossChain() internal view virtual returns (bool);

      /**
       * @dev Returns the address of the sender of the cross-chain message that
       * triggered the current function call.
       *
       * IMPORTANT: Should revert with `NotCrossChainCall` if the current function
       * call is not the result of a cross-chain message.
       */
      function _crossChainSender() internal view virtual returns (address);

      /**
       * @dev Sends a generic cross-chain message through a bridge.
       *
       * IMPORTANT: The structure of the crossChainTxParams is defined in the implementations
       * and can be built using the SDKs of the corresponding bridge most of the times.
       *
       * @param destination The address of the cross-chain target contract.
       * @param data The calldata of the cross-chain call.
       * @param crossChainTxParams An ABI encoded struct representing the configuration required
       * for the message to be sent through the bridge.
       */
      function _sendCrossChainMessage(
          address destination,
          bytes memory data,
          bytes memory crossChainTxParams
      ) internal virtual;
  }
```

This abstraction (and therefore the implementations) only provide us with modifiers to check sender in the receiver (we could add this check to the Greeter).

### Example 1 (send message from arbitrum l1 to l2)

1. Deploy the Greeter in the Abitrum L2 (we are using testnets of course):

   ```sh
   $ hh deploy --network arbitrum --tags greeter
   ```

- For this step you need ETH in Arbitrum, you can follow [this guide](https://docs.handle.fi/how-to-guides/arbitrum-l2-testnet-rinkeby) to get some.

- In this guide I will be using `hh` instead of `npx hardhat`. If you dont have the former configured, just use the latter.

2. Deploy the Sender in the Abitrum L1 (Rinkeby):

   ```sh
    $ hh deploy --network rinkeby --tags sender_arbitrum_l1
   ```

3. Run the `greet` task to get the Greeter message before cross-chain call.

   ```sh
    $ hh greet --network arbitrum
   ```

4. Run the task for sending the message from Arbitrum L1 to L2, using the address of the deployed Greeter as the target, and any message you want:

   ```sh
    $ hh send-message:arbitrum-l1-to-l2 --target \
         [greeter_address_in_l2] --greeting \
         'Hellow World!' --network rinkeby
   ```

5. Wait between 2 and 5 minutes for the message to be executed in l2 (this depends on the Arbitrum Sequencer implementation).

6. Run the `greet` task again to get the updated message (if is not updated wait a little longer).

   ```sh
    $ hh greet --network arbitrum
   ```
