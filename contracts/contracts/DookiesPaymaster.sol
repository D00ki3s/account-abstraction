// SPDX-License-Identifier: MIT

pragma solidity ^0.8.12;

import "@account-abstraction/contracts/samples/VerifyingPaymaster.sol";

contract DookiesPaymaster is VerifyingPaymaster {
    constructor(IEntryPoint _entryPoint, address _verifyingSigner) VerifyingPaymaster(_entryPoint, _verifyingSigner) {}
}