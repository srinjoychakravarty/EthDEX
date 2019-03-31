pragma solidity 0.4.24;

import "openzeppelin-solidity/contracts/token/ERC20/StandardToken.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract SativaGeneSeed is StandardToken, Ownable{

    string public name;
    string public symbol;
    uint32 public decimals;

    constructor() public {
        symbol = "SATVA";
        name = "SativaGeneSeed";
        decimals = 5;
        totalSupply_ = 100000000000;
        owner = msg.sender;
        balances[msg.sender] = totalSupply_;

        emit Transfer(address(0x0), msg.sender, totalSupply_);
    }
}
