
function initializeCOBOLIterators() {
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
    
    return {
        getStatemantIterator: getStatemantIterator
    };

}

if(typeof module !== "undefined") {
    module.exports = initializeCOBOLIterators();
}

