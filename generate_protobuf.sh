# remove old files
rm ./src/protobuf/*

# generate js codes via grpc-tools (grpc server)
grpc_tools_node_protoc \
--js_out=import_style=commonjs,binary:src/protobuf \
--grpc_out=src/protobuf \
--plugin=protoc-gen-grpc=`which grpc_tools_node_protoc_plugin` \
-I protobuf \
./protobuf/*.proto

# generate d.ts codes (grpc server)
protoc \
--plugin=protoc-gen-ts=./node_modules/.bin/protoc-gen-ts \
--ts_out=src/protobuf \
-I protobuf \
./protobuf/*.proto

# generate js data-structures (including all transactions)
./node_modules/protobufjs/bin/pbjs \
-t static-module \
--force-long \
-w commonjs \
-o ./src/protobuf/data-entries.js \
./protobuf/*.proto

# generate ts data-structures (including all transactions)
./node_modules/protobufjs/bin/pbts -o ./src/protobuf/data-entries.d.ts ./src/protobuf/data-entries.js