import * as fs from "fs-jetpack";
import { htmlTemplate } from "./template";
import type { TestTemplateProps } from "./template";


const props: TestTemplateProps = {
  totalGroups: 3,
  totalGroupsFailed: 1,
  totalGroupsPassed: 1,
  totalGroupsSkipped: 1,
  totalTests: 30,
  totalTestsFailed: 2,
  totalTestsPassed: 26,
  totalTestsSkipped: 2,
  totalTime: '00:00:40',
  timestamp: '22/04/2022 - 17:57',
  state: [
    {
      title: "Cadastrar Lançamentos",
      time: "00:00:07",
      passed: false,
      headers: ['Nº', 'Cenário', 'Usuário', 'Valor', 'Descrição', 'Conta', 'Tipo de Lançamento', 'Estado do Lançamento', 'data', 'mensagem'],
      values: {
        1: {
          tags: ["cadastrarLancamento", "Lancamento"],
          tableValues: ['1', 'Usuário sem acesso', 'sem acesso', 'válido', 'válido', 'válido', 'válido', 'válido', 'válido', 'Acesso negado'],
          realValues: ['1', 'Usuário sem acesso', 'jobson', '3000', 'fogão', '1', '1', '1', '22/03/2022', 'Acesso negado'],
          title: "Cadastrar Lançamento - 1 - Usuário sem acesso",
          time: "00:00:01"
        },
        2: {
          tags: ["cadastrarLancamento", "Lancamento"],
          tableValues: ['2', 'sem valor', 'válido', 'nenhum', 'válido', 'válido', 'válido', 'válido', 'válido', 'O campo "Valor" é obrigatório'],
          realValues: ['1', 'sem valor', 'jobson', '3000', 'fogão', '1', '1', '1', '22/03/2022', 'Acesso negado'],
          title: "Cadastrar Lançamento - 2 - sem valor",
          time: "00:00:01"
        },
        3: {
          tags: ["cadastrarLancamento", "Lancamento"],
          tableValues: ['3', 'sem descrição', 'válido', 'válido', 'nenhum', 'válido', 'válido', 'válido', 'válido', 'O campo "Descrição" é obrigatório'],
          realValues: ['1', 'sem descrição', 'jobson', '3000', 'fogão', '1', '1', '1', '22/03/2022', 'Acesso negado'],
          title: "Cadastrar Lançamento - 3 - sem descrição",
          time: "00:00:01"
        },
        4: {
          tags: ["cadastrarLancamento", "Lancamento"],
          tableValues: ['4', 'sem conta', 'válido', 'válido', 'válido', 'nenhum', 'válido', 'válido', 'válido', 'O campo "Conta" é obrigatórios'],
          realValues: ['1', 'sem conta', 'jobson', '3000', 'fogão', '1', '1', '1', '22/03/2022', 'Acesso negado'],
          title: "Cadastrar Lançamento - 4 - sem conta",
          time: "00:00:01",
          error: true,
          errorMessage: `Expected values to be strictly deep-equal:\n+ actual - expected\n\n+ 'O campo "Conta" é obrigatórios'+ 'O campo "Conta" é obrigatórios'+ 'O campo "Conta" é obrigatórios'+ 'O campo "Conta" é obrigatórios'+ 'O campo "Conta" é obrigatórios'+ 'O campo "Conta" é obrigatórios'+ 'O campo "Conta" é obrigatórios'+ 'O campo "Conta" é obrigatórios'\n- 'O campo "Conta" é obrigatório'\n                               ^`,
          stackTrace: `AssertionError [ERR_ASSERTION]: Expected values to be strictly deep-equal:\n+ actual - expected\n\n+ 'O campo "Conta" é obrigatórios'\n- 'O campo "Conta" é obrigatório'\n                                ^\n    at CadastrarLancamentoFixture.cadastrarLancamento (/home/gunter/desenvolvimento/workspace-vscode/contas/tests/suite/lancamentos/CadastrarLancamentoFixture.ts:21:18)\n    at processTicksAndRejections (node:internal/process/task_queues:96:5)`
        },
        5: {
          tags: ["cadastrarLancamento", "Lancamento"],
          tableValues: ['5', 'sem tipo de lançamento', 'válido', 'válido', 'válido', 'válido', 'nenhum', 'válido', 'válido', 'O campo "Tipo de Lançamento" é obrigatório'],
          realValues: ['1', 'sem tipo de lançamento', 'jobson', '3000', 'fogão', '1', '1', '1', '22/03/2022', 'Acesso negado'],
          title: "Cadastrar Lançamento - 5 - sem tipo de lançamento",
          time: "00:00:01"
        },
        6: {
          tags: ["cadastrarLancamento", "Lancamento"],
          tableValues: ['6', 'sem data', 'válido', 'válido', 'válido', 'válido', 'válido', 'válido', 'nenhum', 'O campo "data" é obrigatório'],
          realValues: ['1', 'sem data', 'jobson', '3000', 'fogão', '1', '1', '1', '22/03/2022', 'Acesso negado'],
          title: "Cadastrar Lançamento - 6 - sem data",
          time: "00:00:01"
        },
        7: {
          tags: ["cadastrarLancamento", "Lancamento"],
          tableValues: ['7', 'Sucesso', 'válido', 'válido', 'válido', 'válido', 'válido', 'válido', 'válido', 'Lançamento cadastrado com sucesso'],
          realValues: ['1', 'Sucesso', 'jobson', '3000', 'fogão', '1', '1', '1', '22/03/2022', 'Acesso negado'],
          title: "Cadastrar Lançamento - 7 - Sucesso",
          time: "00:00:01"
        }
      },
      selected: 1,
    },
    {
      title: "Alterar Lançamentos",
      time: "00:00:02",
      passed: true,
      headers: ['Nº', 'Cenário', 'Usuário', 'Valor', 'Descrição', 'Conta', 'Tipo de Lançamento', 'Estado do Lançamento', 'data', 'mensagem'],
      values: {
        1: {
          tags: ["alterarLancamento", "Lancamento"],
          tableValues: ['1', 'Usuário sem acesso', 'sem acesso', 'válido', 'válido', 'válido', 'válido', 'válido', 'válido', 'Acesso negado'],
          realValues: ['1', 'Usuário sem acesso', 'jobson', '3000', 'fogão', '1', '1', '1', '22/03/2022', 'Acesso negado'],
          title: "Alterar Lançamentos - 1 - Usuário sem acesso",
          time: "00:00:01"
        },
        2: {
          tags: ["alterarLancamento", "Lancamento"],
          tableValues: ['2', 'sem valor', 'válido', 'nenhum', 'válido', 'válido', 'válido', 'válido', 'válido', 'O campo "Valor" é obrigatório'],
          realValues: ['1', 'Usuário sem acesso', 'jobson', '3000', 'fogão', '1', '1', '1', '22/03/2022', 'Acesso negado'],
          title: "Alterar Lançamentos - 2 - sem valor",
          time: "00:00:01"
        },
      },
      selected: 1,
    },
  ]
}

