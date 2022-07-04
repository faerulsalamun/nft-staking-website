const { expect } = require('chai');
const { ethers } = require('hardhat');

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

describe('Salamun Contract', () =>{

    beforeEach(async() => {
        const Salamun = await ethers.getContractFactory('Salamun');
        const SalamunToken = await ethers.getContractFactory('SalamunToken');
        const SalamunStaking = await ethers.getContractFactory('SalamunStaking');

        [owner, addr1, addr2, addr3, ...addrs] = await ethers.getSigners();

        salamun = await Salamun.deploy();
        salamunToken = await SalamunToken.deploy();
        salamunStaking = await SalamunStaking.deploy(salamunToken.address, salamun.address);

        await salamunToken.setOwner(salamunStaking.address);
    });

    describe('Stake', () => {

        it('should call a function stake correctly', async() =>{
            await salamun.mint(5);

            await salamunStaking.stake(1);
        })

        it('should call a function stake and return error ERC721: owner query for nonexistent token', async() =>{
            await expect(salamunStaking.stake(1)).to.be.revertedWith('ERC721: owner query for nonexistent token');
        })

        it('should call a function stake and return error Bukan merupakan owner', async() =>{
            await salamun.mint(5);

            await expect(salamunStaking.connect(addr1).stake(1)).to.be.revertedWith('Bukan merupakan owner');
        })
    })

    describe('Unstake', () => {

        it('should call a function unstake correctly', async() =>{
            await salamun.mint(5);

            await salamunStaking.stake(1);

            await salamunStaking.unstake(1);
        })

        it('should call a function unstake and return error ERC721: owner query for nonexistent token', async() =>{
            await expect(salamunStaking.unstake(1)).to.be.revertedWith('ERC721: owner query for nonexistent token');
        })

        it('should call a function unstake and return error Bukan merupakan owner', async() =>{
            await salamun.mint(5);

            await expect(salamunStaking.connect(addr1).unstake(1)).to.be.revertedWith('Bukan merupakan owner');
        })
    })

    describe('Claim', () => {

        it('should call a function claim correctly', async() =>{
            await salamun.mint(5);

            await salamunStaking.stake(1);

            await sleep(9000);

            await salamunStaking.claim(1);

            await sleep(6000);

            await salamunStaking.claim(1);

            console.log(`Token anda sebanyak : ${await salamunToken.balanceOf(owner.address)}`);
        });
    })
})