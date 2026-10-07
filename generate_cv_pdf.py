# -*- coding: utf-8 -*-
"""
Gerador de Currículo ATS-Friendly + Scanner/Validador ATS
-----------------------------------------------------------
Objetivos:
1. Ler curriculo.txt e converter em PDF 100% compatível com sistemas ATS
2. Formatação simples: fontes padrão Helvetica (base 14), sem tabelas aninhadas,
   sem elementos gráficos complexos, hierarquia clara.
3. Metadados PDF corretos (Author, Title, Subject, Keywords) para indexação.
4. Scanner ATS embutido: extrai o texto do PDF gerado com pypdf, valida seções,
   palavras-chave obrigatórias, estrutura hierárquica e detecta problemas de
   compatibilidade, gerando relatório com ajustes recomendados.
5. Testes automatizados: valida extração completa e compatibilidade com padrões
   usados pelos principais ATS (Workday, SuccessFactors, Greenhouse, Lumesse, etc.)
"""

import sys
import re
import os
from datetime import datetime
from pathlib import Path

from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.lib.enums import TA_LEFT, TA_CENTER
from reportlab.lib.colors import HexColor, black
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    HRFlowable,
)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.pdfmetrics import registerFontFamily
from reportlab.pdfbase.ttfonts import TTFont

try:
    from pypdf import PdfReader
except ImportError:
    print("[ERRO] pypdf não instalado. Execute: pip install pypdf")
    sys.exit(1)


# ============================================================
# CONFIGURAÇÕES ATS FRIENDLY
# ============================================================

PAGE_MARGIN_CM = 2
FONT_PRIMARY = "Helvetica"
FONT_BOLD = "Helvetica-Bold"
FONT_OBLIQUE = "Helvetica-Oblique"

ATS_KEYWORDS_REQUIRED = [
    "QA Automation Engineer",
    "Analista de Testes",
    "Selenium",
    "Cypress",
    "Playwright",
    "API",
    "REST",
    "Jenkins",
    "ISTQB",
    "Scrum",
    "Kanban",
    "Testes Automatizados",
    "Automação",
    "Postman",
    "Java",
    "Python",
    "SQL",
    "BDD",
    "Cucumber",
    "Quality Assurance",
]

ATS_SECTIONS_REQUIRED = [
    ("RESUMO", ["Resumo Profissional", "Resumo"]),
    ("COMPETENCIAS", ["Principais Competências", "Competências", "Skills"]),
    ("EXPERIENCIA", ["Experiência Profissional", "Experiência", "Histórico Profissional"]),
    ("FORMACAO", ["Formação Acadêmica", "Formação", "Educação"]),
    ("CERTIFICACOES", ["Certificações", "Certificações Profissionais"]),
]


# ============================================================
# PARSE DO CURRICULO.TXT
# ============================================================

def parse_curriculo_txt(filepath: str) -> dict:
    """Faz o parse do curriculo.txt em uma estrutura hierárquica."""
    with open(filepath, "r", encoding="utf-8") as f:
        lines = [ln.rstrip() for ln in f.readlines()]

    # Linhas 1-3 sempre header: nome / cargo / contato
    data = {
        "nome": lines[0].strip() if len(lines) > 0 else "",
        "cargo": lines[1].strip() if len(lines) > 1 else "",
        "contato": lines[2].strip() if len(lines) > 2 else "",
        "secoes": [],
    }

    secao_atual = None
    bloco = []

    def flush_secao():
        if secao_atual and bloco:
            data["secoes"].append({"titulo": secao_atual, "conteudo": [b for b in bloco if b]})

    # Detecta seções pelo formato "Título" seguido de linha vazia (padrão do arquivo)
    padrao_secao = re.compile(r"^[A-ZÀ-Ý][A-Za-zÀ-ÿÇçãõéíóú\s]+$")

    for ln in lines[3:]:
        stripped = ln.strip()
        # Detecta nova seção: texto sozinho na linha, não começa com '-' ou letras minúsculas
        if stripped and padrao_secao.match(stripped) and len(stripped) <= 60 and not ln.startswith(" ") and not any(
            c in stripped for c in ["|", ":"]
        ) and stripped not in ["Meta", "G4F", "Snowman Labs", "Wipro Limited", "Stefanini Brasil", "Cast IT Group"]:
            flush_secao()
            secao_atual = stripped
            bloco = []
        else:
            if secao_atual is not None:
                bloco.append(stripped)
    flush_secao()
    return data


