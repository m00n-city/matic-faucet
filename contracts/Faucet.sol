//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract Faucet {
    receive() external payable {}

    address public owner;

    modifier onlyOwner() {
        require(msg.sender == owner, "!owner");
        _;
    }

    constructor(address _owner) {
        owner = _owner;
    }

    function setOwner(address _owner) external onlyOwner {
        owner = _owner;
    }

    function withdraw(address payable recepient, uint256 amount) external onlyOwner {
        require(amount <= 0.01 ether, "incorrect amount");
        recepient.transfer(amount);
    }
}
