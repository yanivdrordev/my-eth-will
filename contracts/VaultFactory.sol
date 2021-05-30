// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./BeneficiariesVault.sol";

contract VaultFactory {
    
    
    //map address to struct
    mapping(address => address) public accountToContractMapping;
    
    function createNewVault() public {
      accountToContractMapping[msg.sender] = address(new BeneficiariesVault(msg.sender));
    }
    
    function getContractAddress() public view returns (address){
        return accountToContractMapping[msg.sender];
    }
    
    
    function checkIfAcountHasVault() public view returns (bool) {
        if(accountToContractMapping[msg.sender] == address(0)){
            return false;
        }
        //msg.sender is in the mapping
        return true;
    }
}