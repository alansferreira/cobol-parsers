       WORKING-STORAGE                 SECTION.
      *----------------------------------------------------------------*
      *----------------------------------------------------------------*
       77  FILLER                      PIC  X(050)         VALUE
           '* INICIO DA WORKING STORAGE SECTION *'.
      *----------------------------------------------------------------*
      *----------------------------------------------------------------*
       77  FILLER                      PIC  X(050)         VALUE
           '* AREA DE COMUNICACAO DO PROGRAMA FRWK2999 *'.
      *----------------------------------------------------------------*
       01  WRK-AREA-ERRO.
           COPY 'I#FRWKGE'.
           05  WRK-BLOCO-INFO-ERRO     VALUE SPACES.
               10  WRK-CHAR-INFO-ERRO  PIC X(001)          OCCURS 0
                                       TO 100 TIMES
                                       DEPENDING ON FRWKGHEA-TAM-DADOS.
      *
      *----------------------------------------------------------------*
       77  FILLER                      PIC  X(050)         VALUE
           '* AREA DE TRATAMENTO DE ERROS DE ARQUIVO *'.
      *----------------------------------------------------------------*
      *
       01  WRK-FRWKGARQ.
           COPY 'I#FRWKAR'.
      *
      *----------------------------------------------------------------*
       77  FILLER                      PIC  X(050)         VALUE
           '*** AREA DE TRATAMENTO DE ERROS DB2 ***'.
      *----------------------------------------------------------------*
      *
       01  WRK-AREA-ERRO-DB2.
           COPY 'I#FRWKDB'.
      *
      *----------------------------------------------------------------*
       01  FILLER                      PIC  X(050)         VALUE
           '*** AREA PARA CHECKPOINT/RESTART ***'.
      *----------------------------------------------------------------*
      *
           COPY 'I#CKRS04'.
      *
      *----------------------------------------------------------------*
       77  FILLER                      PIC  X(050)         VALUE
           '* AREA DE TRATAMENTO DE ERROS DE MODULO *'.
      *----------------------------------------------------------------*
      *
       01  WRK-FRWKGMOD.
           COPY 'I#FRWKMD'.
      *
      *----------------------------------------------------------------*
       77  FILLER                      PIC  X(050)         VALUE
           '* AREA COPY PARA CBPA2EST *'.
      *----------------------------------------------------------------*
      *
       COPY 'CBPAW039'.
      *
      *----------------------------------------------------------------*
       77  FILLER                      PIC  X(050)         VALUE
           '* LAYOUT DOS ARQUIVOS DE SAIDA *'.
      *----------------------------------------------------------------*
      *
       COPY 'CBPAW033'.
      *
       01 WRK-AREA-CBPAW031.
          COPY 'CBPAW031'.
      *
      *----------------------------------------------------------------*
       77  FILLER                      PIC  X(050)         VALUE
           '*** AREA PARA MODULO CBTT2E8F ***'.
      *----------------------------------------------------------------*
      *
       01  WRK-AREA-CBTT2E8F.
           COPY  'CBTTW00V'.
           COPY  'CBTTWE8I'.
      *
      *----------------------------------------------------------------*
       77  FILLER                      PIC  X(050)         VALUE
           '*** AREA PARA MODULO CMCD2ABC ***'.
      *----------------------------------------------------------------*
      *
       01  WRK-AREA-CMCD2ABC.
           COPY  'CMCDWABI'.
      *
      *----------------------------------------------------------------*
       77  FILLER                      PIC  X(050)         VALUE
           '*** AREA PARA MODULO CBPA2KVT ***'.
      *----------------------------------------------------------------*
      *
           COPY  'CBPAWKU3'.
      *
      *----------------------------------------------------------------*
       77  FILLER                      PIC  X(050)         VALUE
LFP-01     '*** AREA PARA MODULO INEC2000 ***'.
      *----------------------------------------------------------------*
      *
