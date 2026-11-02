# Loja de roupas

Protótipo React/Vite de uma loja de moda, com catálogo, favoritos, carrinho demonstrativo e contato de compra pelo WhatsApp.

## Funcionalidades

- Busca e filtros por categoria, tamanho, preço e disponibilidade
- Seleção de tamanho/cor e pedido via WhatsApp com mensagem codificada
- Carrinho e favoritos persistidos localmente
- Temas e cores personalizáveis; imagem de fundo apenas por upload; alternância entre modo claro/escuro
- Até cinco fotos por produto, adicionadas pelo computador e navegáveis por miniaturas na vitrine; imagens existentes podem ser mantidas ao editar
- Vitrine inicial simplificada; detalhes, tamanhos, cores e carrinho são exibidos em telas próprias
- Upload da foto da identidade da loja, com otimização local no navegador
- Contador de vendas confirmadas: registre manualmente na Área da equipe após confirmar pagamento pelo WhatsApp; avaliações não são exibidas
- Atalho visível “Área da equipe” na home, com painel demonstrativo protegido por senha
- Edição do nome e da foto da loja pela Área da equipe; imagens enviadas são otimizadas e salvas neste navegador
- Configuração dos links de Instagram, Facebook, TikTok e YouTube, exibidos no cabeçalho e no rodapé da loja
- Tela de abertura animada e transições na vitrine, nos produtos e nas telas de compra
- Layout adaptado para celular; animações respeitam a preferência por movimento reduzido

## Executar

```bash
npm install
npm run dev
```

## Publicação

O GitHub Actions publica esta loja no GitHub Pages a cada atualização da branch `main`:

https://neysidi40-debug.github.io/loja-de-roupas/

A Área da equipe está em `/admin/`. O acesso é demonstrativo e não protege informações em uma página pública.

## Acesso administrativo demonstrativo

Use o atalho **Área da equipe** no cabeçalho da home ou acesse `/admin`. A senha padrão da demonstração é `zoo2026`. Para trocá-la localmente, copie `.env.example` para `.env.local`, altere `VITE_ADMIN_PASSWORD` e reinicie o Vite. O login é pedido novamente ao recarregar a página.

O gate de senha existe no frontend e não é autenticação segura: a variável Vite fica acessível no bundle do navegador. Não use dados reais nem publique esse painel como sistema administrativo. Uma versão de produção precisa validar identidade e autorização no servidor.

## Build e limitações

```bash
npm run build
```

LocalStorage é específico deste navegador/dispositivo. Redes sociais e catálogo são salvos localmente. O pedido pelo WhatsApp usa o número comercial `+55 81 98976-9880`; pagamento e entrega são tratados fora do protótipo. As imagens de catálogo são URLs externas HTTPS.
