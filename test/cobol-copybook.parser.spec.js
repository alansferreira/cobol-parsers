const assert = require('assert');
const { CopybookParser } = require('../src/parsers/cobol-copybook.parser');
const fs = require('fs');
const parser = new CopybookParser();

describe('Read and parse copybook definitions', function(){
    it('should parse cobol copybook statement iterator model', function(){
        var script = new String(fs.readFileSync('./test/CCP0001.CPY'));
        
        var sttIterator = parser.getStatemantIterator(script);
        var iteratee = {done: false};
        var countStatements = 0;
        var countStatementsWithDot = 0;
        fs.writeFileSync('./readed-statements.CCP0001.CPY.txt', '');
        while( iteratee.done==false ){
            iteratee = sttIterator.next();
            if(iteratee.value === undefined) continue;
            countStatements++;
            countStatementsWithDot += (iteratee.value.statement.endsWith('.') ? 1: 0);
            fs.appendFileSync('./readed-statements.CCP0001.CPY.txt', iteratee.value + '\n');
        }
        assert(countStatements === countStatementsWithDot, 'error');
    });
    
    it('should parse cobol copybook', function(){
        var script = new String(fs.readFileSync('./test/CVCAW027.cpy'));
        
        var book = parser.parse(script);
        
        fs.writeFileSync('./parsed-book.CVCAW027.CPY.json', JSON.stringify(book, null, 2));
        
        
        assert(book.fields.length==71, 'error');
    });

});

