//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./crosschain/arbitrum/CrossChainEnabledArbitrumL1.sol";

contract Sender is CrossChainEnabledArbitrumL1 {
    // solhint-disable-next-line no-empty-blocks
    constructor(address bridge_) CrossChainEnabledArbitrumL1(bridge_) {}

    function sendCrossChainMessage(
        address destination,
        bytes memory data,
        bytes memory crossChainTxParams
    ) external {
        _sendCrossChainMessage(destination, data, crossChainTxParams);
    }
}
