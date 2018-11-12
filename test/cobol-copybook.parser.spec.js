var assert = require('assert');
var cpyParser = require('../src/parsers/cobol-copybook.parser');
var fs = require('fs');

describe('Read and parse copybook definitions', function(){
    it('should parse cobol copybook statement iterator model', function(){
        var script = new String(fs.readFileSync('./test/CCP0001.CPY'));
        
        var sttIterator = cpyParser.getStatemantIterator(script);
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
        var script = new String(fs.readFileSync('./test/CCP0001.CPY'));
        
        var book = cpyParser.loadBook(script);
        
        fs.writeFileSync('./parsed-book.CCP0001.CPY.json', JSON.stringify(book, null, 2));
        
        
        assert(book.length==71, 'error');
    });



    // it('should parse cobol copybook PICX', function(){
    //     var script = "       77  WRK-LOCAL                   PIC  X(004)         VALUE SPACES.";
        
    //     var book = cdsParser.COBOL.COPYBOOK.loadBook(script);
        
    //     console.log(book);
    //     fs.writeFileSync('./parsed-book.CCP0000.CPY.json', JSON.stringify(book, null, 2));
        
        
    //     assert(book.length==49, 'error');
    // });

    // it('should parse cobol copybook', function(){
    //     var script = new String(fs.readFileSync('./test/CCP0001.CPY'));
        
    //     var book = cdsParser.COBOL.COPYBOOK.loadBook(script);
        
    //     console.log(book);
    //     fs.writeFileSync('./parsed-book.CCP0001.CPY.json', JSON.stringify(book, null, 2));
        
        
    //     assert(book.length==49, 'error');
    // });

    // it('should parse cobol copybook redefines', function(){
    //     var script = new String(fs.readFileSync('./test/CCP0000.CPY'));
        
    //     var book = cdsParser.COBOL.COPYBOOK.loadBook(script);
        
    //     console.log(book);
    //     fs.writeFileSync('./parsed-book.CCP0000.CPY.json', JSON.stringify(book, null, 2));
        
        
    //     assert(book.length==49, 'error');
    // });

});