function htmlReporterConfig(runner, emitter) {
  const indexes = {
    totalGroups: 0,
    totalGroupsFailed: 0,
    totalGroupsPassed: 0,
    totalGroupsSkipped: 0,
    totalTests: 0,
    totalTestsFailed: 0,
    totalTestsPassed: 0,
    totalTestsSkipped: 0,
  }
  let currentSuite = '';
  let groupHasError = false;
  let state: any[] = []
  let groupHeaders: string[] = [];
  let groupValues: string[] = [];
  let groupStartTime: any;
  let suiteStartTime: any;
  let suiteTime: any;
  let testStartTime: any;

  emitter.on('runner:start', () => { })

  emitter.on('suite:start', ({ name }) => {
    currentSuite = name
    suiteStartTime = new Date().getTime()
  })

  emitter.on('group:start', () => {
    indexes.totalGroups++;
    groupStartTime = new Date().getTime();
    groupHeaders = [];
    groupValues = [];
  })

  emitter.on('test:start', () => {
    indexes.totalTests++;
    testStartTime = new Date().getTime();
  })

  emitter.on('test:end', (payload) => {
    const testProps: any = { realValues: [] };
    if (payload?.dataset?.row?.__rowProps) {
      Object.entries(payload.dataset.row).forEach(([key, value]: [string, any]) => {
        if (key !== '__rowProps') {
          groupHeaders.push(key)
          testProps.realValues.push(String(value))
        } else {
          testProps['tableValues'] = Object.values(value.fromTable)
        }
      })
    }else{
      groupHeaders = ['#','Cenário']
      testProps['tableValues'] = [indexes.totalTests, payload.title.expanded]
    }
    testProps['tags'] = payload.tags
    testProps['title'] = payload.title.expanded
    testProps['time'] = new Date(new Date().getTime() - testStartTime).toISOString().slice(11, 23)
    if (payload.hasError) {
      groupHasError = true;
      testProps['error'] = true
      console.log(payload.errors[0].error)
      testProps['errorMessage'] = `Actual: ${payload.errors[0].error.actual}\nExpected: ${payload.errors[0].error.expected}\n\n${payload.errors[0].error.stack}`
    }
    groupValues.push({ ...testProps })
    if (payload.isSkipped) indexes.totalTestsSkipped++;
    if (payload.hasError) indexes.totalTestsFailed++;
    if (!payload.isSkipped && !payload.hasError) indexes.totalTestsPassed++;
  })

  emitter.on('group:end', ({ title }) => {
    state.push({
      title,
      time: new Date(new Date().getTime() - groupStartTime).toISOString().slice(11, 23),
      passed: !groupHasError,
      suite: currentSuite,
      headers: [...new Set(groupHeaders)],
      values: groupValues
    })
    groupHasError ? indexes.totalGroupsFailed++ : indexes.totalGroupsPassed++
    groupHeaders = []
    groupValues = []
    groupHasError = false
  })

  emitter.on('suite:end', () => {
    suiteTime = new Date(new Date().getTime() - suiteStartTime).toISOString().slice(11, 23)
  })

  emitter.on('runner:end', () => {
    const props = {
      ...indexes,
      totalTime: suiteTime,
      timestamp: new Date().toISOString().slice(0, new Date().toISOString().length - 8).replace('T', ' - '),
      state
    }
    fs.dir(__dirname).file('output.html', { content: htmlTemplate(props) });
  })
}

export function htmlReporter() {
  return htmlReporterConfig
}