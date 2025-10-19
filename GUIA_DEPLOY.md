# 🚀 Guia Completo de Deploy - GM Biblioteca

## 📋 Preparação do Projeto

### 1. Arquivos Essenciais
Certifique-se de que tem estes arquivos na pasta do projeto:
- ✅ `index.html`
- ✅ `script.js`
- ✅ `styles.css`
- ✅ `favicon.ico`
- ✅ `logo-ginestal-machado.png`

### 2. Limpeza
- ❌ Remova arquivos de teste (`teste_*.html`, `debug_*.html`)
- ❌ Remova arquivos SQL (`.sql`)
- ❌ Remova READMEs de desenvolvimento (`README_*.md`)

---

## 🌐 Opção 1: GitHub Pages (RECOMENDADO)

### Passo 1: Criar Repositório no GitHub
1. **Acesse:** [github.com](https://github.com)
2. **Clique:** "New repository"
3. **Nome:** `gm-biblioteca` (ou o que preferir)
4. **Descrição:** "Sistema de Gestão de Biblioteca - Escola Ginestal Machado"
5. **Público:** ✅ (necessário para GitHub Pages gratuito)
6. **Clique:** "Create repository"

### Passo 2: Upload dos Arquivos
**Método A - Via Interface Web:**
1. **Clique:** "uploading an existing file"
2. **Arraste** todos os arquivos essenciais
3. **Commit:** "Initial commit - GM Biblioteca"
4. **Clique:** "Commit changes"

**Método B - Via Git (Avançado):**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/SEUUSUARIO/gm-biblioteca.git
git push -u origin main
```

### Passo 3: Ativar GitHub Pages
1. **Vá para:** Conta → Repositório → Settings
2. **Procure:** "Pages" (lado esquerdo)
3. **Source:** "Deploy from a branch"
4. **Branch:** "main"
5. **Folder:** "/ (root)"
6. **Clique:** "Save"

### Passo 4: Acessar o Site
- **URL:** `https://SEUUSUARIO.github.io/gm-biblioteca`
- **Tempo:** 5-10 minutos para ficar online

---

## 🌐 Opção 2: InfinityFree

### Passo 1: Criar Conta
1. **Acesse:** [infinityfree.net](https://infinityfree.net)
2. **Clique:** "Sign Up"
3. **Preencha:** Dados pessoais
4. **Verifique:** Email

### Passo 2: Criar Site
1. **Login** na conta
2. **Clique:** "Create Account"
3. **Escolha:** Subdomain gratuito (ex: `gmbiblioteca.infinityfreeapp.com`)
4. **Aguarde:** Aprovação (pode demorar algumas horas)

### Passo 3: Upload dos Arquivos
1. **Acesse:** Painel de controle
2. **Clique:** "File Manager"
3. **Vá para:** pasta `htdocs`
4. **Upload:** Todos os arquivos essenciais
5. **Teste:** Acesse seu domínio

### Passo 4: Domínio Personalizado (Opcional)
1. **Compre** domínio (ex: `gmbiblioteca.pt`)
2. **Configure** DNS apontando para InfinityFree
3. **Ative** no painel de controle

---

## 🌐 Opção 3: Netlify (Alternativa)

### Passo 1: Criar Conta
1. **Acesse:** [netlify.com](https://netlify.com)
2. **Clique:** "Sign up"
3. **Escolha:** "Sign up with GitHub"

### Passo 2: Deploy Automático
1. **Clique:** "New site from Git"
2. **Conecte:** Seu repositório GitHub
3. **Configure:** Build settings (deixe padrão)
4. **Clique:** "Deploy site"

### Passo 3: Configurações
1. **Site name:** Personalize (ex: `gm-biblioteca`)
2. **Custom domain:** Configure se tiver
3. **URL:** `https://SEU-SITE.netlify.app`

---

## 🔧 Configurações Importantes

### Supabase (Já Configurado)
```javascript
// No script.js - JÁ FUNCIONANDO
const SUPABASE_URL = 'https://njmmirrzejrdoinzuynt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

### Domínio Personalizado
Se quiser um domínio próprio:
1. **Compre** domínio (ex: GoDaddy, Namecheap)
2. **Configure** DNS para apontar para seu hosting
3. **Ative** SSL (HTTPS) - geralmente automático

---

## ✅ Checklist de Deploy

### Antes do Deploy
- [ ] Arquivos essenciais presentes
- [ ] Teste local funcionando
- [ ] Supabase configurado
- [ ] Sem erros no console

### Após o Deploy
- [ ] Site acessível via URL
- [ ] Todas as funcionalidades funcionando
- [ ] Base de dados conectada
- [ ] Responsivo em mobile
- [ ] SSL/HTTPS ativo

---

## 🆘 Resolução de Problemas

### Site não carrega
1. **Verifique** se todos os arquivos foram enviados
2. **Confirme** se o arquivo principal é `index.html`
3. **Aguarde** alguns minutos para propagação

### Base de dados não funciona
1. **Verifique** as credenciais do Supabase
2. **Teste** conexão local primeiro
3. **Confirme** se o Supabase está ativo

### Erros de CORS
1. **Verifique** configurações do Supabase
2. **Adicione** domínio nas configurações se necessário

### Site lento
1. **Otimize** imagens (comprima)
2. **Verifique** se não há arquivos desnecessários
3. **Considere** CDN se necessário

---

## 📞 Suporte

### GitHub Pages
- **Documentação:** [docs.github.com/pages](https://docs.github.com/pages)
- **Suporte:** Via GitHub Community

### InfinityFree
- **Fórum:** [forum.infinityfree.net](https://forum.infinityfree.net)
- **Documentação:** [infinityfree.net/support](https://infinityfree.net/support)

### Netlify
- **Documentação:** [docs.netlify.com](https://docs.netlify.com)
- **Suporte:** Via Netlify Community

---

## 🎉 Próximos Passos

Após o deploy bem-sucedido:

1. **Teste** todas as funcionalidades
2. **Compartilhe** a URL com os utilizadores
3. **Configure** backup regular
4. **Monitore** performance e erros
5. **Atualize** conforme necessário

**🚀 Parabéns! Seu sistema de biblioteca está online!**

