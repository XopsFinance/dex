// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./IFOModels.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract XOSWAPIFO is ReentrancyGuard, Ownable {
    using SafeMath for uint256;

    event Deposit(address indexed addr,  uint256 deposit_amount);
    event ClaimToken(address indexed addr,  uint256 token_claimed, uint256 refund_amount);


    IFOConfig ifoConfig;
    mapping(address => UserInfo) users;
    address[] private usersList;
    mapping(address => bool) private blacklistUsersList;
    mapping(address => bool) private refundedWalletList;


    //a mapping to determine which contract has access to write data to this contract
    //used in the modifier below
    mapping(address => bool) accessAllowed;
    //function modifier checks to see if an address has permission to update data
    //bool has to be true
    modifier isAllowed() {
        require(accessAllowed[msg.sender] == true);
        _;
    }

    //set an address to the accessAllowed map and set bool to true
    //uses the isAllowed function modifier to determine if user can change data
    //this function controls which addresses can write data to the contract
    //if you update the UserContract you would add the new address here
    function allowAccess(address[] memory _addresses) public onlyOwner {
        for (uint i = 0; i < _addresses.length; i++) {
            accessAllowed[_addresses[i]] = true;
        }
    }

    //set an address to the accessAllowed map and set bool to false
    //uses the isAllowed function modifier to determine if user can change data
    //this function controls which addresses need to have thier write access removed from the contract
    //if you update the UserContract you would set the old contract address to false
    function denyAccess(address _address) public onlyOwner {
        accessAllowed[_address] = false;
    }

    constructor()  {
        accessAllowed[msg.sender] = true;
    }
    
    function setup_blacklist(address[] memory addressList) public onlyOwner returns (bool){
        for (uint256 i = 0; i < addressList.length; i++) {
            blacklistUsersList[addressList[i]]=true;
        }
        return true;
    }

    function setup(
        address _token_address,
        uint256 _token_max_supply,
        uint256 _token_decimal,
        address _cash_wallet,
        uint256 _min_raised,
        uint256 _max_raised,
        uint256 _deposit_start_time,
        uint256 _deposit_end_time,
        uint256 _claim_start_time,
        uint256 _claim_end_time
    ) public isAllowed returns (bool) {
        ifoConfig.INITIALIZED = true;

        ifoConfig.TOKEN_ADDRESS = _token_address;
        ifoConfig.TOKEN_DECIMAL = _token_decimal;
        ifoConfig.TOKEN_MAX_SUPPLY = _token_max_supply;

        ifoConfig.CASH_WALLET = _cash_wallet;

        ifoConfig.DEPOSIT_START_TIME = _deposit_start_time;
        ifoConfig.DEPOSIT_END_TIME = _deposit_end_time;

        ifoConfig.CLAIM_START_TIME = _claim_start_time;
        ifoConfig.CLAIM_END_TIME = _claim_end_time;
        ifoConfig.MIN_TO_RAISE=_min_raised;
        ifoConfig.MIN_TO_RAISE_IN_WEI = _min_raised * 10** 18;

        ifoConfig.MAX_TO_RAISE=_max_raised;
        ifoConfig.MAX_TO_RAISE_IN_WEI = _max_raised * 10** 18;
        
        ifoConfig.TOTAL_REFUNDED_AMOUNT = 0;
        ifoConfig.TOTAL_REFUNDED_USERS = 0;

        return true;
    }


    function setup_time(
        uint256 _deposit_start_time,
        uint256 _deposit_end_time,
        uint256 _claim_start_time,
        uint256 _claim_end_time
    ) public isAllowed returns (bool) {
        ifoConfig.DEPOSIT_START_TIME = _deposit_start_time;
        ifoConfig.DEPOSIT_END_TIME = _deposit_end_time;

        ifoConfig.CLAIM_START_TIME = _claim_start_time;
        ifoConfig.CLAIM_END_TIME = _claim_end_time;

        return true;
    }

    function get_config() public view returns (IFOConfig memory) {

        IFOConfig memory ifoConfig_tmp = ifoConfig;
        ifoConfig_tmp.TOTAL_USERS = usersList.length;
        return ifoConfig_tmp;
    }


    function deposit() public payable returns (UserInfo memory) {
        require(
            ifoConfig.INITIALIZED == true,
            "This smartcontract hasn't been initialized"
        );

        require(
            block.timestamp >= ifoConfig.DEPOSIT_START_TIME,
            "The deposit time has not started yet!"
        );

        require(
            block.timestamp <= ifoConfig.DEPOSIT_END_TIME,
            "The deposit time has ended!"
        );

        // //Get the money

        require(msg.value > 0, "Invalid deposit amount!");
        // payable(ifoConfig.CASH_WALLET).transfer(msg.value);

        // //Record the transaction

        DepositTransaction memory deposit_transaction = DepositTransaction({
            amount: msg.value,
            deposit_time: block.timestamp
        });

        //Done record
        UserInfo storage user = users[msg.sender];
        //Increase the user counter if this user has never depositted before
        if (user.deposit_total_amount == 0) {
            //Never deposit before
            // user_counter.increment();
            // Add user to list
            user.user_address = msg.sender; // Assign the address
            usersList.push(msg.sender);
        }

        user.deposit_transactions.push(deposit_transaction);
        user.deposit_total_amount += msg.value;

        ifoConfig.TOTAL_DEPOSIT_AMOUNT += msg.value;


        emit Deposit(msg.sender, msg.value);

        return user;
    }

    

    function check_user_deposit() public view returns (UserInfo memory) {
        return users[msg.sender];
    }


    function claim_tokens() public returns (bool) {
        require(
            ifoConfig.INITIALIZED == true,
            "This smartcontract hasn't been initialized"
        );
        
        require(!blacklistUsersList[msg.sender], "Blacklist address");

        require(
            block.timestamp >= ifoConfig.CLAIM_START_TIME,
            "The claim time has not started yet!"
        );

        require(
            block.timestamp <= ifoConfig.CLAIM_END_TIME,
            "The claim time has ended!"
        );

        require(
             ifoConfig.TOTAL_DEPOSIT_AMOUNT >= ifoConfig.MIN_TO_RAISE_IN_WEI,
            "DEPOSIT IS REQUIRE UNDER MIN RAISE"
        );

        UserInfo storage user = users[msg.sender];
        require(
            user.deposit_total_amount > 0,
            "There is no record of a deposit from the user!"
        );
        require(user.claim_amount == 0, "The user has claimed the token!");

        require(user.refund_amount < user.deposit_total_amount, "Claim Error!");

        //Calculate the Amount of tokens
        UserCashFlow  memory cashflow = this._get_user_cashflow(msg.sender);

        user.token_claim_amount = cashflow.projected_token_amount;
        user.token_claim_time = block.timestamp;
        user.claim_amount = cashflow.projected_claim_amount;
        user.refund_amount = cashflow.projected_refund_amount;


        //Return Token
        ifoConfig.TOKEN_CLAIMED += user.token_claim_amount;
        IERC20(ifoConfig.TOKEN_ADDRESS).transfer(address(msg.sender),user.token_claim_amount * 10** ifoConfig.TOKEN_DECIMAL);


        //Refund deposited
        if(user.refund_amount >0){
            address payable payable_sender = payable(msg.sender);
            (bool callSuccess, ) = payable_sender.call{value: user.refund_amount}("");
            require(callSuccess,"Failed to refund Token!");
        }


        emit ClaimToken(msg.sender,  user.token_claim_amount , user.refund_amount);

        return true;
    }

    function _get_user_cashflow(address user_address) public view  returns (UserCashFlow memory) {
        UserInfo memory user = users[user_address];
        uint256 user_claim_token_amount;
        uint256 claim_amount = user.deposit_total_amount;
         if(ifoConfig.TOTAL_DEPOSIT_AMOUNT > (ifoConfig.MAX_TO_RAISE_IN_WEI)){
            claim_amount = user.deposit_total_amount.mul(ifoConfig.MAX_TO_RAISE_IN_WEI).div(ifoConfig.TOTAL_DEPOSIT_AMOUNT);
            user_claim_token_amount = claim_amount.mul(ifoConfig.TOKEN_MAX_SUPPLY).div(ifoConfig.MAX_TO_RAISE_IN_WEI);
        }else{
            user_claim_token_amount = user.deposit_total_amount.mul(ifoConfig.TOKEN_MAX_SUPPLY).div(ifoConfig.TOTAL_DEPOSIT_AMOUNT);
        }
        
        uint256 refund_amount = user.deposit_total_amount - claim_amount;



        return UserCashFlow({
            user_deposit: user.deposit_total_amount,

            projected_claim_amount: claim_amount,
            claimed_amount: user.claim_amount,
    
            projected_refund_amount: refund_amount,
            refunded_amount: user.refund_amount,

            projected_token_amount: user_claim_token_amount,
            claimed_token_amount: user.token_claim_amount


        });

    }

    function get_user_cashflow() public view returns (UserCashFlow memory) {

        return this._get_user_cashflow(msg.sender);


    }

    function get_statistic() public view returns (IFOStatistic memory) {
        return
            IFOStatistic({
                user_count: usersList.length,
                total_deposit: ifoConfig.TOTAL_DEPOSIT_AMOUNT,
                max_to_raise: ifoConfig.MAX_TO_RAISE_IN_WEI,
                min_to_raise: ifoConfig.MIN_TO_RAISE_IN_WEI,
                max_token_supply: ifoConfig.TOKEN_MAX_SUPPLY,
                claiming_token_amount: ifoConfig.TOKEN_MAX_SUPPLY,
                claimed_token_amount: ifoConfig.TOKEN_CLAIMED,
                refunded_amount: ifoConfig.TOTAL_REFUNDED_AMOUNT,
                refunded_users: ifoConfig.TOTAL_REFUNDED_USERS
            });
    }


   

    function withdraw_eth_to_cash_wallet() public isAllowed payable {
        address payable payable_sender = payable(msg.sender);
        uint256 amount_to_withdraw = payable(address(this)).balance;
        (bool callSuccess, ) = payable_sender.call{value: amount_to_withdraw}("");
        require(callSuccess,"Failed to send Token!");
    }

    function withdraw_token_to_cash_wallet() public isAllowed payable {
        uint256 currentBalance = IERC20(ifoConfig.TOKEN_ADDRESS).balanceOf(address(this));
        IERC20(ifoConfig.TOKEN_ADDRESS).transfer(address(msg.sender), currentBalance);
    }


    function get_user_lists() public view isAllowed returns (UserInfo[] memory){

        uint256 user_count  = usersList.length;

        UserInfo[] memory users_info_list = new UserInfo[](user_count);

        for (uint256 i = 0; i < usersList.length; i++) {
            // minting_tokenURIs[i] = tokenURIs[senpadConfig.claimed_count + i]; 
            address user_addr = usersList[i];
            UserInfo memory userinfo = users[user_addr];

            users_info_list[i]=userinfo;
        }

        return users_info_list;

    }

    function claim_refund() public returns (bool){
        /*
        * This function only available if LESS THAN REQUIRED MIN RAISE
        */
        require(
            ifoConfig.INITIALIZED == true,
            "This smartcontract hasn't been initialized"
        );
        
        require(!blacklistUsersList[msg.sender], "Blacklist address");

        require(
            block.timestamp >= ifoConfig.DEPOSIT_END_TIME,
            "WAIT TO DEPOSIT END TIME"
        );

        require(
            ifoConfig.TOTAL_DEPOSIT_AMOUNT < ifoConfig.MIN_TO_RAISE_IN_WEI,
            "DEPOSIT IS REQUIRE UNDER MIN RAISE"
        );

        UserCashFlow  memory cashflow = this._get_user_cashflow(msg.sender);
        UserInfo memory user = users[msg.sender];
        require(
            user.deposit_total_amount > 0,
            "ONLY deposited Users to get refund"
        );

         require(
            !(user.refund_amount > 0),
            "USERS get refunded"
        );

        require(
            cashflow.projected_claim_amount > 0,
            "User need to deposit before get refunded"
        );

        require(
            user.claim_amount == 0,
            "User claimed the token"
        );

        require(
            !refundedWalletList[msg.sender],
            "User got the refund"
        );

        //add to refund list
        refundedWalletList[msg.sender] = true;

        //update the total refunded amount to the project statistic
        ifoConfig.TOTAL_REFUNDED_AMOUNT += user.deposit_total_amount;
        ifoConfig.TOTAL_REFUNDED_USERS += 1;

        //add refund amount to reach users
        user.refund_amount = user.deposit_total_amount;

        //deposit_total_amount
        address payable payable_sender = payable(msg.sender);
        (bool callSuccess, ) = payable_sender.call{value: user.deposit_total_amount}("");
        require(callSuccess,"Failed to refund To End-User!");

        return true;


    }

}
