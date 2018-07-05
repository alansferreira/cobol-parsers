function initializeCOBOLProgramParser(){
    /**
     * @typedef RegexSpec
     * @prop {RegExp} REGEX
     * @prop {string} STMT_TYPE
     * @prop {} CAP_INDEX
     * @prop {(match: RegExpExecArray, startedAtLine: Number, endedAtLine: Numbwe)} toJson
     */

     /**
      * @typedef ParsedStatement
      * @prop {string} STMT_TYPE
      * @prop {number} startedAtLine
      * @prop {number} endedAtLine
      * @prop {boolean} isDivision
      * @prop {boolean} isKeywordSection
      * @prop {boolean} isCustomSection
      */


    const regexMap = {
        // IDENTIFICATION_DIVISION: {
        //     REGEX: / {0,}IDENTIFICATION +DIVISION {0,}\./g,
        //     STMT_TYPE: 'IDENTIFICATION_DIVISION',
        //     IS_DIVISION: true,
        //     CAP_INDEX: { },
        //     toJson: (match, startedAtLine, endedAtLine) => { return { STMT_TYPE: regexMap.IDENTIFICATION_DIVISION.STMT_TYPE, startedAtLine, endedAtLine, isDivision: true }; }
        // },
        // ENVIRONMENT_DIVISION: {
        //     REGEX: / {0,}ENVIRONMENT +DIVISION {0,}\./g,
        //     STMT_TYPE: 'ENVIRONMENT_DIVISION',
        //     CAP_INDEX: { },
        //     toJson: (match, startedAtLine, endedAtLine) => { return { STMT_TYPE: regexMap.ENVIRONMENT_DIVISION.STMT_TYPE, startedAtLine, endedAtLine, isDivision: true }; }
        // },
        // DATA_DIVISION: {
        //     REGEX: / {0,}DATA +DIVISION {0,}\./g,
        //     STMT_TYPE: 'DATA_DIVISION',
        //     CAP_INDEX: { },
        //     toJson: (match, startedAtLine, endedAtLine) => { return { STMT_TYPE: regexMap.DATA_DIVISION.STMT_TYPE, startedAtLine, endedAtLine, isDivision: true }; }
        // },
        // WORKING_STORAGE_DIVISION: {
        //     REGEX: / {0,}WORKING-STORAGE +DIVISION {0,}\./g,
        //     STMT_TYPE: 'WORKING_STORAGE_DIVISION',
        //     CAP_INDEX: { },
        //     toJson: (match, startedAtLine, endedAtLine) => { return { STMT_TYPE: regexMap.WORKING_STORAGE_DIVISION.STMT_TYPE, startedAtLine, endedAtLine, isDivision: true }; }
        // },
        // PROCEDURE_DIVISION: {
        //     REGEX: / {0,}PROCEDURE +DIVISION {0,}\./g,
        //     STMT_TYPE: 'PROCEDURE_DIVISION',
        //     CAP_INDEX: { },
        //     toJson: (match, startedAtLine, endedAtLine) => { return { STMT_TYPE: regexMap.PROCEDURE_DIVISION.STMT_TYPE, startedAtLine, endedAtLine, isDivision: true }; }
        // },
        // CONFIGURATION_SECTION: {
        //     REGEX: / {0,}CONFIGURATION +SECTION {0,}\./g,
        //     STMT_TYPE: 'CONFIGURATION_SECTION',
        //     CAP_INDEX: { },
        //     toJson: (match, startedAtLine, endedAtLine) => { return { STMT_TYPE: regexMap.CONFIGURATION_SECTION.STMT_TYPE, startedAtLine, endedAtLine, isKeywordSection: true }; }
        // },
        // INPUT_OUTPUT_SECTION: {
        //     REGEX: / {0,}INPUT\-OUTPUT +SECTION {0,}\./g,
        //     STMT_TYPE: 'INPUT_OUTPUT_SECTION',
        //     CAP_INDEX: { },
        //     toJson: (match, startedAtLine, endedAtLine) => { return { STMT_TYPE: regexMap.INPUT_OUTPUT_SECTION.STMT_TYPE, startedAtLine, endedAtLine, isKeywordSection: true }; }
        // },
        FILE_CONTROL: {
            REGEX: / {0,}FILE\-CONTROL {0,}\./g,
            STMT_TYPE: 'FILE_CONTROL',
            CAP_INDEX: { },
            toJson: (match, startedAtLine, endedAtLine) => { return { STMT_TYPE: regexMap.FILE_CONTROL.STMT_TYPE, startedAtLine, endedAtLine }; }
        },
        
        DIVISION: {
            REGEX: / {0,}([a-zA-Z0-9-#]+) +DIVISION {0,}\./g,
            STMT_TYPE: 'DIVISION',
            CAP_INDEX: {
                NAME: 1
            },
            toJson: (match, startedAtLine, endedAtLine) => { 
                return { 
                    STMT_TYPE: regexMap.DIVISION.STMT_TYPE, 
                    name: match[regexMap.DIVISION.CAP_INDEX.NAME], 
                    startedAtLine, 
                    endedAtLine, 
                    isDivision: true 
                }; 
            }
        },
        SECTION: {
            REGEX: / {0,}([a-zA-Z0-9-#]+) +SECTION {0,}\./g,
            STMT_TYPE: 'SECTION',
            CAP_INDEX: { 
                NAME: 1 
            },
            toJson: (match, startedAtLine, endedAtLine) => { 
                return { 
                    STMT_TYPE: regexMap.SECTION.STMT_TYPE, 
                    name: match[regexMap.SECTION.CAP_INDEX.NAME], 
                    startedAtLine, 
                    endedAtLine
                }; 
            }
        },

        COPY: {
            REGEX: / COPY {1,}(\'([^ ]+)\')?([^ ]+)? ?\./g,
            STMT_TYPE: 'COPY',
            CAP_INDEX: { 
                HARD_CODE_COPY_SOURCE: 2,
                VARIABLE_COPY_SOURCE: 3,
            },
            toJson: (match, startedAtLine, endedAtLine)=>{
                return {
                    STMT_TYPE: regexMap.COPY.STMT_TYPE,
                    hardCodeCopySource: match[regexMap.COPY.CAP_INDEX.HARD_CODE_COPY_SOURCE],
                    variableCopySource: match[regexMap.COPY.CAP_INDEX.VARIABLE_COPY_SOURCE],
                    startedAtLine, endedAtLine,
                }
            }
        },
        EXEC_CICS: {
            REGEX: / EXEC {1,}CICS {1,}LINK {1,}(PROGRAM {1,}\(([^\)]+)\))?.+ {1,}END\-EXEC/g,
            STMT_TYPE: 'EXEC_CICS',
            CAP_INDEX: { 
                PROGRAM_NAME: 2,
            },
            toJson: (match, startedAtLine, endedAtLine)=>{
                return {
                    STMT_TYPE: regexMap.EXEC_CICS.STMT_TYPE,
                    programName: match[regexMap.EXEC_CICS.CAP_INDEX.PROGRAM_NAME],
                    startedAtLine, endedAtLine,
                }
            }
        },
        EXEC_SQL: {
            REGEX: / EXEC {1,}SQL {1,}(INCLUDE {1,}([^ )]+))?(.+) {1,}END\-EXEC/g,
            STMT_TYPE: 'EXEC_SQL',
            CAP_INDEX: { 
                INCLUDE_NAME: 2,
                SQL_STATEMENT: 3,
            },
            toJson: (match, startedAtLine, endedAtLine)=>{
                return {
                    STMT_TYPE: regexMap.EXEC_SQL.STMT_TYPE,
                    include: match[regexMap.EXEC_SQL.CAP_INDEX.INCLUDE_NAME],
                    sqlStatement: match[regexMap.EXEC_SQL.CAP_INDEX.SQL_STATEMENT],
                    startedAtLine, endedAtLine,
                }
            }
        },

        CALL_PROGRAM: {
            REGEX: / CALL[ ]{1,}('([a-zA-Z0-9-#]+)')?([a-zA-Z0-9-#]+)?( {1,}USING {1,}([a-zA-Z0-9-#']+))?/g,
            STMT_TYPE: 'CALL_PROGRAM',
            CAP_INDEX: { 
                HARD_CODE_PROGRAM_NAME: 2,
                VARIABLE_PROGRAM_NAME: 3,
                USING: 5
            },
            toJson: (match, startedAtLine, endedAtLine)=>{
                return {
                    STMT_TYPE: regexMap.CALL_PROGRAM.STMT_TYPE,
                    hardCodeProgramName: match[regexMap.CALL_PROGRAM.CAP_INDEX.HARD_CODE_PROGRAM_NAME],
                    variableProgramName: match[regexMap.CALL_PROGRAM.CAP_INDEX.VARIABLE_PROGRAM_NAME],
                    usingData: match[regexMap.CALL_PROGRAM.CAP_INDEX.USING],
                    startedAtLine, endedAtLine,
                }
            }
        }
    };

    var regexSpecs = [];
    for (const key in regexMap) {
        if (regexMap.hasOwnProperty(key)) {
            const regexSpec = regexMap[key];
            regexSpecs.push(regexSpec);
        }
    }



    function* getStatemantIterator(content){
        const lines = content.replace(/\r\n/g,'\n').replace(/\n\n/g,'\n').split('\n');
        var statement = '';
        var startedAtLine;
        for (let l = 0; l < lines.length; l++) {
            
            const line = '' + lines[l].padEnd(72, ' ').substr(0, 72).replace(/ +$/g, ''); //rtrim
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

    /**
     * Return multiple statements match because IF statements can be long 
     * @param {string} stmt 
     * @returns {ParsedStatement[]} return an yield for multiples match statements
     */
    function parseStatemant(stmt, startedAtLine, endedAtLine, matchFilters){
        const parsedStatements = [];
        

        for (let m = 0; m < matchFilters.length; m++) {
            const regexSpec = matchFilters[m];
            const regex = regexSpec.REGEX;
            if( !regex.test(stmt) ) continue;
            
            parsedStatements.push(...fetchAllMarches(regexSpec, stmt, startedAtLine, endedAtLine));
        
        }
        
        return parsedStatements;
    }
    /**
     * 
     * @param {RegexSpec} regexSpec 
     * @param {string} statement 
     */
    function fetchAllMarches(regexSpec, stmt, startedAtLine, endedAtLine){
        var regex = regexSpec.REGEX;
        var parsedStatements = [];
        regex.test(stmt);
        var m;
        while ((m = regex.exec(stmt)) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (m.index === regex.lastIndex) regex.lastIndex++;
            
            parsedStatements.push(regexSpec.toJson(m, startedAtLine, endedAtLine));
        }
        return parsedStatements;
    }

    /**
     * @typedef ParseOptions
     * @prop {RegexSpec[]} filters filters to extract information, default is all
     * 
     */
    
    /**
     * 
     * @param {string} content full program cobol 
     * @param {ParseOptions} options 
     */
    function parseProgram(content, options){
        var sttIterator = getStatemantIterator(content);
        var iteratee = {done: false};
        var statements = [];

        var program = {
            divisions: [],
            statements: []
        };
        var currentDivision;
        var currentSection;

        const opt = (options || {filters: regexSpecs});


        while( iteratee.done == false ){
            iteratee = sttIterator.next();
            if(iteratee.value === undefined) continue;
            
            var {statement, startedAtLine, endedAtLine} = iteratee.value;
            
            var parsedStatements = parseStatemant(statement, startedAtLine, endedAtLine, opt.filters);
            if(!parsedStatements || parsedStatements.length == 0) continue;
            

            if(parsedStatements[0].STMT_TYPE==regexMap.DIVISION.STMT_TYPE){
                currentDivision = Object.assign({ sections: [], statements: []}, parsedStatements[0]);
                program.divisions.push(currentDivision);
                continue;
            }
            if(parsedStatements[0].STMT_TYPE==regexMap.SECTION.STMT_TYPE){
                currentSection = Object.assign({ statements: [] }, parsedStatements[0]);
                currentDivision.sections.push(currentSection);
                continue;
            }

            (currentSection || currentDivision || program).statements.push( ...parsedStatements );
            
        }
        
        return program;
    }
    
    var cobol_program = {
        parseProgram, 
        parseFilters: regexMap,
        getStatemantIterator,
    };
    
   return cobol_program;
};

if(typeof module !== "undefined") {
    module.exports = initializeCOBOLProgramParser();
}