LFP-01 01  WRK-AREA-INEC2000.
LFP-01     COPY  'INECWC28'.
      *
      *----------------------------------------------------------------*
       77  FILLER                      PIC  X(50)          VALUE
           '*** AREAS PARA A BRAD0160 ***'.
      *----------------------------------------------------------------*
      *
       77  WRK-P0160-JOB               PIC  X(008)         VALUE SPACES.
       77  WRK-P0160-VALORFAC          PIC  9(05)V99 COMP-3 VALUE ZEROS.
      *
      *----------------------------------------------------------------*
       77  FILLER                      PIC  X(050)    VALUE
           '* AREA PARA ACUMULADORES *'.
      *----------------------------------------------------------------*
      *
       01  WRK-ACUMULADORES.
           05  ACU-LIDOS-ARQBAIXA      PIC  9(009) COMP-3  VALUE ZEROS.
           05  ACU-BAIXA-NAO-ACHOU     PIC  9(009) COMP-3  VALUE ZEROS.
           05  ACU-DESPREZADOS-MOEDA   PIC  9(009) COMP-3  VALUE ZEROS.
           05  ACU-DESPREZADOS-VALOR   PIC  9(009) COMP-3  VALUE ZEROS.
           05  ACU-DESPREZADOS-BAIXA   PIC  9(009) COMP-3  VALUE ZEROS.
           05  ACU-DESPREZADOS-OCOR    PIC  9(009) COMP-3  VALUE ZEROS.
           05  ACU-GRAVADOS-BAIXA-14   PIC  9(009) COMP-3  VALUE ZEROS.
           05  ACU-GRAVADOS-BAIXA-15   PIC  9(009) COMP-3  VALUE ZEROS.
           05  ACU-GRAVADOS-TITBAIXA   PIC  9(009) COMP-3  VALUE ZEROS.
           05  ACU-GRAVADOS-DUPLICADOS PIC  9(009) COMP-3  VALUE ZEROS.
      *
      *----------------------------------------------------------------*
       77  FILLER                      PIC  X(050)    VALUE
           '* AREA PARA VARIAVEIS AUXILIARES *'.
      *----------------------------------------------------------------*
      *
       77  WRK-DUMP-BAT                PIC  X(001)    VALUE 'S'.
       77  WRK-ABEND-BAT               PIC S9(004) COMP VALUE +1111.
      *
       77  WRK-FRWK2999                PIC  X(008)         VALUE
           'FRWK2999'.
       77  WRK-PROGRAMA                PIC  X(008)         VALUE
           'CBPA2SAB'.
       77  WRK-MODULO                  PIC  X(008)         VALUE SPACES.
       77  WRK-CKRS0105                PIC  X(008)         VALUE
           'CKRS0105'.
       77  WRK-BRAD0160                PIC  X(008)         VALUE
           'BRAD0160'.
       77  WRK-BRAD0450                PIC  X(008)         VALUE
           'BRAD0450'.
       77  WRK-CBPA2EST                PIC  X(008)         VALUE
           'CBPA2EST'.
      *
       77  WRK-ARQBAIXA                PIC  X(008)         VALUE
           'ARQBAIXA'.
       77  WRK-BAIXA34                 PIC  X(008)         VALUE
           'BAIXA34'.
       77  WRK-BAIXA35                 PIC  X(008)         VALUE
           'BAIXA35'.
       77  WRK-TITBAIXA                PIC  X(008)         VALUE
           'TITBAIXA'.
       77  WRK-TITDUPL                 PIC  X(008)         VALUE
           'TITDUPL'.
      *
       77  WRK-FLAG-TABELAS            PIC  9(001) COMP-3  VALUE ZEROS.
       77  WRK-LOCAL                   PIC  X(004)         VALUE SPACES.
       77  WRK-FLAG-INCONS             PIC  X(001)         VALUE ZEROS.
      *
       01  WRK-CNEGOC-COBR             PIC 9(018)          VALUE ZEROS.
       01  FILLER                      REDEFINES WRK-CNEGOC-COBR.
           05  FILLER                  PIC 9(007).
           05  WRK-AGENC-CNEGOC        PIC 9(004).
           05  WRK-CONTA-CNEGOC        PIC 9(007).
      *
       01  WRK-ECONM-MOEDA-X10         PIC X(010)          VALUE SPACES.
       01  FILLER                      REDEFINES WRK-ECONM-MOEDA-X10.
           05  WRK-ECONM-MOEDA-R-X4    PIC X(004).
           05  FILLER                  PIC X(006).
      *
       01  WRK-SQLCODE-S9-9            PIC S9(009)         VALUE ZEROS.
       01  FILLER                      REDEFINES WRK-SQLCODE-S9-9.
           05  FILLER                  PIC  9(006).
           05  WRK-SQLCODE-MASK        PIC S9(003).
      *
       01  WRK-DATA-X-10.
           05  WRK-DIA-D               PIC  9(002)         VALUE ZEROS.
           05  FILLER                  PIC  X(001)         VALUE '.'.
           05  WRK-MES-D               PIC  9(002)         VALUE ZEROS.
           05  FILLER                  PIC  X(001)         VALUE '.'.
           05  WRK-ANO-D               PIC  9(004)         VALUE ZEROS.
      *
       01  WRK-DATA-9-8                PIC  9(008)         VALUE ZEROS.
       01  FILLER                      REDEFINES WRK-DATA-9-8.
           05  WRK-ANO                 PIC  9(004).
           05  WRK-MES                 PIC  9(002).
           05  WRK-DIA                 PIC  9(002).
      *
       01  WRK-912-ZON                 PIC  9(012)         VALUE ZEROS.
       01  WRK-912-98                  PIC  9(012)         VALUE ZEROS.
       01  FILLER                      REDEFINES WRK-912-98.
           05  FILLER                  PIC  X(004).
           05  WRK-912-98-RED          PIC  9(008).
      *
       01 WRK-S10-910                  PIC +9(10)           VALUE ZEROS.
       01 FILLER                       REDEFINES WRK-S10-910.
          05 FILLER                    PIC X(01).
          05 WRK-S10-910-RED           PIC 9(10).
      *
       01 WRK-S3-93                    PIC +9(03)           VALUE ZEROS.
       01 FILLER                       REDEFINES WRK-S3-93.
          05 FILLER                    PIC X(01).
          05 WRK-S3-93-RED             PIC 9(03).
      *

      *----------------------------------------------------------------*
       77  FILLER                      PIC  X(050)         VALUE
           '* AREA COMPILACAO DATA/HORA *'.
      *----------------------------------------------------------------*
      *
       01  WRK-COMPILACAO.
           05  WRK-DTCOMPILA.
               10  WRK-MMCOMPILA       PIC  X(002)         VALUE SPACES.
               10  FILLER              PIC  X(001)         VALUE SPACES.
               10  WRK-DDCOMPILA       PIC  X(002)         VALUE SPACES.
               10  FILLER              PIC  X(001)         VALUE SPACES.
               10  WRK-AACOMPILA       PIC  X(002)         VALUE SPACES.
           05  WRK-HRCOMPILA           PIC  X(008)         VALUE SPACES.
      *
      *----------------------------------------------------------------*
       77  FILLER                      PIC  X(060)    VALUE
           '* AREA TRATAMENTO CAMPOS NULOS E CAMPOS SINALIZADOS *'.
      *----------------------------------------------------------------*
      *
       01  WRK-TRATAMENTO-NULOS.
           05  WRK-CTPO-CANAL-N        PIC S9(004) COMP VALUE ZEROS.
