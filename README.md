# cobol-parsers

## Usage

> npm i cobol-parsers

```js
var fs = require('fs');
const parsers = require('cobol-parsers');

var jclScript = new String(fs.readFileSync('./test/JOBSPL01L.JCL'));
var jclParsed = parsers.jcl.parseJob(jclScript);

var cobolProgram = new String(fs.readFileSync('./test/CCP0001.CBL'));
var cobolParsed = parsers.cobol.parseJob(cobolProgram);


```

### Output JCL sample
```json
{
  "statements": [
    {
      "STMT_TYPE": "JOB",
      "labelName": 1,
      "command": "JOB",
      "commandArgs": "(META007),'PAWAN Y',CLASS=A,MSGCLASS=L,MSGLEVEL=(1,1),TIME=1440,NOTIFY=&SYSUID",
      "startedAtLine": 1,
      "endedAtLine": 2,
      "parsedArgs": [
        {
          "CLASS": "A"
        },
        {
          "MSGCLASS": "L"
        },
        {
          "TIME": "1440"
        }
      ]
    },
    {
      "STMT_TYPE": "DD",
      "labelName": 1,
      "command": "DD",
      "commandArgs": "DSN=MTHUSER.MY.LOADLIB,DISP=SHR",
      "startedAtLine": 4,
      "endedAtLine": 4,
      "parsedArgs": [
        {
          "DSN": "MTHUSER.MY.LOADLIB"
        },
        {
          "DISP": "SHR"
        }
      ]
    },
    {
      "STMT_TYPE": "EXEC",
      "labelName": 1,
      "command": "EXEC",
      "commandArgs": "PGM=EXAMPROG",
      "startedAtLine": 8,
      "endedAtLine": 8,
      "parsedArgs": [
        {
          "PGM": "EXAMPROG"
        }
      ]
    },
    {
      "STMT_TYPE": "DD",
      "labelName": 1,
      "command": "DD",
      "commandArgs": "DSN=MTHUSER.TEST.LOADLIB,DISP=SHR",
      "startedAtLine": 9,
      "endedAtLine": 9,
      "parsedArgs": [
        {
          "DSN": "MTHUSER.TEST.LOADLIB"
        },
        {
          "DISP": "SHR"
        }
      ]
    },
    {
      "STMT_TYPE": "DD",
      "labelName": 1,
      "command": "DD",
      "commandArgs": "DSN=MTHUSER.EXAMPROG.INPUT,DISP=SHR",
      "startedAtLine": 10,
      "endedAtLine": 10,
      "parsedArgs": [
        {
          "DSN": "MTHUSER.EXAMPROG.INPUT"
        },
        {
          "DISP": "SHR"
        }
      ]
    },
    {
      "STMT_TYPE": "DD",
      "labelName": 1,
      "command": "DD",
      "commandArgs": "DSN=MTHUSER.EXAMPROG.OUTPUT,DISP=(NEW,CATLG,DELETE),UNIT=(SYSDA,20),SPACE=(CYL,(50,25)),DCB=(RECFM=FB,LRECL=80,BLKSIZE=0,BUFNO=2)",
      "startedAtLine": 11,
      "endedAtLine": 15,
      "parsedArgs": [
        {
          "DSN": "MTHUSER.EXAMPROG.OUTPUT"
        },
        {
          "RECFM": "FB"
        },
        {
          "LRECL": "80"
        },
        {
          "BLKSIZE": "0"
        },
        {
          "BUFNO": "2"
        },
        {
          "DCB": {
            "RECFM": "FB",
            "LRECL": "80",
            "BLKSIZE": "0",
            "BUFNO": "2"
          }
        }
      ]
    },
    {
      "STMT_TYPE": "DD",
      "labelName": 1,
      "command": "DD",
      "commandArgs": "SYSOUT=*",
      "startedAtLine": 17,
      "endedAtLine": 17,
      "parsedArgs": [
        {
          "SYSOUT": "*"
        }
      ]
    },
    {
      "STMT_TYPE": "DD",
      "labelName": 1,
      "command": "DD",
      "commandArgs": "SYSOUT=*",
      "startedAtLine": 18,
      "endedAtLine": 18,
      "parsedArgs": [
        {
          "SYSOUT": "*"
        }
      ]
    },
    {
      "STMT_TYPE": "DD",
      "labelName": 1,
      "command": "DD",
      "commandArgs": "SYSOUT=*",
      "startedAtLine": 19,
      "endedAtLine": 19,
      "parsedArgs": [
        {
          "SYSOUT": "*"
        }
      ]
    }
  ]
}
```

