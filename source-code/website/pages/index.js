import 'bootstrap/dist/css/bootstrap.css';
import { useEffect, useState } from 'react';
import { Col, Container, Row,Button } from 'react-bootstrap';
import Header from '../components/Header';
import contract from '../utils/contract/Salamun.json';

const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
const abi = contract.abi;

const Web3 = require('web3');
const web3 = new Web3('ws://localhost:8545');

const nftContract = new web3.eth.Contract(abi,contractAddress);

export default function Home() {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [metamask, setMetamask] = useState(null);
  const [mint, setTotalMint] = useState(0);
  const [totalSupply, setTotalSupply] = useState(0);

  const checkWalletIsConnected = async() =>{
    const {ethereum} = window;

    if(!ethereum){
      console.log('Metamask belum terinstall');
      setMetamask(false);
      return;
    }else{
      setMetamask(true);

      window.ethereum.on("accountChanged",(accounts) =>{
        window.location.reload();
      })
      window.ethereum.on("chainChanged",(accounts) =>{
        window.location.reload();
      })
    }

    const accounts = await ethereum.request({method:'eth_accounts'});

    if(accounts.length !== 0){
      const account = accounts[0];

      setCurrentAccount(account);
      
      await Promise.all([
        await getTotalMint(account),
        await getTotalSupply()
      ]);
    }else{
      console.log('Account tidak diberi otoritas');
    }
  };

  const connectWalletHandler = async() =>{
    const {ethereum} = window;

    if(!ethereum){
      console.log('Metamask belum terinstall');
      setMetamask(false);
      return;
    }else{
      setMetamask(true);

      window.ethereum.on("accountChanged",(accounts) =>{
        window.location.reload();
      })
      window.ethereum.on("chainChanged",(accounts) =>{
        window.location.reload();
      })
    }

    const accounts = await ethereum.request({method:'eth_requestAccounts'});

    if(accounts.length !== 0){
      const account = accounts[0];

      setCurrentAccount(account);
    }else{
      console.log('Account tidak diberi otoritas');
    }
  };

  const getTotalMint = async(account) => {
    const data = await nftContract.methods.balanceOf(account).call();

    setTotalMint(data);
  }

  const getTotalSupply = async() => {
    const data = await nftContract.methods.totalSupply().call();

    setTotalSupply(data);
  }

  const mintHandler = async() =>{
    const tx ={
      to: contractAddress,
      from: currentAccount,
      data: nftContract.methods.mint(1).encodeABI()
    }

    try {
      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [tx]
      })

      await Promise.all([
        await getTotalMint(currentAccount),
        await getTotalSupply()
      ]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() =>{
    checkWalletIsConnected();
  },[])

  const connectButton = () => (<Button variant='primary' className='w-100' onClick={connectWalletHandler}>Connect</Button>);
  
  const mintButton = () => (<Button variant='primary' className='w-100' onClick={mintHandler}>Mint</Button>);

  return (
    <>
      <Header/>
      <Container className='h-100'>
        <Row className='h-100 align-items-center justify-content-center'>
          <Col>
            <div className='mb-2 text-center'>Conneted to address : {currentAccount}</div>
            <div className='mb-2 text-center'>Total Mint : {mint}</div>
            <div className='mb-2 text-center'>Total Supply : {totalSupply}</div>
            { currentAccount ? mintButton() : connectButton() }

          </Col>
        </Row>
      </Container>
    </>
  )
}
