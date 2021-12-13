pragma solidity =0.6.6;

import '@BakerySwap2021/bakery-swap-lib/contracts/token/BEP20/BEP20.sol';

contract BakeryDestroyToken is BEP20('Bakery Destroy Token', 'BAKEDESTROY') {
    constructor() public {
        mint(1E22);
    }
}
