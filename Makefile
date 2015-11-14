build:
	@open http://localhost:3000/example/index.html
	@gulp

test:
	@webpack-dev-server 'mocha!./test/test.js' --hot --inline --module-bind html

test-karma:
	@karma start

doc:
	@ghp-import example -n -p

test-coveralls:
	@echo TRAVIS_JOB_ID $(TRAVIS_JOB_ID)
	@node_modules/.bin/karma start --single-run && \
		cat ./coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js

.PHONY: test
