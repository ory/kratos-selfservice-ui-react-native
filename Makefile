format: .bin/ory node_modules   # formats the source code
	.bin/ory dev headers copyright --type=open-source --exclude=app.config.js
	npm exec -- prettier --write .

help:
	@cat Makefile | grep '^[^ ]*:' | grep -v '^\.bin/' | grep -v '.SILENT:' | grep -v '^node_modules:' | grep -v help | sed 's/:.*#/#/' | column -s "#" -t

licenses: .bin/licenses node_modules  # checks open-source licenses
	.bin/licenses

.bin/licenses: Makefile
	curl --retry 7 --retry-connrefused https://raw.githubusercontent.com/ory/ci/master/licenses/install | sh

.bin/ory: Makefile
	curl --retry 7 --retry-connrefused https://raw.githubusercontent.com/ory/meta/master/install.sh | bash -s -- -b .bin ory v0.1.48
	touch .bin/ory

node_modules: package-lock.json
	npm ci
	touch node_modules


.PHONY: build-sdk
build-sdk: node_modules  # generates and builds the local SDK
ifdef KRATOS_DIR
	(cd $(KRATOS_DIR); make sdk)
	cp $(KRATOS_DIR)/spec/api.json ./contrib/sdk/api.json
endif
	rm -rf ./contrib/sdk/generated
	npx @openapitools/openapi-generator-cli generate -i "./contrib/sdk/api.json" \
		-g typescript-fetch \
		-o "./contrib/sdk/generated" \
		--git-user-id ory \
		--git-repo-id sdk \
		--git-host github.com \
		-c ./contrib/sdk/typescript-fetch.yml
	(cd ./contrib/sdk/generated; npm i; npm run build)

.PHONY: sdk
sdk: build-sdk  # alias for build-sdk

.DEFAULT_GOAL := help
