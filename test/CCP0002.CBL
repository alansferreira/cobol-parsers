       IDENTIFICATION DIVISION.
      *------------------------
       PROGRAM-ID. DDBPT6CB.                                                                00/00/00
      ****************************************************************                      00/00/00
      *   MODULE NAME = DDBPT6CB                                                            00/00/00
      *
      *   DESCRIPTIVE NAME = D-DB SAMPLE APPLICATION
      *                      REORDER POINT PROCESSING
      *                      i5/OS                                                          00/00/00
      *                      COBOL
      *
      *   FUNCTION =  THIS MODULE PROCESSES THE PART_STOCK TABLE AND
      *               FOR EACH PART BELOW THE ROP (REORDER POINT)
      *               CHECKS THE EXISTING ORDERS AND SHIPMENTS,                             00/00/00
      *               CREATES A SUPPLY ORDER AND PRINTS A REPORT.                           00/00/00
      *
      *      DEPENDENCIES = NONE                                                            00/00/00
      *
      *      INPUT = PARAMETERS EXPLICITLY PASSED TO THIS FUNCTION:
      *
      *              LOCAL-DB       LOCAL DB NAME                                           00/00/00
      *              REMOTE-DB      REMOTE DB NAME                                          00/00/00
      *
      *   TABLES =  PART-STOCK       - LOCAL                                                00/00/00
      *             PART_ORDER       - REMOTE                                               00/00/00
      *             PART_ORDLN       - REMOTE                                               00/00/00
      *             SHIPMENTLN       - REMOTE                                               00/00/00
      *                                                                                     00/00/00
      *   CRTSQLCBL  SPECIAL PARAMETERS                                                     00/00/00
      *    PGM(DDBPT6CB) RDB(remotedbname) OPTION(*APOST *APOSTSQL)                         00/00/00
      *                                                                                     00/00/00
      *   INVOKE BY : CALL DDBPT6CB PARM(localdbname remotedbname)                          00/00/00
      *                                                                                     00/00/00
      ****************************************************************                      00/00/00
       ENVIRONMENT DIVISION.
      *---------------------
       INPUT-OUTPUT SECTION.
       FILE-CONTROL.
           SELECT RELAT  ASSIGN TO PRINTER-QPRINT.                                          00/00/00
       DATA DIVISION.
      *--------------
       FILE SECTION.
      *-------------                                                                        00/00/00
       FD  RELAT
           RECORD CONTAINS 33 CHARACTERS
           LABEL RECORDS ARE OMITTED
           DATA RECORD IS REPREC.
       01  REPREC          PIC  X(33).
       WORKING-STORAGE SECTION.
      *------------------------                                                             00/00/00
      *    PRINT LINE  DEFINITIONS                                                          00/00/00
       01  LINE0           PIC  X(33) VALUE  SPACES.
       01  LINE1           PIC  X(33) VALUE
           '***** ROP PROCESSING REPORT *****'.
       01  LINE2.
         05  FILLER        PIC  X(18) VALUE  '   ORDER NUMBER = '.
         05  MASK0         PIC  ZZZ9.
         05  FILLER        PIC  X(11) VALUE  SPACES.
       01  LINE3           PIC  X(33) VALUE
           '---------------------------------'.
       01  LINE4           PIC  X(33) VALUE
           '   LINE     PART         QTY     '.
       01  LINE5           PIC  X(33) VALUE
           '  NUMBER   NUMBER     REQUESTED  '.
       01  LINE6.
         05  FILLER        PIC  XXXX  VALUE SPACES.
         05  MASK1         PIC  ZZZ9.
         05  FILLER        PIC  XXXX  VALUE SPACES.
         05  PART-TABLE    PIC  XXXXX.
         05  FILLER        PIC  XXXX  VALUE SPACES.
         05  MASK2         PIC  Z,ZZZ,ZZZ.ZZ.
       01  LINE7.
         05  FILLER        PIC  X(26) VALUE
           'NUMBER OF LINES CREATED = '.
         05  MASK3         PIC  ZZZ9.
         05  FILLER        PIC  XXX   VALUE  SPACES.
       01  LINE8           PIC  X(33) VALUE
           '********* END OF PROGRAM ********'.
      *    MISCELLANEOUS DEFINITIONS                                                        00/00/00
       01  WHAT-TIME       PIC  X     VALUE '1'.
           88  FIRST-TIME             VALUE '1'.
       01  CONTL           PIC  S9999 COMP-4 VALUE ZEROS.                                   00/00/00
       01  CONTD           PIC  S9999 COMP-4 VALUE ZEROS.                                   00/00/00
       01  RTCODE1         PIC  S9999 COMP-4 VALUE ZEROS.                                   00/00/00
       01  RTCODE2         PIC  S9999 COMP-4.                                               00/00/00
       01  NEXT-NUM        PIC  S9999 COMP-4.                                               00/00/00
       01  IND-NULL        PIC  S9999 COMP-4.                                               00/00/00
       01  LOC-TABLE       PIC  X(16).
       01  ORD-TABLE       PIC  S9999 COMP-4.                                               00/00/00
       01  ORL-TABLE       PIC  S9999 COMP-4.                                               00/00/00
       01  QUANT-TABLE     PIC  S9(9) COMP-4.                                               00/00/00
       01  QTY-TABLE       PIC  S9(9) COMP-4.                                               00/00/00
       01  ROP-TABLE       PIC  S9(9) COMP-4.                                               00/00/00
       01  EOQ-TABLE       PIC  S9(9) COMP-4.                                               00/00/00
       01  QTY-REQ         PIC  S9(9) COMP-4.                                               00/00/00
       01  QTY-REC         PIC  S9(9) COMP-4.                                               00/00/00
      * CONSTANT  FOR LOCATION NUMBER                                                       00/00/00
       01  XPARM.                                                                           00/00/00
           05   LOC        PIC  X(4)  VALUE 'SQLA'.                                         00/00/00
      * DEFINITIONS FOR ERROR MESSAGE HANDLING                                             00/00/00
       01  ERROR-MESSAGE.                                                                  00/00/00
           05   MSG-ID.                                                                    00/00/00
           10   MSG-ID-1     PIC  X(2)                                                     00/00/00
                VALUE 'SQ'.                                                                00/00/00
           10   MSG-ID-2     PIC 99999.                                                    00/00/00
      ******************************                                                        00/00/00
      *    SQLCA INCLUDE           *                                                        00/00/00
      ******************************                                                        00/00/00
           EXEC SQL INCLUDE SQLCA    END-EXEC.
                                                                                            00/00/00
       LINKAGE SECTION.                                                                     00/00/00
      *----------------                                                                     00/00/00
       01  LOCAL-DB        PIC  X(18).                                                      00/00/00
       01  REMOTE-DB       PIC  X(18).                                                      00/00/00
                                                                                            00/00/00
       PROCEDURE DIVISION USING LOCAL-DB REMOTE-DB.                                         00/00/00
      *------------------                                                                   00/00/00
      *****************************                                                         00/00/00
      *    SQL CURSOR DECLARATION *                                                         00/00/00
      *****************************                                                         00/00/00
      * RE-POSITIONABLE CURSOR : POSITION AFTER LAST PART_NUM                               00/00/00
           EXEC SQL DECLARE NEXT_PART CURSOR FOR
                SELECT PART_NUM,
                       PART_QUANT,
                       PART_ROP,
                       PART_EOQ
                FROM   PART_STOCK
                WHERE  PART_ROP > PART_QUANT
                  AND  PART_NUM > :PART-TABLE                                               00/00/00
                ORDER BY PART_NUM ASC                                                       00/00/00
           END-EXEC.
      * CURSOR FOR ORDER LINES                                                              00/00/00
           EXEC SQL DECLARE NEXT_ORDER_LINE CURSOR FOR
                SELECT A.ORDER_NUM,
                       ORDER_LINE,
                       QUANT_REQ
                FROM   PART_ORDLN A,                                                        00/00/00
                       PART_ORDER B
                WHERE  PART_NUM  = :PART-TABLE
                AND    LINE_STAT  <> 'C'                                                    00/00/00
                AND    A.ORDER_NUM = B.ORDER_NUM
                AND    ORDER_TYPE  = 'R'
           END-EXEC.
      ******************************                                                        00/00/00
      *    SQL RETURN CODE HANDLING*                                                        00/00/00
      ******************************                                                        00/00/00
           EXEC SQL WHENEVER SQLERROR GO TO DB-ERROR END-EXEC.
           EXEC SQL WHENEVER SQLWARNING CONTINUE  END-EXEC.                                 00/00/00
                                                                                            00/00/00
       MAIN-PROGRAM-PROC.                                                                   00/00/00
      *------------------                                                                   00/00/00
           PERFORM START-UP THRU START-UP-EXIT.                                             00/00/00
           PERFORM MAIN-PROC THRU MAIN-EXIT UNTIL RTCODE1 = 100.                            00/00/00
       END-OF-PROGRAM.                                                                      00/00/00
      *---------------                                                                      00/00/00
      ****                                                                                  00/00/00
           EXEC SQL CONNECT RESET END-EXEC.                                                 00/00/00
      ****
           CLOSE RELAT.
           GOBACK.
       MAIN-PROGRAM-EXIT. EXIT.                                                             00/00/00
      *------------------                                                                   00/00/00
                                                                                            00/00/00
       START-UP.                                                                            00/00/00
      *----------                                                                           00/00/00
           OPEN OUTPUT RELAT.                                                               00/00/00
      ****                                                                                  00/00/00
           EXEC SQL COMMIT END-EXEC.                                                        00/00/00
      ****                                                                                  00/00/00
           PERFORM CLEAN-UP THRU CLEAN-UP-EXIT.                                             00/00/00
      ********************************                                                      00/00/00
      *    CONNECT TO LOCAL DATABASE *                                                      00/00/00
      ********************************                                                      00/00/00
      ****                                                                                  00/00/00
           EXEC SQL CONNECT TO :LOCAL-DB END-EXEC.                                          00/00/00
      ****                                                                                  00/00/00
       START-UP-EXIT. EXIT.                                                                 00/00/00
      *------------                                                                         00/00/00
           EJECT
       MAIN-PROC.
      *---------
           EXEC SQL OPEN NEXT_PART END-EXEC.                                                00/00/00
           EXEC SQL
                FETCH NEXT_PART
                INTO  :PART-TABLE,
                      :QUANT-TABLE,
                      :ROP-TABLE,
                      :EOQ-TABLE
           END-EXEC.
           IF SQLCODE = 100
              MOVE 100 TO RTCODE1                                                           00/00/00
              PERFORM TRAILER-PROC THRU TRAILER-EXIT                                        00/00/00
           ELSE
              MOVE 0 TO RTCODE2
              MOVE 0 TO QTY-REQ
              MOVE 0 TO QTY-REC
      * --- IMPLICIT "CLOSE" CAUSED BY COMMIT ---                                           00/00/00
      ****                                                                                  00/00/00
              EXEC SQL COMMIT END-EXEC                                                      00/00/00
      ****                                                                                  00/00/00
      *********************************                                                     00/00/00
      *    CONNECT TO REMOTE DATABASE *                                                     00/00/00
      *********************************                                                     00/00/00
      ****                                                                                  00/00/00
              EXEC SQL CONNECT TO :REMOTE-DB END-EXEC                                       00/00/00
      ****                                                                                  00/00/00
              EXEC SQL OPEN NEXT_ORDER_LINE END-EXEC                                        00/00/00
              PERFORM UNTIL RTCODE2 = 100
                 EXEC SQL                                                                   00/00/00
                      FETCH NEXT_ORDER_LINE
                      INTO  :ORD-TABLE,
                            :ORL-TABLE,
                            :QTY-TABLE
                 END-EXEC
                 IF SQLCODE = 100
                    MOVE 100 TO RTCODE2
                    EXEC SQL CLOSE NEXT_ORDER_LINE END-EXEC
                 ELSE
                    ADD QTY-TABLE TO QTY-REQ
                    EXEC SQL
                         SELECT SUM(QUANT_RECV)                                             00/00/00
                         INTO   :QTY-TABLE:IND-NULL
                         FROM   SHIPMENTLN                                                  00/00/00
                         WHERE  ORDER_LOC  = :LOC
                         AND    ORDER_NUM  = :ORD-TABLE
                         AND    ORDER_LINE = :ORL-TABLE
                    END-EXEC
                    IF IND-NULL NOT < 0
                       ADD QTY-TABLE TO QTY-REC
                    END-IF
                 END-IF
              END-PERFORM
              IF ROP-TABLE > QUANT-TABLE + QTY-REQ - QTY-REC
                 PERFORM ORDER-PROC THRU ORDER-EXIT
              END-IF
           END-IF.
      ****                                                                                  00/00/00
           EXEC SQL COMMIT END-EXEC.                                                        00/00/00
      ****                                                                                  00/00/00
      **********************************                                                    00/00/00
      *    RECONNECT TO LOCAL DATABASE *                                                    00/00/00
      **********************************                                                    00/00/00
      ****                                                                                  00/00/00
           EXEC SQL CONNECT TO :LOCAL-DB END-EXEC.                                          00/00/00
      ****                                                                                  00/00/00
       MAIN-EXIT. EXIT.
      *---------------
       ORDER-PROC.
      *----------
           IF FIRST-TIME
              MOVE '2' TO WHAT-TIME
              PERFORM CREATE-ORDER-PROC THRU CREATE-ORDER-EXIT.                             00/00/00
           ADD 1 TO CONTL.
           EXEC SQL
                INSERT
                INTO    PART_ORDLN                                                          00/00/00
                       (ORDER_NUM,
                        ORDER_LINE,
                        PART_NUM,
                        QUANT_REQ,
                        LINE_STAT)
                VALUES (:NEXT-NUM,
                        :CONTL,
                        :PART-TABLE,
                        :EOQ-TABLE,
                        'O')
           END-EXEC.
           PERFORM DETAIL-PROC THRU DETAIL-EXIT.
       ORDER-EXIT. EXIT.
      *----------------
                                                                                            00/00/00
       CREATE-ORDER-PROC.                                                                   00/00/00
      *------------------                                                                   00/00/00
      *GET NEXT ORDER NUMBER                                                                00/00/00
           EXEC SQL                                                                         00/00/00
                SELECT (MAX(ORDER_NUM) + 1)                                                 00/00/00
                INTO   :NEXT-NUM:IND-NULL                                                   00/00/00
                FROM   PART_ORDER                                                           00/00/00
           END-EXEC.                                                                        00/00/00
           IF IND-NULL < 0                                                                  00/00/00
             MOVE 1 TO NEXT-NUM.                                                            00/00/00
           EXEC SQL                                                                         00/00/00
                INSERT                                                                      00/00/00
                INTO    PART_ORDER                                                          00/00/00
                       (ORDER_NUM,                                                          00/00/00
                        ORIGIN_LOC,                                                         00/00/00
                        ORDER_TYPE,                                                         00/00/00
                        ORDER_STAT,                                                         00/00/00
                        CREAT_TIME)                                                         00/00/00
                VALUES (:NEXT-NUM,                                                          00/00/00
                        :LOC, 'R', 'O',                                                     00/00/00
                        CURRENT TIMESTAMP)                                                  00/00/00
              END-EXEC.                                                                     00/00/00
           MOVE NEXT-NUM TO MASK0.                                                          00/00/00
           PERFORM HEADER-PROC THRU HEADER-EXIT.                                            00/00/00
       CREATE-ORDER-EXIT. EXIT.                                                             00/00/00
      *------------------                                                                   00/00/00
                                                                                            00/00/00
       DB-ERROR.                                                                            00/00/00
      *--------                                                                             00/00/00
           PERFORM ERROR-MSG-PROC THRU ERROR-MSG-EXIT.                                      00/00/00
      ***********************                                                               00/00/00
      *    ROLLBACK THE LUW *                                                               00/00/00
      ***********************                                                               00/00/00
           EXEC SQL WHENEVER SQLERROR CONTINUE END-EXEC.                                    00/00/00
      ****                                                                                  00/00/00
           EXEC SQL ROLLBACK WORK END-EXEC.                                                 00/00/00
      ****                                                                                  00/00/00
           PERFORM END-OF-PROGRAM THRU MAIN-PROGRAM-EXIT.                                   00/00/00
      * -- NEXT LINE INCLUDED TO RESET THE "GO TO" DEFAULT --                               00/00/00
           EXEC SQL WHENEVER SQLERROR GO TO DB-ERROR END-EXEC.                              00/00/00
                                                                                            00/00/00
       ERROR-MSG-PROC.                                                                      00/00/00
      *----------                                                                           00/00/00
           MOVE  SQLCODE   TO  MSG-ID-2.                                                    00/00/00
           DISPLAY 'SQL STATE =' SQLSTATE ' SQLCODE =' MSG-ID-2.                            00/00/00
      * -- ADD HERE ANY ADDITIONAL ERROR MESSAGE HANDLING --                                00/00/00
       ERROR-MSG-EXIT. EXIT.                                                                00/00/00
      *----------------                                                                     00/00/00
                                                                                            00/00/00
      *******************                                                                   00/00/00
      * REPORT PRINTING *                                                                   00/00/00
      *******************                                                                   00/00/00
       HEADER-PROC.                                                                         00/00/00
      *-----------                                                                          00/00/00
           WRITE REPREC FROM LINE1 AFTER ADVANCING PAGE.
           WRITE REPREC FROM LINE2 AFTER ADVANCING 3 LINES.
           WRITE REPREC FROM LINE3 AFTER ADVANCING 2 LINES.
           WRITE REPREC FROM LINE4 AFTER ADVANCING 1 LINES.
           WRITE REPREC FROM LINE5 AFTER ADVANCING 1 LINES.
           WRITE REPREC FROM LINE3 AFTER ADVANCING 1 LINES.
           WRITE REPREC FROM LINE0 AFTER ADVANCING 1 LINES.
       HEADER-EXIT. EXIT.
      *-----------------
       DETAIL-PROC.
      *-----------
           ADD 1 TO CONTD.
           IF CONTD > 50
              MOVE 1 TO CONTD
              PERFORM HEADER-PROC THRU HEADER-EXIT
           END-IF
           MOVE CONTL     TO MASK1.
           MOVE EOQ-TABLE TO MASK2.
           WRITE REPREC FROM LINE6 AFTER ADVANCING 1 LINES.
       DETAIL-EXIT. EXIT.
      *-----------------
       TRAILER-PROC.
      *------------
           MOVE CONTL TO MASK3.
           WRITE REPREC FROM LINE3 AFTER ADVANCING 2 LINES.
           WRITE REPREC FROM LINE7 AFTER ADVANCING 2 LINES.
           WRITE REPREC FROM LINE3 AFTER ADVANCING 2 LINES.
           WRITE REPREC FROM LINE8 AFTER ADVANCING 1 LINES.
       TRAILER-EXIT. EXIT.
      *------------------
      ********************************************************                              00/00/00
      * THIS PARAGRAPH IS ONLY REQUIRED IN A TEST ENVIRONMENT*                              00/00/00
      * TO RESET THE DATA TO PERMIT RE-RUNNING OF THE TEST   *                              00/00/00
      ********************************************************                              00/00/00
       CLEAN-UP.                                                                            00/00/00
      *---------                                                                            00/00/00
      *********************************                                                     00/00/00
      *    CONNECT TO REMOTE DATABASE *                                                     00/00/00
      *********************************                                                     00/00/00
      ****                                                                                  00/00/00
           EXEC SQL CONNECT TO :REMOTE-DB END-EXEC.                                         00/00/00
      ****                                                                                  00/00/00
      *---------------------DELETE ORDER ROWS FOR RERUNABILITY                              00/00/00
              EXEC SQL                                                                      00/00/00
                   DELETE                                                                   00/00/00
                   FROM    PART_ORDLN                                                       00/00/00
                   WHERE   ORDER_NUM IN                                                     00/00/00
                              (SELECT  ORDER_NUM                                            00/00/00
                               FROM    PART_ORDER                                           00/00/00
                               WHERE   ORDER_TYPE = 'R')                                    00/00/00
              END-EXEC.                                                                     00/00/00
              EXEC SQL                                                                      00/00/00
                   DELETE                                                                   00/00/00
                   FROM    PART_ORDER                                                       00/00/00
                   WHERE   ORDER_TYPE = 'R'                                                 00/00/00
              END-EXEC.                                                                     00/00/00
      ****                                                                                  00/00/00
           EXEC SQL COMMIT END-EXEC.                                                        00/00/00
      ****                                                                                  00/00/00
       CLEAN-UP-EXIT. EXIT.                                                                 00/00/00
      *-------------                                                                        00/00/00
* * * *  E N D  O F  S O U R C E  * * * *