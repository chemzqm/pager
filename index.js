var Emitter = require('emitter')
var events = require('events')
var domify = require('domify')
var query = require('query')
var classes = require('classes')
var tap = require('tap-event')
var template = require('./template.html')

/**
 * Init pager with optional list for bind
 *
 * @param {Object} list
 * @api public
 */
function Pager (list) {
  if (!(this instanceof Pager)) return new Pager(list)
  var el = this.el = domify(template)
  el.className = 'pager'
  this.events = events(el, this)
  this.events.bind('click li > a')
  this.events.bind('touchstart li > a', 'ontap')
  if (list) this.bind(list)
}

Emitter(Pager.prototype)

/**
 * Select the previous page.
 *
 * @api public
 */

Pager.prototype.prev = function () {
  this.show(Math.max(0, this.current - 1))
}

Pager.prototype.bind = function (list) {
  this.perpage(list.perpage || 5)
  var total = list.total || 0
  this.total(total)
  var self = this
  this.on('show', function (n) {
    list.select(n)
  })
  Object.defineProperty(list, 'total', {
    set: function (v) {
      self.total(v)
      self.select(self.current)
    },
    get: function () {
      return self._total
    }
  })
  Object.defineProperty(list, 'curpage', {
    set: function (v) {
      self.select(v)
    },
    get: function () {
      return self.current
    }
  })
}

/**
 * Select the next page.
 *
 * @api public
 */

Pager.prototype.next = function () {
  this.show(Math.min(this.pages() - 1, this.current + 1))
}

Pager.prototype.onclick = function (e) {
  e.preventDefault()
  var el = e.target.parentNode
  if (classes(el).has('prev')) return this.prev()
  if (classes(el).has('next')) return this.next()
  this.show(el.textContent - 1)
}

Pager.prototype.ontap = tap(Pager.prototype.onclick)

/**
 * Return the total number of pages.
 *
 * @return {Number}
 * @api public
 */

Pager.prototype.pages = function () {
  return Math.ceil(this._total / this._perpage)
}

/**
 * Set total items count
 *
 * @param {String} n
 * @api public
 */
Pager.prototype.total = function (n) {
  this._total = n
}

Pager.prototype.select = function (n) {
  n = Number(n)
  if (n !== this.current) this.emit('change', n)
  this.current = Number(n)
  this.render()
  return this
}

/**
 * Set perpage count to n
 *
 * @param {Number} n
 * @api public
 */
Pager.prototype.perpage = function (n) {
  this._perpage = n
}

/**
 * Select page n and emit `show` event with n
 *
 * @param {String} n
 * @api public
 */
Pager.prototype.show = function (n) {
  this.select(n)
  this.emit('show', n)
  return this
}

Pager.prototype.limit = function (count) {
  this._limit = Number(count)
}

Pager.prototype.remove = function () {
  this.off()
  this.events.unbind()
  if (this.el.parentNode) {
    this.el.parentNode.removeChild(this.el)
  }
}

Pager.prototype.render = function () {
  var limit = this._limit || Infinity
  var curr = this.current
  var pages = this.pages()
  var el = this.el
  var prev = query('.prev', el)
  var next = query('.next', el)
  var links = ''

  // remove old
  var lis = [].slice.call(el.children)
  for (var i = 0, len = lis.length; i < len; i++) {
    var li = lis[i]
    if (classes(li).has('page')) {
      el.removeChild(li)
    }
  }

  // page links
  for (i = 0; i < pages; ++i) {
    var n = i + 1
    if (limit && n === limit + 1) {
      links += '<li class="dots">...</li>'
    }
    if (limit && (n > limit && n !== pages )) {
      continue
    }
    links += curr === i
      ? '<li class="page active"><a href="#">' + n + '</a></li>'
      : '<li class="page"><a href="#">' + n + '</a></li>'
  }

  // insert
  if (links) el.insertBefore(domify(links), next)

  // prev
  if (curr) classes(prev).remove('pager-hide')
  else classes(prev).add('pager-hide')

  // next
  if (curr < pages - 1) classes(next).remove('pager-hide')
  else classes(next).add('pager-hide')
}

module.exports = Pager

