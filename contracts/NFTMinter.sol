// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract NFTMinter is ERC721Enumerable {
    uint256 private _tokenIdCounter;
    IERC20 public paymentToken;
    address public owner;

    constructor(address _paymentToken) ERC721("MyNFT", "MNFT") {
        paymentToken = IERC20(_paymentToken);
        owner = msg.sender;
        _tokenIdCounter = 0; // Explicit initialization
    }

    function mintNFT() public {
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        _safeMint(msg.sender, tokenId);

        uint256 price = 100 * 10**18;
        require(paymentToken.transferFrom(msg.sender, owner, price), "Payment Failed");
    }
}