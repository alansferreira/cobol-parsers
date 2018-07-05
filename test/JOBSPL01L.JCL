//MTHUSERR JOB (META007),'PAWAN Y',CLASS=A,MSGCLASS=L,MSGLEVEL=(1,1),   
//             TIME=1440,NOTIFY=&SYSUID                                 
//*                                                                     
//JOBLIB   DD  DSN=MTHUSER.MY.LOADLIB,DISP=SHR                          
//*                                                                     
//*        EXAMPORG RUNNING STEP                                        
//*                                                                     
//STEP01  EXEC PGM=EXAMPROG                                             
//STEPLIB  DD  DSN=MTHUSER.TEST.LOADLIB,DISP=SHR                        
//INPFILE  DD  DSN=MTHUSER.EXAMPROG.INPUT,DISP=SHR                      
//OUTFILE  DD  DSN=MTHUSER.EXAMPROG.OUTPUT,                             
//             DISP=(NEW,CATLG,DELETE),                                 
//             UNIT=(SYSDA,20),                                         
//             SPACE=(CYL,(50,25)),                                     
//             DCB=(RECFM=FB,LRECL=80,BLKSIZE=0,BUFNO=2)                
//*                                                                     
//SYSPRINT DD  SYSOUT=*                                                 
//SYSUDUMP DD  SYSOUT=*                                                 
//SYSOUT   DD  SYSOUT=*                                                 
