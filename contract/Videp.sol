// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.0/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFT is ERC721URIStorage {
    address payable public immutable feeAccount; 
    uint public immutable feePercent = 2;  
    uint public itemCount; 
    uint public tokenCount;
    uint public borrowCount;
    
    constructor() ERC721("DApp NFT", "DAPP") {
        feeAccount = payable(msg.sender);
    }

    struct Item {
        address ogOwner;
        uint itemId;
        uint tokenId;
        uint256 price; 
        address payable seller;
        uint num;
        uint256 singleprice;
        bool sold;
    }

    struct Borrower {
        address renter;
        uint itemId;
        uint tokenId;
        uint256 price; 
        address payable borrower;
        uint num;
        uint256 singleprice;
    }

    mapping(uint => Item) public items;
    mapping (uint => Borrower) public borrow;

    event Offered(
        uint itemId,
        uint tokenId,
        uint256 price,
        uint num, 
        address indexed seller
    );
    
    event Bought(
        uint itemId,
        uint tokenId,
        uint256 price, 
        address indexed seller,
        address indexed buyer
    );

    event Rented(
        uint itemId,
        uint tokenId,
        uint256 price, 
        uint num,
        address indexed seller,
        address indexed buyer
    );

    function mint(string memory _tokenURI, uint _price, uint _num) external returns(uint) {
        tokenCount ++;
        itemCount++;
        _safeMint(msg.sender, tokenCount);
        _setTokenURI(tokenCount, _tokenURI);
        uint256 _singlePrice = _price / _num;

        items[itemCount] = Item(
            msg.sender,
            itemCount,
            tokenCount,
            _price,
            payable(msg.sender),
            _num,
            _singlePrice,
            false
        );

        emit Offered(
            itemCount,
            tokenCount,
            _price,
            _num,
            msg.sender
        );

        return tokenCount;
    }

    function purchaseItem(uint _itemId) external payable {
        uint256 _totalPrice = getTotalPrice(_itemId); 
        Item storage item = items[_itemId];
        require(_itemId > 0 && _itemId <= itemCount, "Item doesn't exist");
        require(msg.value >= _totalPrice, "Not enough ether to cover item price and market fee");
        require(!item.sold, "Item already sold");

        item.sold = true;
        address payable temp = item.seller;
        item.seller = payable(msg.sender);

        // Transfer the payment to the seller
        uint256 sellerAmount = msg.value * (100 - feePercent) / 100;
        uint256 feeAmount = msg.value - sellerAmount;
        
        temp.transfer(sellerAmount);
        feeAccount.transfer(feeAmount);
        
        emit Bought(
            _itemId,
            item.tokenId,
            item.price,
            temp, 
            msg.sender 
        );
    }

    function rentItem(uint _itemId, uint _num) external payable {
        Item storage item = items[_itemId];
        require(_itemId > 0 && _itemId <= itemCount, "Item doesn't exist");
        require(msg.value >= item.singleprice * _num, "Not enough ether to cover item price and market fee");
        require(!item.sold, "Item already sold");
        require(item.num >= _num, "Not enough items available to rent");

        uint256 _paidPrice = item.singleprice * _num;
        item.num -= _num;

        if (item.num == 0) {
            item.sold = true;
        }

        // Transfer the payment to the seller
        uint256 sellerAmount = msg.value * (100 - feePercent) / 100;
        uint256 feeAmount = msg.value - sellerAmount;
        
        item.seller.transfer(sellerAmount);
        feeAccount.transfer(feeAmount);

        borrowCount++;
        borrow[borrowCount] = Borrower(
            item.ogOwner,
            _itemId,
            item.tokenId,
            _paidPrice,
            payable(msg.sender),
            _num,
            item.singleprice
        );

        emit Rented(
            _itemId,
            item.tokenId,
            item.price,
            _num,
            item.seller,
            msg.sender
        );
    }

    function getTotalPrice(uint _itemId) view public returns(uint256) {
        return ((items[_itemId].price * (100 + feePercent)) / 100);
    }

    function getOwner(uint _itemId) view public returns(address) {
        return items[_itemId].ogOwner;
    }
    
    function getcurrOwner(uint _itemId) view public returns(address) {
        return items[_itemId].seller;
    }

    function seeNFT(uint _itemId) external view returns(string memory) {
        return tokenURI(_itemId);
    }

    function getContractBalance() view public returns(uint) {
        return address(this).balance;
    }
}