# ============================================================
# GERAÇÃO DO PDF ATS-FRIENDLY
# ============================================================

def build_pdf(parsed: dict, output_path: str) -> None:
    doc = SimpleDocTemplate(
        output_path,
        pagesize=A4,
        leftMargin=PAGE_MARGIN_CM * cm,
        rightMargin=PAGE_MARGIN_CM * cm,
        topMargin=PAGE_MARGIN_CM * cm,
        bottomMargin=PAGE_MARGIN_CM * cm,
        title=f"{parsed['nome']} - {parsed['cargo']}",
        author=parsed["nome"],
        subject="Currículo profissional - QA Automation Engineer / Senior Test Analyst",
        keywords=(
            "QA, Testes, Automação, Selenium, Cypress, Playwright, "
            "RestAssured, Postman, BDD, Cucumber, ISTQB, DevOps, CI/CD, "
            "Quality Assurance, Analista de Testes Sênior"
        ),
        creator="ATS CV Generator",
    )

    styles = getSampleStyleSheet()

    style_name = ParagraphStyle(
        "ATS_Name",
        parent=styles["Heading1"],
        fontName=FONT_BOLD,
        fontSize=20,
        leading=24,
        alignment=TA_CENTER,
        textColor=HexColor("#1a1a1a"),
        spaceAfter=2,
    )
    style_title = ParagraphStyle(
        "ATS_Title",
        parent=styles["Heading2"],
        fontName=FONT_BOLD,
        fontSize=13,
        leading=16,
        alignment=TA_CENTER,
        textColor=HexColor("#2563eb"),
        spaceAfter=6,
    )
    style_contact = ParagraphStyle(
        "ATS_Contact",
        parent=styles["Normal"],
        fontName=FONT_PRIMARY,
        fontSize=10.5,
        leading=14,
        alignment=TA_CENTER,
        textColor=HexColor("#333333"),
        spaceAfter=14,
    )
    style_section = ParagraphStyle(
        "ATS_Section",
        parent=styles["Heading2"],
        fontName=FONT_BOLD,
        fontSize=13,
        leading=17,
        textColor=HexColor("#1a1a1a"),
        spaceBefore=14,
        spaceAfter=6,
    )
    style_company = ParagraphStyle(
        "ATS_Company",
        parent=styles["Normal"],
        fontName=FONT_BOLD,
        fontSize=11,
        leading=14,
        textColor=HexColor("#111827"),
        spaceBefore=8,
        spaceAfter=1,
    )
    style_position = ParagraphStyle(
        "ATS_Position",
        parent=styles["Normal"],
        fontName=FONT_BOLD,
        fontSize=10.5,
        leading=13,
        textColor=HexColor("#2563eb"),
        spaceAfter=1,
    )
    style_period = ParagraphStyle(
        "ATS_Period",
        parent=styles["Normal"],
        fontName=FONT_OBLIQUE,
        fontSize=9.5,
        leading=12,
        textColor=HexColor("#4b5563"),
        spaceAfter=5,
    )
    style_body = ParagraphStyle(
        "ATS_Body",
        parent=styles["Normal"],
        fontName=FONT_PRIMARY,
        fontSize=10.5,
        leading=14.5,
        alignment=TA_LEFT,
        textColor=HexColor("#222222"),
        spaceAfter=4,
    )
    style_bullet = ParagraphStyle(
        "ATS_Bullet",
        parent=style_body,
        leftIndent=14,
        firstLineIndent=-6,
        spaceAfter=3,
        bulletIndent=4,
    )

    story = []

    # HEADER
    story.append(Paragraph(parsed["nome"].upper(), style_name))
    story.append(Paragraph(parsed["cargo"], style_title))
    story.append(Paragraph(parsed["contato"].replace("|", "  •  "), style_contact))
    story.append(HRFlowable(width="100%", thickness=0.8, color=HexColor("#111827"), spaceAfter=4))

    for secao in parsed["secoes"]:
        titulo = secao["titulo"].upper()
        conteudo = secao["conteudo"]
        story.append(Paragraph(titulo, style_section))
        story.append(HRFlowable(width="100%", thickness=0.4, color=HexColor("#9ca3af"), spaceBefore=0, spaceAfter=6))

        if "COMPETÊNCIAS" in titulo or "COMPETENCIAS" in titulo:
            # Competências: texto corrido para ser extraível ATS (não usar colunas/tabelas)
            for line in conteudo:
                if line.strip():
                    story.append(Paragraph(escape_pdf(line), style_body))
            continue

        if "RESUMO" in titulo:
            for line in conteudo:
                if line.strip():
                    story.append(Paragraph(escape_pdf(line), style_body))
            continue

        if "EXPERIÊNCIA" in titulo or "EXPERIENCIA" in titulo or "ANTERIORES" in titulo:
            _render_experiencia(conteudo, story, style_company, style_position, style_period, style_bullet, style_body)
            continue

        # Default: Formação / Certificações / outros
        for line in conteudo:
            s = line.strip()
            if not s:
                continue
            # Itens começando com letra maiúscula, curtos = subtítulos fortes
            if len(s) < 120 and (s[0].isupper() or (" – " in s) or (" | " in s)) and not s.startswith("-"):
                story.append(Paragraph("<b>" + escape_pdf(s) + "</b>", style_body))
            else:
                story.append(Paragraph(escape_pdf(s), style_body))

    doc.build(story)
    print(f"[OK] PDF ATS gerado: {output_path}")


