# 📚 GM Biblioteca

Sistema completo de gestão de biblioteca desenvolvido para a Escola Ginestal Machado.

## 🚀 Deploy na Internet

### 📋 Pré-requisitos
- Conta no GitHub
- Conta no Supabase (já configurada)
- Conta no InfinityFree ou plataforma de hosting gratuita

### 🌐 Opções de Deploy

#### **Opção 1: GitHub Pages (Recomendado - Mais Fácil)**
1. **Faça upload dos arquivos para o GitHub**
2. **Ative o GitHub Pages**
3. **Seu site ficará disponível em:** `https://seuusuario.github.io/gm-biblioteca`

#### **Opção 2: InfinityFree (Hosting Gratuito)**
1. **Crie conta no InfinityFree**
2. **Faça upload via File Manager**
3. **Configure domínio personalizado (opcional)**

#### **Opção 3: Netlify (Alternativa)**
1. **Conecte com GitHub**
2. **Deploy automático**
3. **URL personalizada gratuita**

---

## 📁 Arquivos Essenciais para Deploy

```
gm_biblioteca/
├── index.html              # ✅ Página principal
├── script.js               # ✅ Lógica da aplicação
├── styles.css              # ✅ Estilos CSS
├── favicon.ico             # ✅ Ícone do site
├── logo-ginestal-machado.png  # ✅ Logo da escola
└── README.md               # ✅ Documentação
```

## 🔧 Configuração do Supabase

O Supabase já está configurado e funcionando. As credenciais estão no `script.js`:

```javascript
const SUPABASE_URL = 'https://njmmirrzejrdoinzuynt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

## 🎯 Funcionalidades

- ✅ **Gestão de Utentes** - Cadastro e edição de utilizadores
- ✅ **Gestão de Livros** - Catálogo completo com autores, editoras, géneros
- ✅ **Gestão de Empréstimos** - Empréstimos, devoluções, cancelamentos
- ✅ **Relatórios de Estado** - Acompanhamento do estado dos livros
- ✅ **Avisos de Atraso** - Notificações por email
- ✅ **Interface Responsiva** - Funciona em desktop e mobile

## 🗄️ Base de Dados

**Tabelas principais:**
- `utentes` - Utilizadores da biblioteca
- `livros` - Catálogo de livros
- `requisicoes` - Empréstimos e devoluções
- `autores`, `editoras`, `generos`, `idiomas` - Dados de apoio
- `codigos_postais` - Códigos postais portugueses

## 🔒 Segurança

- ✅ **Autenticação** via Supabase
- ✅ **Validação** de dados no frontend
- ✅ **Sanitização** de inputs
- ✅ **Rate limiting** do Supabase

## 📱 Compatibilidade

- ✅ **Chrome, Firefox, Safari, Edge**
- ✅ **Desktop e Mobile**
- ✅ **Responsive Design**

## 🆘 Suporte

Para problemas ou dúvidas:
1. Verifique o console do navegador (F12)
2. Consulte os logs do Supabase
3. Teste com os arquivos de debug incluídos

## 📄 Licença

Este projeto é propriedade da Escola Ginestal Machado.