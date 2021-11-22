'use strict';
const FileStorageAdapter = require('../lib/customStorage/adapters/file');
const storj = require('storj-lib');
const {expect} = require("chai");


describe('class:FileStorageAdapter', function () {
    const item = storj.StorageItem({
        hash: storj.utils.ripemd160('shardhash'),
        contracts: {
            node3: {
                data_hash: storj.utils.ripemd160('shardhash')
            }
        }
    });

    let storageManager = new FileStorageAdapter('path/to/store/');
    describe('#validate store and get', function () {
        it('should store item', function (done) {
            let rpc = storageManager._put(item.hash, item.toObject(), function (error) {
                if(!error){
                    done();
                }
            })

        });
        it('should get item', function (done) {
            storageManager._get(item.hash,function (error,result){
                if(!error){
                    done();
                }
            });

        });

    });

});