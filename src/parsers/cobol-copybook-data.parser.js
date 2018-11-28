const decamelize = require('decamelize');
const camelCase = require('camelcase');
const { Copybook, FieldPIC, FieldREDEFINE, FieldCOPY, FIELD_TYPE, PIC_TYPE } = require('./cobol-copybook.parser');
const fs = require('fs');
const { Readable } = require('stream');


const stringToModelMap = {};
const modelToStringMap = {};
const getFieldStringLengthMap = {};
const generateTypeMap = {};
const picToPrimitiveMap = {};

/**
 * @param {string} content
 * @param {number} offset
 * @param {FieldPIC | FieldREDEFINE | FieldCOPY} field
 */
stringToModelMap[FIELD_TYPE.PIC] = (content, offset, field) => {
    let occurs = field.occursSize;
    const hasOccurs = !!(occurs > 1);
    const hasChildren = !!(field.fields && field.fields.length);

    const arr = [];
    const obj = {};
    let _offset = offset;
    
    if(!hasChildren && !hasOccurs){
        return picToPrimitiveMap[field.picType](content.slice(_offset, _offset + field.precisionSize), field);
    }

    if(hasChildren && !hasOccurs ){
        for (let f = 0; f < field.fields.length; f++) {
            const child = field.fields[f];
            obj[camelCase(child.name)] = stringToModelMap[child.type](content, _offset, child);
            _offset += getFieldStringLengthMap[child.type](child);
        }
        return obj;
    }
    
    if(!hasChildren && hasOccurs ){
        let value;
        for(let o = 0; o < occurs ; o++){
            value = picToPrimitiveMap[field.picType](content.slice(_offset, _offset + field.precisionSize), field);
            arr.push(value);
            _offset += field.precisionSize;
        }
        return arr;
    }

    if(hasChildren && hasOccurs){
        for(let o = 0; o < occurs ; o++){
            for (let f = 0; f < field.fields.length; f++) {
                const child = field.fields[f];
                obj[camelCase(child.name)] = stringToModelMap[child.type](content, _offset, child);
                _offset += getFieldStringLengthMap[child.type](child);
            }
            arr.push(obj);
        }
        return arr;
    }


    // if( !hasChildren && hasOccurs){
    //     for (let f = 0; f < field.fields.length; f++) {
    //         const child = field.fields[f];
    //         arr.push(stringToModelMap[child.type](content, _offset, child));
    //         _offset += getFieldStringLengthMap[child.type](child);
            
    //     }
    // }


    // if(occurs > 1){
    //     const ret = [];
    //     let obj = {};
    //     let _offset = offset;
    //     if(field.fields && field.fields.length){
    //         for(let o = 0; o < occurs ; o++){
    //             obj = {};
    //             for (let f = 0; f < field.fields.length; f++) {
    //                 const child = field.fields[f];
    //                 obj[camelCase(child.name)] = stringToModelMap[child.type](content, _offset, child);
    //                 _offset += getFieldStringLengthMap[child.type](child);
    //             }
    //             ret.push(obj);
    //         }
    //     }else{
    //         for (let o = 0; o < occurs; o++) {
    //             value = picToPrimitiveMap[field.picType](content.substr(_offset, field.precisionSize), field);
    //             ret.push(value);
    //             _offset += field.precisionSize;
    //         }
    //         return ret;
    //     }
    //     return ret;
    // } else {
    //     if(field.fields && field.fields.length){
    //         return stringToModelGroup(content, offset, field);
    //     }else{
    //         return picToPrimitiveMap[field.picType](content.substr(offset, field.precisionSize), field);

    //     }
    // }


    // const occurs = field.occursSize;
    // let value;

    // if(occurs > 1){
    //     const ret = [];
    //     let _offset = offset;
    //     for (let o = 0; o < occurs; o++) {
    //         value = picToPrimitiveMap[field.picType](content.substr(_offset, field.precisionSize), field);
    //         ret.push(value);
    //         _offset += field.precisionSize;
    //     }
    //     return ret;
    // }else{
    //     value = picToPrimitiveMap[field.picType](content.substr(offset, field.precisionSize), field);
    //     return value;
    // }
};
/**
 * @param {string} content
 * @param {FieldPIC} field
 */
