//GPTI99J1 JOB 'GPTI,9999,BN,JOB00001',MSGCLASS=X,CLASS=C,TIME=1440            
//*---------------------------------------------------------------------       
//JOBLIB   DD DSN=DSN810.SDSNLOAD,DISP=SHR                                     
//         DD DSN=DSN810.RUNLIB.LOAD,DISP=SHR                                  
//SELECT   EXEC PGM=IKJEFT01,DYNAMNBR=20                                       
//SYSPRINT DD SYSOUT=*                                                         
//SYSOUT   DD SYSOUT=*                                                         
//SYSTSPRT DD SYSOUT=*                                                         
//SYSUDUMP DD SYSOUT=*                                                         
//SYSTSIN  DD *                                                                
DSN SYSTEM(DB8G)                                                               
RUN  PROGRAM(DSNTEP2) PLAN(DSNTEP81) -                                         
     LIB('DSN810.RUNLIB.LOAD')                                                 
END                                                                            
/*                                                                             
//SYSIN    DD *                                                                
SELECT * FROM DB2PRD.TTPO_ESTRT_ARQ;                                           
SELECT * FROM DB2PRD.TTPO_ESTRT_ARQ;                                           
/*                                                                             
