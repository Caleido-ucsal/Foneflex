# FoneFlex – Front end

Front-end do sistema de gestão da **FoneFlex** (projeto de faculdade): loja de telefonia móvel com venda de aparelhos, conserto e (futuramente) aluguel de celulares.

Stack: React + Vite + TypeScript + React Router.
Design: https://www.figma.com/design/ceb6rh6IknNUddfzan2jmx/FoneFlex--Copy- (referências em `docs/figma/`)

## Contexto (Documento 4.4)
Operação 100% em papel, equipe de 6 pessoas. Dores: perda de dados de clientes, falta de rastreio de ordens de serviço/orçamentos, sem controle de cobranças.

## Roadmap
1. **Fase 1 – Arrumando a casa** (este front): cadastro unificado de clientes, ordens de serviço, vendas e caixa.
2. **Fase 2 – MVP de aluguel presencial**: caução e termo de responsabilidade.
3. **Fase 3 – Plataforma online** para clientes finais.

## Etapas do front
- [x] 1. Base do projeto
- [x] 2. Design system e layout (tokens, componentes base, sidebar/topbar, login, visão geral)
- [x] 3. Clientes (listagem, busca, cadastro com máscaras, histórico)
- [x] 4. Ordens de serviço (filtros, busca, troca de status, Nova OS em 4 passos)
- [x] 5. Vendas e locações (carrinho, estoque, aluguel em 3 passos, devolução)
- [x] 6. Visão Geral com dados reais, busca global, layout responsivo, login (mock)

## Rodando
```
npm install
npm run dev
```

## Telas
| Rota | Tela |
|---|---|
| `/login` | Login (simulado: qualquer e-mail e senha preenchidos) |
| `/` | Visão Geral (indicadores calculados dos dados) |
| `/ordens-de-servico` | Ordens de Serviço, filtros, troca de status, Nova OS (4 passos) |
| `/vendas` | Vendas de Balcão (carrinho, estoque, recibo) |
| `/locacoes` | Locação de Aparelhos (novo aluguel em 3 passos, caução, devolução) |
| `/clientes` | Base de Clientes (cadastro, histórico) |

## Arquitetura
- `src/services/`: camada de dados. Hoje usa `localStorage` com dados iniciais (`mock.ts`); para integrar o back-end, troque as funções de cada serviço mantendo as assinaturas.
- `src/components/ui`: componentes base. `src/components/layout`: sidebar, topbar, busca global.
- `src/pages/`: uma pasta por módulo com seus modais.
- Para recomeçar com os dados de exemplo, limpe o localStorage do navegador (chaves `foneflex:*`).

## Regras implementadas (do documento 4.4)
- Cadastro unificado de clientes, reaproveitado em OS, vendas e aluguéis.
- Rastreio de OS por status e histórico por cliente.
- Aluguel presencial com caução recebida no ato e termo de responsabilidade obrigatórios; caução só é liberada na devolução.
- Caixa do dia = vendas + diárias de locações iniciadas hoje (caução, por ser reembolsável, fica fora).

## Pendências / próximos passos
- Substituir a logo aproximada pelo arquivo oficial em alta resolução.
- Integrar com back-end e autenticação real (hoje simulados).
- Perfis de acesso (o cliente ainda não definiu papéis entre os 6 funcionários).
- Fase 3: plataforma online para clientes finais.
