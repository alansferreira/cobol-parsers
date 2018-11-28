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
        const script = new String(fs.readFileSync('./test/CVCAW027.cpy'));
        
        const parsedBook = copybookParser.parse(script);

        const record = new CopybookRecord(parsedBook, 'CVCAW027');
        
        /** @typedef CVCAW027
         * @property {{cvcaw027NumArquivo:  number, cvcaw027NumLote:  number, cvcaw027NseqRegLote:  number, cvcaw027NseqRegTotal:  number, cvcaw027CindcdOrigPgto:  number, cvcaw027CsistOrig:  string, cvcaw027NseqPagfor:  number, cvcaw027SistLyoutOrige:  string, cvcaw027Vpagto:  number, filler:  string, cvcaw027Ocorrencias:  {cvcaw027Ocorr:  string}[], cvcaw027IndErro:  number}} cvcaw027Registro
         */
        /** @type {CVCAW027} */ const myVar = record.toModel("011111110*AAAAAA**AAAAA1**AAAAA2**AAAAA3*");
        
        
        assert(myVar.cvcaw027Registro.cvcaw027SistLyoutOrige == '*AAAAAA*', 'error');
        assert(myVar.cvcaw027Registro.cvcaw027Ocorrencias[2].cvcaw027Ocorr == '*AAAAA3*')
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

