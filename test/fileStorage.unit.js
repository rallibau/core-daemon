'use strict';
const FileStorageAdapter = require('../lib/customStorage/adapters/file');
const storj = require('storj-lib');
const {expect} = require("chai");


describe('class:FileStorageAdapter', function () {
    let storageManager = new FileStorageAdapter('path/to/store');

    describe('#validatePath', function () {
        it('should callback error if no share', function (done) {

            const item = storj.StorageItem({
                hash: storj.utils.ripemd160('shardhash'),
                contracts: {
                    node3: {
                        data_hash: storj.utils.ripemd160('shardhash')
                    }
                }
            });


            let rpc = storageManager._put(item.hash, item.toObject(), function (error) {
                if(error){
                    console.log(error);
                }
                done();
            })

        });

    });

});