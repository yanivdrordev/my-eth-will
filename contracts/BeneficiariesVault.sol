// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

//add ownable
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/utils/Address.sol";


contract BeneficiariesVault {
    
    // public functions that start with prefix ow_ are only for the Owner of the contract
    // public functions that start with prefix be_ are only for the Beneficiaries
    // all the other public functions are accesible to the Owner or one of the Beneficiaries but not to any other address (more about access control in the modifiers comments)
    
    //START STATE VARIBLES
    address private _owner;
    
    event Deposit(address sender, uint value);
    
    using Address for address payable;
    
    // Add the library methods
    using EnumerableSet for EnumerableSet.AddressSet;
    
    //using Strings for uint256;
    
    // Declare a set state variable
    EnumerableSet.AddressSet private beneficiariesAddresses;
    
    struct BeneficiariesStruct {
        string email;
        string name;
    }
    
    //map address to struct
    mapping(address => BeneficiariesStruct) private beneficiaries;
    
    uint256 deadlineTimestamp;
    
    bool withdrawAllowed;
    
    //END STATE VARIBLES
    
    constructor(address _vaultOwner){
        //Add a dedline with default of a year from contract creation
        deadlineTimestamp = block.timestamp + (365 * 1 days);
        withdrawAllowed = false;
        _owner = _vaultOwner;
    }
    
    //START UTIL FUNCTIONS
    
    function isContains(address  _beneficiaryAddress) private view returns(bool) {
        return beneficiariesAddresses.contains( _beneficiaryAddress);
    }
    
    function getLength() private view returns(uint){
        return beneficiariesAddresses.length();
    }

    function at(uint index) private view returns(address) {
        require(index < beneficiariesAddresses.length());
        return beneficiariesAddresses.at(index);
    }
    
    function owner() public view virtual returns (address) {
        return _owner;
    }
    
    
    //END UTIL FUNCTIONS
    
    //START MODIFIRES
    
    //there are only 2 roles in this contract Owner or Beneficiary
    //and there are 3 modifiers that provide Access Controll 
    
     modifier OnlyBeneficiary(address _beneficiaryAddress){
         require(isContains(_beneficiaryAddress),"beneficiary address not found!");
         _;
    }
    
    modifier OwnerOrBeneficiary(address _address){
         require(owner() == msg.sender || isContains(_address) ,"address is not owner or beneficiary");
         _;       
    }
    
    modifier onlyOwner() {
        require(owner() ==  msg.sender, "Ownable: caller is not the owner");
        _;
    }
    
    //END MODIFIRES
    
    
    //START CONTRACT PUBLIC API
    
    function getContractBalance() public view OwnerOrBeneficiary(msg.sender) returns (uint256) {
        return address(this).balance;
    }
    
    function getBeneficiariesStruct(address _beneficiaryAddress) public view returns(BeneficiariesStruct memory){
        
        require(isContains(_beneficiaryAddress),"beneficiary address not found!");
        
        return beneficiaries[_beneficiaryAddress];
    }
    
    function ow_AddBeneficiary(address _newBeneficiaryAddress, string memory _newBeneficiaryEmail, string memory _newBeneficiaryName) public onlyOwner{
        
        require(!isContains(_newBeneficiaryAddress),"beneficiary address not already exist!");
        //add to beneficiaries mapping
        beneficiaries[_newBeneficiaryAddress] = BeneficiariesStruct(_newBeneficiaryEmail,_newBeneficiaryName);
        //add to beneficiariesAddresses set
        beneficiariesAddresses.add(_newBeneficiaryAddress);
    }
    
    function ow_RemoveBeneficiary(address _beneficiaryAddress) public OnlyBeneficiary(_beneficiaryAddress) onlyOwner{

        //remove from beneficiaries mapping
        delete beneficiaries[_beneficiaryAddress];
        //remove from beneficiariesAddresses set
        beneficiariesAddresses.remove(_beneficiaryAddress);
    }
    
    function be_Withdraw(address payable _beneficiaryAddress) public payable OnlyBeneficiary(_beneficiaryAddress){
        //check that withdraw is allowed
        require(isWithdrawAllowed(), "withdraw is not allowed at the moment");
        //check that the msg.sender
        
        _beneficiaryAddress.sendValue(msg.value);//temporary just for check

    }
    
    function ow_SetDeadlineFromToday(uint256 _numberOfDays) public onlyOwner {
        require(_numberOfDays > 7 && _numberOfDays < 365 , "extension is set only in days that are greater then 7 and lower then 365");
        deadlineTimestamp = block.timestamp + (_numberOfDays * 1 days);
    }
    
    function getDeadlineTimestamp() public view OwnerOrBeneficiary(msg.sender) returns(uint256){
        return deadlineTimestamp;
    }
    
    
    function isWithdrawAllowed() public view OwnerOrBeneficiary(msg.sender) returns(bool){
    
        if(block.timestamp > deadlineTimestamp){
            return true;
        }
        
        return false;
    }
    
    //only admin deposit to contract
    receive() external payable onlyOwner{
        emit Deposit(msg.sender, msg.value);
    }
    
    
    //END CONTRACT PUBLIC API

 }