#!/bin/sh
set -ex

# Adapted from:
# http://nodejs.org/api/tls.html
# https://github.com/joyent/node/blob/master/test/fixtures/keys/Makefile

# Create a private key
openssl genrsa -out client.key 2048

# Create a certificate signing request
openssl req -new -key client.key -out client.csr -config client.cnf

# Use the CSR and the CA key (previously generated) to create a certificate
openssl x509 -req \
    -in client.csr \
    -CA ca.crt \
    -CAkey ca.key \
    -set_serial 0x`cat ca.srl` \
    -passin 'pass:password' \
    -out client.crt \
    -days 1095

# Encrypt with password
openssl rsa -aes128 -in client.key -out client-enc.key -passout 'pass:password'

# Use the generated CRT and the KEY to create a PKCS12 certificate
openssl pkcs12 -export \
    -inkey client.key \
    -in client.crt \
    -out client.pfx \
    -passout 'pass:password'
