# PH Motions — Pedro Simões, editor de vídeo

Portfólio estático (HTML, CSS e JavaScript) publicado no GitHub Pages em https://phmotions.com.br.

## Estrutura

- `index.html`: conteúdo e estrutura das seções (hero, trabalhos, sobre, serviços, anatomia, processo, FAQ, contato).
- `style.css`: identidade visual (preto + vermelho), responsividade e animações em CSS.
- `script.js`: lista de vídeos, player, rolagem suave, animações ligadas à rolagem e briefing para o WhatsApp.
- `analytics-config.js` / `analytics.js`: métricas enviadas ao Supabase (lidas pelo painel em `dashboard/`).
- `og-image.png`: imagem que aparece quando o link é compartilhado (WhatsApp, Instagram, LinkedIn).

Bibliotecas carregadas por CDN: GSAP + ScrollTrigger (animações na rolagem) e Lenis (rolagem suave).
Se elas não carregarem, o site continua funcionando sem as animações.

## Como adicionar um vídeo novo

1. Suba o vídeo (MP4, otimizado para web) no Dropbox e copie o link de compartilhamento.
2. Troque o final do link `&dl=0` por `&raw=1`.
3. Em `script.js`, dentro de `PROJETOS`, copie um bloco e troque `id` (único), `categoria`, `titulo`,
   `formato` (`vertical` ou `horizontal`), `url` e `resumo`.

O card aparece sozinho na seção Trabalhos e entra na sequência do player.
