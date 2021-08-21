// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract AmazonPayDonation {

  address public owner;

  struct Donation {
    string userId;
    string oroId;
    uint amount;
  }

  mapping(string => Donation[]) public donations;
  mapping(string => uint) public totalDonation;

  constructor() {
    owner = msg.sender;
  }

  function saveDonation(Donation memory donationInfo) public onlyOwner {
    donations[donationInfo.userId].push(donationInfo);
    totalDonation[donationInfo.userId] += donationInfo.amount;
  }

  function countDonation(string memory userId) public view returns (uint) {
    return donations[userId].length;
  }

  modifier onlyOwner() {
    require(owner == msg.sender, "Ownable: caller is not the owner");
    _;
  }
}