def _render_experiencia(conteudo, story, sc, sp, sper, sbul, sbody):
    """Renderiza experiência com hierarquia: Empresa, Cargo/Período, bullets."""
    i = 0
    while i < len(conteudo):
        ln = conteudo[i].strip()
        if not ln:
            i += 1
            continue
        # Nome da empresa (linha curta, sem |, geralmente uppercase ou nome)
        if i + 1 < len(conteudo) and "|" in conteudo[i + 1] and len(ln) <= 35:
            story.append(Paragraph(escape_pdf(ln), sc))
            i += 1
            next_ln = conteudo[i].strip()
            # Parse "Cargo | Período"
            if "|" in next_ln:
                partes = [p.strip() for p in next_ln.split("|", 1)]
                story.append(Paragraph(escape_pdf(partes[0]), sp))
                if len(partes) > 1:
                    story.append(Paragraph(escape_pdf(partes[1]), sper))
            else:
                story.append(Paragraph(escape_pdf(next_ln), sp))
            i += 1
            # Bullets de conquistas
            while i < len(conteudo) and conteudo[i].strip() and not _is_empresa_nome(conteudo[i], conteudo, i):
                bul = conteudo[i].strip()
                # Bullet sem marcador: adiciona •
                marcador = "• " if not bul.startswith(("-", "•", "▸", "▹")) else ""
                story.append(Paragraph(marcador + escape_pdf(bul), sbul))
                i += 1
        else:
            # Experiências antigas no formato "Empresa | Cargo – descrição (ano)"
            if "|" in ln or "–" in ln or "-" in ln:
                story.append(Paragraph(escape_pdf(ln), sbody))
            i += 1


def _is_empresa_nome(linha: str, conteudo: list, i: int) -> bool:
    """Heurística simples: próxima linha tem pipe → essa é nome de empresa."""
    if not linha.strip():
        return False
    if i + 1 < len(conteudo) and "|" in conteudo[i + 1] and len(linha.strip()) <= 35:
        return True
    return False


def escape_pdf(text: str) -> str:
    return (
        text.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
    )


# ============================================================
# SCANNER ATS + VALIDAÇÕES
# ============================================================

def extract_text_from_pdf(pdf_path: str) -> str:
    """Extrai texto do PDF (simula o que os scanners ATS fazem)."""
    reader = PdfReader(pdf_path)
    texto = []
    for pagina in reader.pages:
        t = pagina.extract_text() or ""
        texto.append(t)
    return "\n".join(texto)


