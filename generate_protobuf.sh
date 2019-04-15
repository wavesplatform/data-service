# generate js codes via grpc-tools
grpc_tools_node_protoc \
--js_out=import_style=commonjs,binary:src/protobuf \
--grpc_out=src/protobuf \
--plugin=protoc-gen-grpc=`which grpc_tools_node_protoc_plugin` \
-I protobuf \
./protobuf/*.proto

# generate d.ts codes
protoc \
--plugin=protoc-gen-ts=./node_modules/.bin/protoc-gen-ts \
--ts_out=src/protobuf \
-I protobuf \
./protobuf/*.proto