import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";
import i1 from "./assets/images/Lucas.png";

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
  :hover{
    background-color: rgba(250, 250, 250, 0.3);
    color: #ffffff;
    ox-shadow: 5px 10px 0px -4px #ffffffb3;
    -webkit-box-shadow: 5px 10px 0px -4px #ffffffb3;
    -moz-box-shadow: 5px 10px 0px -4px #ffffffb3;
  }
  @media (max-width: 767px) {
    width: 90% !important;
    margin-top: 20px !important;
    margin-left: 0px  !important;
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

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  useEffect(() => {
    getData();
  }, [blockchain.account]);

  return (
    <s.Screen style={{ backgroundColor: "var(--black)" }}>
      <s.Container flex={1} ai={"center"} style={{ padding: 24 }}>
        <s.Container flex style={{ flexDirection: 'row', justifyContent : 'space-around'}}>
        <s.TextTitle
          style={{ textAlign: "center", fontSize: 48, fontWeight: "bold" }}
        >
          # AWBC
        </s.TextTitle>
        <StyledButton
                      style={{width: 300}}
                      onClick={(e) => {
                        e.preventDefault();
                        dispatch(connect());
                        getData();
                      }}
                    >
                    {blockchain.account? `${blockchain.account.substring(0, 6)}...${blockchain.account.substring(
              blockchain.account.length - 4
            )}` : 'CONNECT WALLET'}
        </StyledButton>
          </s.Container>
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
                <s.TextTitle style={{ textAlign: "center", marginBottom: 20 }}>
                  Deposit to earn money
                </s.TextTitle>
                <s.SpacerXSmall />
                <s.TextDescription style={{ textAlign: "center", alignSelf: 'start' }}>
                  Total Deposit: 200.5 ETH
                </s.TextDescription>
                <s.SpacerSmall />
                <s.TextDescription style={{ textAlign: "center",  alignSelf: 'start' }}>
                  Total Reward: 9.7 ETH
                </s.TextDescription>
                <s.SpacerMedium />
                  <s.Container ai={"center"} jc={"center"} fd={"row"}>
                    <StyledButton
                      onClick={(e) => {
                      }}
                    >
                      Deposit
                    </StyledButton>
                    <StyledButton
                      style={{marginLeft: 10}}
                      onClick={(e) => {
                      }}
                    >
                      Withdraw
                    </StyledButton>
            </s.Container>
            <s.Container ai={"center"} jc={"center"} fd={"row"} style={{marginTop: 20}}>
                    <StyledButton
                      style={{width: '99%'}}
                      onClick={(e) => {
                      }}
                    >
                      Play now!
                    </StyledButton>
                  </s.Container>
          </s.Container>
        </ResponsiveWrapper>
        <s.SpacerSmall />
        <s.Container jc={"center"} ai={"center"} style={{ width: "70%" }}>
          <s.TextDescription style={{ textAlign: "center", fontSize: 9 }}>
          Private Chain: also known as Off-Chain to distinguish it from On-Chain (Public Chain), such as off-line and on-line. Instead of being in the cyberspace of millions of computers, Private Chain is a blockchain system that resides inside your computer.
          </s.TextDescription>
          <s.SpacerSmall />
          <s.TextDescription style={{ textAlign: "center", fontSize: 9 }}>
          Users only spend 2 transactions when depositing and withdrawing money from on-chain to off-chain
All other transactions in the game are processed off-chain and do not cost gas
          </s.TextDescription>
        </s.Container>
      </s.Container>
    </s.Screen>
  );
}

export default App;
