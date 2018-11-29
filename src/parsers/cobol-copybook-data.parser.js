const decamelize = require('decamelize');
const camelCase = require('camelcase');
const { Copybook, FieldPIC, FieldREDEFINE, FieldCOPY, FIELD_TYPE, PIC_TYPE } = require('./cobol-copybook.parser');
const fs = require('fs');
const { Readable } = require('stream');


/**
 * @param {string} content
 * @param {number} offset
 * @param {FieldPIC | FieldREDEFINE | FieldCOPY} field
 */
function picToModel (content, offset, field) {
    const occurs = field.occursSize;
    const hasOccurs = !!(occurs > 1);
    const hasChildren = !!(field.fields && field.fields.length);

    let _offset = offset;
    
    if(!hasChildren && !hasOccurs) return  picToPrimitive(content.slice(_offset, _offset + field.precisionSize), field);
    
    const arr = [];
    const obj = {};
    if(hasChildren && !hasOccurs ){
        for (let f = 0; f < field.fields.length; f++) {
            const child = field.fields[f];
            obj[camelCase(child.name)] = picToModel(content, _offset, child);
            _offset += getPicRecordLength(child);
        }
        return obj;
    }
    
    if(!hasChildren && hasOccurs ){
        let value;
        for(let o = 0; o < occurs ; o++){
            value =  picToPrimitive(content.slice(_offset, _offset + field.precisionSize), field);
            arr.push(value);
            _offset += field.precisionSize;
        }
        return arr;
    }

    if(hasChildren && hasOccurs){
        for(let o = 0; o < occurs ; o++){
            for (let f = 0; f < field.fields.length; f++) {
                const child = field.fields[f];
                obj[camelCase(child.name)] = picToModel(content, _offset, child);
                _offset += getPicRecordLength(child);
            }
            arr.push(obj);
        }
        return arr;
    }
};



const picToPrimitiveHandlers = {};
const picToPrimitiveNumericHandler = picToPrimitiveHandlers[PIC_TYPE.NUMERIC] = (content, field) => {
    if(!content) return 0;
    
    const decimalsLength = field.decimalsType_2 | (field.decimalsType_1.length-1);

    if(decimalsLength > 0) {
        const int = content.slice(0,content.length - decimalsLength);
        const dec = content.slice(content.length - decimalsLength, content.length);
        return Number.parseFloat(int + '.' + dec);
    }else{
        return Number.parseInt(content);
    }

};
const picToPrimitiveAlphaHandler = picToPrimitiveHandlers[PIC_TYPE.ALPHABETIC] = picToPrimitiveHandlers[PIC_TYPE.ALPHANUMERIC] = (content, field) => {
    return content.replace(/\s+$/, '');
};
picToPrimitiveHandlers[PIC_TYPE.POSITIVE_NUMBER] = (content, field) => picToPrimitiveNumericHandler(content, field);
picToPrimitiveHandlers[PIC_TYPE.NEGATIVE_NUMBER] = (content, field) => picToPrimitiveNumericHandler(content, field);
picToPrimitiveHandlers[PIC_TYPE.SIGNED_NUMBER] = (content, field) => picToPrimitiveNumericHandler(content, field);

/**
 * @param {string} content
 * @param {FieldPIC} field
 */
function picToPrimitive(content, field){
    return picToPrimitiveHandlers[field.picType](content, field);
}


/**
 * @param {string} content
 * @param {number} offset
 * @param {FieldPIC | FieldREDEFINE | FieldCOPY} field
 */
function redefinesToModel(content, offset, field) {

};
/**
 * @param {string} content
 * @param {number} offset
 * @param {FieldPIC | FieldREDEFINE | FieldCOPY} field
 */
function copyToModel(content, offset, field){

};



/** @param {FieldPIC | FieldREDEFINE | FieldCOPY} field */
function getPicRecordLength(field){
    const occurs = field.occursSize
    if(!field.fields || !field.fields.length){
        return field.precisionSize * occurs;
    }

    let length = 0;
    for (let f = 0; f < field.fields.length; f++) {
        const child = field.fields[f];
        length+=getPicRecordLength(child);
    }
    return length * occurs;

};

/** @param {FieldPIC | FieldREDEFINE | FieldCOPY} field */
function getRedefinesRecordLength(field){
    throw new Error(`getFieldStringLengthMap[FIELD_TYPE.REDEFINE] is not implemented!`);
};
/** @param {FieldPIC | FieldREDEFINE | FieldCOPY} field */
function getCopyRecordLength(field){
    throw new Error(`getFieldStringLengthMap[FIELD_TYPE.COPY] is not implemented!`);
};




