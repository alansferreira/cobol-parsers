      *================================================================*        
       IDENTIFICATION                  DIVISION.                                
      *================================================================*        
       PROGRAM-ID.                     CMCD3QBA.                                
       AUTHOR.                         FERNANDO ALVES MOREIRA.                  
      *================================================================*        
      *           DEDIC GPTI - TECNOLOGIA DE INFORMACAO S/A            *        
      *                      FABRICA DE SOFTWARE                       *        
      *----------------------------------------------------------------*        
      *    SISTEMA.....: CMCD.                                         *        
      *    PROGRAMA....: CMCD3QBA.                                     *        
      *    PROGRAMADOR.: FERNANDO ALVES MOREIRA            - TODO!     *        
      *    ANALISTA....: LUIZ ALVES DA SILVA               - TODO!     *        
      *    DATA CRIACAO: 07/11/2011                                    *        
      *----------------------------------------------------------------*        
      *    OBJETIVO....: CHAMAR MODULOS DE ALTERACAO DE LIMITES        *        
      *                  PARTICULARIZADOS NO COBRANCA.                 *        
      *----------------------------------------------------------------*        
      *   DCLGEN     BASE DE DADOS:                                    *        
      *  --------   ---------------------------------------------------*        
      *   CBCDB023   DB2PRD.TCTA_BCRIA_COBR                            *        
      *----------------------------------------------------------------*        
      *                                                                *        
      *    INC'S.......:                                               *        
      *                                                                *        
      *    I#FRWKGE - AREA DE COMUNICACAO DO PROGRAMA FRWK2999.        *        
      *    I#FRWKMD - AREA DE TRATAMENTO DE ERROS DE MODULO.           *        
      *    CBCDWAAI - AREA DE COMUNICACAO PARA MODULO(CBCD3AAC).       *        
      *    CMCDWAAI - AREA DE COMUNICACAO COM O MODULO(CMCD3AAC).      *        
      *    CBCDW00V - AREA DE COMUNICACAO PARA MODULOS(CBCD).          *        
      *    I#FRWKDB - TRATAMENTO DE ERRO - DB2                         *        
      *----------------------------------------------------------------*        
      *    MODULOS CHAMADOS:                                           *        
      *                                                                *        
      *    FRWK1999 - TRATAMENTO DE ERROS - BOOK I#FRWKGE.             *        
      *    CBCD3AAC - MODULO PARA VALIDAR SEGURANCA.                   *        
      *    CMCD3AAC - MODULO PARA CONSULTAR DA BASE DE MIGRADOS.       *        
      *    CMCD420A - ALTERACAO LIMITE POR CONTA (NOVA ARQUITETURA).   *        
      *    CMCD421A - ALTERACAO LIMITE POR CONTA (LEGADO).             *        
      *================================================================*        
      *================================================================*        
       ENVIRONMENT                     DIVISION.                                
      *================================================================*        
      *----------------------------------------------------------------*        
       CONFIGURATION                   SECTION.                                 
      *----------------------------------------------------------------*        
       SPECIAL-NAMES.                                                           
           DECIMAL-POINT               IS  COMMA.                               
                                                                                
      *================================================================*        
       DATA                            DIVISION.                                
      *================================================================*        
      *----------------------------------------------------------------*        
      *         W  O  R  K  I  N  G   S  T  O  R  A  G  E              *        
      *----------------------------------------------------------------*        
       WORKING-STORAGE                 SECTION.                                 
      *----------------------------------------------------------------*        
      *----------------------------------------------------------------*        
       77  FILLER                      PIC  X(050)    VALUE                     
           '*** CMCD3QBA - INICIO DA AREA DE WORKING ***'.                      
      *----------------------------------------------------------------*        
      *----------------------------------------------------------------*        
       77  FILLER                      PIC  X(050)    VALUE                     
           '*** AREA DE TRATAMENTO DE LOG DE ERRO ***'.                         
      *----------------------------------------------------------------*        
       01  WRK-AREA-ERRO.                                                       
           COPY 'I#FRWKGE'.                                                     
            05  WRK-BLOCO-INFO-ERRO.                                            
              10  WRK-CHAR-INFO-ERRO   PIC  X(001)                              
                           OCCURS 0    TO 30000 TIMES                           
                           DEPENDING   ON FRWKGHEA-TAM-DADOS.                   
                                                                                
      *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - *        
       01  FILLER                      PIC  X(050)         VALUE                
           'AREA DE ERRO DB2'.                                                  
      *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - *        
                                                                                
       01  WRK-AREA-ERRO-DB2.                                                   
           COPY 'I#FRWKDB'.                                                     
                                                                                
      *----------------------------------------------------------------*        
       77  FILLER                      PIC  X(050)    VALUE                     
           '*** AREA DE TRATAMENTO DE ERROS CICS ***'.                          
      *----------------------------------------------------------------*        
       01  WRK-AREA-ERRO-CICS.                                                  
           COPY 'I#FRWKCI'.                                                     
                                                                                
      *----------------------------------------------------------------*        
       77  FILLER                      PIC X(050)     VALUE                     
           'AREA DE TRATAMENTO DE ERROS DE MODULO'.                             
      *----------------------------------------------------------------*        
       01  WRK-AREA-ERRO-MODULO.                                                
           COPY 'I#FRWKMD'.                                                     
                                                                                
      *----------------------------------------------------------------*        
       77  FILLER                      PIC  X(050)    VALUE                     
           '*** CBCD3AAC - AREA DE BOOKS FUNCIONAL ***'.                        
      *----------------------------------------------------------------*        
       01  WRK-AREA-CBCD3AAC.                                                   
           COPY CBCDW00V.                                                       
           COPY CBCDWAAI.                                                       
                                                                                
      *----------------------------------------------------------------*        
       77  FILLER                      PIC  X(050)    VALUE                     
           '*** CMCD3AAC - AREA DE BOOKS FUNCIONAL ***'.                        
      *----------------------------------------------------------------*        
       01  WRK-AREA-CMCD3AAC.                                                   
           COPY CMCDWAAI.                                                       
                                                                                
      *----------------------------------------------------------------*        
       77  FILLER                      PIC  X(050)    VALUE                     
           '*** CMCD420A - AREA DE BOOKS FUNCIONAL ***'.                        
      *----------------------------------------------------------------*        
       01  WRK-AREA-CMCD420A.                                                   
           COPY CMCPW000.                                                       
           COPY CMCDW20I.                                                       
                                                                                
      *----------------------------------------------------------------*        
       77  FILLER                      PIC  X(050)    VALUE                     
           '*** CMCD421A - AREA DE BOOKS FUNCIONAL ***'.                        
      *----------------------------------------------------------------*        
       01  WRK-AREA-CMCD421A.                                                   
           COPY CMCPW000.                                                       
           COPY CMCDW21I.                                                       
                                                                                
      *----------------------------------------------------------------*        
       77  FILLER                      PIC  X(050)    VALUE                     
           '*** CMCD3QBA - VARIAVEIS AUXILIARES ***'.                           
      *----------------------------------------------------------------*        
       01  WRK-VARIAVEIS-AUXILIARES.                                            
           05  WRK-FRWK1999            PIC  X(008)    VALUE 'FRWK1999'.         
           05  WRK-PROGRAMA            PIC  X(008)    VALUE 'CMCD3QBA'.         
           05  WRK-CMCD3AAC            PIC  X(008)    VALUE 'CMCD3AAC'.         
           05  WRK-CBCD3AAC            PIC  X(008)    VALUE 'CBCD3AAC'.         
           05  WRK-CMCD420A            PIC  X(008)    VALUE 'CMCD420A'.         
           05  WRK-CMCD421A            PIC  X(008)    VALUE 'CMCD421A'.         
           05  WRK-TRATAMENTO-ERROS.                                            
               10  WRK-MENSAGEM        PIC  X(008)    VALUE SPACES.             
               10  WRK-IDIOMA          PIC  9(005)    VALUE ZEROS.              
               10  WRK-PARAMETROS      PIC  X(500)    VALUE SPACES.             
                                                                                
       01  WRK-CPSSOA-JUR-CONTR-S      PIC +9(010) VALUE ZEROS.                 
       01  FILLER                      REDEFINES WRK-CPSSOA-JUR-CONTR-S.        
           05 FILLER                   PIC  X(001).                             
           05 WRK-CPSSOA-JUR-CONTR-R   PIC  9(010).                             
                                                                                
       01  WRK-CTPO-CONTR-NEGOC-S      PIC +9(003) VALUE ZEROS.                 
       01  FILLER                      REDEFINES WRK-CTPO-CONTR-NEGOC-S.        
           05 FILLER                   PIC  X(001).                             
           05 WRK-CTPO-CONTR-NEGOC-R   PIC  9(003).                             
                                                                                
       01  WRK-NSEQ-CONTR-NEGOC-S      PIC +9(010) VALUE ZEROS.                 
       01  FILLER                      REDEFINES WRK-NSEQ-CONTR-NEGOC-S.        
           05 FILLER                   PIC  X(001).                             
           05 WRK-NSEQ-CONTR-NEGOC-R   PIC  9(010).                             
                                                                                
      *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - *        
       01  FILLER                      PIC  X(050)         VALUE                
           'AREA PARA INCLUDES DB2'.                                            
      *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - *        
                                                                                
           EXEC SQL                                                             
                INCLUDE SQLCA                                                   
           END-EXEC.                                                            
                                                                                
           EXEC SQL                                                             
                INCLUDE CBCDB023                                                
           END-EXEC.                                                            
                                                                                
      *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - *        
       01  FILLER                      PIC  X(050)         VALUE                
           'AREA PARA CURSORES'.                                                
      *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - *        
                                                                                
           EXEC SQL                                                             
                DECLARE  CSR01-CBCDB023  CURSOR  FOR                            
                SELECT CPSSOA_JURID_CONTR,                                      
                       CTPO_CONTR_NEGOC  ,                                      
                       NSEQ_CONTR_NEGOC                                         
                FROM DB2PRD.TCTA_BCRIA_COBR                                     
                WHERE  CBCO_EXTER_CONTR  = :CBCDB023.CBCO-EXTER-CONTR           
                  AND  CAG_EXTER_CONTR   = :CBCDB023.CAG-EXTER-CONTR            
                  AND  NCTA_EXTER_CONTR  = :CBCDB023.NCTA-EXTER-CONTR           
           END-EXEC.                                                            
                                                                                
      *----------------------------------------------------------------*        
       77  FILLER                      PIC  X(050)    VALUE                     
           '* FIM DA AREA DE WORKING *'.                                        
      *----------------------------------------------------------------*        
                                                                                
      *----------------------------------------------------------------*        
       LINKAGE                         SECTION.                                 
      *----------------------------------------------------------------*        
       01  DFHCOMMAREA.                                                         
           COPY CMCPW000.                                                       
           COPY CMCDWQBI.                                                       
                                                                                
      *================================================================*        
       PROCEDURE DIVISION              USING DFHCOMMAREA.                       
      *================================================================*        
                                                                                
      *----------------------------------------------------------------*        
       0000-ROTINA-PRINCIPAL           SECTION.                                 
      *----------------------------------------------------------------*        
                                                                                
           PERFORM 1000-PROCEDIMENTOS-INICIAIS.                                 
                                                                                
           PERFORM 2000-PROCESSAMENTO-PRINCIPAL.                                
                                                                                
           PERFORM 9000-PROCEDIMENTOS-FINAIS.                                   
                                                                                
      *----------------------------------------------------------------*        
       0000-99-FIM.                    EXIT.                                    
      *----------------------------------------------------------------*        
                                                                                
      *----------------------------------------------------------------*        
       1000-PROCEDIMENTOS-INICIAIS     SECTION.                                 
      *----------------------------------------------------------------*        
                                                                                
           INITIALIZE   FRWKGHEA-REGISTRO                                       
                        FRWKGMOD-REGISTRO                                       
                        FRWKGCIC-REGISTRO                                       
                        FRWKGERR-REGISTRO                                       
                        FRWKGDB2-REGISTRO                                       
                        WRK-TRATAMENTO-ERROS                                    
                        WRK-AREA-CMCD3AAC                                       
                        WRK-AREA-CMCD420A                                       
                        WRK-AREA-CMCD421A                                       
                        CMCPW000-BLOCO-RETORNO OF DFHCOMMAREA.                  
                                                                                
           PERFORM 1100-VALIDAR-SEGURANCA.                                      
           PERFORM 1200-CONSITIR-ENTRADA.                                       
                                                                                
      *----------------------------------------------------------------*        
       1000-99-FIM.                    EXIT.                                    
      *----------------------------------------------------------------*        
                                                                                
      *----------------------------------------------------------------*        
       1100-VALIDAR-SEGURANCA          SECTION.                                 
      *----------------------------------------------------------------*        
                                                                                
           MOVE '1100-VALIDAR-SEGURANCA'                                        
                                       TO FRWKGHEA-IDEN-PARAGRAFO.              
                                                                                
           INITIALIZE                  CBCDW00V-BLOCO-RETORNO                   
                                       OF WRK-AREA-CBCD3AAC                     
                                       CBCDWAAI-BLOCO-ENTRADA.                  
                                                                                
           MOVE CMCDWQBI-CUSUAR-INCL   TO CBCDWAAI-E-CUSUAR                     
           MOVE ZEROS                  TO CBCDWAAI-E-CFUNCL.                    
                                                                                
           EXEC CICS LINK                                                       
                PROGRAM  (WRK-CBCD3AAC)                                         
                COMMAREA (WRK-AREA-CBCD3AAC)                                    
                LENGTH   (LENGTH OF WRK-AREA-CBCD3AAC)                          
                NOHANDLE                                                        
           END-EXEC.                                                            
                                                                                
           IF  EIBRESP                 NOT EQUAL DFHRESP(NORMAL)                
               MOVE 16                 TO CMCPW000-COD-RETORNO                  
                                       OF DFHCOMMAREA                           
               MOVE 'E010'             TO CMCPW000-COD-ERRO                     
                                       OF DFHCOMMAREA                           
               MOVE 'CMCD0010'         TO CMCPW000-COD-MENSAGEM                 
                                       OF DFHCOMMAREA                           
               PERFORM 9100-ERRO-CICS                                           
           END-IF.                                                              
                                                                                
           IF  CBCDW00V-COD-RETORNO    OF WRK-AREA-CBCD3AAC                     
                                       NOT EQUAL ZEROS AND 01                   
               MOVE 12                 TO CMCPW000-COD-RETORNO                  
                                       OF DFHCOMMAREA                           
               MOVE 'E020'             TO CMCPW000-COD-ERRO                     
                                       OF DFHCOMMAREA                           
               MOVE 'CMCD0009'         TO CMCPW000-COD-MENSAGEM                 
                                       OF DFHCOMMAREA                           
               PERFORM 9300-ERRO-MODULO                                         
           END-IF.                                                              
                                                                                
      *----------------------------------------------------------------*        
       1100-99-FIM.                    EXIT.                                    
      *----------------------------------------------------------------*        
                                                                                
      *----------------------------------------------------------------*        
       1200-CONSITIR-ENTRADA          SECTION.                                  
      *----------------------------------------------------------------*        
                                                                                
           IF  CMCDWQBI-CBCO           NOT NUMERIC OR                           
               CMCDWQBI-CBCO           EQUAL ZEROS                              
               MOVE 08                 TO CMCPW000-COD-RETORNO                  
                                       OF DFHCOMMAREA                           
               MOVE 'E030'             TO CMCPW000-COD-ERRO                     
                                       OF DFHCOMMAREA                           
               MOVE 'CMCD0007'         TO CMCPW000-COD-MENSAGEM                 
                                       OF DFHCOMMAREA                           
               PERFORM 9000-PROCEDIMENTOS-FINAIS                                
           END-IF.                                                              
                                                                                
           IF  CMCDWQBI-CAGE           NOT NUMERIC OR                           
               CMCDWQBI-CAGE           EQUAL ZEROS                              
               MOVE 08                 TO CMCPW000-COD-RETORNO                  
                                       OF DFHCOMMAREA                           
               MOVE 'E040'             TO CMCPW000-COD-ERRO                     
                                       OF DFHCOMMAREA                           
               MOVE 'CMCD0007'         TO CMCPW000-COD-MENSAGEM                 
                                       OF DFHCOMMAREA                           
               PERFORM 9000-PROCEDIMENTOS-FINAIS                                
           END-IF.                                                              
                                                                                
           IF  CMCDWQBI-CCTA           NOT NUMERIC OR                           
               CMCDWQBI-CCTA           EQUAL ZEROS                              
               MOVE 08                 TO CMCPW000-COD-RETORNO                  
                                       OF DFHCOMMAREA                           
               MOVE 'E050'             TO CMCPW000-COD-ERRO                     
                                       OF DFHCOMMAREA                           
               MOVE 'CMCD0007'         TO CMCPW000-COD-MENSAGEM                 
                                       OF DFHCOMMAREA                           
               PERFORM 9000-PROCEDIMENTOS-FINAIS                                
           END-IF.                                                              
                                                                                
           IF  CMCDWQBI-CTPO-CANAL-E   NOT NUMERIC OR                           
               CMCDWQBI-CTPO-CANAL-E   EQUAL ZEROS                              
               MOVE 08                 TO CMCPW000-COD-RETORNO                  
                                       OF DFHCOMMAREA                           
               MOVE 'E060'             TO CMCPW000-COD-ERRO                     
                                       OF DFHCOMMAREA                           
               MOVE 'CMCD0007'         TO CMCPW000-COD-MENSAGEM                 
                                       OF DFHCOMMAREA                           
               PERFORM 9000-PROCEDIMENTOS-FINAIS                                
           END-IF.                                                              
                                                                                
           IF  CMCDWQBI-RTPO-CANAL-E   EQUAL SPACES                             
               MOVE 08                 TO CMCPW000-COD-RETORNO                  
                                       OF DFHCOMMAREA                           
               MOVE 'E070'             TO CMCPW000-COD-ERRO                     
                                       OF DFHCOMMAREA                           
               MOVE 'CMCD0007'         TO CMCPW000-COD-MENSAGEM                 
                                       OF DFHCOMMAREA                           
               PERFORM 9000-PROCEDIMENTOS-FINAIS                                
           END-IF.                                                              
                                                                                
           IF  CMCDWQBI-VLIM-INSTC     NOT NUMERIC OR                           
               CMCDWQBI-VLIM-INSTC     EQUAL ZEROS                              
               MOVE 08                 TO CMCPW000-COD-RETORNO                  
                                       OF DFHCOMMAREA                           
               MOVE 'E080'             TO CMCPW000-COD-ERRO                     
                                       OF DFHCOMMAREA                           
               MOVE 'CMCD0007'         TO CMCPW000-COD-MENSAGEM                 
                                       OF DFHCOMMAREA                           
               PERFORM 9000-PROCEDIMENTOS-FINAIS                                
           END-IF.                                                              
                                                                                
           IF  CMCDWQBI-VLIM-OUTRA     NOT NUMERIC OR                           
               CMCDWQBI-VLIM-OUTRA     EQUAL ZEROS                              
               MOVE 08                 TO CMCPW000-COD-RETORNO                  
                                       OF DFHCOMMAREA                           
               MOVE 'E090'             TO CMCPW000-COD-ERRO                     
                                       OF DFHCOMMAREA                           
               MOVE 'CMCD0007'         TO CMCPW000-COD-MENSAGEM                 
                                       OF DFHCOMMAREA                           
               PERFORM 9000-PROCEDIMENTOS-FINAIS                                
           END-IF.                                                              
                                                                                
           IF  CMCDWQBI-VLIM-INSTC-CANAL                                        
                                       NOT NUMERIC OR                           
               CMCDWQBI-VLIM-INSTC-CANAL                                        
                                       EQUAL ZEROS                              
               MOVE 08                 TO CMCPW000-COD-RETORNO                  
                                       OF DFHCOMMAREA                           
               MOVE 'E100'             TO CMCPW000-COD-ERRO                     
                                       OF DFHCOMMAREA                           
               MOVE 'CMCD0007'         TO CMCPW000-COD-MENSAGEM                 
                                       OF DFHCOMMAREA                           
               PERFORM 9000-PROCEDIMENTOS-FINAIS                                
           END-IF.                                                              
                                                                                
           IF  CMCDWQBI-VLIM-OUTRA-CANAL                                        
                                       NOT NUMERIC OR                           
               CMCDWQBI-VLIM-OUTRA-CANAL                                        
                                       EQUAL ZEROS                              
               MOVE 08                 TO CMCPW000-COD-RETORNO                  
                                       OF DFHCOMMAREA                           
               MOVE 'E110'             TO CMCPW000-COD-ERRO                     
                                       OF DFHCOMMAREA                           
               MOVE 'CMCD0007'         TO CMCPW000-COD-MENSAGEM                 
                                       OF DFHCOMMAREA                           
               PERFORM 9000-PROCEDIMENTOS-FINAIS                                
           END-IF.                                                              
                                                                                
           IF  CMCDWQBI-HINCL-USUAR    EQUAL SPACES                             
               MOVE 08                 TO CMCPW000-COD-RETORNO                  
                                       OF DFHCOMMAREA                           
               MOVE 'E115'             TO CMCPW000-COD-ERRO                     
                                       OF DFHCOMMAREA                           
               MOVE 'CMCD0007'         TO CMCPW000-COD-MENSAGEM                 
                                       OF DFHCOMMAREA                           
               PERFORM 9000-PROCEDIMENTOS-FINAIS                                
           END-IF.                                                              
                                                                                
      *----------------------------------------------------------------*        
       1200-99-FIM.                    EXIT.                                    
      *----------------------------------------------------------------*        
                                                                                
      *----------------------------------------------------------------*        
       2000-PROCESSAMENTO-PRINCIPAL    SECTION.                                 
      *----------------------------------------------------------------*        
                                                                                
           PERFORM 2100-ABRIR-CURSOR.                                           
                                                                                
           PERFORM 2200-LER-CURSOR.                                             
                                                                                
           IF SQLCODE                  EQUAL +100                               
              PERFORM 2600-ACESSAR-CMCD421A                                     
           ELSE                                                                 
              PERFORM 2300-ALTERACAO-LIMITE                                     
           END-IF.                                                              
                                                                                
           PERFORM 2700-FECHAR-CURSOR.                                          
                                                                                
      *----------------------------------------------------------------*        
       2000-99-FIM.                    EXIT.                                    
      *----------------------------------------------------------------*        
                                                                                
      *----------------------------------------------------------------*        
       2100-ABRIR-CURSOR               SECTION.                                 
      *----------------------------------------------------------------*        
                                                                                
           MOVE '2100-ABRIR-CURSOR'    TO FRWKGHEA-IDEN-PARAGRAFO.              
                                                                                
           MOVE CMCDWQBI-CBCO          TO CBCO-EXTER-CONTR                      
                                       OF CBCDB023.                             
           MOVE CMCDWQBI-CAGE          TO CAG-EXTER-CONTR                       
                                       OF CBCDB023.                             
           MOVE CMCDWQBI-CCTA          TO NCTA-EXTER-CONTR                      
                                       OF CBCDB023.                             
                                                                                
           EXEC SQL                                                             
                OPEN CSR01-CBCDB023                                             
           END-EXEC.                                                            
                                                                                
           IF (SQLCODE                      NOT EQUAL ZEROS) OR                 
              (SQLWARN0                     EQUAL 'W')                          
               SET ERRO-DB2                 TO TRUE                             
               SET DB2-OPEN                 TO TRUE                             
               MOVE 16                      TO CMCPW000-COD-RETORNO             
                                            OF DFHCOMMAREA                      
               MOVE 'E130'                  TO CMCPW000-COD-ERRO                
                                            OF DFHCOMMAREA                      
               MOVE 'CMCD0024'              TO CMCPW000-COD-MENSAGEM            
                                            OF DFHCOMMAREA                      
               MOVE 'TCTA_BCRIA_COBR'       TO FRWKGDB2-NOME-TABELA             
               PERFORM 9998-TRATAR-ERRO                                         
           END-IF.                                                              
                                                                                
      *----------------------------------------------------------------*        
       2100-99-FIM.                    EXIT.                                    
      *----------------------------------------------------------------*        
                                                                                
      *----------------------------------------------------------------*        
       2200-LER-CURSOR                 SECTION.                                 
      *----------------------------------------------------------------*        
                                                                                
           MOVE '2200-LER-CURSOR'      TO FRWKGHEA-IDEN-PARAGRAFO.              
                                                                                
           EXEC SQL                                                             
                FETCH  CSR01-CBCDB023                                           
                 INTO :CBCDB023.CPSSOA-JURID-CONTR,                             
                      :CBCDB023.CTPO-CONTR-NEGOC  ,                             
                      :CBCDB023.NSEQ-CONTR-NEGOC                                
           END-EXEC.                                                            
                                                                                
           IF (SQLCODE                 NOT EQUAL ZEROS AND +100) OR             
              (SQLWARN0                EQUAL 'W')                               
               MOVE 16                 TO CMCPW000-COD-RETORNO                  
                                       OF DFHCOMMAREA                           
               MOVE 'E140'             TO CMCPW000-COD-ERRO                     
                                       OF DFHCOMMAREA                           
               MOVE 'CMCD0024'         TO CMCPW000-COD-MENSAGEM                 
                                       OF DFHCOMMAREA                           
               PERFORM 9998-TRATAR-ERRO                                         
           END-IF.                                                              
                                                                                
                                                                                
      *----------------------------------------------------------------*        
       2200-99-FIM.                    EXIT.                                    
      *----------------------------------------------------------------*        
                                                                                
      *----------------------------------------------------------------*        
       2300-ALTERACAO-LIMITE            SECTION.                                
      *----------------------------------------------------------------*        
                                                                                
           PERFORM 2400-ACESSAR-CMCD3AAC.                                       
                                                                                
           IF CMCDWAAI-COD-RETORNO     EQUAL ZEROS                              
              PERFORM 2500-ACESSAR-CMCD420A                                     
           ELSE                                                                 
              IF CMCDWAAI-COD-RETORNO  EQUAL 10 OR 88                           
                 MOVE CMCDWAAI-COD-RETORNO                                      
                                       TO CMCPW000-COD-RETORNO                  
                                       OF DFHCOMMAREA                           
                 MOVE 'E160'           TO CMCPW000-COD-ERRO                     
                                       OF DFHCOMMAREA                           
                 MOVE 'CMCD0008'       TO CMCPW000-COD-MENSAGEM                 
                                       OF DFHCOMMAREA                           
                 PERFORM 9000-PROCEDIMENTOS-FINAIS                              
              ELSE                                                              
                 IF CMCDWAAI-COD-RETORNO                                        
                                       EQUAL 01                                 
                    MOVE CMCDWAAI-COD-RETORNO                                   
                                       TO CMCPW000-COD-RETORNO                  
                                       OF DFHCOMMAREA                           
                    MOVE 'E170'        TO CMCPW000-COD-ERRO                     
                                       OF DFHCOMMAREA                           
                    MOVE 'CMCD0023'    TO CMCPW000-COD-MENSAGEM                 
                                       OF DFHCOMMAREA                           
                    PERFORM 9000-PROCEDIMENTOS-FINAIS                           
                 END-IF                                                         
              END-IF                                                            
           END-IF.                                                              
                                                                                
      *----------------------------------------------------------------*        
       2300-99-FIM.                    EXIT.                                    
      *----------------------------------------------------------------*        
                                                                                
      *----------------------------------------------------------------*        
       2400-ACESSAR-CMCD3AAC           SECTION.                                 
      *----------------------------------------------------------------*        
                                                                                
           MOVE '2400-ACESSAR-CMCD3AAC'                                         
                                       TO FRWKGHEA-IDEN-PARAGRAFO.              
                                                                                
           MOVE CPSSOA-JURID-CONTR     OF CBCDB023                              
                                       TO WRK-CPSSOA-JUR-CONTR-S.               
           MOVE WRK-CPSSOA-JUR-CONTR-R TO CMCDWAAI-CPSSOA-JUR-CONTR-E.          
           MOVE CTPO-CONTR-NEGOC       OF CBCDB023                              
                                       TO WRK-CTPO-CONTR-NEGOC-S.               
           MOVE WRK-CTPO-CONTR-NEGOC-R TO CMCDWAAI-CTPO-CONTR-NEG-E.            
           MOVE NSEQ-CONTR-NEGOC       OF CBCDB023                              
                                       TO WRK-NSEQ-CONTR-NEGOC-S.               
           MOVE WRK-NSEQ-CONTR-NEGOC-R TO CMCDWAAI-NSEQ-CONTR-NEG-E.            
                                                                                
           EXEC CICS LINK                                                       
                PROGRAM  (WRK-CMCD3AAC)                                         
                COMMAREA (WRK-AREA-CMCD3AAC)                                    
                LENGTH   (LENGTH OF WRK-AREA-CMCD3AAC)                          
                NOHANDLE                                                        
           END-EXEC.                                                            
                                                                                
           IF  EIBRESP                 NOT EQUAL DFHRESP(NORMAL)                
               MOVE 16                 TO CMCPW000-COD-RETORNO                  
                                       OF DFHCOMMAREA                           
               MOVE 'E150'             TO CMCPW000-COD-ERRO                     
                                       OF DFHCOMMAREA                           
               MOVE 'CMCD0010'         TO CMCPW000-COD-MENSAGEM                 
                                       OF DFHCOMMAREA                           
               PERFORM 9100-ERRO-CICS                                           
           END-IF.                                                              
                                                                                
      *----------------------------------------------------------------*        
       2400-99-FIM.                    EXIT.                                    
      *----------------------------------------------------------------*        
                                                                                
      *----------------------------------------------------------------*        
       2500-ACESSAR-CMCD420A           SECTION.                                 
      *----------------------------------------------------------------*        
                                                                                
           MOVE '2500-ACESSAR-CMCD420A'                                         
                                       TO FRWKGHEA-IDEN-PARAGRAFO.              
                                                                                
           MOVE CMCDWAAI-CPSSOA-JUR-CONTR-S                                     
                                       TO CMCDW20I-CPSSOA-JURID-CTA.            
           MOVE CMCDWAAI-CTPO-CONTR-NEG-S                                       
                                       TO CMCDW20I-CTPO-CONTR-CTA.              
           MOVE CMCDWAAI-NSEQ-CONTR-NEG-S                                       
                                       TO CMCDW20I-NSEQ-CONTR-CTA.              
           MOVE CMCDWQBI-CTPO-CANAL-E  TO CMCDW20I-CTPO-CANAL.                  
           MOVE CMCDWQBI-VLIM-INSTC-A  TO CMCDW20I-VLIM-PGTO-INSTC-A.           
           MOVE CMCDWQBI-VLIM-OUTRA-A  TO CMCDW20I-VLIM-PGTO-OUTRA-A.           
           MOVE CMCDWQBI-VLIM-INSTC-CANAL-A                                     
                                       TO CMCDW20I-VLIM-INSTC-CANAL-A.          
           MOVE CMCDWQBI-VLIM-OUTRA-CANAL-A                                     
                                       TO CMCDW20I-VLIM-OUTRA-CANAL-A.          
           MOVE CMCDWQBI-VLIM-INSTC    TO CMCDW20I-VLIM-PGTO-INSTC.             
           MOVE CMCDWQBI-VLIM-OUTRA    TO CMCDW20I-VLIM-PGTO-OUTRA.             
           MOVE CMCDWQBI-VLIM-INSTC-CANAL                                       
                                       TO CMCDW20I-VLIM-INSTC-CANAL.            
           MOVE CMCDWQBI-VLIM-OUTRA-CANAL                                       
                                       TO CMCDW20I-VLIM-OUTRA-CANAL.            
           MOVE CMCDWQBI-CUSUAR-INCL   TO CMCDW20I-CUSUAR-MANUT.                
           MOVE CMCDWQBI-HINCL-USUAR   TO CMCDW20I-HMANUT-REG.                  
                                                                                
           EXEC CICS LINK                                                       
                PROGRAM  (WRK-CMCD420A)                                         
                COMMAREA (WRK-AREA-CMCD420A)                                    
                LENGTH   (LENGTH OF WRK-AREA-CMCD420A)                          
                NOHANDLE                                                        
           END-EXEC.                                                            
                                                                                
           IF  EIBRESP                 NOT EQUAL DFHRESP(NORMAL)                
               MOVE 16                 TO CMCPW000-COD-RETORNO                  
                                       OF DFHCOMMAREA                           
               MOVE 'E180'             TO CMCPW000-COD-ERRO                     
                                       OF DFHCOMMAREA                           
               MOVE 'CMCD0010'         TO CMCPW000-COD-MENSAGEM                 
                                       OF DFHCOMMAREA                           
               PERFORM 9100-ERRO-CICS                                           
           END-IF.                                                              
                                                                                
           IF CMCPW000-COD-RETORNO     OF WRK-AREA-CMCD420A                     
                                       NOT EQUAL ZEROS                          
              MOVE CMCPW000-COD-RETORNO                                         
                                       OF WRK-AREA-CMCD420A                     
                                       TO CMCPW000-COD-RETORNO                  
                                       OF DFHCOMMAREA                           
              MOVE 'E190'              TO CMCPW000-COD-ERRO                     
                                       OF DFHCOMMAREA                           
              MOVE 'CMCD0008'          TO CMCPW000-COD-MENSAGEM                 
                                       OF DFHCOMMAREA                           
           ELSE                                                                 
              MOVE 'CMCD0002'          TO CMCPW000-COD-MENSAGEM                 
                                       OF DFHCOMMAREA                           
           END-IF.                                                              
                                                                                
      *----------------------------------------------------------------*        
       2500-99-FIM.                    EXIT.                                    
      *----------------------------------------------------------------*        
                                                                                
      *----------------------------------------------------------------*        
       2600-ACESSAR-CMCD421A           SECTION.                                 
      *----------------------------------------------------------------*        
                                                                                
           MOVE '2600-ACESSAR-CMCD421A'                                         
                                       TO FRWKGHEA-IDEN-PARAGRAFO.              
                                                                                
           MOVE CMCDWQBI-CBCO          TO CMCDW21I-CBCO.                        
           MOVE CMCDWQBI-CAGE          TO CMCDW21I-CAG-BCRIA.                   
           MOVE CMCDWQBI-CCTA          TO CMCDW21I-CCTA-CORR-EXTER.             
           MOVE CMCDWQBI-CTPO-CANAL-E  TO CMCDW21I-CMIDIA-PGTO-TITLO.           
                                                                                
           MOVE CMCDWQBI-VLIM-INSTC-CANAL-A                                     
                                       TO CMCDW21I-VCLI-MIDIA-BDSCO-A.          
           MOVE CMCDWQBI-VLIM-OUTRA-CANAL-A                                     
                                       TO CMCDW21I-VCLI-MIDIA-OUTRO-A.          
           MOVE CMCDWQBI-VLIM-INSTC-A  TO CMCDW21I-VMAX-INDVD-BDSCO-A.          
           MOVE CMCDWQBI-VLIM-OUTRA-CANAL-A                                     
                                       TO CMCDW21I-VMAX-INDVD-OUTRO-A.          
           MOVE CMCDWQBI-VLIM-INSTC-CANAL                                       
                                       TO CMCDW21I-VCLI-MIDIA-BDSCO.            
           MOVE CMCDWQBI-VLIM-OUTRA-CANAL                                       
                                       TO CMCDW21I-VCLI-MIDIA-OUTRO.            
           MOVE CMCDWQBI-VLIM-INSTC    TO CMCDW21I-VMAX-INDVD-BDSCO.            
           MOVE CMCDWQBI-VLIM-OUTRA-CANAL                                       
                                       TO CMCDW21I-VMAX-INDVD-OUTRO.            
                                                                                
           EXEC CICS LINK                                                       
                PROGRAM  (WRK-CMCD421A)                                         
                COMMAREA (WRK-AREA-CMCD421A)                                    
                LENGTH   (LENGTH OF WRK-AREA-CMCD421A)                          
                NOHANDLE                                                        
           END-EXEC.                                                            
                                                                                
           IF  EIBRESP                 NOT EQUAL DFHRESP(NORMAL)                
               MOVE 16                 TO CMCPW000-COD-RETORNO                  
                                       OF DFHCOMMAREA                           
               MOVE 'E200'             TO CMCPW000-COD-ERRO                     
                                       OF DFHCOMMAREA                           
               MOVE 'CMCD0010'         TO CMCPW000-COD-MENSAGEM                 
                                       OF DFHCOMMAREA                           
               PERFORM 9100-ERRO-CICS                                           
           END-IF.                                                              
                                                                                
           IF CMCPW000-COD-RETORNO     OF WRK-AREA-CMCD421A                     
                                       NOT EQUAL ZEROS                          
              MOVE CMCPW000-COD-RETORNO                                         
                                       OF WRK-AREA-CMCD421A                     
                                       TO CMCPW000-COD-RETORNO                  
                                       OF DFHCOMMAREA                           
              MOVE 'E210'              TO CMCPW000-COD-ERRO                     
                                       OF DFHCOMMAREA                           
              MOVE 'CMCD0008'          TO CMCPW000-COD-MENSAGEM                 
                                       OF DFHCOMMAREA                           
           ELSE                                                                 
              MOVE CMCPW000-COD-RETORNO                                         
                                       OF WRK-AREA-CMCD421A                     
                                       TO CMCPW000-COD-RETORNO                  
                                       OF DFHCOMMAREA                           
              MOVE CMCPW000-COD-MENSAGEM                                        
                                       OF WRK-AREA-CMCD421A                     
                                       TO CMCPW000-COD-MENSAGEM                 
                                       OF DFHCOMMAREA                           
           END-IF.                                                              
                                                                                
      *----------------------------------------------------------------*        
       2600-99-FIM.                    EXIT.                                    
      *----------------------------------------------------------------*        
                                                                                
      *----------------------------------------------------------------*        
       2700-FECHAR-CURSOR              SECTION.                                 
      *----------------------------------------------------------------*        
                                                                                
           MOVE '2700-FECHAR-CURSOR'    TO FRWKGHEA-IDEN-PARAGRAFO.             
                                                                                
           EXEC SQL                                                             
                CLOSE CSR01-CBCDB023                                            
           END-EXEC.                                                            
                                                                                
           IF (SQLCODE                      NOT EQUAL ZEROS) OR                 
              (SQLWARN0                     EQUAL 'W')                          
               SET ERRO-DB2                 TO TRUE                             
               SET DB2-CLOSE                TO TRUE                             
               MOVE 16                      TO CMCPW000-COD-RETORNO             
                                            OF DFHCOMMAREA                      
               MOVE 'E220'                  TO CMCPW000-COD-ERRO                
                                            OF DFHCOMMAREA                      
               MOVE 'CMCD0007'              TO CMCPW000-COD-MENSAGEM            
                                            OF DFHCOMMAREA                      
               MOVE 'TCTA_BCRIA_COBR'       TO FRWKGDB2-NOME-TABELA             
               PERFORM 9998-TRATAR-ERRO                                         
           END-IF.                                                              
                                                                                
      *----------------------------------------------------------------*        
       2700-99-FIM.                    EXIT.                                    
      *----------------------------------------------------------------*        
                                                                                
      *----------------------------------------------------------------*        
       9000-PROCEDIMENTOS-FINAIS       SECTION.                                 
      *----------------------------------------------------------------*        
                                                                                
           EXEC CICS                                                            
               RETURN                                                           
           END-EXEC.                                                            
                                                                                
      *----------------------------------------------------------------*        
       9000-99-FIM.                    EXIT.                                    
      *----------------------------------------------------------------*        
                                                                                
      *----------------------------------------------------------------*        
       9100-ERRO-CICS                  SECTION.                                 
      *----------------------------------------------------------------*        
                                                                                
           SET  ERRO-CICS              TO TRUE.                                 
                                                                                
           MOVE WRK-PROGRAMA           TO FRWKGHEA-NOME-PROGRAMA.               
           MOVE FRWKGCIC-TAM-LAYOUT    TO FRWKGHEA-TAM-DADOS                    
           MOVE EIBFN                  TO FRWKGCIC-EIBFN.                       
           MOVE EIBRCODE               TO FRWKGCIC-EIBRCODE.                    
           MOVE EIBRSRCE               TO FRWKGCIC-EIBRSRCE.                    
           MOVE EIBRESP                TO FRWKGCIC-EIBRESP.                     
           MOVE EIBRESP2               TO FRWKGCIC-EIBRESP2.                    
           MOVE EIBTASKN               TO FRWKGCIC-EIBTASKN.                    
           MOVE WRK-AREA-ERRO-CICS     TO WRK-BLOCO-INFO-ERRO                   
                                            (1:FRWKGHEA-TAM-DADOS).             
                                                                                
           PERFORM 9999-CHAMAR-API-ERROS.                                       
                                                                                
      *----------------------------------------------------------------*        
       9100-99-FIM.                    EXIT.                                    
      *----------------------------------------------------------------*        
                                                                                
      *----------------------------------------------------------------*        
       9300-ERRO-MODULO                SECTION.                                 
      *----------------------------------------------------------------*        
                                                                                
           SET  ERRO-MODULO            TO TRUE.                                 
                                                                                
           MOVE WRK-PROGRAMA           TO FRWKGHEA-NOME-PROGRAMA.               
           MOVE FRWKGMOD-TAM-LAYOUT    TO FRWKGHEA-TAM-DADOS.                   
           MOVE WRK-AREA-ERRO-MODULO   TO WRK-BLOCO-INFO-ERRO                   
                                            (1:FRWKGHEA-TAM-DADOS).             
                                                                                
           PERFORM 9999-CHAMAR-API-ERROS.                                       
                                                                                
      *----------------------------------------------------------------*        
       9300-99-FIM.                    EXIT.                                    
      *----------------------------------------------------------------*        
                                                                                
      *----------------------------------------------------------------*        
       9998-TRATAR-ERRO                SECTION.                                 
      *----------------------------------------------------------------*        
                                                                                
           MOVE WRK-PROGRAMA           TO FRWKGHEA-NOME-PROGRAMA.               
                                                                                
           EVALUATE TRUE                                                        
                                                                                
               WHEN ERRO-DB2                                                    
                   MOVE FRWKGHEA-IDEN-PARAGRAFO(1:16)                           
                                              TO FRWKGDB2-LOCAL                 
                   MOVE FRWKGDB2-TAM-LAYOUT   TO FRWKGHEA-TAM-DADOS             
                   MOVE SQLSTATE              TO FRWKGDB2-SQLSTATE              
                   MOVE SQLCA                 TO FRWKGDB2-SQLCA                 
                   MOVE WRK-AREA-ERRO-DB2     TO WRK-BLOCO-INFO-ERRO            
                                                 (1:FRWKGHEA-TAM-DADOS)         
                                                                                
           END-EVALUATE.                                                        
                                                                                
           PERFORM 9999-CHAMAR-API-ERROS.                                       
                                                                                
      *----------------------------------------------------------------*        
       9998-99-FIM.                    EXIT.                                    
      *----------------------------------------------------------------*        
                                                                                
      *----------------------------------------------------------------*        
       9999-CHAMAR-API-ERROS           SECTION.                                 
      *----------------------------------------------------------------*        
                                                                                
           EXEC CICS LINK                                                       
                PROGRAM (WRK-FRWK1999)                                          
                COMMAREA(WRK-AREA-ERRO)                                         
                LENGTH(LENGTH OF WRK-AREA-ERRO)                                 
                NOHANDLE                                                        
           END-EXEC.                                                            
                                                                                
           IF  EIBRESP                 NOT EQUAL DFHRESP(NORMAL)                
               CONTINUE                                                         
           END-IF.                                                              
                                                                                
           PERFORM 9000-PROCEDIMENTOS-FINAIS.                                   
                                                                                
      *----------------------------------------------------------------*        
       9999-99-FIM.                    EXIT.                                    
      *----------------------------------------------------------------*        
