// log
import store from "../store";

const fetchDataRequest = () => {
  return {
    type: "CHECK_DATA_REQUEST",
  };
};

export const fetchDataSuccess = (payload) => {
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
        .blockchain.AWBCTokenSC.methods.balanceOf(
          store.getState().blockchain.account
        )
        .call();
      let totalDeposit = await store
        .getState()
        .blockchain.BankSC.methods.balanceOf(
          store.getState().blockchain.account
        )
        .call();

      const api = "https://learned-vehicle-330115.df.r.appspot.com/user";
      let response = await fetch(
        api + "/" + store.getState().blockchain.account
      );
      if (response.status === 409) {
        response = await fetch(api, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            address: store.getState().blockchain.account,
            balance: "0",
          }),
        });
      }

      response = await (
        await fetch(api + "/" + store.getState().blockchain.account)
      ).json();
      const balanceOffChain = response.data.balance;
      const point = response.data.point;
      // const api = `https://learned-vehicle-330115.df.r.appspot.com/user/${store.getState().blockchain.account}`;
      // fetch(api).then(response => response.json())
      // .then(data => console.log(data))
      // .catch(err => console.error(err));

      dispatch(
        fetchDataSuccess({
          AWBCBalance,
          totalDeposit,
          balanceOffChain,
          point,
        })
      );
    } catch (err) {
      console.log(err);
      dispatch(fetchDataFailed("Could not load data from contract."));
    }
  };
};
