import React from "react";
import Web3 from "web3";

const web3 = new Web3(Web3.givenProvider);
export const Web3Context = React.createContext(web3);