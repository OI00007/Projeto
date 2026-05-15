# 🚀 Guia de Deploy - Sistema ARGOM

Este documento descreve como fazer deploy da aplicação ARGOM em diferentes ambientes.

---

## 📋 Índice

1. [Pré-requisitos](#pré-requisitos)
2. [Deploy via Lovable](#deploy-via-lovable)
3. [Deploy Manual](#deploy-manual)
4. [Configuração de Domínio Customizado](#configuração-de-domínio-customizado)
5. [Variáveis de Ambiente](#variáveis-de-ambiente)
6. [CI/CD](#cicd)
7. [Monitoramento](#monitoramento)
8. [Rollback](#rollback)
9. [Troubleshooting](#troubleshooting)

---

## 📦 Pré-requisitos

### Para Deploy Local
- Node.js 18.0.0+
- npm 9.0.0+ (ou yarn/bun)
- Git

### Para Deploy em Produção
- Conta no provedor de hospedagem (Lovable, Vercel, Netlify, etc.)
- Projeto Supabase configurado
- Domínio personalizado (opcional)

---

## 🌟 Deploy via Lovable (Recomendado)

O Lovable oferece a maneira mais simples de fazer deploy da aplicação.

### Passo 1: Acessar o Projeto

1. Acesse [lovable.dev](https://lovable.dev)
2. Abra seu projeto ARGOM
3. Verifique se todas as alterações estão salvas

### Passo 2: Publicar

1. Clique no botão **"Share"** no canto superior direito
2. Selecione **"Publish"**
3. Aguarde o build completar (geralmente 1-2 minutos)

### Passo 3: Acessar a Aplicação

Sua aplicação estará disponível em:
```
https://seu-projeto.lovable.app
```

### Atualizações

Para atualizar a aplicação publicada:
1. Faça as alterações necessárias
2. Clique em **"Share"** → **"Update"**
3. As mudanças serão aplicadas em segundos

> **Nota**: Alterações no frontend requerem "Update". Alterações em Edge Functions e banco de dados são aplicadas automaticamente.

---

## 🔧 Deploy Manual

### Vercel

#### Via CLI
```bash
# Instalar Vercel CLI
npm i -g vercel

# Build do projeto
npm run build

# Deploy
vercel deploy --prod
```

#### Via Dashboard

1. Acesse [vercel.com](https://vercel.com)
2. Importe o repositório Git
3. Configure as variáveis de ambiente
4. Clique em "Deploy"

#### Configuração `vercel.json`
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

### Netlify

#### Via CLI
```bash
# Instalar Netlify CLI
npm i -g netlify-cli

# Build do projeto
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

#### Via Dashboard

1. Acesse [netlify.com](https://netlify.com)
2. Conecte o repositório Git
3. Configure:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Adicione variáveis de ambiente
5. Clique em "Deploy site"

#### Configuração `netlify.toml`
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Docker

#### Dockerfile
```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### nginx.conf
```nginx
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    
    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;
        
        location / {
            try_files $uri $uri/ /index.html;
        }
        
        location /assets {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}
```

#### Comandos Docker
```bash
# Build da imagem
docker build -t argom:latest .

# Executar container
docker run -d -p 80:80 --name argom argom:latest

# Docker Compose
docker-compose up -d
```

#### docker-compose.yml
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "80:80"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

### AWS S3 + CloudFront

```bash
# Build
npm run build

# Sync com S3
aws s3 sync dist/ s3://seu-bucket --delete

# Invalidar cache CloudFront
aws cloudfront create-invalidation \
  --distribution-id XXXXX \
  --paths "/*"
```

---

## 🌐 Configuração de Domínio Customizado

### Via Lovable

1. Acesse **Project** → **Settings** → **Domains**
2. Clique em **"Connect Domain"**
3. Insira seu domínio (ex: `app.suafazenda.com.br`)
4. Configure os registros DNS:

| Tipo | Nome | Valor |
|------|------|-------|
| CNAME | app | lovable.app |

### Via Vercel/Netlify

1. Adicione o domínio nas configurações do projeto
2. Configure os registros DNS conforme instruções
3. Aguarde propagação (até 48h)

### Configuração SSL

- **Lovable/Vercel/Netlify**: SSL automático via Let's Encrypt
- **AWS**: Use AWS Certificate Manager
- **Manual**: Obtenha certificado e configure no servidor

---

## 🔐 Variáveis de Ambiente

### Produção

```env
# Supabase (obrigatório)
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Opcional
VITE_APP_ENV=production
VITE_SENTRY_DSN=https://xxx@sentry.io/xxx
```

### Edge Functions (Supabase Secrets)

```bash
# Configurar via CLI
supabase secrets set OPENAI_API_KEY=sk-xxx
supabase secrets set WEATHER_API_KEY=xxx

# Ou via Dashboard do Supabase
# Settings → Edge Functions → Secrets
```

### Segurança de Secrets

⚠️ **Nunca commite secrets no repositório!**

- Use `.env.local` para desenvolvimento
- Configure secrets via dashboard do provedor
- Use variáveis de ambiente do CI/CD

---

## 🔄 CI/CD

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linter
        run: npm run lint
      
      - name: Build
        run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### GitLab CI

```yaml
# .gitlab-ci.yml
stages:
  - build
  - deploy

build:
  stage: build
  image: node:18-alpine
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - dist/

deploy:
  stage: deploy
  image: alpine
  script:
    - apk add --no-cache curl
    - curl -X POST $DEPLOY_WEBHOOK_URL
  only:
    - main
```

---

## 📊 Monitoramento

### Lovable Analytics

- Acesse **Settings** → **Analytics**
- Visualize métricas de uso e performance

### Sentry (Monitoramento de Erros)

```typescript
// src/lib/sentry.ts
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.VITE_APP_ENV,
  tracesSampleRate: 0.1,
});
```

### Health Check

```typescript
// Endpoint de health check
export async function healthCheck() {
  return {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: import.meta.env.VITE_APP_VERSION,
  };
}
```

---

## ⏪ Rollback

### Via Lovable

1. Acesse o histórico de versões
2. Selecione a versão anterior
3. Clique em "Restore"

### Via Git

```bash
# Reverter para commit específico
git revert HEAD~1
git push origin main

# Ou forçar deploy de versão anterior
git checkout v1.0.0
npm run build
# Deploy manual
```

### Via Vercel/Netlify

1. Acesse **Deployments**
2. Encontre o deploy anterior
3. Clique em **"Redeploy"** ou **"Rollback"**

---

## 🔧 Troubleshooting

### Build Falha

**Erro de memória**
```bash
# Aumentar limite de memória
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

**Erro de tipos TypeScript**
```bash
# Verificar tipos antes do build
npm run type-check

# Build ignorando erros de tipo (não recomendado)
# Modifique vite.config.ts
```

### 404 em Rotas

Verifique se o provedor está configurado para SPA:
- Vercel: `vercel.json` com rewrites
- Netlify: `_redirects` ou `netlify.toml`
- Nginx: `try_files $uri $uri/ /index.html`

### Variáveis de Ambiente Não Carregam

1. Verifique o prefixo `VITE_`
2. Reinicie o servidor de desenvolvimento
3. Verifique se estão configuradas no provedor

### CORS Errors

Configure os headers no Supabase:
1. Acesse **Settings** → **API**
2. Adicione domínios permitidos em **CORS**

### Edge Functions Não Funcionam

1. Verifique os logs: `supabase functions logs nome-funcao`
2. Teste localmente: `supabase functions serve`
3. Verifique secrets configurados

---

## 📋 Checklist de Deploy

### Antes do Deploy
- [ ] Todas as variáveis de ambiente configuradas
- [ ] Build local funciona sem erros
- [ ] Testes passando
- [ ] Lint sem warnings críticos
- [ ] Migrations do banco aplicadas

### Durante o Deploy
- [ ] Monitorar logs de build
- [ ] Verificar se todos os assets carregam
- [ ] Testar autenticação
- [ ] Testar rotas principais

### Após o Deploy
- [ ] Testar em dispositivos móveis
- [ ] Verificar performance (Lighthouse)
- [ ] Confirmar SSL funcionando
- [ ] Monitorar erros no Sentry
- [ ] Comunicar equipe sobre a atualização

---

## 📞 Suporte

Em caso de problemas:

1. Verifique a [documentação do Lovable](https://docs.lovable.dev)
2. Consulte os logs de erro
3. Abra uma issue no repositório
4. Entre em contato: deploy@argom.com.br

---

*Última atualização: Janeiro 2025*
