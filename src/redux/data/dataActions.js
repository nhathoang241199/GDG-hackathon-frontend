// log
import store from "../store";

const fetchDataRequest = () => {
  return {
    type: "CHECK_DATA_REQUEST",
  };
};

const fetchDataSuccess = (payload) => {
  return {
    type: "CHECK_DATA_SUCCESS",
    payload: payload,
  };
};

const fetchDataFailed = (payload) => {
  return {
    type: "CHECK_DATA_FAILED",
    payload: payload,
  };
};

export const fetchData = (account) => {
  return async (dispatch) => {
    dispatch(fetchDataRequest());
    try {
      let AWBCBalance = await store
        .getState()
        .blockchain.AWBCTokenSC.methods.balanceOf(store.getState().blockchain.account)
        .call();
      let totalDeposit = await store
        .getState()
        .blockchain.BankSC.methods.balanceOf(store.getState().blockchain.account)
        .call();
      dispatch(
        fetchDataSuccess({
          AWBCBalance,
          totalDeposit
        })
      );
    } catch (err) {
      console.log(err);
      dispatch(fetchDataFailed("Could not load data from contract."));
    }
  };
};
