const assert = require('assert');
var jclParser = require('../src/parsers/cobol-jcl.parser');
var fs = require('fs');

describe('Read and parse program definitions', function(){
    it('should parse jcl program statement iterator model', function(){
        var script = new String(fs.readFileSync('./test/JOBSPL01L.JCL'));
        
        var sttIterator = jclParser.getStatementIterator(script);
        var iteratee = {done: false};
        var countStatements = 0;

        fs.writeFileSync('./readed-statements.JOBSPL01L.JCL.txt', '');
        while( iteratee.done==false ){
            iteratee = sttIterator.next();
            if(iteratee.value === undefined) continue;
            
            var {statement, startedAtLine, endedAtLine} = iteratee.value;
            countStatements++;
            fs.appendFileSync('./readed-statements.JOBSPL01L.JCL.txt', `[${startedAtLine}, ${endedAtLine}]: ${statement}\n`);
        }
        assert(countStatements === 9, 'error');
    });
    
    it('should parse jcl program', function(){
        var script = new String(fs.readFileSync('./test/JOBSPL01L.JCL'));
        
        var job = jclParser.parseJob(script);
        
        fs.writeFileSync('./parsed-program.JOBSPL01L.JCL.json', JSON.stringify(job, null, 2));
        
        assert(job.statements.length==9, 'error');
    });

    it('should extract basic external references from a jcl program ', function(){
        var script = new String(fs.readFileSync('./test/JOBSPL01L.JCL'));
        
        var parsedJob = jclParser.parseJob(script);
        var references = jclParser.extractReferences(parsedJob);
        
        fs.writeFileSync('./parsed-program.JOBSPL01L.JCL.references.json', JSON.stringify(references, null, 2));
        
        
        assert(references.dd.length==7, 'error');
    });

});

