
const
    assert = require('assert'),
    Parser = require('../lib/parser');

describe('PDF parser', function () {

    describe('Basic types', function () {

        describe('Stream', function () {

            it('should parse a stream value', function () {
                const result = parse('<</Length 10>>\nstream\n1234567890\nendstream\n').getStream();
                assert.strictEqual(result.dict.Length, 10,
                    'Stream dictionary should have a property Length with value 10');
            });

            it('should parse a stream value with Windows newline', function () {
                const result = parse('<</Length 10>>\r\nstream\r\n1234567890\r\nendstream\r\n').getStream();
                assert.strictEqual(result.dict.Length, 10,
                    'Stream dictionary should have a property Length with value 10');
            });

            it('should parse a stream value with MacOS newline', function () {
                const result = parse('<</Length 10>>\rstream\r1234567890\rendstream\r').getStream();
                assert.strictEqual(result.dict.Length, 10,
                    'Stream dictionary should have a property Length with value 10');
            });

            it('should throw a malformed stream value', function () {
                assert.throws(function () {
                    parse('<</Length 10>>\n1234567890\nendstream\n').getStream();
                }, 'Should not accept a malformed stream value');
            });

            it('should throw another malformed stream value', function () {
                assert.throws(function () {
                    parse('<</Length 10>>\nstream\n1234567890').getStream();
                }, 'Should not accept a malformed stream value');
            });

            it('should parse a stream with an indirect object Length field', function () {
                const
                    stream = '<</Length 0 0 R>>\nstream\n1234567890\nendstream\n',
                    indLength = '0 0 obj\n10\nendobj\n',
                    xref = [{
                        position: stream.length
                    }];

                const result = parse(stream + indLength, xref).getStream(xref);

                assert.strictEqual(result.dict.Length, 10,
                    'Indirect Length field should have value 10, but found ' + result.dict.Length);
            });

            it('should throw if filter is not known', function () {
                assert.throws(function () {
                    parse('<</Length 10 /Filter /FooFilter>>\nstream\n1234567890').getStream();
                }, 'Should not accept an unkown filter');
            });
        });
    });

    function parse(script) {
        return new Parser(Buffer.from(script, "utf-8"));
    }

});
