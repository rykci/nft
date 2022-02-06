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
  minter = await upgrades.deployProxy(Minter, [
    owner.address,
    'Test Token',
    'TTKN',
  ])
  await minter.deployed()

  Factory = await ethers.getContractFactory('MinterFactory')
  factory = await upgrades.deployProxy(Factory, [
    (await Minter.deploy()).address,
  ])
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

  it('Mint from factory', async () => {
    const minterAddress = (await factory.getMinterAddresses(owner.address))[0]
    await factory.mintData(minterAddress, owner.address, 'NFT1')

    const minterProxy = await Minter.attach(minterAddress)

    expect(await factory.totalSupply(minterAddress)).to.equal('1')
    expect(await minterProxy.totalSupply()).to.equal('1')
    expect(await factory.tokenURI(minterAddress, 1)).to.equal('NFT1')
    expect(await minterProxy.tokenURI(1)).to.equal('NFT1')
  })

  it('Mint from minter', async () => {
    const minterAddress = (await factory.getMinterAddresses(owner.address))[0]
    const minterProxy = await Minter.attach(minterAddress)
    await minterProxy.mintData(owner.address, 'NFT2')

    expect(await factory.totalSupply(minterAddress)).to.equal('2')
    expect(await minterProxy.totalSupply()).to.equal('2')
    expect(await factory.tokenURI(minterAddress, 2)).to.equal('NFT2')
    expect(await minterProxy.tokenURI(2)).to.equal('NFT2')
  })

  it('Unauthorized mint should revert', async () => {
    const minterAddress = (await factory.getMinterAddresses(owner.address))[0]
    const minterProxy = await Minter.attach(minterAddress)
    await expect(
      factory.connect(addr1).mintData(minterAddress, owner.address, 'NFT3'),
    ).to.be.revertedWith('this is not your minter')
    await expect(
      minterProxy.connect(addr1).mintData(owner.address, 'NFT3'),
    ).to.be.revertedWith('this sender is not an admin')
  })

  it('Update minter implementation', async () => {
    const MinterV2 = await ethers.getContractFactory('MinterV2')
    const minterV2 = await MinterV2.deploy()

    await factory.updateBeaconImplementation(minterV2.address)
    await factory.connect(addr1).createMinter('Minter2', 'MTR2')

    const minterAddress = (
      await factory.connect(addr1).getMinterAddresses(addr1.address)
    )[0]

    expect(
      await MinterV2.attach(minterAddress).connect(addr1).newFeature(),
    ).to.equal('this implementation has the new feature!')
  })

  it('Upgrade Factory', async () => {
    const MinterFactoryV2 = await ethers.getContractFactory('MinterFactoryV2')
    factory = await upgrades.upgradeProxy(factory.address, MinterFactoryV2)

    expect(await factory.newFeature()).to.equal(
      'this implementation has the new feature!',
    )
  })
})
