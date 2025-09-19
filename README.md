# Pokédex

## Sobre o Projeto

Este projeto é uma aplicação web que consome a [PokéAPI](https://pokeapi.co/) para exibir informações detalhadas sobre Pokémon. A Pokédex permite aos usuários buscar Pokémon por nome, filtrar por número, nome ou tipo, e visualizar informações detalhadas sobre cada criatura.

## Funcionalidades Implementadas

### 🔍 **Sistema de Busca e Filtros**
- **Busca por Nome**: Encontre facilmente seu Pokémon favorito com busca em tempo real e debounce
- **Filtro por Tipo**: Selecione múltiplos tipos de Pokémon (Fogo, Água, Grama, etc.)
- **Filtro por Número**: Defina intervalos específicos (ex: #001-#151 para Kanto)
- **Ordenação Avançada**: Ordene por número ou nome (crescente/decrescente)
- **Limpeza de Filtros**: Botão para resetar todos os filtros aplicados

### 📱 **Interface e Navegação**
- **Lista Paginada**: Carregamento otimizado com scroll infinito
- **Cards Interativos**: Visualização em grid com informações básicas
- **Página de Detalhes**: Informações completas organizadas em abas
- **Navegação Fluida**: Roteamento interno entre lista e detalhes
- **Design Responsivo**: Experiência otimizada para todos os dispositivos

### 📊 **Informações Detalhadas**
- **Aba Sobre**: Descrição, altura, peso, habilidades e tipos
- **Aba Estatísticas**: Gráficos visuais das stats base do Pokémon
- **Aba Evolução**: Cadeia evolutiva completa (em desenvolvimento)
- **Imagens Oficiais**: Sprites de alta qualidade da PokéAPI
- **Nomes Localizados**: Nomes em português quando disponíveis

### ⚡ **Performance e UX**
- **Estados de Loading**: Indicadores visuais durante carregamentos
- **Tratamento de Erros**: Mensagens amigáveis para falhas de rede
- **Acessibilidade**: ARIA labels e navegação por teclado
- **Animações Suaves**: Transições e efeitos visuais modernos
- **Cores Temáticas**: Interface adaptada aos tipos de Pokémon

## Tecnologias Utilizadas

### **Frontend**
- **React 18**: Biblioteca JavaScript com hooks modernos
- **TypeScript**: Tipagem estática para maior segurança
- **Vite**: Build tool ultra-rápida para desenvolvimento
- **SCSS Modules**: Estilização modular e responsiva

### **Gerenciamento de Estado**
- **React Hooks**: useState, useEffect, useCallback, useMemo
- **Context API**: Para compartilhamento de dados entre componentes

### **Integração com API**
- **Axios**: Cliente HTTP para requisições à PokéAPI
- **Async/Await**: Programação assíncrona moderna
- **Error Handling**: Tratamento robusto de erros

### **Testes e Qualidade**
- **Jest**: Framework de testes unitários
- **React Testing Library**: Testes focados no comportamento
- **ESLint**: Linting para qualidade de código
- **Prettier**: Formatação automática de código

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
│   ├── components/           # Componentes React
│   │   ├── Header/          # Cabeçalho com logo e busca
│   │   ├── PokemonList/     # Lista principal de Pokémon
│   │   ├── PokemonCard/     # Card individual de Pokémon
│   │   ├── PokemonDetails/  # Página de detalhes completa
│   │   ├── PokemonFilters/  # Sistema de filtros avançado
│   │   └── Loading/         # Componente de carregamento
│   ├── services/            # Serviços e APIs
│   │   └── pokemonApi.ts    # Integração com PokéAPI
│   ├── types/               # Definições TypeScript
│   │   └── pokemon.ts       # Interfaces dos dados
│   ├── styles/              # Estilos globais
│   │   └── _breakpoints.scss # Mixins responsivos
│   ├── assets/              # Recursos estáticos
│   │   └── images/          # Logos e ícones
│   ├── App.tsx              # Componente raiz com roteamento
│   └── main.tsx             # Ponto de entrada
├── __mocks__/               # Mocks para testes
├── Layout/                  # Designs de referência
├── public/                  # Arquivos públicos
├── jest.config.mjs          # Configuração de testes
├── tsconfig.json            # Configuração TypeScript
└── vite.config.ts           # Configuração Vite
```

## Implantação

Este projeto está configurado para ser implantado na [Vercel](https://vercel.com/).

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Faça commit das suas alterações (`git commit -m 'Adiciona nova feature'`)
4. Faça push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 🚀 Próximos Passos de Desenvolvimento

Este projeto está em constante evolução! Aqui estão as funcionalidades e melhorias planejadas para as próximas versões:

### **Fase 1: Funcionalidades Essenciais**
- [ ] **Sistema de Favoritos**: Salvar Pokémon favoritos no localStorage
- [ ] **Comparação de Pokémon**: Comparar stats entre dois ou mais Pokémon
- [ ] **Cadeia Evolutiva Completa**: Implementar visualização completa das evoluções
- [ ] **Filtro por Geração**: Filtrar Pokémon por região (Kanto, Johto, Hoenn, etc.)
- [ ] **Modo Escuro**: Toggle entre tema claro e escuro

### **Fase 2: Experiência Avançada**
- [ ] **PWA (Progressive Web App)**: Funcionalidade offline e instalação
- [ ] **Busca por Voz**: Integração com Web Speech API
- [ ] **Realidade Aumentada**: Visualizar Pokémon em AR (experimental)
- [ ] **Quiz Pokémon**: Mini-jogos para testar conhecimento
- [ ] **Pokédex Sonora**: Reproduzir gritos dos Pokémon

### **Fase 3: Performance e Escalabilidade**
- [ ] **Migração para Next.js**: SSR e otimizações avançadas
- [ ] **Cache Inteligente**: Estratégias de cache para melhor performance
- [ ] **Lazy Loading Avançado**: Carregamento otimizado de imagens
- [ ] **Service Workers**: Cache offline e sincronização
- [ ] **Análise de Bundle**: Otimização do tamanho da aplicação

### **Fase 4: Recursos Sociais**
- [ ] **Sistema de Usuários**: Autenticação e perfis personalizados
- [ ] **Compartilhamento Social**: Compartilhar Pokémon favoritos
- [ ] **Comentários e Avaliações**: Sistema de review dos Pokémon
- [ ] **Batalhas Simuladas**: Simulador básico de batalhas
- [ ] **Ranking Global**: Pokémon mais populares da comunidade

### **Melhorias Técnicas Contínuas**
- [ ] **Testes E2E**: Implementar testes com Cypress
- [ ] **Storybook**: Documentação visual dos componentes
- [ ] **CI/CD**: Pipeline automatizado de deploy
- [ ] **Monitoramento**: Integração com ferramentas de analytics
- [ ] **Acessibilidade**: Certificação WCAG 2.1 AA

### **Como Contribuir**
Este projeto é perfeito para quem está aprendendo React e TypeScript! Sinta-se à vontade para:

1. **Escolher uma tarefa** da lista acima
2. **Criar uma issue** descrevendo sua implementação
3. **Fazer um fork** do projeto
4. **Implementar a funcionalidade** seguindo os padrões do código
5. **Abrir um Pull Request** com suas mudanças

*"A jornada de mil milhas começa com um único passo."* - Lao Tzu

---

## Licença

Este projeto está licenciado sob a Licença MIT. Veja o arquivo [LICENSE](https://github.com/Melksedeque/pokedex?tab=MIT-1-ov-file) para mais detalhes.

## Autor

- GitHub - [Melksedeque Silva](https://github.com/Melksedeque/)
- FrontEndMentor - [@Melksedeque](https://www.frontendmentor.io/profile/Melksedeque)
- Twitter / X - [@SouzaMelk](https://x.com/SouzaMelk)
- LinkedIn - [Melksedeque Silva](https://www.linkedin.com/in/melksedeque-silva/)

---

Desenvolvido com ❤️ e muito café!
