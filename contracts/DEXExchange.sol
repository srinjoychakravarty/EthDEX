pragma solidity 0.4.24;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/lifecycle/Pausable.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";


contract DEXExchange is Ownable, Pausable {

  /**
  * @dev Details of each transfer
  * @param contract_ contract address of ER20 token to transfer
  * @param to_ receiving account
  * @param amount_ number of tokens to transfer to_ account
  * @param failed_ if transfer was successful or not
  */
    struct Transfer {
        address contract_;
        address to_;
        uint amount_;
        bool failed_;
    }

    /**
    * @dev a mapping from transaction ID's to the sender address
    * that initiates them. Owners can create several transactions
    */
    mapping(address => uint[]) public transactionIndexesToSender;

    /**
    * @dev a list of all transfers successful or unsuccessful
    */
    Transfer[] public transactions;
    address public owner;

    /**
    * @dev list of all supported tokens for transfer
    * @param string token symbol
    * @param address contract address of token
    */
    mapping(bytes32 => address) public tokens;

    ERC20 public erc20Interface;

    /**
    * @dev Event to notify if transfer successful or failed
    * after account approval verified
    */
    event TransferSuccessful(address indexed from_, address indexed to_, uint256 amount_);
    event TransferFailed(address indexed from_, address indexed to_, uint256 amount_);

    /**
    * @dev allow contract to receive funds
    */
    function() public payable {}

    /**
    * @dev add address of token to list of supported tokens using
    * token symbol as identifier in mapping
    */
    function addNewToken(bytes32 symbol_, address address_) public onlyOwner returns (bool) {
        tokens[symbol_] = address_;
        return true;
    }

    /**
    * @dev remove address of token we no more support
    */
    function removeToken(bytes32 symbol_) public onlyOwner returns (bool) {
        require(tokens[symbol_] != 0x0);
        delete (tokens[symbol_]);
        return true;
    }

    /**
    * @dev method that handles transfer of ERC20 tokens to other address
    * it assumes the calling address has approved this contract
    * as spender
    * @param symbol_ identifier mapping to a token contract address
    * @param to_ beneficiary address
    * @param amount_ numbers of token to transfer
    */
    function transferTokens(bytes32 symbol_, address to_, uint256 amount_) public whenNotPaused {
        require(tokens[symbol_] != 0x0);
        require(amount_ > 0);
        address contract_ = tokens[symbol_];
        address from_ = msg.sender;
        erc20Interface = ERC20(contract_);
        // Adds a Transfer Object to the end of the transactions array of Transfer Objects
        uint256 transactionId = transactions.push(
            Transfer({
                contract_:  contract_,
                to_: to_,
                amount_: amount_,
                failed_: true
            })
        );

        transactionIndexesToSender[from_].push(transactionId - 1);

        // Ensures that the smart contract is not trying to send out more tokens than it is alloted
        // by the owner of the ERC20 token. If it is, the transfer is reverted, the TransferFailed
        // event is emitted and the boolean flag remains as failed
        if (amount_ > erc20Interface.allowance(from_, address(this))) {
            emit TransferFailed(from_, to_, amount_);
            revert();
        }

        // Transfer is allowed if token amount is within allowed limits as assigned by token owner
        erc20Interface.transferFrom(from_, to_, amount_);

        // Boolean flag switched to false after successful transfer
        transactions[transactionId - 1].failed_ = false;

        // TransferSuccessful event is emitted after successful transfer
        emit TransferSuccessful(from_, to_, amount_);
    }

    /**
    * @dev withdraw funds from this contract
    * @param beneficiary address to receive ether
    */
    function withdraw(address beneficiary) public payable onlyOwner whenNotPaused {
        beneficiary.transfer(address(this).balance);
    }
}
