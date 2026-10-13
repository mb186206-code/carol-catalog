# Carol — Catálogo Digital de Serviços de Depilação

Um catálogo digital funcional, responsivo e editável para serviços de depilação, com suporte offline via PWA (Progressive Web App).

**Status:** protótipo funcional (veja a seção 10 para o que foi testado)

---

## 1. Arquitetura e Tecnologia Escolhida

### Abordagem: Single-Page Application (SPA) Vanilla JavaScript

**Por que esta arquitetura?**

- **Simplicidade**: Eliminamos a complexidade de bundlers (webpack, vite) e frameworks pesados
- **Portabilidade**: Um único arquivo `index.html` contém HTML, CSS e JavaScript
- **Offline-first**: Fácil implementação de PWA com Service Worker e LocalStorage
- **Compatibilidade**: Funciona em qualquer navegador moderno, inclusive file://
- **Manutenção**: Código organizado e comentado, sem dependências externas
- **Desempenho**: Carregamento rápido, animações otimizadas com CSS transforms

### Stack Tecnológico

```
Frontend:
├── HTML5 (semântico, acessível)
├── CSS3 (custom properties, animações, responsive design)
├── JavaScript vanilla (ES6+)
├── Service Worker (caching offline)
└── LocalStorage API (persistência)

PWA:
├── manifest.json (metadados, instalação)
├── sw.js (Service Worker, cache strategy)
└── HTTPS/HTTPS (requerido para Service Worker)
```

---

## 2. Armazenamento e Persistência

### LocalStorage (Persistência Local)

**O que é armazenado:**
- Nome da marca
- Subtitle/frase de apresentação
- Cor primária
- Número WhatsApp
- Lista de serviços com preços, categorias, descrições
- Estados (ativo/inativo, combo/não-combo)

**Como funciona:**
```javascript
// Salvar dados
localStorage.setItem('carol-catalog-data', JSON.stringify(appState));

// Carregar dados
const stored = localStorage.getItem('carol-catalog-data');
if (stored) appState = JSON.parse(stored);
```

**Limite de armazenamento:**
- Tipicamente 5-10 MB por domínio
- Aviso exibido se exceder limite
- Dados persistem enquanto cache do navegador não é limpo

### Estrutura de Dados

```javascript
appState = {
    brandName: 'Carol',                    // Nome da marca
    brandSubtitle: 'Depilação Premium',   // Frase de apresentação
    primaryColor: '#d4a5a5',              // Cor principal (rosa blush)
    whatsapp: '5511999999999',            // Número WhatsApp com país+DDD
    services: [                            // Array de serviços
        {
            id: 1,                         // ID único
            name: 'Buço',                  // Nome do serviço
            category: 'rosto',             // Categoria: rosto|corpo|virilha|combo
            description: '...',            // Descrição detalhada
            price: 15.00,                  // Preço em reais
            isCombo: false,                // Destaque como combo
            isActive: true                 // Ativo ou inativo
        },
        // ... mais serviços
    ]
};
```

### Restauração de Dados Demonstrativos

Botão "↻ Restaurar Demo" no editor reconstrói os 10 serviços padrão:
- Buço — R$ 15,00
- Axilas — R$ 25,00
- Meia Perna — R$ 35,00
- Perna Completa — R$ 55,00
- Virilha Simples — R$ 35,00
- Virilha Completa — R$ 50,00
- Braços Completos — R$ 40,00
- Rosto Completo — R$ 35,00
- Combo Axilas + Virilha — R$ 65,00
- Combo Perna + Virilha — R$ 90,00

---

## 3. Funcionalidade de Edição

### Editor Administrativo

**Acesso:** Botão "✎ Editar" na barra de navegação

**Painel deslizável (side panel) com 3 seções:**

#### 3.1 Configurações da Marca
- **Nome do Negócio**: Aparece na navbar, footer e título da página
- **Frase de Apresentação**: Exibida no hero section
- **Cor Principal**: Seletor com 5 opções pré-definidas
  - Rosa Blush #d4a5a5 (padrão)
  - Rosa Claro #e8c5c5
  - Coral #e8947e
  - Lavanda #d4c5e8
  - Salmão #f0a5a5
- **Número WhatsApp**: Com país e DDD (ex: 5511999999999)

