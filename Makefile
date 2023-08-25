format: .bin/ory node_modules   # formats the source code
	.bin/ory dev headers copyright --type=open-source --exclude=app.config.js
	npm exec -- prettier --write .

help:
	@cat Makefile | grep '^[^ ]*:' | grep -v '^\.bin/' | grep -v '.SILENT:' | grep -v '^node_modules:' | grep -v help | sed 's/:.*#/#/' | column -s "#" -t

licenses: .bin/licenses node_modules  # checks open-source licenses
	.bin/licenses

.bin/licenses: Makefile
	curl https://raw.githubusercontent.com/ory/ci/master/licenses/install | sh

.bin/ory: Makefile
	curl https://raw.githubusercontent.com/ory/meta/master/install.sh | bash -s -- -b .bin ory v0.1.48
	touch .bin/ory

node_modules: package-lock.json
	npm ci
	touch node_modules


.DEFAULT_GOAL := help

.PHONY: build-sdk
build-sdk:
	(cd $$KRATOS_DIR; make sdk)
	cp $$KRATOS_DIR/spec/api.json ./contrib/sdk/api.json
	npx @openapitools/openapi-generator-cli generate -i "./contrib/sdk/api.json" \
					-g typescript-axios \
					-o "./contrib/sdk/generated" \
					--git-user-id ory \
					--git-repo-id sdk \
					--git-host github.com \
					-c ./contrib/sdk/typescript.yml
	(cd ./contrib/sdk/generated; npm i; npm run build)
	make format
	npm i
