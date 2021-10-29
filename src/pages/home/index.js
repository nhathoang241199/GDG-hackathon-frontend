import React from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";

import * as s from "../../styles/globalStyles";
import i1 from "../../assets/images/Lucas.png";
import { useSnackbar } from 'notistack';
import { fetchData } from "../../redux/data/dataActions";

export const StyledButton = styled.button`
  border-radius: 50px;
  border: none;
  background-color: #ffc300;
  padding: 24px 10px;
  font-weight: bold;
  font-size: 30;
  color: #000000;
  width: 49%;
  cursor: pointer;
  box-shadow: 5px 10px 0px -4px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 5px 10px 0px -4px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 5px 10px 0px -4px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
  :hover {
    background-color: rgba(250, 250, 250, 0.3);
    color: #ffffff;
    ox-shadow: 5px 10px 0px -4px #ffffffb3;
    -webkit-box-shadow: 5px 10px 0px -4px #ffffffb3;
    -moz-box-shadow: 5px 10px 0px -4px #ffffffb3;
  }
  @media (max-width: 767px) {
    width: 90% !important;
    margin-top: 20px !important;
    margin-left: 0px !important;
  }
`;

export const StyledA = styled.a`
  border-radius: 50px;
  border: none;
  background-color: #ffc300;
  padding: 24px 10px;
  font-weight: bold;
  font-size: 30;
  color: #000000;
  width: 49%;
  cursor: pointer;
  text-align: center;
  text-decoration: none;
  box-shadow: 5px 10px 0px -4px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 5px 10px 0px -4px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 5px 10px 0px -4px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
  :hover {
    background-color: rgba(250, 250, 250, 0.3);
    color: #ffffff;
    ox-shadow: 5px 10px 0px -4px #ffffffb3;
    -webkit-box-shadow: 5px 10px 0px -4px #ffffffb3;
    -moz-box-shadow: 5px 10px 0px -4px #ffffffb3;
  }
  @media (max-width: 767px) {
    width: 90% !important;
    margin-top: 20px !important;
    margin-left: 0px !important;
  }
`;

export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: stretched;
  align-items: stretched;
  width: 100%;
  @media (min-width: 767px) {
    flex-direction: row;
  }
`;

export const StyledImg = styled.img`
  width: 200px;
  height: 200px;
  @media (min-width: 767px) {
    width: 350px;
    height: 350px;
  }
  transition: width 0.5s;
  transition: height 0.5s;
