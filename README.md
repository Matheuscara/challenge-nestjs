# Challenge API – Testes, Endpoints & Arquitetura

> **Como executar, testar e entender a estrutura interna do projeto**

---

## 1. Formas de executar a aplicação

| Modo      | Comando                                                    | Compose                    | Porta(s)    | Observação                                                                              |
| --------- | ---------------------------------------------------------- | -------------------------- | ----------- | --------------------------------------------------------------------------------------- |
| **Dev**   | `docker compose -f docker-compose.dev.yml up -d --build`   | `docker-compose.dev.yml`   | 3000        | Hot‑reload (`pnpm start:dev`) e logs coloridos (pino‑pretty).                           |
| **Debug** | `docker compose -f docker-compose.debug.yml up -d --build` | `docker-compose.debug.yml` | 3000 / 9229 | Mesmo que _Dev_ porém com **Node Inspector** aberto na porta 9229 (`pnpm start:debug`). |
| **Prod**  | `docker compose -f docker-compose.prod.yml up -d --build`  | `docker-compose.prod.yml`  | 3000 / 3001 | Usa `Dockerfile.server`, logs JSON, Loki + Grafana para observabilidade.                |

> Somente o **modo Prod** inclui Loki + Grafana (porta 3001) e o rate‑limit já ajustado para ambiente real.

---

## 2. Executar os testes

| Tipo                  | Script npm        | Dentro do container                       | Fora do container |
| --------------------- | ----------------- | ----------------------------------------- | ----------------- |
| **Unitários**         | `pnpm test`       | `docker compose exec app pnpm test`       | `pnpm test`       |
| **Unitários (watch)** | `pnpm test:watch` | `docker compose exec app pnpm test:watch` | `pnpm test:watch` |
| **E2E**               | `pnpm test:e2e`   | `docker compose exec app pnpm test:e2e`   | `pnpm test:e2e`   |

Os testes usam **Jest** (pré‑configurado). Basta rodar os scripts acima – nenhuma dependência externa é necessária, pois o _repositório_ de transações é **in‑memory**.

---

## 3. Endpoints da API

| Método & Rota          | Descrição                                                                | Rate‑limit      | Status 2xx                                    |
| ---------------------- | ------------------------------------------------------------------------ | --------------- | --------------------------------------------- |
| `GET /health`          | Verifica saúde da aplicação (memory, uptime, etc.)                       | **100 req/min** | `200 OK`                                      |
| `GET /statistics`      | Estatísticas das transações nos últimos 60 s (count, sum, avg, min, max) | **20 req/min**  | `200 OK`                                      |
| `POST /transactions`   | Cria nova transação (`{ amount, timestamp }`)                            | **5 req/min**   | `201 Created` ou `204 No Content` se expirada |
| `DELETE /transactions` | Remove **todas** as transações                                           | **2 req/min**   | `200 OK`                                      |

Todos os limites são aplicados pelo **Throttler** nativo do NestJS (config por‑endpoint).

---

## 4. Arquitetura **Clean / DDD**

```
src/
 ├─ application/          # Casos de uso, DTOs, testes
 ├─ domain/               # Entidades, Value Objects, erros, repositórios
 ├─ infrastructure/       # Implementações (cache, providers, etc.)
 └─ utils/                # Logger (Pino) e afins
```

### 4.1 Domain

- **Entidades** → `Transaction` (transação).
- **Value Objects** → `TransactionStatistics` (count, sum, …).
- **Erros** → separados em `domain/errors` para capturarmos exceções específicas.
- **Repositório** → Interface **e** implementação in‑memory.

> **⚠️ Atenção** – **Injeção de dependência**
> O módulo `CacheModule` faz _bind_ entre a **interface** e a **implementação**:
>
> ```ts
> providers: [
>   { provide: ITransactionRepository, useClass: TransactionRepositoryImpl },
> ];
> ```
>
> Isso permite trocar facilmente a persistência sem alterar regras de negócio.

---

## 5. Interceptadores Globais

| Ordem | Interceptor                    | Função                                                           |
| ----- | ------------------------------ | ---------------------------------------------------------------- |
| 1️⃣    | **DomainErrorInterceptor**     | Converte exceções de domínio em respostas HTTP coerentes.        |
| 2️⃣    | **SuccessResponseInterceptor** | Formata respostas 200 em `{ data, meta }` (padronização).        |
| 3️⃣    | **LoggingInterceptor**         | Envia linhas de log p/ Loki (Grafana) e imprime via Nest Logger. |

---

## 6. Logging com **Pino**

- **Módulo:** `src/utils/logger.module.ts`
- **Prod:** saídas em JSON → Loki → Grafana.
- **Dev/Debug:** `pino-pretty` (colorido e legível).

- leia o documento GRAFANA.md para saber como rodar o projeto com Loki e Grafana :) 

Config selecionada automaticamente por `NODE_ENV`.

---

## 7. Banco de dados

No momento o repositório é **100 % memória**.
Ao reiniciar o container, as transações somem – ideal para testes & POCs.

---

## 8. Pipeline CI/CD (GitHub Actions)

O repositório contém **dois workflows** automáticos localizados em `.github/workflows/`:

| Workflow                    | Arquivo          | Gatilho                                      | Objetivo                                                      |
| --------------------------- | ---------------- | -------------------------------------------- | ------------------------------------------------------------- |
| **CI – Execute unit tests** | `ci.yml`         | `push` e `pull_request` para `main`/`master` | Rodar testes unitários em cada commit para evitar regressões. |
| **CD – Homologação**        | `cd-homolog.yml` | `push` na branch `main`                      | Buildar a imagem de produção e publicar no Docker Hub.        |

---

> _made with ❤️ & NestJS_
