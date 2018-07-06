const assert = require('assert');
var programParser = require('../src/parsers/cobol-program.parser');
var fs = require('fs');

describe('Read and parse program definitions', function(){
    it('should parse cobol program statement iterator model', function(){
        var script = new String(fs.readFileSync('./test/CCP0001.CBL'));
        
        var sttIterator = programParser.getStatemantIterator(script);
        var iteratee = {done: false};
        var countStatements = 0;
        var countStatementsWithDot = 0;
        fs.writeFileSync('./readed-statements.CCP0001.CBL.txt', '');
        while( iteratee.done==false ){
            iteratee = sttIterator.next();
            if(iteratee.value === undefined) continue;
            
            var {statement, startedAtLine, endedAtLine} = iteratee.value;
            countStatements++;
            countStatementsWithDot += (statement.endsWith('.') ? 1: 0);
            fs.appendFileSync('./readed-statements.CCP0001.CBL.txt', `[${startedAtLine}, ${endedAtLine}]: ${statement}\n`);
        }
        assert(countStatements === countStatementsWithDot, 'error');
    });
    
    it('should parse cobol program', function(){
        var script = new String(fs.readFileSync('./test/CCP0001.CBL'));
        
        var program = programParser.parseProgram(script);
        
        fs.writeFileSync('./parsed-program.CCP0001.CBL.json', JSON.stringify(program, null, 2));

        assert(program.divisions[2].sections.length==19, 'error');
    });


    it('should parse cobol program statement iterator model: with exceding chars before position 6 and after position 72 ', function(){
        var script = new String(fs.readFileSync('./test/CCP0002.CBL'));
        
        var sttIterator = programParser.getStatemantIterator(script);
        var iteratee = {done: false};
        var countStatements = 0;
        var countStatementsWithDot = 0;
        fs.writeFileSync('./readed-statements.CCP0002.CBL.txt', '');
        while( iteratee.done==false ){
            iteratee = sttIterator.next();
            if(iteratee.value === undefined) continue;
            
            var {statement, startedAtLine, endedAtLine} = iteratee.value;
            countStatements++;
            countStatementsWithDot += (statement.endsWith('.') ? 1: 0);
            fs.appendFileSync('./readed-statements.CCP0002.CBL.txt', `[${startedAtLine}, ${endedAtLine}]: ${statement}\n`);
        }

        assert(countStatements === countStatementsWithDot, 'error');
    });

    it('should parse cobol program: with exceding chars before position 6 and after position 72 ', function(){
        var script = new String(fs.readFileSync('./test/CCP0002.CBL'));
        
        var program = programParser.parseProgram(script);
        
        fs.writeFileSync('./parsed-program.CCP0002.CBL.json', JSON.stringify(program, null, 2));
        
        
        assert(program.divisions.length==3, 'error');
        assert(program.divisions[2].sections[2].statements.length==22, 'error');
    });

    it('should parse cobol program: filtering only sql queries ', function(){
        var script = new String(fs.readFileSync('./test/CCP0002.CBL'));
        
        var program = programParser.parseProgram(script, {filters: [programParser.parseFilters.EXEC_SQL]});
        
        fs.writeFileSync('./parsed-program.CCP0002.CBL.json', JSON.stringify(program, null, 2));
        
        
        assert(program.statements.length==23, 'error');
    });

    it('should extract basic external references from a cobol program ', function(){
        var script = new String(fs.readFileSync('./test/CCP0001.CBL'));
        
        var program = programParser.parseProgram(script);
        var references = programParser.extractReferences(program);
        
        fs.writeFileSync('./parsed-program.CCP0001.CBL.references.json', JSON.stringify(references, null, 2));
        
        
        assert(references.cics.length==5, 'error');
        assert(references.copybook.length==13, 'error');
        assert(references.query.length==6, 'error');
    });

});

