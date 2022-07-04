import 'bootstrap/dist/css/bootstrap.css';
import Header from '../components/Header';
import salamunToken from '../utils/contract/SalamunToken.json';
import salamunStaking from '../utils/contract/SalamunStaking.json';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { useEffect, useState } from 'react';

const Web3 = require('web3');
const web3 = new Web3('ws://localhost:8545');

const contractAddressToken = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';
const abiToken = salamunToken.abi;
const contractToken = new web3.eth.Contract(abiToken,contractAddressToken);

const contractAddressStaking = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0';
const abiStaking = salamunStaking.abi;
const contractStaking = new web3.eth.Contract(abiStaking,contractAddressStaking);

export default function Stake() {
    const [currentAccount, setCurrentAccount] = useState(null);
    const [metamask, setMetamask] = useState(null);
    const [totalToken, setTotalToken] = useState(0);
    const [tokenId, setTokenId] = useState('');

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
          
          await getTotalToken(account);
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

    const getTotalToken = async(account) => {
        const data = await contractToken.methods.balanceOf(account).call();

        setTotalToken(data);
    }

    const stakeHandler = async() => {
        const tx = {
            to: contractAddressStaking,
            from: currentAccount,
            data: contractStaking.methods.stake(tokenId).encodeABI()
        };

        try {
            const txHash = await window.ethereum.request({
                method: 'eth_sendTransaction',
                params: [tx]
            });

            alert(`Berhasil melakukan staking dengan token id ${tokenId}`);
        } catch (error) {
            console.log(error);
        }
    }

    const unstakeHandler = async() => {
        const tx = {
            to: contractAddressStaking,
            from: currentAccount,
            data: contractStaking.methods.unstake(tokenId).encodeABI()
        };

        try {
            const txHash = await window.ethereum.request({
                method: 'eth_sendTransaction',
                params: [tx]
            });

            alert(`Berhasil melakukan unstake dengan token id ${tokenId}`);
        } catch (error) {
            console.log(error);
        }
    }

    const claimeHandler = async() => {
        const tx = {
            to: contractAddressStaking,
            from: currentAccount,
            data: contractStaking.methods.claim(tokenId).encodeABI()
        };

        try {
            const txHash = await window.ethereum.request({
                method: 'eth_sendTransaction',
                params: [tx]
            });

            await getTotalToken(currentAccount);

            alert(`Berhasil melakukan claim dengan token id ${tokenId}`);
        } catch (error) {
            console.log(error);
        }
    }

    const connectButton = () => (<Button variant='primary' className='w-100' onClick={connectWalletHandler}>Connect</Button>);

    useEffect(() => {
        checkWalletIsConnected();
    },[]);

    return (
        <>
            <Header/>
            <Container className='h-100'>
                <Row className='h-100 align-items-center justify-content-center'>
                    <Col>
                        <div className='mb-2 text-center'>Connected to address : { currentAccount }</div>
                        <div className='mb-2 text-center'>Total Token : { totalToken }</div>

                        {
                            currentAccount ?
                                (
                                    <>
                                     <Form>
                                        <Form.Group className='mb-3'>
                                            <Form.Label>Token ID</Form.Label>
                                            <Form.Control type='number' placeholder='Enter Token ID' 
                                            onChange={(event) => setTokenId(event.target.value)} value={tokenId}/>

                                            <Button variant='primary' className='w-100 mb-2 mt-2' onClick={stakeHandler}>Stake</Button>
                                            <Button variant='danger' className='w-100 mb-2' onClick={unstakeHandler}>Unstake</Button>
                                            <Button variant='success' className='w-100 mb-2' onClick={claimeHandler}>Claim</Button>

                                        </Form.Group>
                                    </Form>
                                    </>
                                ) : connectButton()
                        }
                       
                    </Col>
                </Row>
            </Container>
        </>
    )
}