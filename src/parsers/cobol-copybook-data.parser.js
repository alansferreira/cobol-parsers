const decamelize = require('decamelize');
const camelCase = require('camelcase');
const { Copybook, FieldGroup, FieldPIC, FieldREDEFINE, FieldCOPY, FIELD_TYPE } = require('./cobol-copybook.parser');
const fs = require('fs');
const { Readable } = require('stream');


const stringToModelMap = {};
const modelToStringMap = {};
const getFieldStringLengthMap = {};
const generateTypeMap = {};

/**
 * @param {string} content
 * @param {number} offset
 * @param {FieldGroup | FieldPIC | FieldREDEFINE | FieldCOPY} field
 */
stringToModelMap[FIELD_TYPE.PIC] = (content, offset, field) => {
    const occurs = field.occursSize;
    if(occurs > 1){
        const ret = [];
        let _offset = offset;
        for (let o = 0; o < occurs; o++) {
            ret.push(content.substr(_offset, field.precisionSize));
            _offset += field.precisionSize;
        }
        return ret;
    }else{
        return content.substr(offset, field.precisionSize);
    }
};

/**
 * @param {string} content
 * @param {number} offset
 * @param {FieldGroup | FieldPIC | FieldREDEFINE | FieldCOPY} field
 */
function stringToModelGroup(content, offset, field){
    const obj = {};

    let _offset = offset;
    for (let f = 0; f < field.fields.length; f++) {
        const child = field.fields[f];
        obj[camelCase(child.name)] = stringToModelMap[child.type](content, _offset, child);
        _offset += getFieldStringLengthMap[child.type](child);
    }
    return obj;

}

/**
 * @param {string} content
 * @param {number} offset
 * @param {FieldGroup | FieldPIC | FieldREDEFINE | FieldCOPY} field
 */
stringToModelMap[FIELD_TYPE.GROUP] = (content, offset, field) => {
    let occurs = field.occursSize;
    
    if(occurs > 1){
        const ret = [];
        let obj = {};
        let _offset = offset;

        for(let o = 0; o < occurs ; o++){
            obj = {};
            for (let f = 0; f < field.fields.length; f++) {
                const child = field.fields[f];
                obj[camelCase(child.name)] = stringToModelMap[child.type](content, _offset, child);
                _offset += getFieldStringLengthMap[child.type](child);
            }
            ret.push(obj);
        
        }
        return ret;
    } else {
        return stringToModelGroup(content, offset, field);
    }

    // return content.substring(offset, offset + getFieldStringLengthMap[field.type](field));
};
/**
 * @param {string} content
 * @param {number} offset
 * @param {FieldGroup | FieldPIC | FieldREDEFINE | FieldCOPY} field
 */
stringToModelMap[FIELD_TYPE.REDEFINE] = (content, offset, field) => {

};
/**
 * @param {string} content
 * @param {number} offset
 * @param {FieldGroup | FieldPIC | FieldREDEFINE | FieldCOPY} field
 */
stringToModelMap[FIELD_TYPE.COPY] = (content, offset, field) => {

};

modelToStringMap[FIELD_TYPE.PIC] = () => {

};

modelToStringMap[FIELD_TYPE.GROUP] = () => {

};
modelToStringMap[FIELD_TYPE.REDEFINE] = () => {

};
modelToStringMap[FIELD_TYPE.COPY] = () => {

};

/**
 * @param {FieldPIC} field
 */
generateTypeMap[FIELD_TYPE.PIC] = (field) => {
    return  (['A', 'X'].indexOf(field.picType.toUpperCase()) != -1 ? 'string' : 'number');
};

generateTypeMap[FIELD_TYPE.GROUP] = (field) => {
    
    
    const buff = [];

    for (let c = 0; c < field.fields.length; c++) {
        const child = field.fields[c];
        
        const result = generateTypeMap[child.type](child);
        if(!result) continue;
        const occurs = child.occursSize;

        if(occurs > 1){
            buff.push(`${camelCase(child.name)}:  ${result}[]`);
        }else{
            buff.push(`${camelCase(child.name)}:  ${result}`);
        }
    }

    return [`{`, buff.join(`, `), `}`].join('');

};
generateTypeMap[FIELD_TYPE.REDEFINE] = (field) => {
    //return ` * @property {string} ${camelCase(field.name)} `;
};
generateTypeMap[FIELD_TYPE.COPY] = (field) => {
    //return ` * @property {string} ${camelCase(field.name)} `;
};


/** @param {FieldGroup | FieldPIC | FieldREDEFINE | FieldCOPY} field */
getFieldStringLengthMap[FIELD_TYPE.PIC] = (field) => {
    const occurs = field.occursSize
    return field.precisionSize * occurs;
};
/** @param {FieldGroup | FieldPIC | FieldREDEFINE | FieldCOPY} field */
getFieldStringLengthMap[FIELD_TYPE.GROUP] = (field) => {
    const occurs = field.occursSize

    let length = 0;
    for (let f = 0; f < field.fields.length; f++) {
        const child = field.fields[f];
        length+=getFieldStringLengthMap[child.type](child);
    }
    return length * occurs;
};
/** @param {FieldGroup | FieldPIC | FieldREDEFINE | FieldCOPY} field */
getFieldStringLengthMap[FIELD_TYPE.REDEFINE] = (field) => {
    throw new Error(`getFieldStringLengthMap[FIELD_TYPE.REDEFINE] is not implemented!`);
};
/** @param {FieldGroup | FieldPIC | FieldREDEFINE | FieldCOPY} field */
getFieldStringLengthMap[FIELD_TYPE.COPY] = (field) => {
    throw new Error(`getFieldStringLengthMap[FIELD_TYPE.COPY] is not implemented!`);
};


class CopybookRecord {
    /**
     * 
     * @param {Copybook} parsedBook 
     */
    constructor(parsedBook, rootName){
        this.book = parsedBook;
        this.book.name = rootName;
        this.book.type = FIELD_TYPE.GROUP;
    }
    /**
     * 
     * @param {string} recordString 
     * @returns {any}
     */
    toModel(recordString){
        const obj = {};
        let _offset = 0;
        let fieldLength;
        for (let f = 0; f < this.book.fields.length; f++) {
            const child = this.book.fields[f];
            
            if([FIELD_TYPE.REDEFINE, FIELD_TYPE.COPY].indexOf(child.type) > -1) continue;

            obj[camelCase(child.name)] = stringToModelMap[child.type](recordString, _offset, child);
            _offset += getFieldStringLengthMap[child.type](child);
        }

        return obj;
    }
    
    getJSDoc(){
        const buff = [`/** @typedef ${this.book.name} \n`];
        for (let c = 0; c < this.book.fields.length; c++) {
            const child = this.book.fields[c];
            const generated = generateTypeMap[child.type](child);
            if (!generated) continue;
            
            buff.push(` * @property {${generated}} ${camelCase(child.name)} \n`)
        }

        buff.push(` */ \n`);

        return buff.join('');

        // return [`/** @typedef ${this.book.name} `, ` * @property {${generateTypeMap[FIELD_TYPE.GROUP](this.book)}} root`, ` */`].join('\n');
    }

    toString(model){
        for (const key in model) {
            if (model.hasOwnProperty(key)) {
                const value = model[key];
                
            }
        }        
        
    }


}




if(typeof module !== "undefined") {
    module.exports = {
        CopybookRecord: CopybookRecord
    };
}

