const { expect } = require('chai')
const { ethers, upgrades } = require('hardhat')

let minter
let Minter
let Factory
let factory
let owner
let addr1
let addr2
let addrs

// deploy contract
before(async () => {
  ;[owner, addr1, addr2, ...addrs] = await ethers.getSigners()

  Minter = await ethers.getContractFactory('Minter')

  Factory = await ethers.getContractFactory('MinterFactory')
  factory = await upgrades.deployProxy(Factory, [])
  await factory.deployed()
})

describe('Factory', function () {
  it('New factory should have no minters', async function () {
    expect((await factory.getMinterAddresses(owner.address)).length).to.equal(0)
  })

  it('Create new minter instance', async () => {
    await factory.createMinter('Minter1', 'MTR1')
    expect((await factory.getMinterAddresses(owner.address)).length).to.equal(1)
  })

  it('Mint from minter', async () => {
    const minterAddress = (await factory.getMinterAddresses(owner.address))[0]
    minter = await Minter.attach(minterAddress)
    await minter.mintData(owner.address, 'NFT1')

    expect(await minter.totalSupply()).to.equal('1')
    expect(await minter.tokenURI(1)).to.equal('NFT1')
  })

  it('Unauthorized mint should revert', async () => {
    const minterAddress = (await factory.getMinterAddresses(owner.address))[0]
    minter = await Minter.attach(minterAddress)
    await expect(
      minter.connect(addr1).mintData(owner.address, 'NFT3'),
    ).to.be.revertedWith('this sender is not an admin')
  })

  it('Upgrade Factory', async () => {
    const MinterFactoryV2 = await ethers.getContractFactory('MinterFactoryV2')
    factory = await upgrades.upgradeProxy(factory.address, MinterFactoryV2)

    expect(await factory.newFeature()).to.equal(
      'this implementation has the new feature!',
    )
  })
})
