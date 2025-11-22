# OwlMind — Quiz de Conhecimentos Gerais

> Um projeto front‑end simples e elegante para quizzes de conhecimentos gerais, com páginas escopadas por `data-page`, carrossel na Home, cadastro, escolha do assunto, dinâmica de perguntas/respostas com feedback, modal de confirmação e utilitários.

---

## ✨ Recursos (Features)
- **Layout por páginas** usando `data-page` no `<body>`: `home`, `signup`, `subjects`, `quiz`, `result`.
- **Estilo responsivo** com CSS Grid e *breakpoints* (`1200px` e `900px`).
- **Quiz**
  - Barra de progresso.
  - Exibição de dicas.
  - **Modal de confirmação** da resposta.
  - **Botão Desistir** com modal — encerra e volta para a escolha de tema.
  - Feedback visual de acerto/erro e **bloqueio** das alternativas após validação.
- **Armazenamento local** (localStorage) para manter tema e resultado.
- **Acessibilidade básica**: navegação por teclado nas opções e foco em modais.

---

## 🧰 Tech Stack
- **HTML5**, **CSS3** (Poppins), **JavaScript (ES6+)**.
- Sem *frameworks*; dependências zero.

---

## 📁 Estrutura de Pastas
```text
assets/
├─ css/
│  └─ styles.css
├─ js/
│  └─ owlmind.js
├─ img/
│  └─ Corujinha_pensando.png
└─ data/
   └─ perguntas.json
home.html
signup.html
subjects.html
quiz.html
result.html
```

---

## 🚀 Como rodar localmente

```bash
# 1) Clonar
git clone https://github.com/<seu-usuario>/owlmind.git
cd owlmind

# 2) Servidor local (qualquer um):
# Opção A: Python 3
python -m http.server 5500
# Opção B: VS Code Live Server (extensão)
# Opção C: Node http-server (se instalado)
# npx http-server -p 5500

# 3) Acessar no navegador
http://localhost:5500/quiz.html
```

> Dica: abra `home.html` para validar todos os layouts; o fluxo do quiz inicia em `subjects.html`.

---

## ⚙️ Configuração de dados
O arquivo `assets/data/perguntas.json` deve conter um objeto com chaves de **assuntos** e suas **listas de perguntas**:
```json
{
  "esporte": [
    {
      "pergunta": "Qual é o principal torneio de clubes da Europa no futebol?",
      "alternativas": ["Copa América", "Liga dos Campeões (UEFA)", "Eurocopa", "Libertadores"],
      "resposta": "d",
      "dica": "Times europeus disputam em formato eliminatório."
    }
  ],
  "tecnologia": [ ... ]
}
```

---

## 🔐 Lógica principal do Quiz (resumo)

- **Inicialização** (`initQuiz`): lê `assuntoSelecionado` do `localStorage`; carrega `perguntas.json`; renderiza a pergunta atual.
- **Escolha de alternativa**: abre modal de **confirmação da resposta**.
- **Validação** (`validate`): marca acerto/erro, mostra feedback, **bloqueia** a lista de opções e habilita `Próxima`.
- **Desistir** (`quitGame`): modal pergunta “Deseja desistir desta partida?”; em caso de “Sim”, salva `status: 'desistiu'` e redireciona para `subjects.html`.
- **Finalização** (`finish`): salva `resultadoQuiz` e redireciona para `result.html` com `status` (`ganhou/perdeu`).

---

## 🎨 Padrões de estilo (CSS)
- Paleta: `--owl-brown`, `--owl-dark`, `--owl-cream`, `--owl-gold`, `--owl-sand`, `--text`.
- Componentes: `.card`, `.btn`, `.alert`, `.site-header.banner`, `.site-footer`.
- **Escopo por página**: `body[data-page="home"|"signup"|"subjects"|"quiz"|"result"]` para evitar conflitos.
- **Modais**: `.modal` compacto com `inline-size: fit-content` e `max-inline-size: min(36ch, 90vw)`.

---

## 🧪 Testes manuais recomendados
- Selecionar assunto e navegar por 3–5 perguntas.
- Confirmar respostas corretas e incorretas; verificar **bloqueio** das alternativas.
- Abrir/fechar **dica**.
- Usar **Desistir** e checar redirecionamento.
- Responsividade em 360px, 768px, 1024px, 1440px.

---

## 📦 Deploy
Sendo um projeto *static*, você pode usar algumas opções de visualização:
- **GitHub Pages** (`Settings > Pages > Deploy from a branch`).
- **Netlify** / **Vercel** (arrastar e soltar a pasta ou conectar ao repositório).

---

## 🗺️ Roadmap
- [ ] Animações suaves ao trocar pergunta.
- [ ] Modo acessível completo (ARIA roles, foco inicial em modais, fechar com ESC).
- [ ] Ranking local por assunto.
- [ ] Tela de resultados com detalhamento por pergunta.
- [ ] Tema escuro (dark mode).

---

> Diretrizes de código: manter escopo por página, sem dependências externas, sem quebrar responsividade.

---

## 🙌 Agradecimentos
- Design e dev: **Dionatan Rodrigues Soares**.
- Linkedin: https://www.linkedin.com/in/dionatansoares/
- Inspiração: quizzes educativos e UX minimalista.

---

## 🔗 Links
- **GitHub Pages**: *https://github.com/DioNathanSoares*
- **Repositório**: https://github.com/DioNathanSoares/OwlMind
- **Página Web**: https://dionathansoares.github.io/OwlMind/index.html
