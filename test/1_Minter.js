const { expect } = require('chai')
const { ethers, upgrades } = require('hardhat')

let minter
let Minter
let owner
let addr1
let addr2
let addrs

// deploy contract
before(async () => {
  ;[owner, addr1, addr2, ...addrs] = await ethers.getSigners()

  Minter = await ethers.getContractFactory('Minter')
  minter = await upgrades.deployProxy(Minter, [
    owner.address,
    'Test Token',
    'TTKN',
  ])

  await minter.deployed()
})

describe('Minter', function () {
  it('New contract instance should have no minted tokens', async function () {
    const totalSupply = (await minter.totalSupply()).toString()

    expect(totalSupply).to.equal('0')
  })

  it('Should be able to mint token', async () => {
    const tokenURI = 'test'
    const mintTx = await minter.mintData(owner.address, tokenURI)

    await mintTx.wait()

    const totalSupply = (await minter.totalSupply()).toString()

    expect(totalSupply).to.equal('1')
  })

  it('Should be able to view token URI', async () => {
    expect(await minter.tokenURI(1)).to.equal('test')
  })

  it('Other users should not be able to mint token', async () => {
    const tokenURI = "addr1's nft"

    await expect(
      minter.connect(addr1).mintData(owner.address, tokenURI),
    ).to.be.revertedWith('this sender is not an admin')
  })

  it('Minter upgradeable', async () => {
    const MinterV2 = await ethers.getContractFactory('MinterV2')
    minter = await upgrades.upgradeProxy(minter.address, MinterV2)

    expect(await minter.newFeature()).to.equal('new minter feature')
  })
})
