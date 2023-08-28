// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


struct IFOConfig {        
    
        bool INITIALIZED;

        address TOKEN_ADDRESS;
        uint256 TOKEN_MAX_SUPPLY;
        uint256 TOKEN_CLAIMED;

        uint256 TOKEN_DECIMAL;

        address CASH_WALLET;
        
        uint256 DEPOSIT_START_TIME;
        uint256 DEPOSIT_END_TIME;
        uint256 CLAIM_START_TIME;
        uint256 CLAIM_END_TIME;


        uint256 TOTAL_DEPOSIT_AMOUNT;
        uint256 TOTAL_USERS; 

        uint256 TOTAL_REFUNDED_AMOUNT;
        uint256 TOTAL_REFUNDED_USERS; 


        uint256 MIN_TO_RAISE;
        uint256 MIN_TO_RAISE_IN_WEI;

        uint256 MAX_TO_RAISE;
        uint256 MAX_TO_RAISE_IN_WEI;
        

        
}


struct UserInfo {
    address user_address;
    uint256 deposit_total_amount; //ETH
    uint256 claim_amount; // Token
    uint256 refund_amount; // Token
    DepositTransaction[] deposit_transactions;

    uint256 token_claim_amount;
    uint256 token_claim_time;

}

struct DepositTransaction {
    uint256 amount;
    uint256 deposit_time;
}

struct UserCashFlow {
    uint256 user_deposit;

    uint256 projected_claim_amount;
    uint256 claimed_amount;
    

    uint256 projected_refund_amount;
    uint256 refunded_amount;

    uint256 projected_token_amount;
    uint256 claimed_token_amount;

}


struct IFOStatistic {
    uint256 user_count;
    uint256 total_deposit;
    uint256 max_token_supply;
    uint256 claiming_token_amount;
    uint256 claimed_token_amount;
    uint256 min_to_raise;
    uint256 max_to_raise;
    uint256 refunded_amount;
    uint256 refunded_users;
}