def run_ats_scan(pdf_path: str, parsed_txt: dict) -> dict:
    """Executa varredura de compatibilidade ATS e retorna relatório."""
    rel = {
        "ok": True,
        "nota_final": 0,
        "total_checks": 0,
        "passaram": 0,
        "checks": [],
        "ajustes": [],
    }

    texto_pdf = extract_text_from_pdf(pdf_path)
    texto_normalizado = _norm(texto_pdf)
    rel["texto_extraido_len"] = len(texto_pdf.strip())

    # Check 1: Extração de texto - PDF deve ter texto real (não imagem escaneada)
    rel["total_checks"] += 1
    if len(texto_pdf.strip()) > 800:
        rel["passaram"] += 1
        rel["checks"].append(("✅ TEXTO EXTRAÍDO", f"{len(texto_pdf.strip())} caracteres de texto real detectado"))
    else:
        rel["ok"] = False
        rel["checks"].append(("❌ TEXTO BAIXO", "Pouco texto extraído — risco de ser imagem"))
        rel["ajustes"].append("Verifique se o PDF contém texto real e não imagem escaneada.")

    # Check 2: Nome extraído
    rel["total_checks"] += 1
    nome_norm = _norm(parsed_txt["nome"])
    if all(p in texto_normalizado for p in nome_norm.split()):
        rel["passaram"] += 1
        rel["checks"].append(("✅ NOME", f"{parsed_txt['nome']} encontrado no PDF"))
    else:
        rel["ok"] = False
        rel["checks"].append(("❌ NOME", "Não foi possível extrair o nome completo"))
        rel["ajustes"].append("Nome deve estar em texto simples no topo do currículo.")

    # Check 3: Cargo / título profissional
    rel["total_checks"] += 1
    cargo = _norm(parsed_txt["cargo"])
    if any(tok in texto_normalizado for tok in cargo.split() if len(tok) > 3):
        rel["passaram"] += 1
        rel["checks"].append(("✅ CARGO", parsed_txt["cargo"]))
    else:
        rel["ok"] = False
        rel["checks"].append(("❌ CARGO", "Título profissional não detectado"))
        rel["ajustes"].append("Título profissional deve aparecer logo abaixo do nome.")

    # Check 4: Email presente
    rel["total_checks"] += 1
    email_match = re.search(r"[\w.+-]+@[\w-]+\.[\w.-]+", texto_pdf)
    if email_match:
        rel["passaram"] += 1
        rel["checks"].append(("✅ EMAIL", email_match.group()))
    else:
        rel["ok"] = False
        rel["checks"].append(("❌ EMAIL", "E-mail não encontrado no texto extraído"))
        rel["ajustes"].append("Adicione endereço de e-mail em texto simples (não como imagem ou hiperlink oculto).")

    # Check 5: Seções obrigatórias
    for (codigo, variacoes) in ATS_SECTIONS_REQUIRED:
        rel["total_checks"] += 1
        encontrou = any(_norm(v) in texto_normalizado for v in variacoes)
        if encontrou:
            rel["passaram"] += 1
            rel["checks"].append((f"✅ SEÇÃO {codigo}", f"Detectada: {variacoes[0]}"))
        else:
            rel["ok"] = False
            rel["checks"].append((f"❌ SEÇÃO {codigo}", f"Ausente do texto extraído"))
            rel["ajustes"].append(f"Inclua seção explícita: '{variacoes[0]}'. ATS dependem de títulos de seção padronizados.")

    # Check 6: Palavras-chave de hard skills (QA)
    hits = 0
    faltantes = []
    for kw in ATS_KEYWORDS_REQUIRED:
        if _norm(kw) in texto_normalizado:
            hits += 1
        else:
            faltantes.append(kw)
    rel["total_checks"] += 1
    if hits >= int(len(ATS_KEYWORDS_REQUIRED) * 0.7):
        rel["passaram"] += 1
        rel["checks"].append((f"✅ PALAVRAS-CHAVE", f"{hits}/{len(ATS_KEYWORDS_REQUIRED)} detectadas"))
    else:
        rel["ok"] = False
        rel["checks"].append((f"⚠️ PALAVRAS-CHAVE", f"Apenas {hits}/{len(ATS_KEYWORDS_REQUIRED)} detectadas"))
        rel["ajustes"].append(f"Considere adicionar estas keywords: {', '.join(faltantes[:8])}.")

    # Check 7: Nenhum elemento suspeito (ATS costumam quebrar com tabelas, imagens)
    rel["total_checks"] += 1
    reader = PdfReader(pdf_path)
    tem_imagem = False
    for pg in reader.pages:
        try:
            if "/XObject" in pg.get("/Resources", {}):
                for obj in pg["/Resources"]["/XObject"].values():
                    obj_ref = obj.get_object() if hasattr(obj, "get_object") else obj
                    if getattr(obj_ref, "get", lambda k: None)("/Subtype") == "/Image":
                        tem_imagem = True
                        break
        except Exception:
            pass
    if not tem_imagem:
        rel["passaram"] += 1
        rel["checks"].append(("✅ SEM IMAGENS", "Nenhuma imagem detectada — excelente para ATS"))
    else:
        rel["checks"].append(("⚠️ IMAGENS DETECTADAS", "Imagens podem quebrar scanners ATS"))
        rel["ajustes"].append("Evite fotos de perfil, logotipos ou elementos gráficos — ATS não leem imagens.")

    # Check 8: Metadados PDF corretos
    rel["total_checks"] += 1
    meta = reader.metadata or {}
    author_ok = bool(meta.get("/Author"))
    title_ok = bool(meta.get("/Title"))
    kw_ok = bool(meta.get("/Keywords"))
    if author_ok and title_ok and kw_ok:
        rel["passaram"] += 1
        rel["checks"].append(("✅ METADADOS", "Author, Title e Keywords definidos"))
    else:
        rel["ok"] = False
        rel["checks"].append(("⚠️ METADADOS", f"Author={author_ok}, Title={title_ok}, Keywords={kw_ok}"))
        rel["ajustes"].append("Preencha metadados Author/Title/Keywords para indexação ATS.")

    # Check 9: Leitura linearizada (Workday / SuccessFactors costumam ler linhas em ordem)
    rel["total_checks"] += 1
    if texto_pdf.strip().startswith(parsed_txt["nome"][:6].upper()) or parsed_txt["nome"].split()[0] in texto_pdf[:150]:
        rel["passaram"] += 1
        rel["checks"].append(("✅ LEITURA LINEAR", "Nome aparece no início do fluxo de texto"))
    else:
        rel["checks"].append(("⚠️ LEITURA LINEAR", "Nome não está nos primeiros 150 chars do fluxo"))
        rel["ajustes"].append("Evite layouts em 2 colunas — ATS preferem texto empilhado linearmente.")

    # Check 10: Tamanho razoável (1-3 páginas)
    rel["total_checks"] += 1
    if 1 <= len(reader.pages) <= 3:
        rel["passaram"] += 1
        rel["checks"].append(("✅ Nº PÁGINAS", f"{len(reader.pages)} página(s)"))
    else:
        rel["checks"].append((f"⚠️ Nº PÁGINAS", f"{len(reader.pages)} — ideal 1-2 páginas"))
        rel["ajustes"].append("Currículos Sênior ótimos têm 1 a 2 páginas.")

    rel["nota_final"] = round((rel["passaram"] / rel["total_checks"]) * 100, 1)
    return rel


