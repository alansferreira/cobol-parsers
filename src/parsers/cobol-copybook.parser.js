var regexes = {
    GROUP_ITEM: {
        REGEX: /^ {0,}([0-9]+) +([a-zA-Z-0-9]+)( {0,}VALUE {1,}([^ ]+))?( {1,}OCCURS +([0-9]+)( +TO +([0-9]+))?( +TIMES)( {0,}DEPENDING +ON +([a-zA-Z-0-9]+))?)? {0,}\.?/,
        FIELD_TYPE: 'GROUP_ITEM',
        CAP_INDEX: { 
            LEVEL: 1,
            NAME: 2,
            VALUE: 4,
            OCCURS_MIN: 6, 
            OCCURS_MAX: 8,
            DEPENDING_ON: 11
        }
    },
    GENERIC_PIC: {
        REGEX: /^ {0,}([0-9]+) +([a-zA-Z-0-9]+) +PIC +([\+9]?[\-9]?[sS9]?[xX]??[aA]?[9]?) {0,}\(([0-9]+)\)(V([0-9]+)( {0,}\(([0-9]+)\))?)? {0,}(COMP(-([1-3]))? {0,})?( {0,}VALUE {1,}([^ ]+))?( {1,}OCCURS +([0-9]+)( +TO +([0-9]+))?( +TIMES)( {0,}DEPENDING +ON +([a-zA-Z-0-9]+))?)? {0,}\./,
        FIELD_TYPE: 'PICS9',
        CAP_INDEX: { 
            LEVEL: 1, 
            NAME: 2, 
            PIC_TYPE: 3,
            PRECISION_SIZE: 4, 
            DECIMALS_TYPE_1: 6,
            DECIMALS_TYPE_2: 8,
            HAS_COMPRESSION: 9,
            COMPRESSION_LEVEL: 11, 
            DEFAULT_VALUE: 13,
            OCCURS_MIN: 15, 
            OCCURS_MAX: 17,
            DEPENDING_ON: 20
        }
    },
    REDEFINES: {
        REGEX: /^ {0,}([0-9]+) +([a-zA-Z-0-9]+) {0,}REDEFINES {0,}([a-zA-Z-0-9]+) {0,}\./,
        FIELD_TYPE: 'REDEFINES',
        CAP_INDEX: {
            LEVEL: 1, 
            NAME: 2, 
            OUTER_NAME: 3                
        }
    },
    IMPORT_COPY: {
        REGEX: /^ {0,}COPY {1,}([^\.]+) {0,}\./,
        FIELD_TYPE: 'COPY',
        CAP_INDEX: {
            FILE_NAME: 1
        }
    }

};

const FIELD_TYPE = {
    PIC: 'PIC',
    GROUP: 'GROUP',
    REDEFINE: 'REDEFINE',
    COPY: 'COPY'
}

class FieldGroup {
    constructor(statement, match){
        this.src = statement;
        /** @type {'GROUP'} */this.type = FIELD_TYPE.GROUP;
        /** @type {number} */this.level = match[regexes.GROUP_ITEM.CAP_INDEX.LEVEL];
        /** @type {string} */this.name = match[regexes.GROUP_ITEM.CAP_INDEX.NAME];
        /** @type {string} */this.value = match[regexes.GROUP_ITEM.CAP_INDEX.VALUE];
        /** @type {string} */this.depending_on = match[regexes.GROUP_ITEM.CAP_INDEX.DEPENDING_ON];
        /** @type {number} */this.occursMin = parseInt(match[regexes.GROUP_ITEM.CAP_INDEX.OCCURS_MIN] | 1);
        /** @type {number} */this.occursMax = parseInt(match[regexes.GROUP_ITEM.CAP_INDEX.OCCURS_MAX] | 1);
        if(this.occursMax < this.occursMin){
            /** @type {number} */this.occursSize = (this.occursMin | 1);
        }else{
            /** @type {number} */this.occursSize = (this.occursMax - this.occursMin | 1);
        }
        this.fields = [];
    }
}

