# Pager

[![Build Status](https://secure.travis-ci.org/chemzqm/pager.svg)](http://travis-ci.org/chemzqm/pager)
[![Coverage Status](https://coveralls.io/repos/chemzqm/pager/badge.svg?branch=master&service=github)](https://coveralls.io/github/chemzqm/pager?branch=master)
A basic pager component


## Features

* Support tap event
* Support bind to a list(not works at ie < 9)

## Install

    npm i component-pager

## Usage

``` js
var Pager = require('pager')
var pager = new Pager
pager.el.appendTo('body')
pager.total(50).perpage(10).render()
pager.on('show', function(n){
  console.log('selected page %d', n)
})
```

## Events

  - `show` (n) emitted when a page is selected (0-based)
  - `change` (n) emitted when page number changed (0-based)

## API

### Pager#total(n)

  Set the total number of items to `n`.

### Pager#limit(n)

  Limit the shown page numbers to `n`

### Pager#perpage(n)

  Set the number of items per page to `n`. [5]

### Pager#pages()

  Return the total number of pages.

### Pager#show(n)

  Select page `n`, `.render()`, and emit "show".

### Pager#select(n)

  Select page `n` and `.render()`.

### Pager#render()

  Re-render the pager.

# License

  MIT
