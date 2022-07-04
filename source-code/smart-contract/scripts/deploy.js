const hre = require('hardhat');

async function deploy(){
    const Salamun = await ethers.getContractFactory('Salamun');
    const SalamunToken = await ethers.getContractFactory('SalamunToken');
    const SalamunStaking = await ethers.getContractFactory('SalamunStaking');

    [owner, addr1, addr2, addr3, ...addrs] = await ethers.getSigners();

    salamun = await Salamun.deploy();
    salamunToken = await SalamunToken.deploy();
    salamunStaking = await SalamunStaking.deploy(salamunToken.address, salamun.address);

    await salamunToken.setOwner(salamunStaking.address);

    console.log("Salamun deployed to:", salamun.address);
    console.log("Salamun Token deployed to:", salamunToken.address);
    console.log("Salamun Staking deployed to:", salamunStaking.address);

}

deploy()
    .then(() =>process.exit(0))
    .catch((error) =>{
        console.log(error)
        process.exit(1);
    });