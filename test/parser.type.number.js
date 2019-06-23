
const
    assert = require('assert'),
    Parser = require('../lib/parser');

describe('PDF parser', function () {

    describe('Basic types', function () {

        describe('Number', function () {

            it('should parse an integer value', function () {

                const result = parse('42').getNumber();
                assert.strictEqual(typeof result, 'number', 'Invalid integer value');
                assert.strictEqual(result, 42, 'Number should be 42');
            });

            it('should parse a real value', function () {

                const result = parse('4.2').getNumber();
                assert.strictEqual(typeof result, 'number', 'Invalid real value');
                assert.strictEqual(result, 4.2, 'Number should be 4.2');
            });

            it('should parse a real value with a missing integer part', function () {

                const result = parse('.2').getNumber();
                assert.strictEqual(typeof result, 'number', 'Invalid real value');
                assert.strictEqual(result, 0.2, 'Number should be 0.2');
            });
        });
    });

    function parse(script) {
        return new Parser(Buffer.from(script, "utf-8"));
    }
});
