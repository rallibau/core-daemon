'use strict';

const assert = require('assert');
const utils = require('../../utils');
const mkdirp = require('mkdirp');
const fs = require('fs');

/**
 * Implements an file system/KFS customStorage adapters interface
 * @extends {StorageAdapter}
 * @param {String} storageDirPath - Path to store the level db
 * @constructor
 * @license AGPL-3.0
 */
function FileStorageAdapter(storageDirPath) {
    if (!(this instanceof FileStorageAdapter)) {
        return new FileStorageAdapter(storageDirPath);
    }

    this._validatePath(storageDirPath);

    this._path = storageDirPath;
    this._isOpen = true;

}

FileStorageAdapter.SIZE_START_KEY = '0';
FileStorageAdapter.SIZE_END_KEY = 'z';
FileStorageAdapter.MAX_OPEN_FILES = 1000;
FileStorageAdapter.S3_SHARD_BUCKETNAME = 'sharddata';


/**
 * Validates the customStorage path supplied
 * @private
 */
FileStorageAdapter.prototype._validatePath = function (storageDirPath) {
    if (!utils.existsSync(storageDirPath)) {
        mkdirp.sync(storageDirPath);
    }

    assert(utils._isValidDirectory(storageDirPath), 'Invalid directory path supplied');
};

/**
 * Implements the abstract {@link StorageAdapter#_get}
 * @private
 * @param {String} key
 * @param {Function} callback
 */
FileStorageAdapter.prototype._get = function (key, callback) {
    const self = this;

    if (!fs.existsSync(self._path.concat(key))) {
        return callback("the file not exist");
    }
    fs.open(self._path.concat(key), 'r', function (status, fd) {
        if (status) {
            return callback(status.message);
        }
        const buffer = Buffer.alloc(100);
        fs.read(fd, buffer, 0, 100, 0, function (err, num) {
            console.log(buffer.toString('utf8', 0, num));
        });
        callback(null, buffer);

    });


};

FileStorageAdapter.prototype._objectExists = function (key, callback) {
    const self = this;
    callback(fs.existsSync(self._path.concat(key)));
}

/**
 * Implements the abstract {@link StorageAdapter#_peek}
 * @private
 * @param {String} key
 * @param {Function} callback
 */
FileStorageAdapter.prototype._peek = function (key, callback) {
    this._get(key, function (err, value) {
        if (err) {
            return callback(err);
        }

        callback(null, JSON.parse(value));
    });
};

/**
 * Implements the abstract {@link StorageAdapter#_put}
 * @private
 * @param {String} key
 * @param {Object} item
 * @param {Function} callback
 */
FileStorageAdapter.prototype._put = function (key, item, callback) {
    const self = this;
    fs.writeFile(self._path.concat(key), JSON.stringify(item), (error) => {
        if (error) {
            return callback(error);
        }

        callback(null);
    });


};

/**
 * Implements the abstract {@link StorageAdapter#_del}
 * @private
 * @param {String} key
 * @param {Function} callback
 */
FileStorageAdapter.prototype._del = function (key, callback) {
    fs.unlinkSync(self._path.concat(key));

};

/**
 * Implements the abstract {@link StorageAdapter#_flush}
 * @private
 * @param {Function} callback
 */
FileStorageAdapter.prototype._flush = function (callback) {
    // No flush implementation for file system Bucket
    callback(null);
};

/**
 * Implements the abstract {@link StorageAdapter#_size}
 * @private
 * @param {String} [key]
 * @param {Function} callback
 */
FileStorageAdapter.prototype._size = function (key, callback) {
    const self = this;

};

/**
 * Implements the abstract {@link StorageAdapter#_keys}
 * @private
 * @returns {ReadableStream}
 */
FileStorageAdapter.prototype._keys = function (options) {
    return null
};

/**
 * Implements the abstract {@link StorageAdapter#_open}
 * @private
 * @param {Function} callback
 */
FileStorageAdapter.prototype._open = function (callback) {
    const self = this;

    if (!this._isOpen) {
        self._isOpen = true;
        callback(null);
    }

    callback(null);
};

/**
 * Implements the abstract {@link StorageAdapter#_close}
 * @private
 * @param {Function} callback
 */
FileStorageAdapter.prototype._close = function (callback) {
    const self = this;

    if (this._isOpen) {
        self._isOpen = false;
        callback(null);
    }

    callback(null);
};

/**
 * Look up if the data exists on datashardDB
 *
 * @param {*} key File Key on contracts database
 */
FileStorageAdapter.prototype.existDataShard = function (key, callback) {
    if (fs.statSync(self._path.concat(key))) {
        callback(null, true)
    } else {
        callback(null, false)
    }
}


module.exports = FileStorageAdapter;
