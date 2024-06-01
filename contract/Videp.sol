// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.0/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
// import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFT is ERC721URIStorage {
    address payable public immutable feeAccount = payable(msg.sender); 
    uint public immutable feePercent = 2;  
    uint public itemCount; 
    uint public tokenCount;
    constructor() ERC721("DApp NFT", "DAPP"){}

    struct Item {
        address ogOwner;
        uint itemId;
        uint tokenId;
        uint256 price; 
        address payable seller;
        bool sold;
    }

    mapping(uint => Item) public items;

    event Offered(
        uint itemId,
        uint tokenId,
        uint256 price, 
        address indexed seller
    );
    
    event Bought(
        uint itemId,
        uint tokenId,
        uint256 price, 
        address indexed seller,
        address indexed buyer
    );

    function mint(string memory _tokenURI, uint _price) external returns(uint) {
        tokenCount ++;
        itemCount++;
        _safeMint(msg.sender, tokenCount);
        _setTokenURI(tokenCount, _tokenURI);

        address prevOwner = msg.sender;
        items[itemCount] = Item(
            prevOwner,
            itemCount,
            tokenCount,
            _price,
            payable(msg.sender),
            false
        );

        emit Offered(
            itemCount,
            tokenCount,
            _price,
            msg.sender
        );
        

        return(tokenCount);
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
        
        emit Bought(
            _itemId,
            item.tokenId,
            item.price,
            temp, 
            msg.sender 
        );
    }

    function getTotalPrice(uint _itemId) view public returns(uint256) { 
        return ((items[_itemId].price * (100 + 2)) / 100);
    }

    function getOwner(uint _itemId) view public returns(address) {
        address ogOwner = items[_itemId].ogOwner;
        return ogOwner;
    }
    
    function getcurrOwner(uint _itemId) view public returns(address) {
        address currOwner = items[_itemId].seller;
        return currOwner;
    }

    function seeNFT(uint _itemId) external payable returns(string memory){
        string memory uri=tokenURI(_itemId);
       return uri;
    }

}