`;

function Home() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  console.log('data: ', data);
  const sig = '0xaf8ff3425a9d939fd2fa3b68726f9eabec8dabda7b5643f8db12be92bc6cc2f0719810cb0ca5d85971b1fd6c651647c16dd5d825959bc45fe0ecb860c28781721c';
  
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const handleNotify = (mess, type) => {
    enqueueSnackbar(mess, {variant: type});
  };

  const handleProcessing = (mess, type) => {
    enqueueSnackbar(mess, {variant: type, persist: true});
  };

  const handleCloseNotify = () => {
    closeSnackbar();
  }

  if(blockchain.errorMsg){
    handleNotify(blockchain.errorMsg, 'error');
  }

  const deposit = () => {
    dispatch(fetchData(blockchain.account));
    handleProcessing('Deposit ...', 'info');
    blockchain.BankSC.methods
    .deposit(data.AWBCBalance)
    .send({
      from: blockchain.account,
    }).once('error', (err)=>{
      handleCloseNotify();
      handleNotify('Deposit fail!', 'error');
      console.log(err);
    }).then(async () => {
      handleCloseNotify();
      handleNotify('Deposit successful!', 'success');
      dispatch(fetchData(blockchain.account));
    });

    
  }

  const withdraw = async () => {
    const response = await fetch('https://learned-vehicle-330115.df.r.appspot.com/message/sign', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({recipientAddress: blockchain.account, amount: data.balanceOffChain, nonce: blockchain.nonce})
    });
    handleProcessing('Withdraw ...', 'info');
    blockchain.BankSC.methods
    .withdraw(blockchain.web3.utils.toWei((data.balanceOffChain).toString(), "ether"), blockchain.nonce, sig)
    .send({
      from: blockchain.account,
    }).once('error', (err)=>{
      handleCloseNotify();
      handleNotify('Withdraw fail!', 'error');
      console.log(err);
    }).then(() => {
      handleCloseNotify();
      handleNotify('Withdraw successful!', 'success');
      console.log('deposit successful!');
    });
  }

  return (
    <s.Container flex={1} ai={"center"} style={{ padding: 24 }}>
      <s.SpacerMedium />
      <ResponsiveWrapper flex={1} style={{ padding: 24 }}>
        <s.Container flex={1} jc={"center"} ai={"center"}>
          <StyledImg alt={"example"} src={i1} />
        </s.Container>
        <s.SpacerMedium />
        <s.Container
          flex={1}
          jc={"center"}
          ai={"center"}
          style={{ backgroundColor: "#383838", padding: 24 }}
        >
          {blockchain.account ? (
          <>
          <s.TextTitle style={{ textAlign: "center", marginBottom: 20 }}>
            Deposit to earn money
          </s.TextTitle>
          <s.SpacerXSmall />
          <s.TextDescription
            style={{ textAlign: "center", alignSelf: "start" }}
          >
            AWBC Balance: {data.balanceOffChain ? data.balanceOffChain/10**18 : 0} AWBC
          </s.TextDescription>
          <s.SpacerSmall />
          <s.TextDescription
            style={{ textAlign: "center", alignSelf: "start" }}
          >
            Total Deposit: {data.totalDeposit ? data.totalDeposit/(10**18) : 0} AWBC
          </s.TextDescription>
          <s.SpacerSmall />
          <s.TextDescription
            style={{ textAlign: "center", alignSelf: "start" }}
          >
            Total Reward: {data.point ? data.point : 0} AWBC
          </s.TextDescription>
          <s.SpacerMedium />
          <s.Container ai={"center"} jc={"center"} fd={"row"}>
            <StyledButton onClick={deposit}>Deposit</StyledButton>
            <StyledButton style={{ marginLeft: 10 }} onClick={withdraw}>
              Withdraw
            </StyledButton>
          </s.Container>
          <s.Container
            ai={"center"}
            jc={"center"}
            fd={"row"}
            style={{ marginTop: 20 }}
          >
            <StyledA href="/game" style={{ width: "99%" }} onClick={(e) => {}}>
              Play now!
            </StyledA>
          </s.Container>
        
        </>
          ) : (
            <>
            <s.TextTitle style={{ textAlign: "center", marginBottom: 20 }}>
              Let's connect your wallet
          </s.TextTitle>
          <s.Container
            ai={"center"}
            jc={"center"}
            fd={"row"}
            style={{ marginTop: 20 }}
          >
            <StyledA href="/game" style={{ width: "99%" }} onClick={(e) => {}}>
              Play now!
            </StyledA>
          </s.Container>
            </>
          )
        }
        </s.Container>
      </ResponsiveWrapper>
      <s.SpacerSmall />
      <s.Container jc={"center"} ai={"center"} style={{ width: "70%" }}>
        <s.TextDescription style={{ textAlign: "center", fontSize: 9 }}>
          Private Chain: also known as Off-Chain to distinguish it from On-Chain
          (Public Chain), such as off-line and on-line. Instead of being in the
          cyberspace of millions of computers, Private Chain is a blockchain
          system that resides inside your computer.
        </s.TextDescription>
        <s.SpacerSmall />
        <s.TextDescription style={{ textAlign: "center", fontSize: 9 }}>
          Users only spend 2 transactions when depositing and withdrawing money
          from on-chain to off-chain All other transactions in the game are
          processed off-chain and do not cost gas
        </s.TextDescription>
      </s.Container>
    </s.Container>
  );
}

export default Home;
