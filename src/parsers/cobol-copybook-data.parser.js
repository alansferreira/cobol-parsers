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
    return content.substring(offset, offset + getFieldStringLengthMap[field.type](field));
};

/**
 * @param {string} content
 * @param {number} offset
 * @param {FieldGroup | FieldPIC | FieldREDEFINE | FieldCOPY} field
 */
function stringToModelGroup(content, offset, field){
    /** @type {teste} */
    const obj = {};

    let _offset = offset;

    console.log(`/** @typedef ${camelCase(field.name)}`);
    for (let f = 0; f < field.fields.length; f++) {
        const child = field.fields[f];
        child._stringLength = getFieldStringLengthMap[child.type](child);
        obj[child.name] = stringToModelMap[child.type](content, _offset, child);
        _offset += child._stringLength;

        if(child.type==FIELD_TYPE.GROUP){
            console.log(` * @property {${camelCase(child.name)}} ${camelCase(child.name)}`);
        }else{
            console.log(` * @property {*} ${camelCase(child.name)}`);
        }

    }
    console.log(`*/`);
    return obj;

}

/**
 * @param {string} content
 * @param {number} offset
 * @param {FieldGroup | FieldPIC | FieldREDEFINE | FieldCOPY} field
 */
stringToModelMap[FIELD_TYPE.GROUP] = (content, offset, field) => {
    let occurs = getOccursLength(field);
    
    
    if(occurs < 2){
        return stringToModelGroup(content, offset, field);
    } else {
        const ret = [];
        const obj = {};
        const fieldLength = getFieldStringLengthMap[field.type](field);
        let _offset = offset;

        for(let o = 0; o < occurs ; o++){
            obj = stringToModelGroup(content, offset, field);
            ret.push(obj);
            _offset += fieldLength;
        }
        return ret;
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
        const occurs = getOccursLength(child);

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
    return field.size;
};
/** @param {FieldGroup | FieldPIC | FieldREDEFINE | FieldCOPY} field */
getFieldStringLengthMap[FIELD_TYPE.GROUP] = (field) => {
    let length = 0;
    for (let f = 0; f < field.fields.length; f++) {
        const child = field.fields[f];
        length+=getFieldStringLengthMap[child.type](child);
    }
    return length;
};
/** @param {FieldGroup | FieldPIC | FieldREDEFINE | FieldCOPY} field */
getFieldStringLengthMap[FIELD_TYPE.REDEFINE] = (field) => {
    throw new Error(`getFieldStringLengthMap[FIELD_TYPE.REDEFINE] is not implemented!`);
};
/** @param {FieldGroup | FieldPIC | FieldREDEFINE | FieldCOPY} field */
getFieldStringLengthMap[FIELD_TYPE.COPY] = (field) => {
    throw new Error(`getFieldStringLengthMap[FIELD_TYPE.COPY] is not implemented!`);
};

/**
 * 
 * @param {FieldGroup | FieldPIC | FieldREDEFINE | FieldCOPY} item 
 */
function getOccursLength(item){
    var occurs = {
        max: parseInt((item.occurs_max | 0)),
        min: parseInt((item.occurs_min | 0))
    };
    if(occurs.max < occurs.min) return occurs.min;
    return (occurs.max - occurs.min | 1);
}


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

        for (let f = 0; f < this.book.fields.length; f++) {
            const child = this.book.fields[f];
            
            if([FIELD_TYPE.REDEFINE, FIELD_TYPE.COPY].indexOf(child.type) > -1) continue;

            child._stringLength = getFieldStringLengthMap[child.type](child);
            obj[child.name] = stringToModelMap[child.type](recordString, _offset, child);
            _offset += child._stringLength;
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

