#!/bin/sh
set -ex

# Adapted from:
# http://nodejs.org/api/tls.html
# https://github.com/joyent/node/blob/master/test/fixtures/keys/Makefile

# Create a private key
openssl genrsa -out localhost.key 2048

# Create a certificate signing request
openssl req  -new -key localhost.key -out localhost.csr -config localhost.cnf

# Use the CSR and the CA key (previously generated) to create a certificate
openssl x509 -req \
    -in localhost.csr \
    -CA ca.crt \
    -CAkey ca.key \
    -set_serial 0x`cat ca.srl` \
    -passin 'pass:password' \
    -out localhost.crt \
    -days 3650
