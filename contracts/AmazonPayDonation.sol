// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract AmazonPayDonation {

  //このコントラクトのオーナー
  address public owner;

  //寄付されたらイベントをemitするので、eventを定義します。
  event Donated(string userId, string oroId, uint amount );

  //寄付の構造体
  struct Donation {
    string userId;
    string oroId;
    uint amount;
    uint timestamp;
  }

  //すべての寄付金額の合計
  uint public totalDonationAmount;
  //すべての寄付の数
  uint public totalDonationCount;
  //ユーザ毎の寄付 donationByUser[userId] => 寄付の構造体[]
  mapping(string => Donation[]) public donationByUser;
  //ユーザ毎の寄付の数
  mapping(string => uint) public totalDonationAmountByUser;

  constructor() {
    owner = msg.sender;
  }

  function saveDonation(Donation memory donationInfo) public onlyOwner {
    donationInfo.timestamp = block.timestamp;
    donationByUser[donationInfo.userId].push(donationInfo);
    totalDonationAmountByUser[donationInfo.userId] += donationInfo.amount;
    totalDonationAmount += donationInfo.amount;
    totalDonationCount += 1;
    emit Donated(donationInfo.userId, donationInfo.oroId, donationInfo.amount);
  }

  function countDonation(string memory userId) public view returns (uint) {
    return donationByUser[userId].length;
  }

  modifier onlyOwner() {
    require(owner == msg.sender, "Ownable: caller is not the owner");
    _;
  }
}
