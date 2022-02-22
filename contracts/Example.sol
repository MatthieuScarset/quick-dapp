// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Example is Ownable {
  uint private number;

  event NewSecretNumber(uint indexed old);

  constructor(uint _num) {
    number = _num;
  }

  /// @dev Only owner can set a new number.
  function setNewSecretNumber(uint _num) onlyOwner public {
    require(_num != number, "Please use a different secret number");
    uint old = number;
    number = _num;
    emit NewSecretNumber(old);
  }

  /// @notice Guess the secret number.
  function guess(uint _num) public view returns (bool) {
    return _num == number;
  }
}