LFP-01     05  WRK-CPSSOA-LCTO-CTA-N   PIC S9(004) COMP VALUE ZEROS.
LFP-01     05  WRK-CTPO-LCTO-CTA-N     PIC S9(004) COMP VALUE ZEROS.
LFP-01     05  WRK-NCONTR-LCTO-CTA-N   PIC S9(004) COMP VALUE ZEROS.
      *
       01  WRK-VNMNAL-TITLO-COBR-R     PIC 9(15)V99     VALUE ZEROS.
       01  FILLER                     REDEFINES WRK-VNMNAL-TITLO-COBR-R.
           05 FILLER                     PIC  X(002).
           05 WRK-VNMNAL-TITLO-COBR-13   PIC  9(13)V99.
      *
LFP-01 01  WRK-917-915V99              PIC 9(17)        VALUE ZEROS.
LFP-01 01  FILLER                     REDEFINES WRK-917-915V99.
LFP-01     05 WRK-917-915V99-RED       PIC 9(15)V99.
      *
      *----------------------------------------------------------------*
       77  FILLER                      PIC  X(050)         VALUE
           '* AREA DE MSG DE ERRO NO FILE STATUS *'.
      *----------------------------------------------------------------*
      *
       01  WRK-MSG-FS.
           05  FILLER                  PIC  X(005)         VALUE
               'ERRO '.
           05  WRK-OPERACAO            PIC  X(013)         VALUE SPACES.
           05  FILLER                  PIC  X(012)         VALUE
               ' DO ARQUIVO '.
           05  WRK-ARQUIVO             PIC  X(008)         VALUE SPACES.
           05  FILLER                  PIC  X(016)         VALUE
               '. FILE-STATUS = '.
           05  WRK-FS                  PIC  X(002)         VALUE SPACES.
      *
       77  WRK-ABERTURA                PIC  X(013)         VALUE
           'NA ABERTURA'.
       77  WRK-LEITURA                 PIC  X(013)         VALUE
           'NA LEITURA'.
       77  WRK-FECHAMENTO              PIC  X(013)         VALUE
           'NO FECHAMENTO'.
       77  WRK-GRAVACAO                PIC  X(013)         VALUE
           'NA GRAVAVAO'.
      *
      *----------------------------------------------------------------*
       77  FILLER                      PIC  X(050)    VALUE
           '* AREA DE MSG DE ERRO DB2 *'.
      *----------------------------------------------------------------*
      *
       01  WRK-MSG-SQL.
           05  FILLER                  PIC  X(008)         VALUE
                                                           'ERRO DB2'.
           05  FILLER                  PIC  X(009)         VALUE
                                                          ' SQLCODE '.
           05  WRK-SQLCODE             PIC +9(009)         VALUE ZEROS.
      *
      *----------------------------------------------------------------*
       77  FILLER                      PIC  X(050)    VALUE
           '* AREA DE FILE-STATUS *'.
      *----------------------------------------------------------------*
      *
       77  WRK-FS-ARQBAIXA             PIC  X(002)         VALUE SPACES.
       77  WRK-FS-BAIXA34              PIC  X(002)         VALUE SPACES.
       77  WRK-FS-BAIXA35              PIC  X(002)         VALUE SPACES.
       77  WRK-FS-TITBAIXA             PIC  X(002)         VALUE SPACES.
       77  WRK-FS-TITDUPL              PIC  X(002)         VALUE SPACES.
      *
      *----------------------------------------------------------------*
       77  FILLER                      PIC  X(050)         VALUE
           '* LAYOUT DOS ARQUIVOS DE ENTRADA *'.
      *----------------------------------------------------------------*
      *
LFP-01 01  WRK-AREA-CBTTWREA.
LFP-01     COPY  'CBTTWREA'.
      *
      *----------------------------------------------------------------*
       77  FILLER                      PIC  X(080)         VALUE
