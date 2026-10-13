# Carol — Guia Rápido de Início

**Comece em 3 passos!**

---

## Passo 1️⃣: Executar Localmente

### Com Python (Recomendado)
```bash
cd carol-catalog/
python3 -m http.server 8000
# Abrir http://localhost:8000
```

### Com Node.js
```bash
npm install -g http-server
cd carol-catalog/
http-server -c-1
# Abrir http://localhost:8080
```

---

## Passo 2️⃣: Publicar no GitHub Pages

### Terminal
```bash
cd carol-catalog/
git init
git add .
git commit -m "Initial commit: Carol catalog"
git remote add origin https://github.com/SEU_USER/carol-catalog.git
git branch -M main
git push -u origin main
```

### GitHub (Navegador)
1. Vai em Settings → Pages
2. Source: "main" branch
3. Save

**URL:** `https://seu-user.github.io/carol-catalog/`

---

## Passo 3️⃣: Customizar para sua Cliente

**Abrir em `http://localhost:8000` (ou seu GitHub Pages)**

1. Clique **"✎ Editar"** (navbar)
2. Altere:
   - **Nome do Negócio:** seu nome
   - **Frase de Apresentação:** sua marca
   - **Cor Principal:** selecione tema
   - **Número WhatsApp:** com país+DDD (ex: 5511987654321)
3. Feche editor
4. **Dados salvos automaticamente! ✓**

---

## Testar Offline

### Versão PWA (requer HTTPS/localhost)
1. Abrir em `http://localhost:8000`
2. Recarregar página (força cache)
3. DevTools (F12) → Network → Offline
4. Recarregar → funciona offline ✓

### Versão HTML Standalone
1. Editor → **"💾 Exportar HTML Offline"**
2. Arquivo baixa (`carol-offline-YYYY-MM-DD.html`)
3. Abrir em qualquer navegador (funciona offline)

---

## Estrutura de Arquivos

```
carol-catalog/
├── index.html              # Aplicação completa
├── sw.js                   # Service Worker
├── manifest.json           # PWA config
├── README.md              # Documentação detalhada
└── QUICK_START.md         # Este arquivo
```

---

## Funcionalidades

✓ **Catálogo:**
- 10 serviços demonstrativos
- Busca e filtros
- Detalhes com emojis

✓ **Editor:**
- Adicionar/editar/deletar serviços
- Mudar cor e marca
- Ativar/desativar serviços
- Combos com destaque

✓ **WhatsApp:**
- Integrado em cada serviço
- Mensagem automática
- Número configurável

✓ **Dados:**
- Salvos localmente
- Exportar JSON (backup)
- Importar JSON (restaurar)

✓ **Offline:**
- PWA com Service Worker
- Funciona sem internet
- Sincroniza dados local

✓ **Mobile:**
- Responsivo iPhone/Android
- Toca-amigável
- Rápido e leve

---

## Dúvidas?

Veja `README.md` para:
- Arquitectura técnica
- Testes detalhados
- Limitações conhecidas
- Guias de customização

---

**Pronto para usar! 🎉**