def _norm(s: str) -> str:
    """Normaliza texto para comparação case/accent insensitive."""
    from unicodedata import normalize
    s = normalize("NFKD", s or "")
    s = s.encode("ASCII", "ignore").decode("ASCII")
    return s.lower()


def print_relatorio(rel: dict) -> None:
    print("\n" + "=" * 80)
    print("RELATÓRIO DE COMPATIBILIDADE ATS — SCANNER")
    print("=" * 80)
    print(f"NOTA FINAL: {rel['nota_final']} / 100  —  "
          f"{'APROVADO' if rel['nota_final'] >= 85 else 'ATENÇÃO' if rel['nota_final'] >= 70 else 'REPROVADO'}")
    print("-" * 80)
    for status, descr in rel["checks"]:
        print(f"  {status:<28}  {descr}")
    if rel["ajustes"]:
        print("\n--- AJUSTES RECOMENDADOS ---")
        for i, a in enumerate(rel["ajustes"], 1):
            print(f"  {i}. {a}")
    print("=" * 80)


# ============================================================
# TESTES AUTOMATIZADOS DE EXTRAÇÃO / ATS
# ============================================================

def run_tests(pdf_path: str, parsed_txt: dict) -> bool:
    """Bateria de testes (asserts) simulando extração por Workday, SF, Greenhouse."""
    print("\n" + "=" * 80)
    print("EXECUTANDO TESTES AUTOMATIZADOS DE COMPATIBILIDADE ATS")
    print("=" * 80)
    texto = extract_text_from_pdf(pdf_path)
    tn = _norm(texto)
    testes = []

    def t(name, condition, detail=""):
        testes.append((name, condition, detail))

    # Teste 1: Dados pessoais extraídos
    t("T1 - Extrai Nome Completo", all(p in tn for p in _norm(parsed_txt["nome"]).split()), parsed_txt["nome"])
    t("T2 - Extrai Email", bool(re.search(r"[\w.+-]+@[\w-]+\.[\w.-]+", texto)), "formato email")
    t("T3 - Cargo Principal", "qa automation engineer" in tn or "analista de testes" in tn, parsed_txt["cargo"])

    # Teste 2: Seções essenciais
    t("T4 - Seção Resumo", "resumo profissional" in tn or "resumo" in tn)
    t("T5 - Seção Competências", "principais competencias" in tn or "competencias" in tn)
    t("T6 - Seção Experiência", "experiencia profissional" in tn or "experiencia" in tn)
    t("T7 - Seção Formação", "formacao academica" in tn or "formacao" in tn)
    t("T8 - Seção Certificações", "certificacoes" in tn or "certificacoes profissionais" in tn)

    # Teste 3: Palavras-chave técnicas ATS
    t("T9 - KW Selenium", "selenium" in tn)
    t("T10 - KW API/REST", "api" in tn and "rest" in tn)
    t("T11 - KW Jenkins / CI-CD", "jenkins" in tn or "gitlab ci" in tn or "ci/cd" in tn)
    t("T12 - KW ISTQB", "istqb" in tn)
    t("T13 - KW Automação", "automacao" in tn or "automacao de testes" in tn)
    t("T14 - KW SQL / Bancos", "sql" in tn)
    t("T15 - KW BDD / Cucumber", "bdd" in tn or "cucumber" in tn)

    # Teste 4: Extração de experiência recente
    t("T16 - Experiência Meta / Mais Recente", "meta" in tn or "dezembro de 2025" in tn)
    t("T17 - Projeto TSE/G4F extraído", "g4f" in tn or "tse" in tn or "e-titulo" in tn)

    # Teste 5: Linguagens e stacks principais
    t("T18 - Linguagens: Java + Python", "java" in tn and "python" in tn)
    t("T19 - Frameworks: Cypress ou Playwright", "cypress" in tn or "playwright" in tn)
    t("T20 - Metodologias: Scrum/Kanban", "scrum" in tn or "kanban" in tn)

    passed = sum(1 for _, cond, _ in testes if cond)
    total = len(testes)
    for name, cond, det in testes:
        status = "✅ PASS" if cond else "❌ FAIL"
        det_str = f" — {det}" if det else ""
        print(f"  {status}  {name:<35}{det_str}")

    taxa = round((passed / total) * 100, 1)
    print("-" * 80)
    print(f"RESULTADO TESTES ATS: {passed}/{total} passaram — taxa {taxa}%")
    print("=" * 80)
    return taxa >= 85


