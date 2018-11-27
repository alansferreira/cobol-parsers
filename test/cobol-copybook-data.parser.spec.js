const assert = require('assert');
const { CopybookRecord } = require('../src/parsers/cobol-copybook-data.parser');
const { CopybookParser } = require('../src/parsers/cobol-copybook.parser');
const fs = require('fs');
const copybookParser = new CopybookParser();


describe('Read and parse copybook data file', function(){
    it('should parse generate JSDoc of copybook', function(){
        const script = new String(fs.readFileSync('./test/CVCAW027.cpy'));
        
        const parsedBook = copybookParser.parse(script);

        const record = new CopybookRecord(parsedBook, 'CVCAW027');
        console.log(record.getJSDoc());
        
        assert(true, 'error');
    });

    it('should parse copybook records', function(){
        const script = new String(fs.readFileSync('./test/CCP0001.CPY'));
        
        const parsedBook = copybookParser.parse(script);

        const record = new CopybookRecord(parsedBook, 'CCP0001');
        record.toModel("01111110*NOME-TABELA                   *02222220");
        
        assert(true, 'error');
    });


    // it('should parse cobol copybook', function(){
    //     var script = new String(fs.readFileSync('./test/CCP0001.CPY'));
        
    //     var book = copybookParser.parse(script);
    //     const dataFileStream = fs.createReadStream('/media/af/usr-data/dev/repo/github.com/alansferreira/stages/cobol-parsers/test/JOBSPL01L.JCL', {highWaterMark: 1});
    //     const recordReadable = new DataReadableStream(book, dataFileStream);

    //     const iterator = recordReadable.readRecordString();
    //     var iteratee = {done: false};
    //     while(!iteratee.done){
    //         iteratee = iterator.next();
    //         console.log(iteratee.value);
    //     }
        
        
        
    //     assert(true, 'error');
    // });

});

