const { searchMixcloud } = require('../src/scrapers/mixcloud')
const { expect, assert } = require('chai')

describe('searchMixcloud', function () {
  before(function (done) {
    /** extend timeout because puppeteer takes a while */
    this.timeout(10000)
    searchMixcloud("bob marley")
    .then(res => {
      this.data = res
      console.log(this.data)
      done()
    }).catch(err => {
      console.error("Error: ", err)
      assert.fail(0, 1, 'Failed to fetch soundcloud songs. URL could be broken or website is down.')
    })
  })

  it('It returns an array', function () {
    expect(this.data).to.be.an('array')
  })

  it('The array contains objects', function () {
    expect(this.data[0]).to.be.an('object')
  })

  it('The object has the expected properties', function () {
    const obj = this.data[0]

    expect(obj).to.have.property('name')
    expect(obj).to.have.property('url')
    expect(obj).to.have.property('user')
    // expect(obj).to.have.nested.property('teams.away')
  })
})

