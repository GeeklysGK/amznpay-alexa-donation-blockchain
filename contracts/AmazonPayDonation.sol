// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract AmazonPayDonation {

  address public owner;

  event Donated(bytes32 indexed userId, bytes32 indexed oroId, uint amount );

  struct Donation {
    bytes32 userId;
    bytes32 oroId;
    uint amount;
    uint timestamp;
  }

  uint public total;
  mapping(bytes32 => Donation[]) public donations;
  mapping(bytes32 => uint) public totalDonation;

  constructor() {
    owner = msg.sender;
  }

  function saveDonation(Donation memory donationInfo) public onlyOwner {
    donationInfo.timestamp = block.timestamp;
    donations[donationInfo.userId].push(donationInfo);
    totalDonation[donationInfo.userId] += donationInfo.amount;
    total += donationInfo.amount;
    emit Donated(donationInfo.userId, donationInfo.oroId, donationInfo.amount);
  }

  function countDonation(bytes32 userId) public view returns (uint) {
    return donations[userId].length;
  }

  modifier onlyOwner() {
    require(owner == msg.sender, "Ownable: caller is not the owner");
    _;
  }
}
