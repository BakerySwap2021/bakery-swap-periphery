import chai from 'chai'
import * as ethers from 'ethers'
import {deployContract, solidity} from 'ethereum-waffle'
import {expandTo18Decimals, getCreate2Address} from './shared/utilities'

import BakeryMaster from '../build/BakeryMaster.json'
import BEP20 from '../build/IBEP20.json'
import {MaxUint256} from 'ethers/constants'
import {BigNumber} from 'ethers/utils'

chai.use(solidity)

describe('BakeryMaster', () => {
  const provider = new ethers.providers.JsonRpcProvider('https://data-seed-prebsc-1-s1.binance.org:8545')
  //  const provider = ethers.getDefaultProvider('rinkeby')
  const privateKey = '0x5031dcf9fba831e699cc5e01df38836a285c885d7b33336795db7800ab6713f9'
  const wallet = new ethers.Wallet(privateKey, provider)

  let overrides = {
    //        3022211
    gasLimit: 9999999
  }

  // const bakeryMasterAddress = '0x4b221a21e1152c2aeEB6f43a9E50A174Ae34Ac4c'
  // const bakeryMasterAddress = '0xBBea168D931D4f0669cFFD9B278ffA57421Ed2aA'
  // 没return
  // const bakeryMasterAddress = '0x2C9b5e3e974c03E5A2D00976836FE2716CC64CC8'
  // 有return
  // const bakeryMasterAddress = '0x8d99eFA072BB05f95Bc0b10d4c078E0FDd35529D'
  // 修完bug
  const bakeryMasterAddress = '0x7D177b6F9629907a3a08cF17B2cfd7f67BdF77c0'

  beforeEach(async () => {
    let gasPrice = await provider.getGasPrice()
    console.log(`current gas Price ${gasPrice}`)
    gasPrice = gasPrice.mul(3)
    console.log(`new gas Price ${gasPrice}`)
    overrides = Object.assign(overrides, {gasPrice: gasPrice.toNumber()})
  })

  it('poolAddresses', async () => {
    const bakeryMaster = new ethers.Contract(bakeryMasterAddress, JSON.stringify(BakeryMaster.abi), provider).connect(
      wallet
    )
    const poolAddresses = await bakeryMaster.poolAddresses(1)
    console.log(`poolAddresses ${poolAddresses}`)
  })

  it('pendingBake', async () => {
    const bakeryMaster = new ethers.Contract(bakeryMasterAddress, JSON.stringify(BakeryMaster.abi), provider).connect(
      wallet
    )
    const pendingBake = await bakeryMaster.pendingBake(
      '0xbac54b69512300ae2d29fb08c0cc33300373e6c9',
      '0x337E3Cee9c3e892F84c76B0Ec2C06fd4Ab06A734'
    )
    console.log(`pendingBake ${pendingBake}`)
  })

  it('poolLength', async () => {
    const bakeryMaster = new ethers.Contract(bakeryMasterAddress, JSON.stringify(BakeryMaster.abi), provider).connect(
      wallet
    )
    const poolLength = await bakeryMaster.poolLength()
    console.log(`poolLength ${poolLength}`)
  })

  it('massUpdatePools', async () => {
    const bakeryMaster = new ethers.Contract(bakeryMasterAddress, JSON.stringify(BakeryMaster.abi), provider).connect(
      wallet
    )
    const tx = await bakeryMaster.massUpdatePools()
    console.log(`massUpdatePools ${JSON.stringify(tx)}`)
    await tx.wait()
  })

  it('updatePool', async () => {
    const bakeryMaster = new ethers.Contract(bakeryMasterAddress, JSON.stringify(BakeryMaster.abi), provider).connect(
      wallet
    )
    // const tx = await bakeryMaster.updatePool('0x809142af759a8c39ab12f85ade543ed8bd3f164b')
    // 0x3dec41b6dd3876a5e08ebaafbcd7b3cca73885e2cc76fe2ddca8feb338cfe405
    const tx = await bakeryMaster.updatePool('0x809142af759a8c39ab12f85ade543ed8bd3f164b')
    console.log(`updatePool ${JSON.stringify(tx)}`)
    await tx.wait()
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
    tx = await bakeryMaster.add(2, '0x89b57f327f0996dd975b5dc4fa99656d43f16782', false, {
      ...overrides,
      value: 0
    })
    console.log(`add2: ${tx.hash}`)
    await tx.wait()
  })

  it('set', async () => {
    const bakeryMaster = new ethers.Contract(bakeryMasterAddress, JSON.stringify(BakeryMaster.abi), provider).connect(
      wallet
    )
    const tx = await bakeryMaster.set('0x2A942b802258F50810d4914cF2E5c4f9446Da36a', 0, false, {
      ...overrides,
      value: 0
    })
    console.log(`set ${tx.hash}`)
    await tx.wait()
    // 0x9c3346e7c831ffa4a6b66d52d95c043baff274cf245b4f31e725e1433379907e
  })

  it('emergencyWithdraw', async () => {
    const bakeryMaster = new ethers.Contract(bakeryMasterAddress, JSON.stringify(BakeryMaster.abi), provider).connect(
      wallet
    )
    const tx = await bakeryMaster.emergencyWithdraw('0xbac54b69512300ae2d29fb08c0cc33300373e6c9', {
      ...overrides,
      value: 0
    })
    console.log(`emergencyWithdraw ${tx.hash}`)
    await tx.wait()
    // 0x3ec28a8df73c1796f70fff997bed37694f160b3210c1c141668e013accb217ab
    // 0x1ba0741994ce0cbabe48a8b09565d842b1351ff10cfc3c73afd77635b76484b0
  })

  it('withdraw', async () => {
    const bakeryMaster = new ethers.Contract(bakeryMasterAddress, JSON.stringify(BakeryMaster.abi), provider).connect(
      wallet
    )
    const tx = await bakeryMaster.withdraw(
      '0x809142af759a8c39ab12f85ade543ed8bd3f164b',
      new BigNumber(10).mul(new BigNumber(10).pow(18)),
      {
        ...overrides,
        value: 0
      }
    )
    console.log(`withdraw ${tx.hash}`)
    await tx.wait()
    // 0x3ec28a8df73c1796f70fff997bed37694f160b3210c1c141668e013accb217ab
    // 0x1ba0741994ce0cbabe48a8b09565d842b1351ff10cfc3c73afd77635b76484b0
  })
})
