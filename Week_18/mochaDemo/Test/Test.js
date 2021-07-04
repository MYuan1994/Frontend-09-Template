let assert = require('assert');
// let {add,mul} = require('../add.js');
import { add,mul } from '../add.js';

describe('XX模块测试', function () {

    it('normal', function () {
        assert.equal(add(5,16), 21);
    });

    it('positive and negative', function () {
        assert.equal(add(-5,20), 15);
    });

    describe('mul', function () {

        it('normal', function () {
            assert.equal(mul(5,3), 15);
        });
    
    });

});