const primitiveToPicHandlers = {};
const primitiveToPicNumericHandler = primitiveToPicHandlers[PIC_TYPE.NUMERIC] = (value, field) => {
    if(!value) return '';
    
    const decimalsLength = field.decimalsType_2 | (field.decimalsType_1.length-1);

    // if(decimalsLength > 0) {
    const fixedDigits = Number.parseFloat(value).toFixed(decimalsLength || 0).replace('.', '');

    return ('0'.repeat(field.precisionSize - fixedDigits.length) + fixedDigits);
    // }else{
    //     return Number.parseInt(value);
    // }

};
const primitiveToPicAlphaHandler = primitiveToPicHandlers[PIC_TYPE.ALPHABETIC] = primitiveToPicHandlers[PIC_TYPE.ALPHANUMERIC] = (content, field) => {
    const trimmedContent = (content || '').slice(0, field.precisionSize);
    return (trimmedContent + ' '.repeat(field.precisionSize - trimmedContent.length));
};
primitiveToPicHandlers[PIC_TYPE.POSITIVE_NUMBER] = (content, field) => primitiveToPicNumericHandler(content, field);
primitiveToPicHandlers[PIC_TYPE.NEGATIVE_NUMBER] = (content, field) => primitiveToPicNumericHandler(content, field);
primitiveToPicHandlers[PIC_TYPE.SIGNED_NUMBER] = (content, field) => primitiveToPicNumericHandler(content, field);

/**
 * @param {string} value
 * @param {FieldPIC} field
 */
function primitiveToPic(value, field){
    return primitiveToPicHandlers[field.picType](value, field);
}

function modelToString(model, field){
    let occurs = field.occursSize;
    const hasOccurs = !!(occurs > 1);
    const hasChildren = !!(field.fields && field.fields.length);

    const result = [];
    
    if(!hasChildren && !hasOccurs){
        return primitiveToPic(model, field);
    }

    if(hasChildren && !hasOccurs ){
        
        for (let f = 0; f < field.fields.length; f++) {
            const child = field.fields[f];
            result.push(modelToString(model[camelCase(child.name)], child));
        }
        return result.join('');
    }
    
    if(!hasChildren && hasOccurs ){
        for(let o = 0; o < occurs ; o++){
            result.push(primitiveToPic(model[o], field));
        }
        return result.join('');
    }

    if(hasChildren && hasOccurs){
        let currentModel = {};
        for(let o = 0; o < occurs ; o++){
            currentModel = model[o];
            for (let f = 0; f < field.fields.length; f++) {
                const child = field.fields[f];
                result.push(modelToString(currentModel[camelCase(child.name)], child));
            }
        }
        return result.join('');
    }
}

class CopybookRecord {
    /**
     * 
     * @param {Copybook} parsedBook 
     */
    constructor(parsedBook, rootName){
        this.book = parsedBook;
        this.book.name = rootName;
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

            obj[camelCase(child.name)] = picToModel(recordString, _offset, child);
            _offset += getPicRecordLength(child);
        }

        return obj;
    }
    
    getJSDoc(){
        const buff = [`/** @typedef ${this.book.name} \n`];
        for (let c = 0; c < this.book.fields.length; c++) {
            const child = this.book.fields[c];
            const generated = JsDoc.picToJSDoc(child);
            if (!generated) continue;
            if(child.occursSize > 1){
                buff.push(` * @property {${generated}[]} ${camelCase(child.name)} \n`)
            }else{
                buff.push(` * @property {${generated}} ${camelCase(child.name)} \n`)
            }
        }

        buff.push(` */ \n`);

        return buff.join('');

    }

    toString(model){
        const result = [];
        for (let f = 0; f < this.book.fields.length; f++) {
            const child = this.book.fields[f];
            
            if([FIELD_TYPE.REDEFINE, FIELD_TYPE.COPY].indexOf(child.type) > -1) continue;

            result.push(modelToString(model[camelCase(child.name)], child));
        }

        return result.join('');
    }

}

class JsDoc {
    /**
     * @param {FieldPIC} field
     */
    static picToJSDoc(field) {
        if(!field.fields || !field.fields.length){
            return  (['A', 'X'].indexOf(field.picType.toUpperCase()) != -1 ? 'string' : 'number');
        }

        const buff = [];

        for (let c = 0; c < field.fields.length; c++) {
            const child = field.fields[c];
            
            const result = JsDoc.picToJSDoc(child);
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

    static redefinesToJSDoc(field) {
        //return ` * @property {string} ${camelCase(field.name)} `;
    };
    static copyToJSDoc(field) {
        //return ` * @property {string} ${camelCase(field.name)} `;
    };

}



if(typeof module !== "undefined") {
    module.exports = {
        CopybookRecord: CopybookRecord
    };
}

