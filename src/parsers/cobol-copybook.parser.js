function initializeCOBOLCopybookParser(){
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
        PICX: 1,
        PIC9: 2, 
        PICS9: 3, 
        PIC_PLUS_9: 4, 
        GROUP: 5
    }

    function matchStatement(statement){
        const regs = [regexes.PICS9, regexes.PIC_PLUS_9, regexes.PIC9, regexes.PICX, regexes.GROUP_ITEM, regexes.REDEFINES, regexes.IMPORT_COPY];
        for (let m = 0; m < regs.length; m++) {
            const regex = regs[m].REGEX;
            if( regex.test(statement) ) return regs[m];
        }
    }

    function Field(){

    }
    function Group(){

    }


    function parseStatemant(statement){
        const stmType = matchStatement(statement);
        if(!stmType) return;
        var  m;
        if((m = stmType.REGEX.exec(statement)) == null) return ;

        var fieldObject;

        switch (stmType.FIELD_TYPE) {
            case regexes.GROUP_ITEM.FIELD_TYPE:
                fieldObject = {
                    src: statement,
                    type: regexes.GROUP_ITEM.FIELD_TYPE,
                    logicalLevel: m[regexes.GROUP_ITEM.CAP_INDEX.LEVEL],
                    name: m[regexes.GROUP_ITEM.CAP_INDEX.NAME],
                    occurs_min: m[regexes.GROUP_ITEM.CAP_INDEX.OCCURS_MIN],
                    occurs_max: m[regexes.GROUP_ITEM.CAP_INDEX.OCCURS_MAX],
                    depending_on: m[regexes.GROUP_ITEM.CAP_INDEX.DEPENDING_ON],
                    fields: [],
                };
                break;
            case regexes.PIC9.FIELD_TYPE:
                fieldObject = {
                    src: statement,
                    type: regexes.PIC9.FIELD_TYPE,
                    logicalLevel: m[regexes.PIC9.CAP_INDEX.LEVEL],
                    name: m[regexes.PIC9.CAP_INDEX.NAME],
                    size: m[regexes.PIC9.CAP_INDEX.SIZE],
                    decimals: m[regexes.PIC9.CAP_INDEX.DECIMALS],
                    has_compression: m[regexes.PIC9.CAP_INDEX.HAS_COMPRESSION],
                    compression_level: m[regexes.PIC9.CAP_INDEX.COMPRESSION_LEVEL],
                    default_value: (m[regexes.PIC9.CAP_INDEX.DEFAULT_VALUE] || '').replace(/[\'\"]/g, ''),
                    occurs_min: m[regexes.PIC9.CAP_INDEX.OCCURS_MIN],
                    occurs_max: m[regexes.PIC9.CAP_INDEX.OCCURS_MAX],
                    depending_on: m[regexes.PIC9.CAP_INDEX.DEPENDING_ON],
                        
                };
                break;
            case regexes.PIC_PLUS_9.FIELD_TYPE:
                fieldObject = {
                    src: statement,
                    type: regexes.PIC_PLUS_9.FIELD_TYPE,
                    logicalLevel: m[regexes.PIC_PLUS_9.CAP_INDEX.LEVEL],
                    name: m[regexes.PIC_PLUS_9.CAP_INDEX.NAME],
                    size: m[regexes.PIC_PLUS_9.CAP_INDEX.SIZE],
                    decimals: m[regexes.PIC_PLUS_9.CAP_INDEX.DECIMALS],
                    has_compression: m[regexes.PIC_PLUS_9.CAP_INDEX.HAS_COMPRESSION],
                    compression_level: m[regexes.PIC_PLUS_9.CAP_INDEX.COMPRESSION_LEVEL],
                    default_value: (m[regexes.PIC_PLUS_9.CAP_INDEX.DEFAULT_VALUE] || '').replace(/[\'\"]/g, ''),
                    occurs_min: m[regexes.PIC_PLUS_9.CAP_INDEX.OCCURS_MIN],
                    occurs_max: m[regexes.PIC_PLUS_9.CAP_INDEX.OCCURS_MAX],
                    depending_on: m[regexes.PIC_PLUS_9.CAP_INDEX.DEPENDING_ON],
                        
                };
                break;
            case regexes.PICS9.FIELD_TYPE:
                fieldObject = {
                    src: statement,
                    type: regexes.PICS9.FIELD_TYPE,
                    logicalLevel: m[regexes.PICS9.CAP_INDEX.LEVEL],
                    name: m[regexes.PICS9.CAP_INDEX.NAME],
                    size: m[regexes.PICS9.CAP_INDEX.SIZE],
                    decimals: m[regexes.PICS9.CAP_INDEX.DECIMALS],
                    has_compression: m[regexes.PICS9.CAP_INDEX.HAS_COMPRESSION],
                    compression_level: m[regexes.PICS9.CAP_INDEX.COMPRESSION_LEVEL],
                    default_value: (m[regexes.PICS9.CAP_INDEX.DEFAULT_VALUE] || '').replace(/[\'\"]/g, ''),
                    occurs_min: m[regexes.PICS9.CAP_INDEX.OCCURS_MIN],
                    occurs_max: m[regexes.PICS9.CAP_INDEX.OCCURS_MAX],
                    depending_on: m[regexes.PICS9.CAP_INDEX.DEPENDING_ON],

                };
                break;
            case regexes.PICX.FIELD_TYPE:
                fieldObject = {
                    src: statement,
                    type: regexes.PICX.FIELD_TYPE,
                    logicalLevel: m[regexes.PICX.CAP_INDEX.LEVEL],
                    name: m[regexes.PICX.CAP_INDEX.NAME],
                    size: m[regexes.PICX.CAP_INDEX.SIZE],
                    default_value: (m[regexes.PICX.CAP_INDEX.DEFAULT_VALUE] || '').replace(/[\'\"]/g, ''),
                    occurs_min: m[regexes.PICX.CAP_INDEX.OCCURS_MIN],
                    occurs_max: m[regexes.PICX.CAP_INDEX.OCCURS_MAX],
                    depending_on: m[regexes.PICX.CAP_INDEX.DEPENDING_ON],
                };
                break;
            case regexes.REDEFINES.FIELD_TYPE:
                fieldObject = {
                    src: statement,
                    type: regexes.REDEFINES.FIELD_TYPE,
                    logicalLevel: m[regexes.REDEFINES.CAP_INDEX.LEVEL],
                    name: m[regexes.REDEFINES.CAP_INDEX.NAME],
                    outer_name: m[regexes.REDEFINES.CAP_INDEX.OUTER_NAME],
                    fields: []
                };
                break;
            case regexes.IMPORT_COPY.FIELD_TYPE:
                fieldObject = {
                    src: statement,
                    type: regexes.IMPORT_COPY.FIELD_TYPE,
                    fileName: m[regexes.IMPORT_COPY.CAP_INDEX.FILE_NAME],
                    fields: []
                };
            default:
                break;
        }

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

    function* getStatemantIterator(content){
        const lines = content.replace(/\r\n/g,'\n').replace(/\n\n/g,'\n').split('\n');
        var statement = '';
        for (let l = 0; l < lines.length; l++) {
            const line = '' + lines[l].replace(/ +$/g, ''); //rtrim
            if(line.length < 7) continue;
            if(line.substr(6, 1) != ' ') continue;

            statement += line.substring(7);
            if(!line.endsWith('.')) continue;

            yield statement;
            statement = '';
        }
    }

    function parseBook(content, importCopyCallback){
        var sttIterator = getStatemantIterator(content);
        var statement = {done: false};
        var statements = [];

        var book = [];
        var lastField;
        var currentParent;
        var rootFields = [];

        while( statement.done == false ){
            statement = sttIterator.next();
            if(statement.value === undefined) continue;

            var newField = parseStatemant(statement.value);
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
                            currentParent.alternativeNames.push(newField);
                            continue;
                        case 88:
                            currentParent.fixedValues.push(newField);
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
        
        return book;
    }




    function getOccursLength(item){
        var occurs = {
            max: parseInt((item.occurs_max | 0)),
            min: parseInt((item.occurs_min | 0))
        };
        return (occurs.max - occurs.min | 1);
    }
    /**
     * Create expanded containers do types PICX, PIC9, PICS9, PIC+9
     * @param {*} item 
     */
    function expandPrimitiveItem(item){
        const expanded = [];
        if(!item) return expanded;
    
        const occurs = getOccursLength(item);
        for (let i = 0; i < occurs; i++) {
            expanded.push({
                name: item.name,
                size: item.size,
                type: item.type,
                compression_level: item.compression_level,
                has_compression: item.has_compression,
                dataContent: '',
                index: i,
            });
        }
        return expanded;
    
    }
    function expandPicx(item){ return expandPrimitiveItem(item); }
    function expandPic9(item){ return expandPrimitiveItem(item); }
    function expandPics9(item){ return expandPrimitiveItem(item); }
    function expandPic_plus_9(item){ return expandPrimitiveItem(item); }
    
    function expandGroup_item(item){ 
        const expanded = [];
        if(!item) return expanded;
    
        var expandedRoot = Object.assign({}, item);
        expandedRoot.dataFields = [].concat.apply([], item.fields.map((field) => {
            return expandMapDelegates[field.type](field);
        }));
        delete expandedRoot.fields;
    
        const occurs = getOccursLength(item);
        for (let i = 0; i < occurs; i++) {
            expanded.push(Object.assign({index: i}, expandedRoot));
        }
        return expanded;
    }
    function expandRedefines(item){ return []; }
    function expandCopy(item){ return []; }
    
    var expandMapDelegates = {
        'GROUP_ITEM': expandGroup_item, 
        'PICX': expandPicx, 
        'PIC9': expandPic9, 
        'PICS9': expandPics9, 
        'PIC_PLUS_9': expandPic_plus_9, 
        'REDEFINES': expandRedefines, 
        'COPY': expandCopy, 
    }
    
    function expandBook(book){
        var expandedItems = book.map((item) => {
            return expandMapDelegates[item.type](item);
        });
    
        return [].concat.apply([], expandedItems);
    }
    
    var cobol_copybook = {
        getStatemantIterator: getStatemantIterator,
        loadBook: parseBook, 
        expandDataBook: expandBook
    };
    
   return cobol_copybook;
};

if(typeof module !== "undefined") {
    module.exports = initializeCOBOLCopybookParser();
}


