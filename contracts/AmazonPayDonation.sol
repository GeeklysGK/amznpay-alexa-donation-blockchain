// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract AmazonPayDonation {

  address public owner;

  event Donated(string userId, string oroId, uint amount );

  struct Donation {
    string userId;
    string oroId;
    uint amount;
    uint timestamp;
  }

  uint public totalAmount;
  uint public totalCount;
  mapping(string => Donation[]) public donations;
  mapping(string => uint) public totalDonation;

  string private name;

  constructor() {
    owner = msg.sender;
  }

  function saveDonation(Donation memory donationInfo) public onlyOwner {
    donationInfo.timestamp = block.timestamp;
    donations[donationInfo.userId].push(donationInfo);
    totalDonation[donationInfo.userId] += donationInfo.amount;
    totalAmount += donationInfo.amount;
    totalCount += donationInfo.amount;
    emit Donated(donationInfo.userId, donationInfo.oroId, donationInfo.amount);
  }

  function getDonation(string memory userId) public view returns (Donation[] memory) {
    return donations[userId];
  }

  function countDonation(string memory userId) public view returns (uint) {
    return donations[userId].length;
  }

  modifier onlyOwner() {
    require(owner == msg.sender, "Ownable: caller is not the owner");
    _;
  }
}
