// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

interface ISalamunToken {
    function mint(address to_, uint256 amount_) external;
}

interface ISalamun {
    function ownerOf(uint256 tokenId) external view returns(address);
}

contract SalamunStaking {

    ISalamunToken public salamunToken;
    ISalamun public salamun;

    struct Stake {
        uint256 tokenId;
        uint256 latestClaim;
    }

    mapping(uint256 => Stake) staked;

    constructor(address salamunToken_, address salamun_){
        salamunToken = ISalamunToken(salamunToken_);
        salamun = ISalamun(salamun_);
    }

    function stake(uint256 tokenId_) external {
        require(salamun.ownerOf(tokenId_) == msg.sender, "Bukan merupakan owner");

        staked[tokenId_] = Stake({
            tokenId: tokenId_,
            latestClaim: block.timestamp
        });
    }

    function unstake(uint256 tokenId_) external {
        require(salamun.ownerOf(tokenId_) == msg.sender, "Bukan merupakan owner");
        require(staked[tokenId_].tokenId == tokenId_,"NFT belum di stake");

        delete staked[tokenId_];
    }

    function claim(uint256 tokenId_) external {
        require(salamun.ownerOf(tokenId_) == msg.sender, "Bukan merupakan owner");
        require(staked[tokenId_].tokenId == tokenId_,"NFT belum di stake");

        // 1 token = 5 detik
        // Misal latest claim itu pukul 14:30:31 dan claim itu pada pukul 14:30:37
        uint256 totalClaim = (block.timestamp - staked[tokenId_].latestClaim) / 5;

        if(totalClaim > 0){
            staked[tokenId_] = Stake({
                tokenId: tokenId_,
                // Latest claimnya menjadi 14:30:37 akan tetapi saya jadikan menjadi 14:30:36
                latestClaim: block.timestamp - ((block.timestamp - staked[tokenId_].latestClaim) % 5)
            });

            salamunToken.mint(msg.sender, totalClaim);
        }

    }
}