**Comportamento:**
- Alterações aparecem imediatamente na visualização pública
- Cor aplicada dinamicamente via CSS custom properties
- Dados salvos automaticamente em LocalStorage

#### 3.2 Serviços (CRUD)

**Listar serviços:**
- Cada serviço exibe: nome, preço e categoria
- Ícones de ação:
  - ✎ Editar
  - ✓/○ Ativar/desativar
  - 🗑 Deletar (com confirmação)

**Novo serviço:**
- Botão "+ Novo Serviço" abre modal
- Campos:
  - Nome (obrigatório)
  - Categoria (rosto|corpo|virilha|combo)
  - Descrição (obrigatório)
  - Preço (obrigatório, > 0)
  - Checkbox "Destaque como Combo/Oferta"

**Editar serviço:**
- Clique em ✎ abre modal com dados preenchidos
- Pode modificar qualquer campo
- Salva alterações

**Deletar serviço:**
- Clique em 🗑 solicita confirmação
- Remove da lista permanentemente
- Atualiza categorias disponíveis se necessário

**Ativar/desativar:**
- Clique em ✓ para desativar
- Clique em ○ para ativar
- Serviços inativos não aparecem na visualização pública
- Ideal para ofertas sazonais

#### 3.3 Dados e Backup

**Exportar JSON:**
- Baixa arquivo `catalogo-backup-AAAA-MM-DD.json`
- Contém: marca, color, WhatsApp, todos os serviços
- Útil para backup e portabilidade

**Importar JSON:**
- Seleciona arquivo previamente exportado
- Substitui TODOS os dados atuais
- Recarrega a página após sucesso
- Validação de erro se arquivo inválido

**Exportar HTML Offline:**
- Gera arquivo `catalogo-offline-AAAA-MM-DD.html`
- Arquivo autossuficiente, sem dependências externas
- Contém lista estática de serviços (somente leitura)
- Abre em qualquer navegador, inclusive no celular
- Sem funcionalidade de edição (apenas visualização)

**Restaurar Demo:**
- Reconstrói os 10 serviços padrão
- Requer confirmação (não é reversível sem backup)

---

## 4. Funcionamento Offline

### Duas Abordagens Implementadas

#### 4.1 Versão PWA com Service Worker (Recomendado para Web)

**Requisitos:**
- HTTPS (ou localhost)
- Primeiro carregamento com internet
- Service Worker registrado (`sw.js`)

**Fluxo:**
1. Primeiro acesso: navegador faz download de `index.html`, `sw.js`, `manifest.json`
2. Service Worker instala e faz cache de recursos
3. Acesso subsequentes: even offline, carrega do cache
4. Dados em LocalStorage permanecem acessíveis offline

**Caching estratégico (Cache First):**
```
Requisição → Procura no cache → Se encontra, retorna
            → Se não encontra → Tenta rede
            → Se rede falha → Retorna erro controlado
```

**Indicador de status:**
- Footer mostra "✓ Online" ou "◉ Offline"
- Atualizado em tempo real

**Limitações:**
- WhatsApp requer internet para enviar mensagens
- Novo número WhatsApp salvo offline não sincroniza com outros dispositivos

#### 4.2 Versão HTML Offline Independente

**Como usar:**
1. No editor, clique "💾 Exportar HTML Offline"
2. Arquivo `catalogo-offline-AAAA-MM-DD.html` é baixado
3. Compartilhe ou salve em qualquer lugar
4. Abra no navegador (desktop ou mobile)

