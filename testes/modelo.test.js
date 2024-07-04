const bd = require('../bd/bd_utils.js');
const modelo = require('../modelo.js');

beforeEach(() => {
  bd.reconfig('./bd/esmforum-teste.db');
  // limpa dados de todas as tabelas
  bd.exec('delete from perguntas', []);
  bd.exec('delete from respostas', []);
});

test('Testando banco de dados vazio', () => {
  expect(modelo.listar_perguntas().length).toBe(0);
});

test('Testando cadastro de três perguntas', () => {
  modelo.cadastrar_pergunta('1 + 1 = ?');
  modelo.cadastrar_pergunta('2 + 2 = ?');
  modelo.cadastrar_pergunta('3 + 3 = ?');
  const perguntas = modelo.listar_perguntas(); 
  expect(perguntas.length).toBe(3);
  expect(perguntas[0].texto).toBe('1 + 1 = ?');
  expect(perguntas[1].texto).toBe('2 + 2 = ?');
  expect(perguntas[2].num_respostas).toBe(0);
  expect(perguntas[1].id_pergunta).toBe(perguntas[2].id_pergunta-1);
});

test('Testando o cadastro de resposta', async () => {
  await modelo.cadastrar_pergunta('Pergunta genérica?');
  const perguntas = await modelo.listar_perguntas();
  const idPergunta = perguntas[0].id_pergunta;
  const pergunta = await modelo.get_pergunta(idPergunta);
  expect(pergunta).toBeDefined();
  expect(pergunta.id_pergunta).toBe(idPergunta);
});

test('Testando a recuperação de respostas', async () => {
  await modelo.cadastrar_pergunta('Pergunta genérica?');
  const perguntas = await modelo.listar_perguntas();
  const idPergunta = perguntas[0].id_pergunta;
  await modelo.cadastrar_resposta(idPergunta, 'Resposta genérica');
  const respostas = await modelo.get_respostas(idPergunta);
  expect(Array.isArray(respostas)).toBe(true);
  expect(respostas.length).toBeGreaterThan(0);
});

test('Testando get_num_respostas retorna o número correto de respostas para um dado ID de pergunta', async () => {
  await modelo.cadastrar_pergunta('Pergunta genérica?');
  const perguntas = await modelo.listar_perguntas();
  const idPergunta = perguntas[0].id_pergunta;
  await modelo.cadastrar_resposta(idPergunta, 'Resposta genérica');
  const numRespostas = await modelo.get_num_respostas(idPergunta);
  expect(numRespostas).toBeDefined();
  expect(typeof numRespostas).toBe('number');
  expect(numRespostas).toBeGreaterThan(0);
});