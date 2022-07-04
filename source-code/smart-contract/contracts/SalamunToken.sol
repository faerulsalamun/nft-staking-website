// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SalamunToken is ERC20, Ownable {

    address private ownerAddress;

    constructor() ERC20("SALAMUN TOKEN","SALT"){

    }

    function mint(address to_, uint256 amount_) external {
        require(ownerAddress == msg.sender,"Anda bukan merupakan owner address");
        _mint(to_,amount_);
    }

    function setOwner(address owner_) external onlyOwner {
        ownerAddress = owner_;
    }
}