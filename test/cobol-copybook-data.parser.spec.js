const assert = require('assert');
const { CopybookRecord } = require('../src/parsers/cobol-copybook-data.parser');
const { CopybookParser } = require('../src/parsers/cobol-copybook.parser');
const fs = require('fs');
const copybookParser = new CopybookParser();


describe('Read and parse copybook data file', function(){
    const initialRecordData = "011111110*AAAA   *AAAAA1**AAAAA2**AAAAA3*0777777701022222220*AA*0333004444444444444051022222220*AA*033300444444444444405";

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
                
        // /** @typedef CVCAW027
        //  * @property {{cvcaw027NumLote:  number, cvcaw027SistLyoutOrige:  string, cvcaw027Ocorrencias:  {cvcaw027Ocorr:  string[]}, cvcaw027NseqRegLote:  number}} cvcaw027Registro
        //  * @property {{cvcaw027CindcdOrigPgto:  number, cvcaw027NumArquivo:  number, cvcaw027CsistOrig:  string, cvcaw027NseqPagfor:  number, cvcaw027Vpagto:  number, filler:  string,cvcaw027IndErro:  number}[]} cvcaw027NseqRegTotal
        //  */

        /** @typedef CVCAW027
        * @property {{cvcaw027NumLote:  number, cvcaw027SistLyoutOrige:  string, cvcaw027Ocorrencias:  {cvcaw027Ocorr:  string[]}, cvcaw027NseqRegLote:  number, cvcaw027NseqRegTotal: {cvcaw027CindcdOrigPgto:  number, cvcaw027NumArquivo:  number, cvcaw027CsistOrig:  string, cvcaw027NseqPagfor:  number, cvcaw027Vpagto:  number, filler:  string, cvcaw027IndErro:  number}[]}} cvcaw027Registro
        */

        /** @type {CVCAW027} */ const myVar = record.toModel(initialRecordData);
        
        assert(myVar.cvcaw027Registro.cvcaw027SistLyoutOrige == '*AAAA', 'error');
        assert(myVar.cvcaw027Registro.cvcaw027Ocorrencias.cvcaw027Ocorr[2] == '*AAAAA3*');
        assert(myVar.cvcaw027Registro.cvcaw027NseqRegTotal[0].cvcaw027Vpagto == 444444444444.4);
    });

    it('should dump copybook records into byte array', function(){
        const script = new String(fs.readFileSync('./test/CVCAW027.cpy'));
        const parsedBook = copybookParser.parse(script);
        const recordParser = new CopybookRecord(parsedBook, 'CVCAW027');

        /** @typedef CVCAW027
        * @property {{cvcaw027NumLote:  number, cvcaw027SistLyoutOrige:  string, cvcaw027Ocorrencias:  {cvcaw027Ocorr:  string[]}, cvcaw027NseqRegLote:  number, cvcaw027NseqRegTotal: {cvcaw027CindcdOrigPgto:  number, cvcaw027NumArquivo:  number, cvcaw027CsistOrig:  string, cvcaw027NseqPagfor:  number, cvcaw027Vpagto:  number, filler:  string, cvcaw027IndErro:  number}[]}} cvcaw027Registro
        */

        /** @type {CVCAW027} */ const myVar = recordParser.toModel(initialRecordData);
        

        const result = recordParser.toString(myVar);

        assert(initialRecordData === result, 'error');
    });

});

