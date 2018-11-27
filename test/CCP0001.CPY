                                     
       77  WRK-MODULO                  PIC  X(008)  VALUE SPACES.       
       77  WRK-NOME-TABELA             PIC  X(032)  VALUE SPACES.       
       77  WRK-STORED-PROC             PIC  X(008)  VALUE SPACES.       
       77  WRK-HSOLTD-AGNDA            PIC  X(008)  VALUE SPACES.       
       77  WRK-GRAVADO-CAB-LOTE        PIC  9(001)  VALUE ZEROS.        
       77  WRK-OPERACAO                PIC  9(005)  COMP-3 VALUE ZEROS. 
                                                                        
       01  WRK-NDIA-PGMC-AGNDA         PIC  9(002)  VALUE ZEROS.        
       01  WRK-NDIA-PGMC-AGNDA-X       REDEFINES                        
           WRK-NDIA-PGMC-AGNDA         PIC  X(002).                     
                                                                        
       01  WRK-DATA-ATUAL              PIC  9(008)  VALUE ZEROS.        
       01  WRK-DATA-ATUAL-R            REDEFINES                        
           WRK-DATA-ATUAL              PIC  X(008).                     
       01  WRK-DATA-ATU                PIC  X(010)  VALUE SPACES.       
                                                                        
       01  WRK-RPARM-AGNDA             PIC  X(020)  VALUE SPACES.       
       01  WRK-RPARM-AGNDA-R           REDEFINES                        
           WRK-RPARM-AGNDA             PIC  9(005).                     
                                                                        
       01  WRK-NAGNDA                  PIC 9(18)  VALUE ZEROS.          
       01  WRK-NAGNDA-R     REDEFINES  WRK-NAGNDA.                      
           05 FILLER                   PIC 9(16).                       
           05 WRK-PTCAO                PIC 9(02).                       
                                                                        
       01  WRK-DAGEND-CALC             PIC  9(008)  VALUE ZEROS.        
       01  WRK-DAGEND-CALC-X           REDEFINES                        
           WRK-DAGEND-CALC             PIC  X(008).                     
                                                                        
       01  WRK-DAGEND                  PIC  9(008)  VALUE ZEROS.        
       01  WRK-DAGEND-R                REDEFINES    WRK-DAGEND.         
           05  WRK-DAGEND-AAAA         PIC  9(004).                     
           05  WRK-DAGEND-MM           PIC  9(002).                     
           05  WRK-DAGEND-DD           PIC  9(002).                     
                                                                        
       01  WRK-DFIM-DAGEND.                                             
           05  WRK-DFIM-DAGEND-AAAA    PIC  9(004)  VALUE ZEROS.        
           05  WRK-DFIM-DAGEND-MM      PIC  9(002)  VALUE ZEROS.        
           05  WRK-DFIM-DAGEND-DD      PIC  9(002)  VALUE ZEROS.        
                                                                        
       01  WRK-DATA-DB2.                                                
           05  WRK-DD                  PIC  9(002)  VALUE ZEROS.        
           05  WRK-PONTO-1             PIC  X(001)  VALUE '.'.          
           05  WRK-MM                  PIC  9(002)  VALUE ZEROS.        
           05  WRK-PONTO-2             PIC  X(001)  VALUE '.'.          
           05  WRK-AAAA                PIC  9(004)  VALUE ZEROS.        
                                                                        
       01  WRK-TIMESTAMP.                                               
           05  WRK-ANO                 PIC  9(004)  VALUE ZEROS.        
           05  FILLER                  PIC  X(001)  VALUE '-'.          
           05  WRK-MES                 PIC  9(002)  VALUE ZEROS.        
           05  FILLER                  PIC  X(001)  VALUE '-'.          
           05  WRK-DIA                 PIC  9(002)  VALUE ZEROS.        
           05  FILLER                  PIC  X(001)  VALUE '-'.          
           05  WRK-HORA                PIC  X(002)  VALUE SPACES.       
           05  FILLER                  PIC  X(001)  VALUE '.'.          
           05  WRK-MINUTO              PIC  9(002)  VALUE ZEROS.        
           05  FILLER                  PIC  X(001)  VALUE '.'.          
           05  WRK-SEGUNDO             PIC  9(002)  VALUE ZEROS.        
           05  FILLER                  PIC  X(001)  VALUE '.'.          
           05  WRK-MILESIMO            PIC  9(006)  VALUE ZEROS.        
                                                                        
       01  WRK-PROTOCOLO               PIC  X(001)  VALUE SPACES.       
           88  WRK-POR-CONTRATO                     VALUE 'C'.          
           88  WRK-POR-PESSOA                       VALUE 'P'.          
                                                                        
       01  WRK-TRATAMENTO-ERROS.                                        
           05  WRK-BLOCO-RETORNO.                                       
             10  WRK-COD-RETORNO       PIC  9(002)  VALUE ZEROS.        
             10  WRK-COD-ERRO          PIC  X(004)  VALUE SPACES.       
             10  WRK-COD-MENSAGEM      PIC  X(008)  VALUE SPACES.       
                                                                        
       01  WRK-CONTRATO.                                                
           05  WRK-CCLUB               PIC  9(010)  VALUE ZEROS.        
           05  WRK-CTPO-CONTR          PIC  9(003)  VALUE ZEROS.        
           05  WRK-NSEQ-CONTR          PIC  9(010)  VALUE ZEROS.        
                                                                        
      *                                                                 
      *--> "LITERAIS UTILIZADAS PELO PROGRAMA"                          
      *                                                                 
                                                                        
       77  WRK-AGCP1349                PIC  X(008)  VALUE 'AGCP1349'.   
       77  WRK-AGCP1304                PIC  X(008)  VALUE 'AGCP1304'.   
       77  WRK-AGCP1311                PIC  X(008)  VALUE 'AGCP1311'.   
       77  WRK-AGCP1324                PIC  X(008)  VALUE 'AGCP1324'.   
       77  WRK-AGCP1368                PIC  X(008)  VALUE 'AGCP1368'.   
       77  WRK-AGCP1369                PIC  X(008)  VALUE 'AGCP1369'.   
       77  WRK-AGCP1382                PIC  X(008)  VALUE 'AGCP1382'.   
       77  WRK-CALE1000                PIC  X(008)  VALUE 'CALE1000'.   
       77  WRK-CDPS1429                PIC  X(008)  VALUE 'CDPS1429'.   
       77  WRK-CTCP1068                PIC  X(008)  VALUE 'CTCP1068'.   
       77  WRK-INEC108A                PIC  X(008)  VALUE 'INEC108A'.   
       77  WRK-FRWK1999                PIC  X(008)  VALUE 'FRWK1999'.   
       77  WRK-AGCP1326                PIC  X(008)  VALUE 'AGCP1326'.   
       77  WRK-CSIT-AGNDA              PIC S9(002)  COMP-3 VALUE 1.     
                                                                        
      *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - *
       77  FILLER PIC X(34) VALUE  '** AREA P/ TRATAM DE NULIDADE **  '.
      *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - *
                                                                        
       01  WRK-AGCPB006-NULL.                                           
           05  WRK-NAGNDA-LOTE-NULL    PIC S9(004)  COMP VALUE ZEROS.   
           05  WRK-NAGNDA-RAGDD-NULL   PIC S9(004)  COMP VALUE ZEROS.   
           05  WRK-NAGNDA-PGMD-NULL    PIC S9(004)  COMP VALUE ZEROS.   
           05  WRK-CUSUAR-MANUT-NULL   PIC S9(004)  COMP VALUE ZEROS.   
           05  WRK-HMANUT-REG-NULL     PIC S9(004)  COMP VALUE ZEROS.   
                                                                        
       01  WRK-AGCPB008-NULL.                                           
           05  WRK-CPSSOA-JURID-PRTCP-NULL                              
                                       PIC S9(004)  COMP VALUE ZEROS.   
           05  WRK-CTPO-CONTR-PRTCP-NULL                                
                                       PIC S9(004)  COMP VALUE ZEROS.   
           05  WRK-NSEQ-CONTR-PRTCP-NULL                                
                                       PIC S9(004)  COMP VALUE ZEROS.   
           05  WRK-CPSSOA-PRTCP-NULL                                    
                                       PIC S9(004)  COMP VALUE ZEROS.   
           05  WRK-CTPO-PRTCP-PSSOA-NULL                                
                                       PIC S9(004)  COMP VALUE ZEROS.   
           05  WRK-CPSSOA-SOLCT-AGNDA-NULL                              
                                       PIC S9(004)  COMP VALUE ZEROS.   
                                                                        
      *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - *
       77  FILLER PIC X(34) VALUE  '** AREA DE INCLUDES PARA DB2 **   '.
      *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - *
                                                                        
           EXEC SQL                                                     
              INCLUDE SQLCA                                             
           END-EXEC.                                                    
                                                                        
           EXEC SQL                                                     
              INCLUDE AGCPB006                                          
           END-EXEC.                                                    
                                                                        
           EXEC SQL                                                     
              INCLUDE AGCPB007                                          
           END-EXEC.                                                    
                                                                        
           EXEC SQL                                                     
              INCLUDE AGCPB008                                          
           END-EXEC.                                                    
                                                                        
           EXEC SQL                                                     
              INCLUDE AGCPB010                                          
           END-EXEC.                                                    
                                                                        
      *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - *
       77  FILLER PIC X(34) VALUE  '** FIM DA WORKING AGCP1349 **     '.
      *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - *
           