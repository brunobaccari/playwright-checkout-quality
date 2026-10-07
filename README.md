# Checkout no SauceDemo — Playwright e TypeScript

[English version](README.en.md)

Automação contra **https://www.saucedemo.com/**, retomando a jornada do meu [projeto com Selenium](https://github.com/brunobaccari/selenium-test-checkout-automation): login, produtos, carrinho, dados do cliente e conclusão.

## Instalação e execução

Node.js 22.9 ou superior e npm. O CI usa Node 24.

```bash
cp .env.example .env
npm ci
npx playwright install chromium
npm run typecheck
npm test
```

No Linux, use `npx playwright install --with-deps chromium`. Não há aplicação local para iniciar.

## Cenários

- Compra de mochila e lanterna: dois itens, subtotal de US$ 39,98, taxa de US$ 3,20 e total de US$ 43,18; confirmação e carrinho vazio.
- Remoção de um produto sem perder o outro; estado preservado ao recarregar.
- Nome, sobrenome e CEP obrigatórios, com correção do formulário.
- Cancelamento da revisão mantém o item no carrinho.
- Usuário bloqueado não acessa o catálogo.

## Organização

`pages/CheckoutPage.ts` reúne as ações repetidas. `tests/checkout.spec.ts` contém os cenários e expectativas. Seletores usam o atributo `data-test` exposto pelo site; as esperas verificam estado, sem sleeps.

## Relatórios e CI

`npm run report` abre o relatório HTML. Falhas geram screenshot e trace; JUnit fica em `test-results/junit.xml`. O GitHub Actions executa a mesma suíte e guarda os relatórios. [Execuções e artifacts no Actions](https://github.com/brunobaccari/playwright-checkout-quality/actions).

São usadas as credenciais de demonstração publicadas na página inicial (`standard_user` e `locked_out_user`, senha `secret_sauce`) e dados fictícios de cliente. Não há pagamento real, mock, interceptação ou servidor local. Os valores esperados se referem ao catálogo padrão observado em 06/10/2026. Indisponibilidade ou mudança do site deve ser investigada; não há retry automático nem execução de carga.

## Configuração do ambiente

Copie `.env.example` para `.env` (`Copy-Item .env.example .env` no PowerShell ou `cp .env.example .env` no Linux/macOS). As variáveis do processo têm prioridade. `.env` não é versionado. URLs e credenciais ficam nessa configuração; os valores esperados dos testes permanecem nos cenários.

As contas do exemplo são públicas e exclusivas de demonstração. Para outro ambiente, injete credenciais via secrets do CI e confirme também o contrato e os dados esperados antes de executar.


Para consultar no GitHub, abra **Actions → Tests → execução → Summary**. O resumo mostra o resultado da etapa, as contagens do JUnit e o link para baixar as evidências. Em **Artifacts**, baixe `test-results` e extraia o ZIP para abrir os relatórios. O ZIP inclui também `summary.md`. A retenção é de 7 dias; o upload e o resumo também são executados após falhas. Se não houver relatório, o resumo informa que não foi possível confirmar a execução.

## Riscos e decisão no CI

O risco principal é concluir uma compra com itens ou valores desatualizados. O cenário de troca refaz o checkout após cancelar a revisão: confere produtos, preços, subtotal, arredondamento da taxa e carrinho vazio após concluir. Isso valida o contrato da demonstração, não liquidação de pagamento.

O gate exige testes aprovados e JUnit legível, sem falhas, cenários ignorados ou relatório vazio. Uma execução sem relatório não aprova o commit. Em uma falha, confira primeiro instalação/rede, depois o estado capturado nos artifacts e a expectativa do cenário; mudar a expectativa exige confirmar a regra do ambiente. Sem retry automático para transformar uma falha em aprovação.

Datas de commits deste portfólio foram reorganizadas retroativamente; as execuções do Actions mantêm suas datas reais.

O summary do Actions lista cada cenário, duração, totais e motivo de bloqueio. O gate exige a quantidade prevista no workflow, sem falhas ou skips; JUnit ausente ou inválido reprova. O resumo também acompanha o artifact.

Screenshots do estado final também são capturados nos testes de interface aprovados e ficam nos artifacts, fora do Git.