# ============================================================
# ENTRY POINT
# ============================================================

def main():
    base_dir = Path(__file__).resolve().parent
    input_txt = base_dir / "curriculo.txt"
    output_pdf = base_dir / "curriculo.pdf"

    if not input_txt.exists():
        print(f"[FALHA] Arquivo {input_txt} não encontrado!")
        sys.exit(2)

    print(f"[1/4] Lendo e fazendo parse de: {input_txt.name}")
    parsed = parse_curriculo_txt(str(input_txt))
    print(f"      · Nome: {parsed['nome']}")
    print(f"      · Cargo: {parsed['cargo']}")
    print(f"      · Seções detectadas: {len(parsed['secoes'])} → " +
          ", ".join(s["titulo"] for s in parsed["secoes"]))

    print(f"[2/4] Gerando PDF ATS-friendly → {output_pdf.name}")
    build_pdf(parsed, str(output_pdf))
    assert output_pdf.exists() and output_pdf.stat().st_size > 5000, "PDF vazio ou falhou na geração"

    print(f"[3/4] Executando Scanner ATS sobre o PDF gerado")
    relatorio = run_ats_scan(str(output_pdf), parsed)
    print_relatorio(relatorio)

    print(f"[4/4] Rodando bateria de testes automatizados")
    aprovado = run_tests(str(output_pdf), parsed)

    print("\n" + "=" * 80)
    if aprovado and relatorio["nota_final"] >= 85:
        print(f"🎉 SUCESSO: Currículo aprovado com nota ATS {relatorio['nota_final']}%!")
        print(f"   Arquivo final: {output_pdf}")
        print(f"   Tamanho: {output_pdf.stat().st_size / 1024:.1f} KB")
    else:
        print(f"⚠️  Atenção: Currículo gerado, mas com nota ATS abaixo de 85% ({relatorio['nota_final']}%)")
        print("   Verifique os ajustes recomendados no relatório acima.")
    print("=" * 80)


if __name__ == "__main__":
    main()