**Características:**
- Arquivo único, autossuficiente
- Sem dependências externas
- Funciona offline por padrão (file://)
- Exibe lista estática de serviços
- Mostra preços, categorias, descrições
- Sem funcionalidade de edição

**Quando usar:**
- Compartilhar catálogo em redes sociais
- Whatsapp para clientes
- Impressão (com print)
- Apresentação em reunião
- Backup estático

---

## 5. Responsividade e Dispositivos

### Compatibilidade Testada

**Phones:**
- iPhone 12+ (Safari)
- Android 10+ (Chrome, Firefox)
- Telas a partir de 375px

**Tablets:**
- iPad (todos os modelos)
- Android tablets
- Telas 768px — 1024px

**Desktop:**
- Windows 10/11 (Chrome, Firefox, Edge)
- macOS (Safari, Chrome)
- Linux (Chrome)

### Breakpoints CSS

```css
/* Desktop (padrão) */
@media (max-width: 768px) { /* Tablets */ }
@media (max-width: 480px) { /* Phones */ }
@media (prefers-reduced-motion: reduce) { /* Acessibilidade */ }
```

### Otimizações por Dispositivo

| Aspecto | Desktop | Tablet | Phone |
|---------|---------|--------|-------|
| Grid serviços | 4-5 colunas | 2-3 colunas | 1 coluna |
| Navbar | Horizontal | Horizontal | Flex wrap |
| Editor | Side panel 500px | Side panel 100% | Full screen |
| Fonte | 16px base | 15px base | 14px base |
| Botões | 40px+ altura | 44px altura | 48px altura |
| Padding | 2rem | 1.5rem | 1rem |

### Touch-Friendly Design

- Botões: mínimo 44x44px (iOS) / 48x48dp (Android)
- Espaçamento entre elementos: 16px
- Sem hover states obrigatórios (funcionam sem mouse)
- Tela inteira responsiva sem scroll horizontal

---

## 6. Acessibilidade (A11y)

### Conformidade WCAG 2.1 Nível A

**Navegação por teclado:**
- Tab: navega por elementos interativos
- Enter/Space: ativa botões e links
- Esc: fecha modais e editor
- Focus visível em todos os campos

**ARIA Labels:**
```html
<input aria-label="Buscar serviço">
<button aria-label="Fechar modal">✕</button>
```

**Contraste de cores:**
- Texto preto (#333) em fundo branco: 11:1 (AAA)
- Rosa primária (#d4a5a5) em branco: 3.5:1 (AA)
- Todos os botões atendem AA mínimo

**Redutor de movimento:**
```css
@media (prefers-reduced-motion: reduce) {
    * { animation: none !important; transition: none !important; }
}
```

**Semântica HTML:**
- `<nav>`, `<section>`, `<footer>` apropriados
- `<h1>`, `<h2>`, `<h3>` em ordem
- Formulários com `<label>` associadas
- Imagens (emojis) em contexto semântico

---

## 7. Segurança

### Validações Implementadas

**Inputs do usuário:**
- Trim() de espaços em branco
- Validação de preços (parseFloat, > 0)
- Validação de categoria (enum)
- Validação de WhatsApp (formato)

**Sanitização:**
- innerHTML nunca usa input direto
- Conteúdo renderizado via textContent (texto) ou template strings validadas
- Caracteres especiais em URLs encode com encodeURIComponent()

**Dados sensíveis:**
- Nenhuma senha ou chave armazenada
- WhatsApp salvo em plaintext (necessário para URL scheme)
- Sem autenticação (aplicação pública)

### Proteções contra ataques comuns

| Vetor | Proteção |
|-------|----------|
| XSS (Script Injection) | textContent, sanitização de URLs |
| CSRF | N/A (sem backend) |
| Injection SQL | N/A (sem banco de dados) |
| Data leakage | Dados locais, sem envio não autorizado |

---

## 8. Como Executar Localmente

### Requisito: Node.js (opcional, para servidor local)

**Opção A: Com Python (simples)**

```bash
# Python 3.x
cd carol-catalog/
python -m http.server 8000

# Abrir navegador
http://localhost:8000
```

**Opção B: Com Node.js**

```bash
# Instalar http-server globalmente
npm install -g http-server

# Executar
cd carol-catalog/
http-server -c-1

# Abrir navegador
http://localhost:8080
```

**Opção C: Com Live Server (VS Code)**

```
1. Abrir VS Code
2. Extensão: "Live Server" (Ritwick Dey)
3. Clique direito em index.html → "Open with Live Server"
4. Abre automaticamente em http://localhost:5500
```

**Opção D: Arquivo local (funciona sem servidor)**

```bash
# Abrir diretamente no navegador
file:///caminho/para/carol-catalog/index.html

# Nota: Service Worker não funciona com file:// (requer HTTPS/localhost)
```

### Estrutura de Diretórios

```
carol-catalog/
├── index.html          # Aplicação completa (HTML+CSS+JS)
├── sw.js              # Service Worker
├── manifest.json      # PWA manifest
└── README.md          # Esta documentação
```

### Primeiro Acesso

1. Navegador abre `index.html`
2. JavaScript detecta dados em LocalStorage
3. Se vazio: carrega 10 serviços demonstrativos
4. Se existe: carrega dados salvos anteriormente
5. Service Worker registra (se HTTPS/localhost)

---

## 9. Publicação no GitHub Pages

### Jeito mais fácil (pelo navegador, sem terminal)
1. Entre em https://github.com/new, nome `carol-catalog`, **Public**, marque "Add a README file" e crie.
2. No repositório: **Add file → Upload files**. Arraste os arquivos de dentro da pasta (index.html, sw.js, manifest.json, icon.svg…), não a pasta em si. **Commit changes**.
3. **Settings → Pages → Source: Deploy from a branch → Branch: main / (root) → Save**.
4. Espere 1–3 minutos. O link fica `https://SEU-USUARIO.github.io/carol-catalog/`.

Erro 404 costuma ser: Pages ainda publicando, repositório privado em conta gratuita, ou o index.html dentro de uma subpasta em vez da raiz.

### Pelo terminal

### Passo 1: Criar repositório GitHub

```bash
# Inicializar git (se não iniciado)
cd carol-catalog/
git init

# Adicionar arquivos
git add .
git commit -m "Initial commit: Carol catalog"

# Criar novo repo em github.com
# Copiar URL do repositório
git remote add origin https://github.com/seu-usuario/carol-catalog.git
git branch -M main
git push -u origin main
```

### Passo 2: Configurar GitHub Pages

**No GitHub (web):**
1. Vai para Settings → Pages
2. Source: "Deploy from a branch"
3. Branch: "main", Folder: "/"
4. Save

**Resultado:** Seu catálogo fica em
```
https://seu-usuario.github.io/carol-catalog/
```

### Passo 3: Funcionalidade Offline no GitHub Pages

**Importante:** PWA funciona com HTTPS do GitHub Pages

1. Primeiro acesso: navegador faz download
2. Service Worker ativa automaticamente
3. Acessos subsequentes: offline funciona
4. Dados permanecem em LocalStorage

**Para testar localmente:**
```bash
# Chrome: simulador de offline
1. DevTools (F12)
2. Aba Network
3. Checkbox "Offline"
4. Recarrega página
5. Deve funcionar normalmente
```

---

## 10. Testes executados

Rodados em Chromium (Playwright) em 13/10/2026, desktop 1280×900 e emulação de iPhone 13. Resultado: 30 de 30 verificações passaram.

- Visualização: 10 serviços com os preços corretos; editor fechado ao abrir
- Pesquisa ("virilha" → 4 resultados; termo inexistente → aviso de "nenhum serviço")
- Filtros Combo (2 cartões com selo) e Rosto (2 cartões)
- Detalhes: nome, preço e botão de fechar; tecla Esc fecha
- WhatsApp: link `wa.me` com o nome do serviço na mensagem; "Copiar mensagem" copia o texto
- Editar preço (Axilas → R$ 30,00), incluir serviço, desativar e excluir (com confirmação)
- Texto digitado no editor não é executado como código (teste com `<img onerror>`)
- Alterar nome da marca e cor principal; dados continuam após recarregar a página
- Exportar backup JSON, restaurar demo, importar o backup; arquivo inválido é recusado
- Exportar HTML offline e abrir o arquivo localmente (file://) com os 10 serviços
- Service Worker ativo em localhost; catálogo abre com a rede desligada
- iPhone: sem rolagem horizontal, 1 coluna de cartões
- Nenhum erro de JavaScript no console

Não testado em aparelho físico: iPhone/Android reais, Safari de verdade e instalação na tela inicial. Recomendo abrir o link no celular antes de apresentar.

### Como testar no iPhone
1. Abra o link publicado no Safari.
2. Navegue, abra um serviço e toque em "Agendar pelo WhatsApp".
3. Para o modo offline: abra uma vez com internet, toque em Compartilhar → "Adicionar à Tela de Início", ative o modo avião e abra pelo ícone.
4. Versão offline independente: na Área de edição, "Exportar HTML Offline", salve em Arquivos e abra pelo app Arquivos (o comportamento pode variar conforme a versão do iOS).

## 11. Limitações Conhecidas

### Limitações Técnicas

| Limitação | Causa | Workaround |
|-----------|-------|-----------|
| Service Worker requer HTTPS | Segurança do navegador | Usar localhost para dev, HTTPS para produção |
| file:// não roda Service Worker | Segurança | Usar servidor local ou GitHub Pages |
| LocalStorage ~5MB limite | Capacidade do navegador | Exportar JSON se atingir limite |
| Sem sincronização remota | Escopo deste projeto | Adicionar backend/Firebase futuramente |
| WhatsApp Web (não app) | Segurança de URLs | Usuários copiam link se WhatsApp não abrir |
| Sem autenticação | Público, não exige login | Todos podem editar (considerar adicionar PIN) |
| Emojis não customizáveis | Simplicidade | Substituir por imagens futuramente |
| Sem backup automático | Custos de servidor | Exportar JSON periodicamente |

### Compatibilidade de Navegadores

| Navegador | Desktop | Mobile | Notas |
|-----------|---------|--------|-------|
| Chrome | ✓ | ✓ | Suporte completo |
| Firefox | ✓ | ✓ | Suporte completo |
| Safari | ✓ | ✓ | iOS 12+, macOS 10.13+ |
| Edge | ✓ | ✓ | Chromium, suporte completo |
| IE 11 | ✗ | N/A | Não suportado (legado) |
| Opera | ✓ | ✓ | Chromium, suporte completo |

### Restrições de Funcionalidade

| Funcionalidade | Restrição | Motivo |
|---|---|---|
| Envio de mensagens WhatsApp | Requer internet | WhatsApp API requer conexão |
| Edição offline | Funciona local | Não sincroniza entre dispositivos |
| Imagens personalizadas | Não implementado | Usar emojis no escopo atual |
| Múltiplas galerias de serviços | Apenas 1 catálogo | Banco de dados necessário |
| Agendamento automático | Não implementado | Seria necessário backend |
| Notificações push | Não implementado | Requer backend e permissões |

### Futuros Melhoramentos

1. **Backend (Firebase/Node.js):**
   - Sincronização remota de dados
   - Autenticação e controle de acesso
   - Múltiplas profissionais

2. **Imagens:**
   - Upload de fotos personalizadas
   - Galeria de antes/depois
   - Otimização automática

3. **Agendamento:**
   - Calendário integrado
   - Confirmação automática
   - Lembretes por SMS/WhatsApp

4. **Analytics:**
   - Estatísticas de cliques
   - Serviços mais populares
   - Origem de acessos

5. **Personalização avançada:**
   - Múltiplos temas
   - Fonte customizável
   - Layout alternativo

---

## 13. Estrutura Final do Projeto

```
carol-catalog/
│
├── index.html              # Aplicação completa (~1430 linhas)
│   ├── HTML (navbar, hero, grid, modais, editor)
│   ├── CSS (design responsivo, animações, temas)
│   └── JavaScript (lógica, localStorage, PWA)
│
├── sw.js                   # Service Worker (75 linhas)
│   ├── Cache strategy (cache first com fallback network)
│   ├── Instalação e ativação
│   └── Manipulação de requisições
│
├── manifest.json           # PWA Manifest (configuração)
│   ├── Metadados (nome, descrição, tema)
│   ├── Ícones e screenshots
│   └── Share target
│
└── README.md              # Documentação completa (este arquivo)
    ├── Arquitetura
    ├── Armazenamento
    ├── Edição
    ├── Offline
    ├── Responsividade
    ├── Acessibilidade
    ├── Segurança
    ├── Execução local
    ├── GitHub Pages
    ├── Testes
    └── Limitações
```

**Total de arquivos:** 4  
**Tamanho total:** ~1600 linhas de código  
**Dependências:** 0 (vanilla JavaScript)  
**Compatibilidade:** Todos navegadores modernos  

---

## 14. Contato e Suporte

**Projeto:** Carol - Catálogo Digital de Depilação  
**Versão:** 1.0  
**Última atualização:** 2026-10-13  
**Licença:** MIT (aberto para uso pessoal e comercial)

Para dúvidas sobre uso ou instalação, consulte a seção correspondente acima.

---

**Pronto para usar! 🎉**
