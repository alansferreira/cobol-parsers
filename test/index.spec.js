var assert = require('assert');

describe('Test module definition', function(){
    it('should export all modules', function(){
        const m = require('../src');
        assert(m.jcl!==undefined, 'loaded');
    });
    
});