### Output COBOL sample

```json
{
  "divisions": [],
  "statements": [
    {
      "STMT_TYPE": "EXEC_SQL",
      "include": "SQLCA",
      "sqlStatement": "   ",
      "startedAtLine": 109,
      "endedAtLine": 109
    },
    {
      "STMT_TYPE": "EXEC_SQL",
      "sqlStatement": "DECLARE NEXT_PART CURSOR FOR         SELECT PART_NUM,                PART_QUANT,                PART_ROP,                PART_EOQ         FROM   PART_STOCK         WHERE  PART_ROP > PART_QUANT           AND  PART_NUM > :PART-TABLE         ORDER BY PART_NUM ASC   ",
      "startedAtLine": 122,
      "endedAtLine": 131
    },
    {
      "STMT_TYPE": "EXEC_SQL",
      "sqlStatement": "DECLARE NEXT_ORDER_LINE CURSOR FOR         SELECT A.ORDER_NUM,                ORDER_LINE,                QUANT_REQ         FROM   PART_ORDLN A,                PART_ORDER B         WHERE  PART_NUM  = :PART-TABLE         AND    LINE_STAT  <> 'C'         AND    A.ORDER_NUM = B.ORDER_NUM         AND    ORDER_TYPE  = 'R'   ",
      "startedAtLine": 133,
      "endedAtLine": 143
    },
    {
      "STMT_TYPE": "EXEC_SQL",
      "sqlStatement": "WHENEVER SQLERROR GO TO DB-ERROR",
      "startedAtLine": 147,
      "endedAtLine": 147
    },
    {
      "STMT_TYPE": "EXEC_SQL",
      "sqlStatement": "WHENEVER SQLWARNING CONTINUE ",
      "startedAtLine": 148,
      "endedAtLine": 148
    },
    {
      "STMT_TYPE": "EXEC_SQL",
      "sqlStatement": "CONNECT RESET",
      "startedAtLine": 157,
      "endedAtLine": 157
    },
    {
      "STMT_TYPE": "EXEC_SQL",
      "sqlStatement": "COMMIT",
      "startedAtLine": 168,
      "endedAtLine": 168
    },
    {
      "STMT_TYPE": "EXEC_SQL",
      "sqlStatement": "CONNECT TO :LOCAL-DB",
      "startedAtLine": 175,
      "endedAtLine": 175
    },
    {
      "STMT_TYPE": "EXEC_SQL",
      "sqlStatement": "OPEN NEXT_PART",
      "startedAtLine": 182,
      "endedAtLine": 182
    },
    {
      "STMT_TYPE": "EXEC_SQL",
      "sqlStatement": "FETCH NEXT_PART         INTO  :PART-TABLE,               :QUANT-TABLE,               :ROP-TABLE,               :EOQ-TABLE   ",
      "startedAtLine": 183,
      "endedAtLine": 189
    },
    {
      "STMT_TYPE": "EXEC_SQL",
      "sqlStatement": "COMMIT END-EXEC       EXEC SQL CONNECT TO :REMOTE-DB END-EXEC       EXEC SQL OPEN NEXT_ORDER_LINE END-EXEC       PERFORM UNTIL RTCODE2 = 100          EXEC SQL               FETCH NEXT_ORDER_LINE               INTO  :ORD-TABLE,                     :ORL-TABLE,                     :QTY-TABLE          END-EXEC          IF SQLCODE = 100             MOVE 100 TO RTCODE2             EXEC SQL CLOSE NEXT_ORDER_LINE END-EXEC          ELSE             ADD QTY-TABLE TO QTY-REQ             EXEC SQL                  SELECT SUM(QUANT_RECV)                  INTO   :QTY-TABLE:IND-NULL                  FROM   SHIPMENTLN                  WHERE  ORDER_LOC  = :LOC                  AND    ORDER_NUM  = :ORD-TABLE                  AND    ORDER_LINE = :ORL-TABLE            ",
      "startedAtLine": 190,
      "endedAtLine": 236
    },
    {
      "STMT_TYPE": "EXEC_SQL",
      "sqlStatement": "COMMIT",
      "startedAtLine": 238,
      "endedAtLine": 238
    },
    {
      "STMT_TYPE": "EXEC_SQL",
      "sqlStatement": "CONNECT TO :LOCAL-DB",
      "startedAtLine": 244,
      "endedAtLine": 244
    },
    {
      "STMT_TYPE": "EXEC_SQL",
      "sqlStatement": "INSERT         INTO    PART_ORDLN                (ORDER_NUM,                 ORDER_LINE,                 PART_NUM,                 QUANT_REQ,                 LINE_STAT)         VALUES (:NEXT-NUM,                 :CONTL,                 :PART-TABLE,                 :EOQ-TABLE,                 'O')   ",
      "startedAtLine": 254,
      "endedAtLine": 267
    },
    {
      "STMT_TYPE": "EXEC_SQL",
      "sqlStatement": "SELECT (MAX(ORDER_NUM) + 1)         INTO   :NEXT-NUM:IND-NULL         FROM   PART_ORDER   ",
      "startedAtLine": 275,
      "endedAtLine": 279
    },
    {
      "STMT_TYPE": "EXEC_SQL",
      "sqlStatement": "INSERT         INTO    PART_ORDER                (ORDER_NUM,                 ORIGIN_LOC,                 ORDER_TYPE,                 ORDER_STAT,                 CREAT_TIME)         VALUES (:NEXT-NUM,                 :LOC, 'R', 'O',                 CURRENT TIMESTAMP)      ",
      "startedAtLine": 282,
      "endedAtLine": 293
    },
    {
      "STMT_TYPE": "EXEC_SQL",
      "sqlStatement": "WHENEVER SQLERROR CONTINUE",
      "startedAtLine": 305,
      "endedAtLine": 305
    },
    {
      "STMT_TYPE": "EXEC_SQL",
      "sqlStatement": "ROLLBACK WORK",
      "startedAtLine": 307,
      "endedAtLine": 307
    },
    {
      "STMT_TYPE": "EXEC_SQL",
      "sqlStatement": "WHENEVER SQLERROR GO TO DB-ERROR",
      "startedAtLine": 311,
      "endedAtLine": 311
    },
    {
      "STMT_TYPE": "EXEC_SQL",
      "sqlStatement": "CONNECT TO :REMOTE-DB",
      "startedAtLine": 366,
      "endedAtLine": 366
    },
    {
      "STMT_TYPE": "EXEC_SQL",
      "sqlStatement": "DELETE            FROM    PART_ORDLN            WHERE   ORDER_NUM IN                       (SELECT  ORDER_NUM                        FROM    PART_ORDER                        WHERE   ORDER_TYPE = 'R')      ",
      "startedAtLine": 369,
      "endedAtLine": 376
    },
    {
      "STMT_TYPE": "EXEC_SQL",
      "sqlStatement": "DELETE            FROM    PART_ORDER            WHERE   ORDER_TYPE = 'R'      ",
      "startedAtLine": 377,
      "endedAtLine": 381
    },
    {
      "STMT_TYPE": "EXEC_SQL",
      "sqlStatement": "COMMIT",
      "startedAtLine": 383,
      "endedAtLine": 383
    }
  ]
}```