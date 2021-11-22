'use strict';
const FileStorageAdapter = require('../lib/customStorage/adapters/file');
const storj = require('storj-lib');
const {expect} = require("chai");

function getRandomString(length) {
    let s = '';
    do {
        s += Math.random().toString(36).substr(2);
    } while (s.length < length);
    s = s.substr(0, length);

    return s;
}

const itemMother = function () {
    const uid = getRandomString(32);
    return storj.StorageItem({
        hash: storj.utils.ripemd160(uid),
        contracts: {
            node3: {
                data_hash: storj.utils.ripemd160(uid)
            }
        }
    });
};

const cleanItem = function (storageManager, hash, callback) {
    storageManager._del(hash, function (error) {
        console.log(error)
        if (!error) {
            callback();
        } else {
            callback(error);
        }
    });
};

const createItem = function (storageManager, hash, object, callback) {
    storageManager._put(hash, object, function (error) {
        if (!error) {
            callback();
        } else {
            callback(error.error);
        }
    });
};

describe('class:FileStorageAdapter', function () {
    let storageManager = new FileStorageAdapter('path/to/store/');
    describe('#validate store and get', function () {
        it('should store item', function (done) {
            const item = itemMother();
            createItem(storageManager, item.hash, item.toObject(), function (error) {
                if (error) {
                    done(error.error);
                }
                done();
                cleanItem(storageManager, item.hash);
            });

        });
        it('should get item', function (done) {
            const item = itemMother();
            createItem(storageManager, item.hash, item.toObject(), function (error) {
                if (error) {
                    done(error.error);
                }
                storageManager._get(item.hash, function (error) {
                    if (error) {
                        done(error.error);
                    }
                    done();
                    cleanItem(storageManager, item.hash);
                });
            });


        });
        it('should delete item', function (done) {
            const item = itemMother();
            createItem(storageManager, item.hash, item.toObject(), function (error) {
                if (error) {
                    done(error.error);
                }
                cleanItem(storageManager, item.hash, function (error) {
                    if (error) {
                        done(error.error);
                    }
                    done();
                });
            });


        });
    });

});