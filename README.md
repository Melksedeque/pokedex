# Pokédex

## Sobre o Projeto

Este projeto é uma aplicação web que consome a [PokéAPI](https://pokeapi.co/) para exibir informações detalhadas sobre Pokémon. A Pokédex permite aos usuários buscar Pokémon por nome, filtrar por número, nome ou tipo, e visualizar informações detalhadas sobre cada criatura.

## Funcionalidades

- **Busca por Nome**: Encontre facilmente seu Pokémon favorito digitando seu nome
- **Filtragem Avançada**: Filtre Pokémon por número, nome ou tipo
- **Visualização Detalhada**: Acesse informações completas sobre cada Pokémon
- **Design Responsivo**: Experiência otimizada em dispositivos móveis e desktop

## Tecnologias Utilizadas

- **Vite**: Ferramenta de build rápida para desenvolvimento moderno
- **React**: Biblioteca JavaScript para construção de interfaces
- **TypeScript**: Superset tipado de JavaScript
- **Redux Toolkit**: Gerenciamento de estado da aplicação
- **React Router**: Navegação entre páginas
- **Axios**: Cliente HTTP para requisições à API
- **Jest**: Framework de testes

## Pré-requisitos

- Node.js (versão 16 ou superior)
- npm

## Instalação

```bash
# Clone o repositório
git clone https://github.com/Melksedeque/pokedex.git

# Entre no diretório do projeto
cd pokedex

# Instale as dependências
npm install
```

## Executando o Projeto

```bash
# Modo de desenvolvimento
npm run dev

# Build para produção
npm run build
```

## Testes

```bash
# Executar testes
npm run test
```

## Design

O design deste projeto foi baseado em um protótipo do Figma. Você pode visualizar o design [aqui](https://www.figma.com/design/55CRR2mF4ANCSy7678CZZW/Pokédex--Community-?node-id=913-237&p=f&t=Koh29MrEKbIF8eh2-0).

## API

Este projeto utiliza a [PokéAPI](https://pokeapi.co/), uma API RESTful que fornece dados abrangentes sobre o universo Pokémon.

Endpoint principal: `https://pokeapi.co/api/v2/`

## Estrutura do Projeto

```
pokedex/
├── src/
│   ├── assets/         # Arquivos estáticos
│   │   └── images/     # Imagens usadas no projeto
│   ├── components/     # Componentes reutilizáveis
│   ├── App.tsx         # Componente principal
│   └── main.tsx        # Ponto de entrada
├── public/             # Arquivos estáticos
│   └── images/         # Imagens públicas do projeto
├── index.html          # Arquivo HTML principal
├── package.json        # Arquivo de configuração do projeto
├── README.md           # Este arquivo
├── tsconfig.json       # Configurações do TypeScript
└── vite.config.ts      # Arquivo de configuração do Vite
```

## Implantação

Este projeto está configurado para ser implantado na [Vercel](https://vercel.com/).

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Faça commit das suas alterações (`git commit -m 'Adiciona nova feature'`)
4. Faça push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a Licença MIT. Veja o arquivo [LICENSE](https://github.com/Melksedeque/pokedex?tab=MIT-1-ov-file) para mais detalhes.

## Autor

- GitHub - [Melksedeque Silva](https://github.com/Melksedeque/)
- FrontEndMentor - [@Melksedeque](https://www.frontendmentor.io/profile/Melksedeque)
- Twitter / X - [@SouzaMelk](https://x.com/SouzaMelk)
- LinkedIn - [Melksedeque Silva](https://www.linkedin.com/in/melksedeque-silva/)

---

Desenvolvido com ❤️ e muito café!
