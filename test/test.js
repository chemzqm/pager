/*global describe, it, beforeEach, afterEach*/
var Pager = require('..')
var query = require('query')
var assert = require('assert')
var classes = require('classes')

describe('Pager', function () {
  var pager
  beforeEach(function () {
    pager = new Pager()
    pager.perpage(5)
    document.body.appendChild(pager.el)
  })

  afterEach(function () {
    pager.remove()
  })

  function getLinks () {
    return pager.el.querySelectorAll('li.page')
  }

  it('should init without new', function () {
    var p = Pager()
    p.perpage(5)
    assert.equal(p._perpage, 5)
  })

  it('should set pages according to total count and perpage', function () {
    pager.total(5)
    assert(pager.pages() === 1)
    pager.total(8)
    assert(pager.pages() === 2)
  })

  it('should reset pager elements on select', function () {
    pager.total(5)
    pager.select(0)
    assert(getLinks().length === 1)
    pager.total(8)
    pager.select(0)
    assert(getLinks().length === 2)
  })

  it('should active the selected link', function () {
    pager.total(15)
    pager.select(2)
    var links = getLinks()
    assert(links.length === 3)
    assert(classes(links[2]).has('active'))
  })

  it('should should limit the rendered links', function () {
    pager.limit(10)
    pager.total(60)
    pager.select(0)
    var links = getLinks()
    assert(links.length === 11)
  })

  it('should bind to page list', function () {
    var page
    var list = {
      total: 20,
      perpage: 4,
      curpage: 0,
      select: function (n) {
        page = n
      }
    }
    pager.bind(list)
    assert.equal(pager.pages(), 5)
    pager.select(2)
    assert.equal(list.curpage, 2)
    list.curpage = 1
    assert.equal(pager.current, 1)
    pager.show(0)
    assert.equal(page, 0)
    list.total = 30
    var links = getLinks()
    assert.equal(links.length, 8)
    pager.total(100)
    assert.equal(list.total, 100)
    list.perpage = 10
    assert.equal(list.perpage, 10)
    assert.equal(pager._perpage, 10)
  })

  it('should react to link click', function () {
    var prev = query('.prev a', pager.el)
    var next = query('.next a', pager.el)
    pager.total(10)
    pager.select(0)
    next.click()
    var links = getLinks()
    assert(classes(links[1]).has('active'))
    assert.equal(pager.current, 1)
    prev.click()
    links = getLinks()
    assert(classes(links[0]).has('active'))
    assert.equal(pager.current, 0)
    links[1].querySelector('a').click()
    links = getLinks()
    assert(classes(links[1]).has('active'))
    assert.equal(pager.current, 1)
  })

  it('should hide prev/next link when not available', function () {
    var prev = query('.prev', pager.el)
    var next = query('.next', pager.el)
    pager.total(10)
    pager.select(0)
    assert(classes(prev).has('pager-hide'))
    assert(classes(next).has('pager-hide') === false)
    pager.select(1)
    assert(classes(prev).has('pager-hide') === false)
    assert(classes(next).has('pager-hide'))
  })

  it('should activate previous page on prev() when available', function () {
    pager.total(10)
    pager.select(1)
    pager.prev()
    var links = getLinks()
    assert(classes(links[0]).has('active'))
  })

  it('should activate next page on next() when available', function () {
    pager.total(10)
    pager.select(0)
    pager.next()
    var links = getLinks()
    assert(classes(links[1]).has('active'))
  })

  it('should activate the link and emit show event on show()', function () {
    var showed
    pager.on('show', function () {
      showed = true
    })
    pager.total(10)
    pager.show(1)
    assert(showed === true)
    var links = getLinks()
    assert(classes(links[1]).has('active'))
  })

  it('should remove el on remove()', function () {
    pager.total(10)
    pager.remove()
    assert(pager.el.parentNode == null)
  })

  it('should remove event listeners on remove()', function () {
    var showed
    pager.total(10)
    pager.on('show', function () {
      showed = true
    })
    pager.remove()
    pager.emit('show')
    assert(showed !== true)
  })
})
