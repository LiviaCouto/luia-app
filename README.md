# luia-app

Versão modularizada da plataforma Luia — estudos para IFPE 2027.

## Estrutura

```
luia-app/
  index.html        # HTML estrutural
  css/
    style.css       # Todo o CSS
  js/
    app.js          # Todo o JavaScript
```

## Banco de dados

Supabase: `aqrwxqhgkfhcylndjpit.supabase.co`
- Mesmo banco do projeto `luisa-ifpe`
- Dados acessíveis pela palavra-chave da usuária

## Próximos passos (modularização do JS)

- `js/config.js` — constantes Supabase
- `js/auth.js` — autenticação e sessão
- `js/simulados.js` — módulo de questões
- `js/dashboard.js` — dashboard e stats
- `js/perfil.js` — perfil e avatar
- `js/revisoes.js` — revisões e ciclos
- `js/app.js` — init e cola tudo
