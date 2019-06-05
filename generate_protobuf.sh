#!/bin/bash

# make temporary proto files directory
# including those from waves node and from the service
rm -rf protobuf_temp
cp -r protobuf protobuf_temp

node_commit=b3608442a49ba3881a24ec2d2b8b7f8939c45524
curl https://raw.githubusercontent.com/wavesplatform/Waves/$node_commit/node/src/main/protobuf/transaction.proto --output ./protobuf_temp/transaction.proto
curl https://raw.githubusercontent.com/wavesplatform/Waves/$node_commit/node/src/main/protobuf/script.proto --output ./protobuf_temp/script.proto
curl https://raw.githubusercontent.com/wavesplatform/Waves/$node_commit/node/src/main/protobuf/recipient.proto --output ./protobuf_temp/recipient.proto

# remove old destination directory
rm -rf ./src/protobuf
mkdir ./src/protobuf

# generate js codes via grpc-tools (grpc server)
grpc_tools_node_protoc \
--js_out=import_style=commonjs,binary:src/protobuf \
--grpc_out=src/protobuf \
--plugin=protoc-gen-grpc=`which grpc_tools_node_protoc_plugin` \
-I protobuf_temp \
./protobuf_temp/*.proto

# generate d.ts codes (grpc server)
protoc \
--plugin=protoc-gen-ts=./node_modules/.bin/protoc-gen-ts \
--ts_out=src/protobuf \
-I protobuf_temp \
./protobuf_temp/*.proto

# generate js data-structures for data-entries service (including all transactions)
./node_modules/protobufjs/bin/pbjs \
-t static-module \
--force-long \
-w commonjs \
-o ./src/protobuf/data-entries.js \
./protobuf_temp/data-entries.proto ./protobuf_temp/recipient.proto ./protobuf_temp/script.proto ./protobuf_temp/transaction.proto

# generate ts data-structures for data-entries service (including all transactions)
./node_modules/protobufjs/bin/pbts -o ./src/protobuf/data-entries.d.ts ./src/protobuf/data-entries.js

# generate js data-structures for balances service (including all transactions)
./node_modules/protobufjs/bin/pbjs \
-t static-module \
--force-long \
-w commonjs \
-o ./src/protobuf/balances.js \
./protobuf_temp/balances.proto ./protobuf_temp/recipient.proto ./protobuf_temp/script.proto ./protobuf_temp/transaction.proto

# generate ts data-structures for balances service (including all transactions)
./node_modules/protobufjs/bin/pbts -o ./src/protobuf/balances.d.ts ./src/protobuf/balances.js

# cleanup
#rm -rf protobuf_temp