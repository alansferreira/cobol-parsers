function initializeJCLParser(){
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
      */

    /**
     * @typedef ParsedJobCommand
     * @prop {string} STMT_TYPE
     * @prop {number} startedAtLine
     * @prop {number} endedAtLine
     * @prop {string} labelName
     * @prop {string} command
     * @prop {string} commandArgs
     * @prop {any[]} args
     */

    const regexMap = {
        JOB_COMMAND: {
            REGEX: /^([a-zA-Z0-9#$%]+)[ ]{1,}JOB[ ]{0,}\(?([a-zA-Z0-9#-]+)\)?,?(\'([a-zA-Z0-9#\#\- ]+)\'),?(.+)/gi,
            STMT_TYPE: 'JOB_COMMAND',
            CAP_INDEX: {
                LABEL_NAME: 1,
                JOB_NAME: 2,
                PROGRAMER_NAME: 4,
                COMMAND_ARGS: 5
            },
            toJson: (match, startedAtLine, endedAtLine) => { 
                const json = { 
                    STMT_TYPE: regexMap.JOB_COMMAND.STMT_TYPE, 
                    labelName: match[regexMap.GENERIC_COMMAND.CAP_INDEX.LABEL_NAME], 
                    jobName: match[regexMap.JOB_COMMAND.CAP_INDEX.JOB_NAME], 
                    programerName: match[regexMap.JOB_COMMAND.CAP_INDEX.PROGRAMER_NAME], 
                    commandArgs: match[regexMap.JOB_COMMAND.CAP_INDEX.COMMAND_ARGS], 
                    startedAtLine, 
                    endedAtLine, 
                }; 

                // for (const key in regexMap.JOB_COMMAND.PARAMS) {
                //     if (!regexMap.JOB_COMMAND.PARAMS.hasOwnProperty(key)) continue ;
                    
                //     const subExpr = regexMap.JOB_COMMAND.PARAMS[key];
                //     const fetched = fetchAllMarches(subExpr,json.commandArgs).filter((s)=> s !== undefined && s !== null);
                //     if(!fetched || !fetched.length) continue;
                    
                //     json.parsedArgs.push(...fetched);
                // }
            
                return json; 

            }
        },
        GENERIC_COMMAND: {
            REGEX: /^([a-zA-Z0-9#$%]+)[ ]{1,}([a-zA-Z]+)[ ]{1,}(.+)/gi,
            STMT_TYPE: 'GENERIC_COMMAND',
            CAP_INDEX: {
                LABEL_NAME: 1,
                COMMAND: 2,
                COMMAND_ARGS: 3
            },
            /** 
             * @returns {ParsedJobCommand} 
             */
            toJson: (match, startedAtLine, endedAtLine) => { 
                const json = { 
                    STMT_TYPE: match[regexMap.GENERIC_COMMAND.CAP_INDEX.COMMAND], 
                    labelName: match[regexMap.GENERIC_COMMAND.CAP_INDEX.LABEL_NAME], 
                    command: match[regexMap.GENERIC_COMMAND.CAP_INDEX.COMMAND], 
                    commandArgs: match[regexMap.GENERIC_COMMAND.CAP_INDEX.COMMAND_ARGS], 
                    startedAtLine, 
                    endedAtLine,
                    parsedArgs: {}
                };
                
                for (const key in regexMap.GENERIC_COMMAND.PARAMS) {
                    if (!regexMap.GENERIC_COMMAND.PARAMS.hasOwnProperty(key)) continue ;
                    
                    const subExpr = regexMap.GENERIC_COMMAND.PARAMS[key];
                    const fetched = fetchAllMarches(subExpr,json.commandArgs).filter((s)=> s !== undefined && s !== null);
                    if(!fetched || !fetched.length) continue;
                    
                    fetched.map((f) => {
                        json.parsedArgs[f.name] = f.value;    
                    });
                }
            


                return json; 
            },
            PARAMS: {
                GENERIC_SIMPLE: {
                    REGEX: /,?([a-zA-Z]+)=([a-zA-Z/.0-9/*]+)/gi,
                    STMT_TYPE: 'GENERIC_SIMPLE',
                    CAP_INDEX: { NAME: 1, VALUE: 2 },
                    toJson: (match) => {
                        const capIndex = regexMap.GENERIC_COMMAND.PARAMS.GENERIC_SIMPLE.CAP_INDEX;
                        const ret = {};
                        ret.name = match[capIndex.NAME];
                        ret.value = match[capIndex.VALUE];
                        return ret;
                    }
                },
                GENERIC_MULTIPLE: {
                    REGEX: /,?([a-zA-Z]+)=(\(([^\)]+)\)|([^\(\)]+))/gi,
                    STMT_TYPE: 'GENERIC_MULTIPLE',
                    CAP_INDEX: { NAME: 1, COMPLEX_VALUES: 3, SIMPLE_VALUE: 4 },
                    toJson: (match) => {
                        const capIndex = regexMap.GENERIC_COMMAND.PARAMS.GENERIC_MULTIPLE.CAP_INDEX;
                        const ret = {};
                        
                        const args = (match[capIndex.COMPLEX_VALUES] 
                            || match[capIndex.SIMPLE_VALUE]);
                        
                        try {
                            ret.name = match[capIndex.NAME];
                            ret.value = args.replace(/[ ]{0,},?[ ]{0,}([a-zA-Z]+)/gi, '$1,').split(',');
                        } catch (error) {
                            console.error(error);
                        }
                    }
                },

                GENERIC_MLTI_PAIR_VALUES: {
                    REGEX: /,?([a-zA-Z]+)=\(([a-zA-Z0-9]+=[a-zA-Z0-9\#\$\%\'][^\)]+)\)/gi,
                    STMT_TYPE: 'GENERIC_MLTI_PAIR_VALUES',
                    CAP_INDEX: { NAME: 1, ARGS: 2 },
                    toJson: (match) => {
                        const capIndex = regexMap.GENERIC_COMMAND.PARAMS.GENERIC_MLTI_PAIR_VALUES.CAP_INDEX;
                        const args = match[capIndex.ARGS];
                        const ret = {};
                        const values = {};

                        args
                        .replace(/,?([a-zA-Z]+)=([a-zA-Z0-9\#\$]+)/gi, '$1:$2\n')
                        .split('\n')
                        .map((p) => {
                            values[p.split(':')[0]] = p.split(':')[1];
                        });
                        
                        ret[match[capIndex.NAME]] = values;
                        return ret;
                    }
                },
            },
        },
    };

    var regexSpecs = [];
    for (const key in regexMap) {
        if (regexMap.hasOwnProperty(key)) {
            const regexSpec = regexMap[key];
            regexSpecs.push(regexSpec);
        }
    }



    function* getStatementIterator(content){
        const lines = content.replace(/\r\n/g,'\n').split('\n');
        var statement = '';
        var startedAtLine;

        function getUtilLine(line){
            return line.padEnd(72, ' ').substr(0, 72).replace(/ +$/g, ''); //rtrim
        }

        for (let l = 0; l < lines.length; l++) {
            
            const line = '' + getUtilLine(lines[l]);
            if(line.length < 7) continue;
            if(line.substr(2, 1) === '*') continue;

            if(statement == '') startedAtLine = l + 1;
            statement += line.substring(2).replace(/^ +/g, '');

            if(l + 2 < lines.length && getUtilLine(lines[l+1]).startsWith('//         ')) continue;

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
            regex.lastIndex = -1;
            if( !regex.test(stmt) ) continue;
            
            const fetched = fetchAllMarches(regexSpec, stmt, startedAtLine, endedAtLine).filter((s)=> s !== undefined && s !== null);
            if(!fetched || !fetched.length) continue;
            
            parsedStatements.push(...fetched);
        
            return parsedStatements;
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
        regex.lastIndex = 0;
        
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
    function parseJob(content, options){
        var sttIterator = getStatementIterator(content);
        var iteratee = {done: false};
        var statements = [];

        var job = {
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
            

            job.statements.push( ...parsedStatements );
            
        }
        
        return job;
    }
    
    function extractReferences(parsedJob){
        const statements = [];
        const result = {};

        const pushRecursive = (o)=> {
            statements.push(...o.statements);
            // if(o.divisions) o.divisions.map(pushRecursive);
            // if(o.sections) o.sections.map(pushRecursive);
        };
        pushRecursive(parsedJob);    
        
        const stmtToRef ={
            'JOB_COMMAND': (stmt) => {
                return {
                    type: 'job',
                    startedAtLine: stmt.startedAtLine,
                    reference: {
                        jobName: stmt.jobName,
                        programerName: stmt.programerName
                    }
                };
            },
            'DD': (stmt) => {
                return {
                    type: 'dd',
                    startedAtLine: stmt.startedAtLine,
                    reference: {
                        datasetName: (stmt.parsedArgs.DSN || stmt.parsedArgs.DSNANE)
                    }
                };
            },
            'EXEC': (stmt) => {
                return {
                    type: 'program',
                    startedAtLine: stmt.startedAtLine,
                    reference: {
                        program: (stmt.parsedArgs.PGM || stmt.commandArgs)
                    }
                };
            },
        };

        statements.map((stmt) => {
            const convertFn = (stmtToRef[stmt.STMT_TYPE] || stmtToRef['default']);
            if(!convertFn) return ;

            let ref = convertFn(stmt);

            if(!result[ref.type]) result[ref.type] = [];
            result[ref.type].push(ref);
        });

        return result;
    }
    
    var cobol_program = {
        parseJob, 
        parseFilters: regexMap,
        getStatementIterator,
        extractReferences
    };
    
   return cobol_program;
};

if(typeof module !== "undefined") {
    module.exports = initializeJCLParser();
}
