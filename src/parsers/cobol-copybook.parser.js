var regexes = {
    GROUP_ITEM: {
        REGEX: /^ {0,}([0-9]+) +([a-zA-Z-0-9]+)( {0,}VALUE {0,}(.+))?( {0,}OCCURS +([0-9]+) +TO +([0-9]+) +TIMES)?( {0,}DEPENDING +ON +([a-zA-Z-0-9]+))? {0,}\./,
        FIELD_TYPE: 'GROUP_ITEM',
        CAP_INDEX: { 
            LEVEL: 1,
            NAME: 2,
            OCCURS_MIN: 4, 
            OCCURS_MAX: 5,
            DEPENDING_ON: 7
        }
    },
    PICX: {
        REGEX: /^ {0,}([0-9]+) +([a-zA-Z-0-9]+) +PIC +X {0,}\(([0-9]+)\)( {0,}VALUE {0,}(.+))?( {0,}OCCURS +([0-9]+) +TO +([0-9]+) +TIMES)?( {0,}DEPENDING +ON +([a-zA-Z-0-9]+))? {0,}\./, 
        FIELD_TYPE: 'PICX',
        CAP_INDEX: { 
            LEVEL: 1, 
            NAME: 2, 
            SIZE: 3, 
            DEFAULT_VALUE: 5,
            OCCURS_MIN: 7, 
            OCCURS_MAX: 8,
            DEPENDING_ON: 10
        }
    },
    PIC9: {
        REGEX: /^ {0,}([0-9]+) +([a-zA-Z-0-9]+) +PIC +9 {0,}\(([0-9]+)\)(V([0-9]+))? {0,}(COMP(-([1-3]))? {0,})?( {0,}VALUE {0,}(.+))?( {0,}OCCURS +([0-9]+) +TO +([0-9]+) +TIMES)?( {0,}DEPENDING +ON +([a-zA-Z-0-9]+))? {0,}\./, 
        FIELD_TYPE: 'PIC9',
        CAP_INDEX: { 
            LEVEL: 1, 
            NAME: 2, 
            SIZE: 3, 
            DECIMALS: 5,
            HAS_COMPRESSION: 6,
            COMPRESSION_LEVEL: 8, 
            DEFAULT_VALUE: 10,
            OCCURS_MIN: 12, 
            OCCURS_MAX: 13,
            DEPENDING_ON: 15
        }
    },
    PICS9: {
        REGEX: /^ {0,}([0-9]+) +([a-zA-Z-0-9]+) +PIC +S9 {0,}\(([0-9]+)\)(V([0-9]+))? {0,}(COMP(-([1-3]))? {0,})?( {0,}VALUE {0,}(.+))?( {0,}OCCURS +([0-9]+) +TO +([0-9]+) +TIMES)?( {0,}DEPENDING +ON +([a-zA-Z-0-9]+))? {0,}\./,
        FIELD_TYPE: 'PICS9',
        CAP_INDEX: { 
            LEVEL: 1, 
            NAME: 2, 
            SIZE: 3, 
            DECIMALS: 5,
            HAS_COMPRESSION: 6,
            COMPRESSION_LEVEL: 8, 
            DEFAULT_VALUE: 10,
            OCCURS_MIN: 12, 
            OCCURS_MAX: 13,
            DEPENDING_ON: 15
        }
    },
    PIC_PLUS_9: {
        REGEX: /^ {0,}([0-9]+) +([a-zA-Z-0-9]+) +PIC +\+9 {0,}\(([0-9]+)\)(V([0-9]+))? {0,}(COMP(-([1-3]))? {0,})?( {0,}VALUE {0,}(.+))?( {0,}OCCURS +([0-9]+) +TO +([0-9]+) +TIMES)?( {0,}DEPENDING +ON +([a-zA-Z-0-9]+))? {0,}\./,
        FIELD_TYPE: 'PIC_PLUS_9',
        CAP_INDEX: { 
            LEVEL: 1, 
            NAME: 2, 
            SIZE: 3, 
            DECIMALS: 5,
            HAS_COMPRESSION: 6,
            COMPRESSION_LEVEL: 8, 
            DEFAULT_VALUE: 10,
            OCCURS_MIN: 12, 
            OCCURS_MAX: 13,
            DEPENDING_ON: 15
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
    PICX: 'PICX',
    PIC9: 'PIC9', 
    PICS9: 'PICS9', 
    PIC_PLUS_9: 'PIC_PLUS_9', 
    GROUP: 'GROUP',
    REDEFINE: 'REDEFINE',
    COPY: 'COPY'
}

class FieldGroup {
    constructor(statement, match){
        this.src = statement;
        /** @type {'GROUP'} */this.type = FIELD_TYPE.GROUP;
        this.logicalLevel = match[regexes.GROUP_ITEM.CAP_INDEX.LEVEL];
        this.name = match[regexes.GROUP_ITEM.CAP_INDEX.NAME];
        this.occurs_min = match[regexes.GROUP_ITEM.CAP_INDEX.OCCURS_MIN];
        this.occurs_max = match[regexes.GROUP_ITEM.CAP_INDEX.OCCURS_MAX];
        this.depending_on = match[regexes.GROUP_ITEM.CAP_INDEX.DEPENDING_ON];
        this.fields = [];
    }
}

class FieldPIC9 {
    constructor(statement, match){
        this.src = statement;
        /** @type {'PIC9'} */this.type = FIELD_TYPE.PIC9;
        this.logicalLevel = match[regexes.PIC9.CAP_INDEX.LEVEL];
        this.name = match[regexes.PIC9.CAP_INDEX.NAME];
        this.size = match[regexes.PIC9.CAP_INDEX.SIZE];
        this.decimals = match[regexes.PIC9.CAP_INDEX.DECIMALS];
        this.has_compression = match[regexes.PIC9.CAP_INDEX.HAS_COMPRESSION];
        this.compression_level = match[regexes.PIC9.CAP_INDEX.COMPRESSION_LEVEL];
        this.default_value = (match[regexes.PIC9.CAP_INDEX.DEFAULT_VALUE] || '').replace(/[\'\"]/g, '');
        this.occurs_min = match[regexes.PIC9.CAP_INDEX.OCCURS_MIN];
        this.occurs_max = match[regexes.PIC9.CAP_INDEX.OCCURS_MAX];
        this.depending_on = match[regexes.PIC9.CAP_INDEX.DEPENDING_ON];
    }
}

class FieldPICPlus9{
    constructor(statement, match){
        this.src = statement;
        /** @type {'PIC_PLUS_9'} */this.type = FIELD_TYPE.PIC_PLUS_9;
        this.logicalLevel = match[regexes.PIC_PLUS_9.CAP_INDEX.LEVEL];
        this.name = match[regexes.PIC_PLUS_9.CAP_INDEX.NAME];
        this.size = match[regexes.PIC_PLUS_9.CAP_INDEX.SIZE];
        this.decimals = match[regexes.PIC_PLUS_9.CAP_INDEX.DECIMALS];
        this.has_compression = match[regexes.PIC_PLUS_9.CAP_INDEX.HAS_COMPRESSION];
        this.compression_level = match[regexes.PIC_PLUS_9.CAP_INDEX.COMPRESSION_LEVEL];
        this.default_value = (match[regexes.PIC_PLUS_9.CAP_INDEX.DEFAULT_VALUE] || '').replace(/[\'\"]/g, '');
        this.occurs_min = match[regexes.PIC_PLUS_9.CAP_INDEX.OCCURS_MIN];
        this.occurs_max = match[regexes.PIC_PLUS_9.CAP_INDEX.OCCURS_MAX];
        this.depending_on = match[regexes.PIC_PLUS_9.CAP_INDEX.DEPENDING_ON];
    }
}

class FieldPICS9{
    constructor(statement, match){
        this.src = statement;
        /** @type {'PICS9'} */this.type = FIELD_TYPE.PICS9;
        this.logicalLevel = match[regexes.PICS9.CAP_INDEX.LEVEL];
        this.name = match[regexes.PICS9.CAP_INDEX.NAME];
        this.size = match[regexes.PICS9.CAP_INDEX.SIZE];
        this.decimals = match[regexes.PICS9.CAP_INDEX.DECIMALS];
        this.has_compression = match[regexes.PICS9.CAP_INDEX.HAS_COMPRESSION];
        this.compression_level = match[regexes.PICS9.CAP_INDEX.COMPRESSION_LEVEL];
        this.default_value = (match[regexes.PICS9.CAP_INDEX.DEFAULT_VALUE] || '').replace(/[\'\"]/g, '');
        this.occurs_min = match[regexes.PICS9.CAP_INDEX.OCCURS_MIN];
        this.occurs_max = match[regexes.PICS9.CAP_INDEX.OCCURS_MAX];
        this.depending_on = match[regexes.PICS9.CAP_INDEX.DEPENDING_ON];
    }
}

class FieldPICX{
    constructor(statement, match){
        this.src = statement;
        /** @type {'PICX'} */this.type = FIELD_TYPE.PICX;
        this.logicalLevel = match[regexes.PICX.CAP_INDEX.LEVEL];
        this.name = match[regexes.PICX.CAP_INDEX.NAME];
        this.size = match[regexes.PICX.CAP_INDEX.SIZE];
        this.default_value = (match[regexes.PICX.CAP_INDEX.DEFAULT_VALUE] || '').replace(/[\'\"]/g, '');
        this.occurs_min = match[regexes.PICX.CAP_INDEX.OCCURS_MIN];
        this.occurs_max = match[regexes.PICX.CAP_INDEX.OCCURS_MAX];
        this.depending_on = match[regexes.PICX.CAP_INDEX.DEPENDING_ON];
    }
}

class FieldREDEFINE{
    constructor(statement, match){
        this.src = statement;
        /** @type {'REDEFINE'} */this.type = FIELD_TYPE.REDEFINE;
        this.logicalLevel = match[regexes.REDEFINES.CAP_INDEX.LEVEL];
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
    {match: regexes.PICS9, type: FieldPICS9}, 
    {match: regexes.PIC_PLUS_9, type: FieldPICPlus9}, 
    {match: regexes.PIC9, type: FieldPIC9}, 
    {match: regexes.PICX, type: FieldPICX}, 
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
            
            if(newField.logicalLevel > lastField.logicalLevel && newField.logicalLevel < 50){
                rootFields.push(lastField);
                currentParent = rootFields[rootFields.length-1];
                currentParent.fields.push(newField);
            }else {
                if(newField.logicalLevel > lastField.logicalLevel){
                    switch (newField.logicalLevel) {
                        case 66:
                            lastField.alternativeNames.push(newField);
                            continue;
                        case 88:
                            lastField.fixedValues.push(newField);
                            continue;
                    }
                }


                if(newField.logicalLevel == 77){
                    // come back to root level
                    rootFields.splice(0, rootFields.length);
                    currentParent = null;
                } else if(newField.logicalLevel < lastField.logicalLevel){
                    // come back to brother level
                    while(rootFields.length != 0){
                        if(rootFields[rootFields.length - 1].logicalLevel < newField.logicalLevel) break;
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


        try { fieldObject.logicalLevel = parseInt(fieldObject.logicalLevel); } catch(e) {} 
        try { fieldObject.size = parseInt(fieldObject.size); } catch(e) {} 
        try { fieldObject.has_compression = parseInt(fieldObject.has_compression); } catch(e) {} 
        try { fieldObject.compression_level = parseInt(fieldObject.compression_level); } catch(e) {} 
        try { fieldObject.default_value = parseInt(fieldObject.default_value); } catch(e) {} 
        try { fieldObject.occurs_min = parseInt(fieldObject.occurs_min); } catch(e) {} 
        try { fieldObject.occurs_max = parseInt(fieldObject.occurs_max); } catch(e) {} 

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
        FieldPIC9,
        FieldPICPlus9,
        FieldPICS9,
        FieldPICX,
        FieldREDEFINE,
        FieldCOPY,
        CopybookParser,
        Copybook,
    };
}


