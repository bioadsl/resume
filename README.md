# 🧪 QA Automation Engineer - Portfólio & Currículo

<div align="center">

![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-ativo-10b981?style=flat-square&logo=githubpages&logoColor=white)
![Status](https://img.shields.io/badge/status-em%20produ%C3%A7%C3%A3o-blue?style=flat-square)
![Versão](https://img.shields.io/badge/vers%C3%A3o-1.0.0-6366f1?style=flat-square)
![Licença](https://img.shields.io/badge/licen%C3%A7a-MIT-eab308?style=flat-square)
![Tamanho](https://img.shields.io/github/repo-size/bioadsl/resume?style=flat-square&color=0ea5e9)
![Linguagem Principal](https://img.shields.io/badge/linguagem-JavaScript%20%7C%20CSS%20%7C%20HTML%20%7C%20JSON-f59e0b?style=flat-square)

[**🌐 Site Publicado**](https://bioadsl.github.io/resume/) · [**📂 Repositório GitHub**](https://github.com/bioadsl/resume) · [**📦 Issues**](https://github.com/bioadsl/resume/issues) · [**💬 Contato**](#-suporte-e-contato)

</div>

---

## 📋 Sumário

- [✨ Sobre o Projeto](#-sobre-o-projeto)
- [🎯 Funcionalidades](#-funcionalidades)
- [🛠️ Stack Tecnológico](#%EF%B8%8F-stack-tecnológico)
- [📁 Estrutura do Projeto](#-estrutura-do-projeto)
- [⚙️ Requisitos](#%EF%B8%8F-requisitos)
- [🚀 Instalação e Configuração](#-instalação-e-configuração)
- [💡 Como Usar](#-como-usar)
- [🧪 Testes e Validações](#-testes-e-validações)
- [☁️ Deploy no GitHub Pages](#%EF%B8%8F-deploy-no-github-pages)
- [🤝 Contribuição](#-contribuição)
- [📄 Changelog](#-changelog)
- [🆘 Suporte e Contato](#-suporte-e-contato)
- [🙌 Créditos](#-créditos)
- [📜 Licença](#-licença)

---

## ✨ Sobre o Projeto

Site de **portfólio e currículo profissional** de **Fabrício Duarte** (QA Automation Engineer & Senior Test Analyst) com foco em **maximizar a performance, acessibilidade e escaneabilidade por Tech Recruiters, Gerentes de Engenharia e sistemas ATS (Applicant Tracking System)**.

### 🏆 Objetivos Alcançados
- 🎨 **Design moderno, minimalista e 100% responsivo** (desktop, tablet e mobile)
- 🌓 **Dark Mode por padrão** com alternância nativa para Light Mode (preferência salva no navegador)
- 🚀 **Leve e performático** (~9.7KB de PDF + ~25KB totais de HTML/CSS/JS)
- 📦 **Zero dependências externas de runtime** (sem Bootstrap, React, Vue, etc.) — vanilla puro
- 🔌 **Conteúdo modular e data-driven**: todo texto/histórico fica em `data.json`, basta editar 1 arquivo
- 🔍 **Otimizado para SEO + Open Graph** (preview bonito ao compartilhar no LinkedIn, WhatsApp, etc.)
- ✅ **Badges CI/CD** diretamente dos GitHub Actions dos repositórios do portfólio
- 📄 **Currículo em PDF ATS-friendly** incluso, com scanner e testes automatizados de compatibilidade

---

## 🎯 Funcionalidades

| Funcionalidade | Status | Descrição |
|---|:---:|---|
| 🧭 **Navegação Fixada + Menu Mobile** | ✅ | Scroll suave, responsivo, animações |
| 👤 **Hero Section** | ✅ | Nome, cargo, localização, 4 links sociais, botão Baixar CV |
| 💼 **Sobre Mim** | ✅ | 3 cards de destaque (experiência, Shift-Left, projetos críticos) |
| 🧩 **Skills Matrix** | ✅ | 6 categorias visuais com ícones |
| 📊 **Timeline Profissional** | ✅ | 8 experiências + conquistas em bullet points |
| 🗂️ **Portfólio QA** | ✅ | 9 cards de projetos com tags e links GitHub |
| ✅ **Badges CI/CD** | ✅ | 5 projetos exibem selo de pipeline ativo via shields.io |
| 🎓 **Formação & Certificações** | ✅ | ISTQB CTFL + formações técnicas e graduação |
| 🌓 **Dark / Light Mode** | ✅ | Persistência via `localStorage` |
| ⬆️ **Back to Top + Scroll Spy** | ✅ | Animações de entrada via IntersectionObserver |
| 📱 **Totalmente Responsivo** | ✅ | Breakpoints 968px, 768px, 480px |
| 🔍 **Meta SEO + Open Graph** | ✅ | Otimizado para LinkedIn, Google, Twitter Cards |
| 📄 **PDF ATS-Friendly** | ✅ | 9.7KB, 100% texto extraível, scanner + 20 testes |

---

## 🛠️ Stack Tecnológico

<div align="center">

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![JSON](https://img.shields.io/badge/json-5E5C5C?style=for-the-badge&logo=json&logoColor=white)
![Git](https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)
![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-222222?style=for-the-badge&logo=githubpages&logoColor=white)

</div>

| Camada | Tecnologia |
|---|---|
| **Front-End** | HTML5 Semântico, CSS3 (Variables, Flexbox, Grid, Transições), JavaScript Vanilla ES6+ |
| **Dados** | JSON estruturado (consumido via `fetch()`) |
| **Badges Dinâmicas** | [shields.io](https://shields.io/) (status CI/CD dos repositórios) |
| **PDF ATS** | Python 3 + `reportlab` (geração + scanner ATS + 20 testes automáticos) |
| **Hospedagem** | GitHub Pages (branch `main` · pasta `/root`) |
| **CI/CD** | GitHub Actions nativo do Pages (publicação automática a cada push) |

> ✔️ **Nenhum framework front-end pesado** carregado em runtime (sem React, Vue, Bootstrap, Tailwind CDN).

---

## 📁 Estrutura do Projeto

```
c:\laragon\www\resume\               # Raiz do projeto
├── 📄 index.html                    # Estrutura semântica + SEO/OG + ícones SVG
├── 🎨 styles.css                    # Tema Dark/Light · responsividade · animações
├── ⚙️ script.js                     # Fetch JSON · renderização dinâmica · toggle tema
├── 📦 data.json                     # TODO O conteúdo editável (perfil, skills, projetos...)
├── 📑 curriculo.pdf                 # Currículo em PDF ATS-Friendly (botão download)
├── 📜 curriculo.txt                 # Fonte textual do currículo (backup)
├── 🐍 generate_cv_pdf.py            # Gera PDF ATS + Scanner ATS + 20 testes automáticos
└── 📖 README.md                     # Este documento
```

### 📝 Arquivo Principal de Conteúdo: `data.json`

| Campo | O que controla |
|---|---|
| `profile` | Nome, cargo, email, telefone, LinkedIn, GitHub, URL do CV PDF |
| `about.summary` | Resumo executivo da seção Sobre Mim |
| `skills.categories[ ]` | Nome, ícone e itens de cada bloco da Skills Matrix |
| `experience[ ]` | Timeline profissional (empresa, cargo, período, localização, bullets) |
| `projects[ ]` | Portfólio QA (título, descrição, tags, GitHub, ícone, badges CI/CD) |
| `education[ ]` | Graduação e formações técnicas |
| `certifications[ ]` | Certificações profissionais |
| `footer` | Créditos e link do repositório no rodapé |

---

## ⚙️ Requisitos

### 📌 Para apenas **visualizar** o site publicado
- 🌐 Qualquer navegador moderno (Chrome 90+, Edge 90+, Firefox 88+, Safari 14+)
- 📶 Conexão com a internet (carrega shields.io dos badges CI/CD)

### 🛠️ Para **rodar localmente e editar o conteúdo**
| Ferramenta | Versão mínima | Por quê? |
|---|---|---|
| Python 3 | `3.8+` | Subir um servidor HTTP local (`fetch()` não funciona com `file://`) |
| Git | `2.30+` | Controle de versão e push para o GitHub |
| Editor de texto | Qualquer um | Recomendado: VS Code / Trae IDE |

### 🐍 Para **gerar/atualizar o PDF ATS**
```bash
pip install reportlab pypdf
```

---

## 🚀 Instalação e Configuração

### Passo 1 — Clonar o repositório
```bash
git clone https://github.com/bioadsl/resume.git
cd resume
```

> ✋ **Já tem os arquivos locais?** (ex: em `c:\laragon\www\resume`) Pule direto para o Passo 2.

### Passo 2 — Subir um servidor HTTP local
> ⚠️ Abrir o `index.html` direto no navegador **não funciona** — o `script.js` usa `fetch('data.json')` e os navegadores bloqueiam requisições `file://`.

**Opção A — Mais simples: Python**
```bash
# Windows PowerShell / Linux / macOS
python -m http.server 8080
```

**Opção B — Laragon / WAMP / XAMPP**
- Coloque a pasta no diretório web (ex: `C:\laragon\www\resume`)
- Acesse `http://localhost/resume/`

**Opção C — VS Code Live Server**
- Instale extensão **Live Server** → clique em "Go Live" no canto inferior direito

### Passo 3 — Abrir no navegador
👉 **http://localhost:8080/** (ou a URL da sua opção acima)

✅ Se ver a página com seu nome, cargo e seções, está tudo certo!

---

## 💡 Como Usar

### ✏️ Atualizando seus dados (sem tocar em HTML/CSS/JS)
Basta editar **apenas** o arquivo `data.json`:

```jsonc
// Exemplo: atualizar telefone e LinkedIn
{
  "profile": {
    "name": "Fabrício Duarte",
    "role": "QA Automation Engineer & Senior Test Analyst",
    "email": "fabricio.4135@gmail.com",
    "phone": "+55 (61) 98426-0515",          // ← edite aqui
    "linkedin": "https://linkedin.com/in/SEU-PERFIL", // ← e aqui
    ...
  }
}
```

### ➕ Adicionar um badge de CI/CD a um projeto
Edite o array `badges` do projeto em `data.json → projects`:
```jsonc
{
  "title": "Meu Novo Projeto",
  "github": "https://github.com/bioadsl/meu-novo-projeto",
  "badges": [
    {
      "type": "github-actions",
      "repo": "bioadsl/meu-novo-projeto",    // formato usuario/repo
      "label": "CI/CD",
      "color": "10b981"                      // cor hex SEM o #
    }
  ]
}
```

### 📄 Atualizar / Regenerar o PDF ATS
```bash
# 1) Edite curriculo.txt se quiser mudar texto fonte
# 2) Execute:
python generate_cv_pdf.py
```
✅ O script:
1. Faz parse do `curriculo.txt`
2. Gera `curriculo.pdf` novo
3. Roda **Scanner ATS** interno (0-100 pontos)
4. Roda **20 testes automáticos** de extração de texto e keywords

### 🌗 Alterando o tema padrão
Edite em `styles.css` a variável de cor — o toggle do usuário sempre sobrepõe:
```css
:root {
  color-scheme: dark;        /* ← troque para 'light' se preferir */
  --bg: #0b1020;
  --text: #e5e7eb;
  ...
}
```

---

## 🧪 Testes e Validações

### 🔬 Scanner ATS Interno (PDF)
Execute `python generate_cv_pdf.py` para rodar o scanner de 10 dimensões:

| Critério | Peso |
|---|---|
| Texto extraído real (não imagem) | 15pts |
| Nome completo detectável | 10pts |
| Cargo profissional detectável | 10pts |
| E-mail presente em texto simples | 10pts |
| 5 seções obrigatórias | 20pts |
| Keywords de QA/Automação | 15pts |
| Sem imagens (ATS não leem) | 5pts |
| Metadados PDF (Author/Title/Keywords) | 5pts |
| Leitura linearizada | 5pts |
| ≤ 4 páginas | 5pts |

### ✅ Bateria de 20 Testes Automatizados
Cobre extração de dados e compatibilidade com **ATS principais** (Workday, SuccessFactors, Greenhouse, Lumesse):
- Dados pessoais, seções obrigatórias, keywords técnicas, experiência recente, stacks e metodologias
- Resultado em **20/20 PASS** para o PDF atual

### 📱 Testes Manuais Recomendados
| Caso de Teste | Como Validar |
|---|---|
| Dark / Light Mode toggle | Clicar no botão ☀️/🌙 e recarregar (preferência deve persistir) |
| Responsividade mobile | DevTools → 375px / 768px / 1024px |
| Links externos abrem em nova aba | Clicar em LinkedIn/GitHub/CV |
| Badges CI/CD carregam | Verificar 5 badges verdes em Projetos |
| Download do CV | Clicar em "Baixar CV" → arquivo abre/baixa |

---

## ☁️ Deploy no GitHub Pages

> ✅ O seu repositório **já tem tudo pronto** para deploy — é só habilitar UMA vez.

### Passo a Passo
1. Acesse → **https://github.com/bioadsl/resume/settings/pages**
2. Em **Build and deployment → Source**:
   - **Source:** `Deploy from a branch`
   - **Branch:** `main`
   - **Folder:** `/ (root)`
3. Clique em **Save** ✨
4. Vá na aba **Actions** — aguarde o workflow `pages-build-deployment` ficar ✅ verde
5. Acesse: 👉 **https://bioadsl.github.io/resume/**

### ♻️ Atualização Contínua
A cada `git push origin main` o GitHub **automaticamente:**
1. Roda o build do Pages
2. Publica a nova versão em ~60-120 segundos
3. Mantém a mesma URL

> 💡 **Dica:** Dê `Ctrl + F5` na página do navegador após o deploy para limpar cache.

---

## 🤝 Contribuição

Obrigado por querer contribuir com este projeto! 💛 Siga as etapas abaixo:

### 1. Fork do Repositório
```bash
gh repo fork bioadsl/resume --clone=true
cd resume
```

### 2. Crie uma branch feature
```bash
git checkout -b feature/sua-melhoria
```

### 3. Commit pattern
Use o padrão [Conventional Commits](https://www.conventionalcommits.org/):
```bash
git add .
git commit -m "feat: adicionar nova seção de artigos"
# ou
git commit -m "fix: corrigir responsividade mobile do hero"
# ou
git commit -m "docs: atualizar README com novo badge"
```

### 4. Push e Pull Request
```bash
git push -u origin feature/sua-melhoria
```
Acesse o link que aparecer no terminal → **Open Pull Request**.

### 5. Checklist Antes de Enviar o PR
- [ ] JSON validado (`python -c "import json; json.load(open('data.json'))"`)
- [ ] HTML renderizou corretamente no servidor local
- [ ] Testou Dark e Light Mode
- [ ] Sem erros de JS no Console (F12)
- [ ] Atualizou `README.md` se fez mudanças estruturais

---

## 📄 Changelog

### [1.0.0] — 2026-10-07
- ✅ Release inicial completa do portfólio
- 🌓 Tema Dark/Light Mode
- 🧩 Skills Matrix com 6 categorias
- 📊 Timeline com 8 experiências profissionais
- 🗂️ Portfólio com 9 projetos + 5 badges CI/CD
- 🎓 Formação, certificações e rodapé
- 📄 `curriculo.pdf` ATS 100 pontos + scanner + 20 testes
- 🚀 Publicação via GitHub Pages

---

## 🆘 Suporte e Contato

**Precisando de ajuda?** Seguem os canais:

| Canal | Link / Contato |
|---|---|
| 📧 E-mail | [fabricio.4135@gmail.com](mailto:fabricio.4135@gmail.com) |
| 💼 LinkedIn | [/in/fabricio-duarte-qa](https://www.linkedin.com/in/fabricio-duarte-qa) |
| 🐙 GitHub | [@bioadsl](https://github.com/bioadsl) |
| 🐛 Issues do projeto | [github.com/bioadsl/resume/issues](https://github.com/bioadsl/resume/issues) |
| 📞 Telefone / WhatsApp | [+55 (61) 98426-0515](https://wa.me/5561984260515) |

> 💡 Para bugs / feature requests, abra uma **Issue** com **print de tela + descrição do comportamento esperado**.

---

## 🙌 Créditos

Agradecimentos especiais às comunidades e ferramentas que possibilitaram o projeto:

- 🧑‍🎨 **Google Fonts** — Fonte Inter (utilizada no layout)
- 🛡️ **shields.io** — Badges CI/CD dinâmicas dos repositórios do portfólio
- 📝 **ReportLab** — Biblioteca Python usada na geração do PDF ATS-friendly
- 📦 **GitHub Pages** — Hospedagem gratuita e confiável
- 🚀 **JavaScript Vanilla + CSS Puro** — por possibilitarem portfólios performáticos sem frameworks pesados
- 🧠 **ISTQB® / BSTQB** — Referencial teórico e boas práticas da Engenharia de Qualidade

---

## 📜 Licença

```
MIT License

Copyright (c) 2026 Fabrício Duarte (bioadsl)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

<div align="center">

**Feito com 🧪 & ☕ por Fabrício Duarte — QA Automation Engineer**

[⬆️ Voltar ao topo](#-qa-automation-engineer---portfólio--currículo)

</div>
