export const XOSWAP_IFO = {
  _format: 'hh-zksolc-artifact-1',
  contractName: 'XoswapIFO',
  sourceName: 'contracts/XoswapIFO.sol',
  abi: [
    { inputs: [], stateMutability: 'nonpayable', type: 'constructor' },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'addr',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'token_claimed',
          type: 'uint256',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'refund_amount',
          type: 'uint256',
        },
      ],
      name: 'ClaimToken',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'addr',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'deposit_amount',
          type: 'uint256',
        },
      ],
      name: 'Deposit',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'previousOwner',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'newOwner',
          type: 'address',
        },
      ],
      name: 'OwnershipTransferred',
      type: 'event',
    },
    {
      inputs: [
        { internalType: 'address', name: 'user_address', type: 'address' },
      ],
      name: '_get_user_cashflow',
      outputs: [
        {
          components: [
            { internalType: 'uint256', name: 'user_deposit', type: 'uint256' },
            {
              internalType: 'uint256',
              name: 'projected_claim_amount',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: 'claimed_amount',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: 'projected_refund_amount',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: 'refunded_amount',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: 'projected_token_amount',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: 'claimed_token_amount',
              type: 'uint256',
            },
          ],
          internalType: 'struct UserCashFlow',
          name: '',
          type: 'tuple',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address[]', name: '_addresses', type: 'address[]' },
      ],
      name: 'allowAccess',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'check_user_deposit',
      outputs: [
        {
          components: [
            { internalType: 'address', name: 'user_address', type: 'address' },
            {
              internalType: 'uint256',
              name: 'deposit_total_amount',
              type: 'uint256',
            },
            { internalType: 'uint256', name: 'claim_amount', type: 'uint256' },
            { internalType: 'uint256', name: 'refund_amount', type: 'uint256' },
            {
              components: [
                { internalType: 'uint256', name: 'amount', type: 'uint256' },
                {
                  internalType: 'uint256',
                  name: 'deposit_time',
                  type: 'uint256',
                },
              ],
              internalType: 'struct DepositTransaction[]',
              name: 'deposit_transactions',
              type: 'tuple[]',
            },
            {
              internalType: 'uint256',
              name: 'token_claim_amount',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: 'token_claim_time',
              type: 'uint256',
            },
          ],
          internalType: 'struct UserInfo',
          name: '',
          type: 'tuple',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'claim_refund',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'claim_tokens',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'address', name: '_address', type: 'address' }],
      name: 'denyAccess',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'deposit',
      outputs: [
        {
          components: [
            { internalType: 'address', name: 'user_address', type: 'address' },
            {
              internalType: 'uint256',
              name: 'deposit_total_amount',
              type: 'uint256',
            },
            { internalType: 'uint256', name: 'claim_amount', type: 'uint256' },
            { internalType: 'uint256', name: 'refund_amount', type: 'uint256' },
            {
              components: [
                { internalType: 'uint256', name: 'amount', type: 'uint256' },
                {
                  internalType: 'uint256',
                  name: 'deposit_time',
                  type: 'uint256',
                },
              ],
              internalType: 'struct DepositTransaction[]',
              name: 'deposit_transactions',
              type: 'tuple[]',
            },
            {
              internalType: 'uint256',
              name: 'token_claim_amount',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: 'token_claim_time',
              type: 'uint256',
            },
          ],
          internalType: 'struct UserInfo',
          name: '',
          type: 'tuple',
        },
      ],
      stateMutability: 'payable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'get_config',
      outputs: [
        {
          components: [
            { internalType: 'bool', name: 'INITIALIZED', type: 'bool' },
            { internalType: 'address', name: 'TOKEN_ADDRESS', type: 'address' },
            {
              internalType: 'uint256',
              name: 'TOKEN_MAX_SUPPLY',
              type: 'uint256',
            },
            { internalType: 'uint256', name: 'TOKEN_CLAIMED', type: 'uint256' },
            { internalType: 'uint256', name: 'TOKEN_DECIMAL', type: 'uint256' },
            { internalType: 'address', name: 'CASH_WALLET', type: 'address' },
            {
              internalType: 'uint256',
              name: 'DEPOSIT_START_TIME',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: 'DEPOSIT_END_TIME',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: 'CLAIM_START_TIME',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: 'CLAIM_END_TIME',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: 'TOTAL_DEPOSIT_AMOUNT',
              type: 'uint256',
            },
            { internalType: 'uint256', name: 'TOTAL_USERS', type: 'uint256' },
            {
              internalType: 'uint256',
              name: 'TOTAL_REFUNDED_AMOUNT',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: 'TOTAL_REFUNDED_USERS',
              type: 'uint256',
            },
            { internalType: 'uint256', name: 'MIN_TO_RAISE', type: 'uint256' },
            {
              internalType: 'uint256',
              name: 'MIN_TO_RAISE_IN_WEI',
              type: 'uint256',
            },
            { internalType: 'uint256', name: 'MAX_TO_RAISE', type: 'uint256' },
            {
              internalType: 'uint256',
              name: 'MAX_TO_RAISE_IN_WEI',
              type: 'uint256',
            },
          ],
          internalType: 'struct IFOConfig',
          name: '',
          type: 'tuple',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'get_statistic',
      outputs: [
        {
          components: [
            { internalType: 'uint256', name: 'user_count', type: 'uint256' },
            { internalType: 'uint256', name: 'total_deposit', type: 'uint256' },
            {
              internalType: 'uint256',
              name: 'max_token_supply',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: 'claiming_token_amount',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: 'claimed_token_amount',
              type: 'uint256',
            },
            { internalType: 'uint256', name: 'min_to_raise', type: 'uint256' },
            { internalType: 'uint256', name: 'max_to_raise', type: 'uint256' },
            {
              internalType: 'uint256',
              name: 'refunded_amount',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: 'refunded_users',
              type: 'uint256',
            },
          ],
          internalType: 'struct IFOStatistic',
          name: '',
          type: 'tuple',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'get_user_cashflow',
      outputs: [
        {
          components: [
            { internalType: 'uint256', name: 'user_deposit', type: 'uint256' },
            {
              internalType: 'uint256',
              name: 'projected_claim_amount',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: 'claimed_amount',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: 'projected_refund_amount',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: 'refunded_amount',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: 'projected_token_amount',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: 'claimed_token_amount',
              type: 'uint256',
            },
          ],
          internalType: 'struct UserCashFlow',
          name: '',
          type: 'tuple',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'get_user_lists',
      outputs: [
        {
          components: [
            { internalType: 'address', name: 'user_address', type: 'address' },
            {
              internalType: 'uint256',
              name: 'deposit_total_amount',
              type: 'uint256',
            },
            { internalType: 'uint256', name: 'claim_amount', type: 'uint256' },
            { internalType: 'uint256', name: 'refund_amount', type: 'uint256' },
            {
              components: [
                { internalType: 'uint256', name: 'amount', type: 'uint256' },
                {
                  internalType: 'uint256',
                  name: 'deposit_time',
                  type: 'uint256',
                },
              ],
              internalType: 'struct DepositTransaction[]',
              name: 'deposit_transactions',
              type: 'tuple[]',
            },
            {
              internalType: 'uint256',
              name: 'token_claim_amount',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: 'token_claim_time',
              type: 'uint256',
            },
          ],
          internalType: 'struct UserInfo[]',
          name: '',
          type: 'tuple[]',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'owner',
      outputs: [{ internalType: 'address', name: '', type: 'address' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'renounceOwnership',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: '_token_address', type: 'address' },
        { internalType: 'uint256', name: '_token_max_supply', type: 'uint256' },
        { internalType: 'uint256', name: '_token_decimal', type: 'uint256' },
        { internalType: 'address', name: '_cash_wallet', type: 'address' },
        { internalType: 'uint256', name: '_min_raised', type: 'uint256' },
        { internalType: 'uint256', name: '_max_raised', type: 'uint256' },
        {
          internalType: 'uint256',
          name: '_deposit_start_time',
          type: 'uint256',
        },
        { internalType: 'uint256', name: '_deposit_end_time', type: 'uint256' },
        { internalType: 'uint256', name: '_claim_start_time', type: 'uint256' },
        { internalType: 'uint256', name: '_claim_end_time', type: 'uint256' },
      ],
      name: 'setup',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address[]', name: 'addressList', type: 'address[]' },
      ],
      name: 'setup_blacklist',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: '_deposit_start_time',
          type: 'uint256',
        },
        { internalType: 'uint256', name: '_deposit_end_time', type: 'uint256' },
        { internalType: 'uint256', name: '_claim_start_time', type: 'uint256' },
        { internalType: 'uint256', name: '_claim_end_time', type: 'uint256' },
      ],
      name: 'setup_time',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
      name: 'transferOwnership',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'withdraw_eth_to_cash_wallet',
      outputs: [],
      stateMutability: 'payable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'withdraw_token_to_cash_wallet',
      outputs: [],
      stateMutability: 'payable',
      type: 'function',
    },
  ],
  bytecode: '',
  linkReferences: {},
  deployedLinkReferences: {},
  factoryDeps: {},
}
