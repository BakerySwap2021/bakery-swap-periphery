import chai from 'chai'
import * as ethers from 'ethers'
import {deployContract, solidity} from 'ethereum-waffle'

import BakerySwapRouter from '../build/BakerySwapRouter.json'
import BakerySwapPair from '@BakerySwap2021/bakery-swap-core/build/BakerySwapPair.json'
import BakeryToken from '../build/BakeryToken.json'
import BakeryMaster from '../build/BakeryMaster.json'
import {BigNumber} from 'ethers/utils'

chai.use(solidity)

describe('PeripheryDeployProd', () => {
  // bsc test
  const provider = new ethers.providers.JsonRpcProvider('https://data-seed-prebsc-1-s1.binance.org:8545')
  // bsc main
  // const provider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed1.binance.org/')
  //  const provider = ethers.getDefaultProvider('rinkeby')
  const privateKey = '0x5031dcf9fba831e699cc5e01df38836a285c885d7b33336795db7800ab6713f9'
  const wallet = new ethers.Wallet(privateKey, provider)

  let overrides = {
    gasLimit: 9999999
  }

  const factoryAddress = '0xbC5e1628F7502e2e17C3bFE05850a6C3cB146a40'
  const bakeryTokenAddress = '0x95D619e70160D289933c7E6A98E7dFD3a2C75e27'
  const bakeryMasterAddress = '0x4fEB8A0Be376A2450E388a5D5f1554889B40170f'
  const routeAddress = '0x821133E187a4ef23C48A367c7B43b3DC5cc3564e'
  const devAddress = '0xf9e89b5aCA2e6061d22EA98CBCc2d826E3f9E4b1'
  const wbnbAddress = '0x094616f0bdfb0b526bd735bf66eca0ad254ca81f'

  beforeEach(async () => {
    let gasPrice = await provider.getGasPrice()
    console.log(`current gas Price ${gasPrice}`)
    gasPrice = gasPrice.mul(3).div(2)
    console.log(`new gas Price ${gasPrice}`)
    overrides = Object.assign(overrides, {gasPrice: gasPrice.toNumber()})
  })

  it('init code hash', function() {
    const hash = ethers.utils.keccak256(`0x${BakerySwapPair.evm.bytecode.object}`)
    console.log(hash)
  })

  it('deployBakeryToken', async () => {
    console.log(`start deployContract BakeryToken`)
    const bakeryToken = await deployContract(wallet, BakeryToken, [], overrides)
    console.log(`contract BakeryToken address ${bakeryToken.address}`)
    console.log(`contract BakeryToken deploy transaction hash ${bakeryToken.deployTransaction.hash}`)
    await bakeryToken.deployed()
    console.log(`finish deployContract BakeryToken`)
    /**
         * 20200912 测试
         * start deployContract BakeryToken
         contract BakeryToken address 0xcEEe33DBFc9DE3845D494BED9934F0537D5DEba4
         contract BakeryToken deploy transaction hash 0xafa8c8f0a62d7abbc1525c1ddf43e4f8eea95b1fb64669b8a0ccbab996540ef1
         finish deployContract BakeryToken
         */
  })

  it('deployBakeryMaster', async () => {
    console.log(`start deployContract BakeryMaster`)
    const bonusBeforeBulkBlockSize = new BigNumber(30000)
    const bakeStartBlock = new BigNumber(12000000).mul(new BigNumber(10).pow(18)).div(bonusBeforeBulkBlockSize)
    const startBlock = new BigNumber(1845000)
    const bonusEndBlock = startBlock.add(900000)
    const bonusEndBulkBlockSize: BigNumber = bonusEndBlock.sub(startBlock)
    const bonusBeforeCommonDifference = new BigNumber(300000)
      .mul(new BigNumber(10).pow(18))
      .div(bonusBeforeBulkBlockSize)
    const bonusEndCommonDifference = new BigNumber(300000)
      .mul(30)
      .mul(new BigNumber(10).pow(18))
      .div(bonusEndBlock.sub(startBlock))
    const bakeBonusEndBlock: BigNumber = bakeStartBlock
      .sub(
        bonusEndBlock
          .sub(startBlock)
          .div(bonusBeforeBulkBlockSize)
          .sub(1)
          .mul(bonusBeforeCommonDifference)
      )
      .mul(bonusBeforeBulkBlockSize)
      .mul(bonusEndBulkBlockSize.div(bonusBeforeBulkBlockSize))
      .div(bonusEndBulkBlockSize)
    const maxRewardBlockNumber: BigNumber = startBlock
      .add(
        bonusEndBulkBlockSize.mul(
          bakeBonusEndBlock
            .sub(bakeBonusEndBlock.mod(bakeBonusEndBlock))
            .div(bonusEndCommonDifference)
            .add(1)
        )
      )
      .sub(1)

    console.log('bonusBeforeBulkBlockSize  ' + bonusBeforeBulkBlockSize)
    console.log('bakeStartBlock  ' + bakeStartBlock)
    console.log('startBlock  ' + startBlock)
    console.log('bonusEndBlock  ' + bonusEndBlock)
    console.log('bonusEndBulkBlockSize  ' + bonusEndBulkBlockSize)
    console.log('bonusBeforeCommonDifference  ' + bonusBeforeCommonDifference)
    console.log('bonusEndCommonDifference  ' + bonusEndCommonDifference)
    console.log('bakeBonusEndBlock  ' + bakeBonusEndBlock)
    console.log('maxRewardBlockNumber ' + maxRewardBlockNumber)

    const constructorArgumentsABIEncoded = ethers.utils.defaultAbiCoder.encode(
      new ethers.utils.Interface(BakeryMaster.abi).deployFunction.inputs,
      [
        bakeryTokenAddress,
        devAddress,
        bakeStartBlock,
        startBlock,
        bonusEndBlock,
        bonusBeforeBulkBlockSize,
        bonusBeforeCommonDifference,
        bonusEndCommonDifference
      ]
    )
    console.log('constructorArgumentsABIEncoded ' + constructorArgumentsABIEncoded)
    const bakeryMaster = await deployContract(
      wallet,
      BakeryMaster,
      [
        bakeryTokenAddress,
        devAddress,
        bakeStartBlock,
        startBlock,
        bonusEndBlock,
        bonusBeforeBulkBlockSize,
        bonusBeforeCommonDifference,
        bonusEndCommonDifference
      ],
      overrides
    )
    console.log(`contract BakeryMaster address ${bakeryMaster.address}`)
    console.log(`contract BakeryMaster deploy transaction hash ${bakeryMaster.deployTransaction.hash}`)
    await bakeryMaster.deployed()
    console.log(`finish deployContract BakeryMaster`)
    /**
        20200912 测试
     start deployContract BakeryMaster
     bonusBeforeBulkBlockSize  30000
     bakeStartBlock  400000000000000000000
     startBlock  1845000
     bonusEndBlock  2745000
     bonusEndBulkBlockSize  900000
     bonusBeforeCommonDifference  10000000000000000000
     bonusEndCommonDifference  10000000000000000000
     bakeBonusEndBlock  110000000000000000000
     maxRewardBlockNumber 12644999
     contract BakeryMaster address 0xd3c66bb21a7eC5aF8C39591B406a2583a7f66aBD
     contract BakeryMaster deploy transaction hash 0x164f02b5f5d7cf76f55c3555873a10def411030126526c2ac6c4926f67e0b484
     finish deployContract BakeryMaster

     0913
     bonusBeforeCommonDifference 10000000000000000
     bonusEndCommonDifference 5000000000000000
     bakeBonusEndBlock  110000000000000000
     current gas Price 18000000000
     new gas Price 27000000000
     start deployContract BakeryMaster
     bonusBeforeBulkBlockSize  30000
     bakeStartBlock  400000000000000000000
     startBlock  1845000
     bonusEndBlock  2745000
     bonusEndBulkBlockSize  900000
     bonusBeforeCommonDifference  10000000000000000000
     bonusEndCommonDifference  10000000000000000000
     bakeBonusEndBlock  110000000000000000000
     maxRewardBlockNumber 12644999
     constructorArgumentsABIEncoded 0x00000000000000000000000095d619e70160d289933c7e6a98e7dfd3a2c75e27000000000000000000000000f9e89b5aca2e6061d22ea98cbcc2d826e3f9e4b1000000000000000000000000000000000000000000000015af1d78b58c40000000000000000000000000000000000000000000000000000000000000001c2708000000000000000000000000000000000000000000000000000000000029e2a800000000000000000000000000000000000000000000000000000000000075300000000000000000000000000000000000000000000000008ac7230489e800000000000000000000000000000000000000000000000000008ac7230489e80000
     contract BakeryMaster address 0x4fEB8A0Be376A2450E388a5D5f1554889B40170f
     contract BakeryMaster deploy transaction hash 0xb0149acbbb9380c1614ff7c59fd3fa4af0ce0e7365494f3e0de0bb712cf2ee92
     finish deployContract BakeryMaster
         */
  })

  it('deployBakerySwapRouter', async () => {
    console.log(`start deployContract BakerySwapRouter`)
    const bakerySwapRouter = await deployContract(wallet, BakerySwapRouter, [factoryAddress, wbnbAddress], overrides)
    console.log(`contract BakerySwapRouter address ${bakerySwapRouter.address}`)
    console.log(`contract BakerySwapRouter deploy transaction hash ${bakerySwapRouter.deployTransaction.hash}`)
    await bakerySwapRouter.deployed()
    console.log(`finish deployContract BakerySwapRouter`)
    /**
         * 20200912 测试
         start deployContract BakerySwapRouter
         contract BakerySwapRouter address 0x059c4cC5a7fAdc56eF80e6da6B0D86FDE41e600b
         contract BakerySwapRouter deploy transaction hash 0xf848615cdc1f7644a40a3d7e6a619776cd3249813dae795442321205f2ea2c73
         finish deployContract BakerySwapRouter

     0913
     start deployContract BakerySwapRouter
     contract BakerySwapRouter address 0x821133E187a4ef23C48A367c7B43b3DC5cc3564e
     contract BakerySwapRouter deploy transaction hash 0xfeba39da8f268e5bc8a57c8864a5023f3e851e1924c733e6627fa81c6faf73de
     finish deployContract BakerySwapRouter
         */
  })

  it('transferBakeryTokenOwnershipToBakeryMaster', async () => {
    const bakeryToken = new ethers.Contract(bakeryTokenAddress, JSON.stringify(BakeryToken.abi), provider).connect(
      wallet
    )
    const tx = await bakeryToken.transferOwnership(bakeryMasterAddress, {
      ...overrides,
      value: 0
    })
    console.log(`transferBakeryTokenOwnershipToBakeryMaster ${tx.hash}`)
    await tx.wait()
    // 0xeba9d6fecd74768b4925417a269e34bd35321d706c94005e015994ee43a060a3
  })

  it('add', async () => {
    const bakeryMaster = new ethers.Contract(bakeryMasterAddress, JSON.stringify(BakeryMaster.abi), provider).connect(
      wallet
    )
    let tx = await bakeryMaster.add(1, '0x89b57f327f0996dd975b5dc4fa99656d43f16782', false, {
      ...overrides,
      value: 0
    })
    console.log(`add1: ${tx.hash}`)
    await tx.wait()
    tx = await bakeryMaster.add(2, '0xcbcd41ed7fcaaf8c8a4f803d4385f176afaff186', false, {
      ...overrides,
      value: 0
    })
    console.log(`add2: ${tx.hash}`)
    await tx.wait()
  })
})