picToPrimitiveMap[PIC_TYPE.ALPHANUMERIC] = (content, field) => content.replace(/\s+$/, '')

/**
 * @param {string} content
 * @param {FieldPIC} field
 */
picToPrimitiveMap[PIC_TYPE.ALPHABETIC] = (content, field) => content.replace(/\s+$/, '')

/**
 * @param {string} content
 * @param {FieldPIC} field
 */
picToPrimitiveMap[PIC_TYPE.POSITIVE_NUMBER] = (content, field) => {
    return content.replace(/\s+$/, '');
}
/**
 * @param {string} content
 * @param {FieldPIC} field
 */
picToPrimitiveMap[PIC_TYPE.NEGATIVE_NUMBER] = (content, field) => {
    return content.replace(/\s+$/, '');
}
/**
 * @param {string} content
 * @param {FieldPIC} field
 */
picToPrimitiveMap[PIC_TYPE.SIGNED_NUMBER] = (content, field) => {
    return content.replace(/\s+$/, '');
}
/**
 * @param {string} content
 * @param {FieldPIC} field
 * @returns {number}
 */
picToPrimitiveMap[PIC_TYPE.NUMERIC] = (content, field) => {
    if(!content) return 0;
    
    const decimalsLength = field.decimalsType_2 | (field.decimalsType_1.length-1);

    if(decimalsLength > 0) {
        const int = content.slice(0,content.length - decimalsLength);
        const dec = content.slice(content.length - decimalsLength, content.length);
        return Number.parseFloat(int + '.' + dec);
    }else{
        return Number.parseInt(content);
    }

}


/**
 * @param {string} content
 * @param {number} offset
 * @param {FieldPIC | FieldREDEFINE | FieldCOPY} field
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
 * @param {FieldPIC | FieldREDEFINE | FieldCOPY} field
 */
stringToModelMap[FIELD_TYPE.REDEFINE] = (content, offset, field) => {

};
/**
 * @param {string} content
 * @param {number} offset
 * @param {FieldPIC | FieldREDEFINE | FieldCOPY} field
 */
stringToModelMap[FIELD_TYPE.COPY] = (content, offset, field) => {

};

modelToStringMap[FIELD_TYPE.PIC] = () => {

};

modelToStringMap[FIELD_TYPE.REDEFINE] = () => {

};
modelToStringMap[FIELD_TYPE.COPY] = () => {

};

/**
 * @param {FieldPIC} field
 */
generateTypeMap[FIELD_TYPE.PIC] = (field) => {
    if(!field.fields || !field.fields.length){
        return  (['A', 'X'].indexOf(field.picType.toUpperCase()) != -1 ? 'string' : 'number');
    }

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


/** @param {FieldPIC | FieldREDEFINE | FieldCOPY} field */
getFieldStringLengthMap[FIELD_TYPE.PIC] = (field) => {
    const occurs = field.occursSize
    if(!field.fields || !field.fields.length){
        return field.precisionSize * occurs;
    }

    let length = 0;
    for (let f = 0; f < field.fields.length; f++) {
        const child = field.fields[f];
        length+=getFieldStringLengthMap[child.type](child);
    }
    return length * occurs;

};
/** @param {FieldPIC | FieldREDEFINE | FieldCOPY} field */
getFieldStringLengthMap[FIELD_TYPE.REDEFINE] = (field) => {
    throw new Error(`getFieldStringLengthMap[FIELD_TYPE.REDEFINE] is not implemented!`);
};
/** @param {FieldPIC | FieldREDEFINE | FieldCOPY} field */
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

