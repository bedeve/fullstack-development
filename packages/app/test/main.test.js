const { getCommits } = require('../src')
const { expect, assert } = require('chai')

describe('getCommits', function () {
  before(function (done) {
    /** extend timeout because puppeteer takes a while */
    this.timeout(10000)
    getCommits("bedeve", "fullstack-development").then(res => {
      this.data = res
      done()
    }).catch(err => {
      assert.fail(0, 1, 'Failed to fetch commits. URL could be broken or website is down.')
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
    expect(obj).to.have.property('author')
    expect(obj).to.have.property('time')
    // expect(obj).to.have.nested.property('teams.home')
    // expect(obj).to.have.nested.property('teams.away')
  })
})
