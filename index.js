require('../pager.css')
var demo = document.getElementById('demo')
var Pager = require('..')
var list = {total: 0, perpage: 10}
var pager = new Pager(list)
pager.limit(10)
demo.appendChild(pager.el)

list.curpage = 2
list.total = 100
window.list = list

list.select = function (n) {
  this.curpage = n
  console.log(n) // eslint-disable-line
}

