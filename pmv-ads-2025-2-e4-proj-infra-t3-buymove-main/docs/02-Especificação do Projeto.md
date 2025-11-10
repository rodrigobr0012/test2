# Especificações do Projeto

<span style="color:red">Pré-requisitos: <a href="1-Documentação de Contexto.md"> Documentação de Contexto</a></span>

Definição do problema e ideia de solução a partir da perspectiva do usuário. É composta pela definição do  diagrama de personas, histórias de usuários, requisitos funcionais e não funcionais além das restrições do projeto.

Apresente uma visão geral do que será abordado nesta parte do documento, enumerando as técnicas e/ou ferramentas utilizadas para realizar a especificações do projeto

ESPECIFICAÇÃO DO PROJETO

## Personas

| FOTO | NOME | IDADE | PERFIL | OBJETIVO | NECESSIDADE | FRUSTRAÇÃO | COMO O SITE AJUDA |
| :---: | :--- | :---: | :--- | :--- | :--- | :--- | :--- |
|![363531569-fa32ca10-e06a-460f-95db-91a57e7a8f38](https://github.com/user-attachments/assets/eead7b2e-b15f-4eba-bf52-afe7ff033fd3)| João Lopes Barros| 28 anos | Consumidor comum | Encontrar um carro usado confiável dentro do orçamento | Comparar preços sem perder tempo pesquisando em 10 sites diferentes | Nunca sabe se está pagando caro demais | Mostra opções claras com valores e alertas de queda de preço |
| ![363534445-df020f62-b3ff-4d73-b6c2-5f2105454e44](https://github.com/user-attachments/assets/95a5687c-ac49-44d2-89a6-caa4ce348427)| Camila Ágata Silva | 34 anos | Mãe de família | Comprar um carro seguro e espaçoso para os filhos | Ver facilmente quais modelos estão dentro da faixa de preço | Sites confusos, anúncios enganosos | Comparação prática e confiável em um só lugar |
| ![363535749-22940e6e-bc44-45c5-af17-fee55c333fee](https://github.com/user-attachments/assets/ab848213-3b3c-4138-80a9-cf947ce55155)| Rafael Nunes Texeira| 41 anos | Entusiasta de carros | Acompanhar preços para escolher o melhor momento de compra | Ter confiança nos dados e alertas para não perder oportunidades | Informações espalhadas em sites diferentes e pouco confiáveis | Concentra informações e preços, com alertas automáticos |
|![363534966-55fef553-3456-460e-be0d-29bd47b86311](https://github.com/user-attachments/assets/dff79966-e1ea-4d4b-9220-ddbc06142572)| Ana Paula Melo Santos | 37 anos | Revendedora | Pesquisar valores de mercado para definir preços de revenda | Dados amplos de diferentes regiões | Demora em buscar referências de mercado | Facilita a análise de preços em diferentes locais |

## Histórias de Usuários

Com base na análise das personas forma identificadas as seguintes histórias de usuários:

|EU COMO... `PERSONA`| QUERO/PRECISO ... `FUNCIONALIDADE` |PARA ... `MOTIVO/VALOR`                 |
|--------------------|------------------------------------|----------------------------------------|
|Consumidor comum  | Salvar minhas buscas e receber alertas de queda de preço          | Encontrar um carro confiável dentro do meu orçamento sem perder tempo pesquisando em vários sites.              |
|Mãe de família     | Comparar modelos lado a lado, salvar favoritos e receber alertas                 |Decidir rapidamente qual carro é melhor para minha família e não cair em anúncios enganosos. |
|Entusiasta de carros      |Usar filtros avançados e acompanhar o histórico de preços                | Escolher o melhor momento de compra e ter confiança de que estou fazendo o melhor negócio |
|Revendedora        | Acessar preços por região e exportar relatórios de mercado               | Identificar onde comprar mais barato e revender com lucro |

## Requisitos

As tabelas que se seguem apresentam os requisitos funcionais e não funcionais que detalham o escopo do projeto. Para determinar a prioridade de requisitos, aplicar uma técnica de priorização de requisitos e detalhar como a técnica foi aplicada.

<strong>Crie no mínimo 12 Requisitos funcionais, 6 não funcionais e 3 restrições</strong>
<strong>Cada aluno será responsável pela execução completa (back, web e mobile) de pelo menos 2 requisitos que será acompanhado pelo professor</strong>
### Requisitos Funcionais

| ID     | Descrição do Requisito                                                                 | Prioridade | Responsável |
|--------|----------------------------------------------------------------------------------------|------------|-------------|
| RF-001 | O sistema deve implementar uma searchbar para busca rápida de veículos por termos gerais | ALTA       |             |
| RF-002 | O sistema deve permitir que usuários se cadastrem utilizando Nome, CPF ou CNPJ, e-mail e telefone           | ALTA       |             |
| RF-003 | O sistema deve permitir login seguro com autenticação                                  | ALTA       |             |
| RF-004 | O sistema deve permitir buscar veículos por modelo, marca, ano, preço, quilometragem | ALTA       |             |
| RF-005 | O sistema deve oferecer filtros adicionais como cor, localização, número de portas      | ALTA       |             |
| RF-006 | O sistema deve mostrar informações detalhadas do veículo (preço, ano, quilometragem, fotos, descrição, localização) | ALTA |             |
| RF-007 | O usuário deve poder salvar veículos em uma lista de favoritos                         | MÉDIA      |             |
| RF-008 | O usuário deve poder deletar veículos da lista de favoritos                           | MÉDIA      |             |
| RF-009 | O usuário deve poder editar veículos na lista de favoritos                            | MÉDIA      |             |
| RF-010 | O sistema deve permitir que o usuário veja múltiplas fotos do veículo em uma galeria   | BAIXA      |             |
| RF-011 | O sistema deve recomendar veículos semelhantes ao pesquisado, com base em preço e características | BAIXA |             |
| RF-012 | O sistema deve permitir ao usuário realizar o logout do sistema                        | ALTA       |             |
| RF-013 | O sistema deve oferecer um modo de visualização rápida com informações resumidas       | BAIXA      |             |
| RF-014 | O usuário deve poder atualizar seus dados pessoais, preferências e notificações        | MÉDIA      |             |

### Requisitos não Funcionais

|ID     | Descrição do Requisito  |Prioridade |
|-------|-------------------------|----|
|RNF-001| O sistema deve ser responsivo para rodar em um dispositivos móvel | MÉDIA | 
|RNF-002| A aplicação deve ser compatível com os principais sistemas operacionais utilizados (Android e IOS) | ALTA |
|RNF-003| A segurança dos dados dos usuários deve estar em conformidade com a LGPD (Lei Geral de Proteção de Dados)	 | ALTA |
|RNF-004| A aplicação deve fornecer uma interface interativa e responsiva | ALTA |
|RNF-005| A aplicação deve ser compatível com os principais sistemas operacionais utilizados (Android e IOS) | ALTA |
|RNF-006| Deve processar requisições do usuário em no máximo 5s |  BAIXA | 
|RNF-007| A arquitetura deve permitir escalabilidade horizontal, suportando aumento de usuários e dados sem retrabalho | ALTA |
|RNF-008| As senhas devem ser armazenadas com hash seguro (ex.: bcrypt) | ALTA |
|RNF-009| O sistema deve garantir disponibilidade mínima de 99,5% ao mês | ALTA |
|RNF-010| O código deve ser modular, documentado, seguir padrões de estilo | MÉDIA |
|RNF-010| O sistema precisa de um dispositivo ligado a internet | ALTA |


## Restrições

O projeto está restrito pelos itens apresentados na tabela a seguir.

|ID| Restrição                                             |
|--|-------------------------------------------------------|
|01| O projeto deverá ser entregue até o final do semestre |
|02| Deverá ser utilizado Banco de Dados NoSQL             |

Enumere as restrições à sua solução. Lembre-se de que as restrições geralmente limitam a solução candidata.

> **Links Úteis**:
> - [O que são Requisitos Funcionais e Requisitos Não Funcionais?](https://codificar.com.br/requisitos-funcionais-nao-funcionais/)
> - [O que são requisitos funcionais e requisitos não funcionais?](https://analisederequisitos.com.br/requisitos-funcionais-e-requisitos-nao-funcionais-o-que-sao/)

## Diagrama de Casos de Uso

<img width="865" height="593" alt="image" src="https://github.com/user-attachments/assets/e0f79588-6172-4326-8a01-fa92a65a0da8" />


| Ator    | Caso de Uso                    | Descrição                                                                             |
| ------- | ------------------------------ | ------------------------------------------------------------------------------------- |
| Usuário | Criar Conta                    | Permite que um novo usuário registre-se no sistema fornecendo informações necessárias. |
| Usuário | Entrar na Conta                | Autentica o usuário no sistema usando credenciais (ex: email e senha).                |
| Usuário | Pesquisar na searchbar         | Busca por carros ou conteúdo no sistema usando uma barra de pesquisa.                 |
| Usuário | Criar lista de Carros          | Cria uma lista personalizada para armazenar carros de interesse.                      |
| Usuário | Recuperar a Senha              | Solicita a redefinição de senha em caso de esquecimento.                              |
| Usuário | Inserir Filtro                 | Aplica filtros à pesquisa para refinar os resultados.                                 |
| Usuário | Remover da lista               | Remove um carro de uma lista específica criada pelo usuário.                          |
| Usuário | Atualizar lista                | Modifica uma lista existente (ex: adicionar, reorganizar ou renomear itens).          |

# Matriz de Rastreabilidade
<img width="1194" height="512" alt="image" src="https://github.com/user-attachments/assets/9679c55f-d6c0-4c36-a29a-e6712e393290" />


# Gerenciamento de Projeto

De acordo com o PMBoK v6 as dez áreas que constituem os pilares para gerenciar projetos, e que caracterizam a multidisciplinaridade envolvida, são: Integração, Escopo, Cronograma (Tempo), Custos, Qualidade, Recursos, Comunicações, Riscos, Aquisições, Partes Interessadas. Para desenvolver projetos um profissional deve se preocupar em gerenciar todas essas dez áreas. Elas se complementam e se relacionam, de tal forma que não se deve apenas examinar uma área de forma estanque. É preciso considerar, por exemplo, que as áreas de Escopo, Cronograma e Custos estão muito relacionadas. Assim, se eu amplio o escopo de um projeto eu posso afetar seu cronograma e seus custos.

## Gerenciamento de Tempo

Com diagramas bem organizados que permitem gerenciar o tempo nos projetos, o gerente de projetos agenda e coordena tarefas dentro de um projeto para estimar o tempo necessário de conclusão.

![Diagrama de rede simplificado notação francesa (método francês)](img/02-diagrama-rede-simplificado.png)

O gráfico de Gantt ou diagrama de Gantt também é uma ferramenta visual utilizada para controlar e gerenciar o cronograma de atividades de um projeto. Com ele, é possível listar tudo que precisa ser feito para colocar o projeto em prática, dividir em atividades e estimar o tempo necessário para executá-las.

![Gráfico de Gantt](img/02-grafico-gantt.png)

## Gerenciamento de Equipe

O gerenciamento adequado de tarefas contribuirá para que o projeto alcance altos níveis de produtividade. Por isso, é fundamental que ocorra a gestão de tarefas e de pessoas, de modo que os times envolvidos no projeto possam ser facilmente gerenciados. 

![Simple Project Timeline](img/02-project-timeline.png)

## Gestão de Orçamento

| Recursos necessários                                                                 | Custo Estimado (R$) |
|--------------------------------------------------------------------------------------|--------------------:|
| Recursos humanos (6 desenvolvedores × 6 meses × R$ 3.000,00/mês por pessoa)          |          108.000,00 |
| Hardware (Notebooks, acessórios, manutenção)                                         |           12.000,00 |
| Rede (Internet, servidores de teste, banco de dados em nuvem)                        |            3.000,00 |
| Software (Licenças, ferramentas de desenvolvimento, APIs pagas)                      |            3.500,00 |
| Serviços (Hospedagem, Google Play Store, domínio, marketing inicial)                 |            4.500,00 |
| Outros custos (Treinamentos, deslocamento, imprevistos)                              |            5.000,00 |
| **Custo total estimado para o projeto**                                              |         **136.000,00** |

