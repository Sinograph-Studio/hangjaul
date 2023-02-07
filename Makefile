.PHONY: default
default:
	npx tsc -t es6 -m commonjs test.ts