class FieldPIC {
    constructor(statement, match){
        this.src = statement;
        /** @type {string} */this.type = FIELD_TYPE.PIC;

        /** @type {number} */this.level = parseInt(match[regexes.GENERIC_PIC.CAP_INDEX.LEVEL]);
        /** @type {string} */this.name = match[regexes.GENERIC_PIC.CAP_INDEX.NAME];
        /** @type {string} */this.picType = match[regexes.GENERIC_PIC.CAP_INDEX.PIC_TYPE];
        /** @type {number} */this.precisionSize = parseInt(match[regexes.GENERIC_PIC.CAP_INDEX.PRECISION_SIZE] | 0);
        /** @type {number} */this.decimalsType_1 = parseInt(match[regexes.GENERIC_PIC.CAP_INDEX.DECIMALS_TYPE_1] | 0);
        /** @type {number} */this.decimalsType_2 = parseInt(match[regexes.GENERIC_PIC.CAP_INDEX.DECIMALS_TYPE_2] | 0);
        /** @type {boolean} */this.hasCompression = !!match[regexes.GENERIC_PIC.CAP_INDEX.HAS_COMPRESSION];
        /** @type {number} */this.compressionLevel = parseInt(match[regexes.GENERIC_PIC.CAP_INDEX.COMPRESSION_LEVEL] | 0);
        /** @type {string} */this.defaultValue = (match[regexes.GENERIC_PIC.CAP_INDEX.DEFAULT_VALUE] || '').replace(/[\'\"]/g, '');
        /** @type {number} */this.occursMin = parseInt(match[regexes.GENERIC_PIC.CAP_INDEX.OCCURS_MIN] | 0);
        /** @type {number} */this.occursMax = parseInt(match[regexes.GENERIC_PIC.CAP_INDEX.OCCURS_MAX] | 0);
        if(this.occursMax < this.occursMin){
            /** @type {number} */this.occursSize = (this.occursMin | 1);
        }else{
            /** @type {number} */this.occursSize = (this.occursMax - this.occursMin | 1);
        }
        
        /** @type {string} */this.dependingOn = match[regexes.GENERIC_PIC.CAP_INDEX.DEPENDING_ON];
    }
}

class FieldREDEFINE{
    constructor(statement, match){
        this.src = statement;
        /** @type {'REDEFINE'} */this.type = FIELD_TYPE.REDEFINE;
        this.level = match[regexes.REDEFINES.CAP_INDEX.LEVEL];
        this.name = match[regexes.REDEFINES.CAP_INDEX.NAME];
        this.outer_name = match[regexes.REDEFINES.CAP_INDEX.OUTER_NAME];
        this.fields = [];
    }
}

class FieldCOPY{
    constructor(statement, match){
        this.src = statement;
        /** @type {'COPY'} */this.type = FIELD_TYPE.COPY;
        this.fileName = match[regexes.IMPORT_COPY.CAP_INDEX.FILE_NAME];
        this.fields = [];
    }
}

const matchMap = [
    {match: regexes.GENERIC_PIC, type: FieldPIC}, 
    {match: regexes.GROUP_ITEM, type: FieldGroup}, 
    {match: regexes.REDEFINES, type: FieldREDEFINE}, 
    {match: regexes.IMPORT_COPY, type: FieldCOPY}, 
];

class CopybookParser {
    
    * getStatemantIterator(content){
        const lines = content.replace(/\r\n/g,'\n').split('\n');
        var statement = '';
        var startedAtLine;
        for (let l = 0; l < lines.length; l++) {
            const line = '' + lines[l].replace(/ +$/g, ''); //rtrim
            if(line.length < 7) continue;
            if(line.substr(6, 1) != ' ') continue;
            
            if(statement == '') startedAtLine = l + 1;
            statement += line.substring(7);
            if(!line.endsWith('.')) continue;

            yield {
                statement,
                startedAtLine,
                endedAtLine: l + 1
            };
            statement = '';
        }
    }

    parse(content){
        var sttIterator = this.getStatemantIterator(content);
        var iteratee = {done: false};
        var statements = [];

        var book = [];
        var lastField;
        var currentParent;
        var rootFields = [];

        while( iteratee.done == false ){
            iteratee = sttIterator.next();
            if(iteratee.value === undefined) continue;
            
            var {statement, startedAtLine, endedAtLine} = iteratee.value;

            var newField = this.parseStatemant(statement, startedAtLine, endedAtLine);
            if(!newField ) continue;
            if(newField.type == regexes.IMPORT_COPY.FIELD_TYPE){
                // if(importCopyCallback){
                //     importCopyCallback(newField.fileName, lastField);
                // }
                continue;
            }
            
            statements.push(newField);

            if(!lastField){
                book.push(newField)
                lastField = newField
                continue;
            }
            
            if(newField.level > lastField.level && newField.level < 50){
                rootFields.push(lastField);
                currentParent = rootFields[rootFields.length-1];
                currentParent.fields.push(newField);
            }else {
                if(newField.level > lastField.level){
                    switch (newField.level) {
                        case 66:
                            lastField.alternativeNames.push(newField);
                            continue;
                        case 88:
                            lastField.fixedValues.push(newField);
                            continue;
                    }
                }


                if(newField.level == 77){
                    // come back to root level
                    rootFields.splice(0, rootFields.length);
                    currentParent = null;
                } else if(newField.level < lastField.level){
                    // come back to brother level
                    while(rootFields.length != 0){
                        if(rootFields[rootFields.length - 1].level < newField.level) break;
                        rootFields.splice(rootFields.length - 1, 1);
                    }
                }
                
                if(rootFields.length == 0){
                    book.push(newField)
                }else {
                    currentParent = rootFields[rootFields.length - 1];
                    currentParent.fields.push(newField);
                }
            }


            lastField = newField;
        }
        
        return new Copybook(book);
    }

    matchStatement(statement){
        for (let m = 0; m < matchMap.length; m++) {
            const regex = matchMap[m].match.REGEX;
            regex.lastIndex = -1;
            if( regex.test(statement) ) {
                var match;
                regex.lastIndex = -1;
                if((match = regex.exec(statement)) == null) return ;
                return new matchMap[m].type(statement, match);
            }
        }
    }

    parseStatemant(statement, startedAtLine, endedAtLine){
        var fieldObject = this.matchStatement(statement);
        
        if(!fieldObject) return null;

        fieldObject.startedAtLine = startedAtLine;
        fieldObject.endedAtLine = endedAtLine;
        
        fieldObject.alternativeNames = [];
        fieldObject.fixedValues = [];

        if(!fieldObject) return fieldObject;

        return fieldObject;
    }
}

class Copybook{
    constructor(fields){
        this.fields = fields;
    }
}

if(typeof module !== "undefined") {
    module.exports = {
        FIELD_TYPE,
        FieldGroup,
        FieldPIC,
        FieldREDEFINE,
        FieldCOPY,
        CopybookParser,
        Copybook,
    };
}


