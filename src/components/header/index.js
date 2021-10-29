import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { StyledButton } from "../../pages/home";
import { connect } from "../../redux/blockchain/blockchainActions";
import { fetchData } from "../../redux/data/dataActions";
import * as s from "../../styles/globalStyles";

function Header() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  useEffect(() => {
    getData();
  }, [blockchain.account]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <s.Container
      flex
      style={{ flexDirection: "row", justifyContent: "space-around" }}
    >
      <s.TextHref
        href="/"
        style={{ textAlign: "center", fontSize: 48, fontWeight: "bold" }}
      >
        # AWBC
      </s.TextHref>
      <StyledButton
        style={{ width: 300 }}
        disabled={blockchain?.account}
        onClick={(e) => {
          e.preventDefault();
          dispatch(connect());
          getData();
        }}
      >
        {blockchain.account
          ? `${blockchain.account.substring(
              0,
              6
            )}...${blockchain.account.substring(blockchain.account.length - 4)}`
          : "CONNECT WALLET"}
      </StyledButton>
    </s.Container>
  );
}

export default Header;
