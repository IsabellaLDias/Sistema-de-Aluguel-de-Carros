# Sistema de Aluguel de Carros 🚖

<table>
  <tr>
    <td width="800px">
      <div align="justify">
        O Sistema de Aluguel de Carros</strong> é uma aplicação web desenvolvida para facilitar a gestão de clientes e seus respectivos pedidos de locação. Este projeto foca em uma interface limpa, responsiva e amigável, conectada a uma API robusta e padronizada.
      </div>
      <div align="justify">
        O objetivo principal é digitalizar e simplificar o processo de aluguel, permitindo que usuários criem suas contas, gerenciem seus perfis (CRUD completo) e realizem novos pedidos de forma autônoma e centralizada.
      </div>
    </td>
    <td>
      <div>
        <td width="350px" align="center">
  <img 
    src="docs/images/Logo - AlugaCarro.png" 
    alt="Logo do Projeto"
    height="180"
  />
</td>
  </tr> 
</table>

---

## 🚧 Status do Projeto

[![Versão](https://img.shields.io/badge/Versão-v1.0.0-blue?style=for-the-badge)](https://github.com/IsabellaLDias/Aluguel-Carros/releases) ![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white) ![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black) ![GitHub license](https://img.shields.io/github/license/IsabellaLDias/Aluguel-Carros?style=for-the-badge&color=007ec6&logo=opensourceinitiative)

---

## 📚 Índice
- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades Principais](#-funcionalidades-principais)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Instalação e Execução](#-instalação-e-execução)
  - [Pré-requisitos](#pré-requisitos)
  - [Instalação de Dependências e Como Executar a Aplicação](#-instalação-e-execução)
- [Estrutura de Pastas](#-estrutura-de-pastas)
- [User Stories](#-user-stories)
- [Diagramas](#-diagramas)
- [Documentações utilizadas](#-documentações-utilizadas)
- [Autores](#-autores)
- [Contribuição](#-contribuição)
- [Agradecimentos](#-agradecimentos)
- [Licença](#-licença)

---

## 📝 Sobre o Projeto

O **Sistema de Aluguel de Carros** é uma aplicação web Full-Stack projetada para atuar como um portal de autoatendimento ágil e intuitivo para clientes de locadoras de veículos.

- **Por que ele existe:**
  Surgiu da necessidade de modernizar o fluxo de pedidos de locação. Substituindo processos manuais e burocráticos, a aplicação utiliza arquitetura moderna para entregar uma experiência fluida e acessível diretamente do navegador do usuário.

- **Qual problema ele resolve:**
  O sistema elimina a lentidão e a desorganização no acompanhamento e registro de locações, centralizando toda a operação em um único painel. Ele garante:
  - **Autonomia de Cadastro:** Criação de contas independentes para clientes, com geração automática e segura de IDs.
  - **Gestão Transparente:** Painel dinâmico para acompanhamento em tempo real do status dos pedidos (pendentes, ativos, concluídos ou cancelados).
  - **Controle de Dados:** Área de perfil dedicada com CRUD completo, permitindo ao usuário atualizar suas informações ou excluir sua conta de forma permanente.  

- **Qual o contexto:**
  Desenvolvido em um ambiente acadêmico, o projeto tem como foco a aplicação de boas práticas de Engenharia de Software. Ele explora o desenvolvimento de uma **API RESTful** robusta em Java com Spring Boot, e sua integração fluida com uma interface Front-end construída sob os conceitos de *Single Page Application* (SPA) utilizando Vanilla JavaScript.

- **Onde ele pode ser utilizado:**
  - **Locadoras de Veículos:** Como portal do cliente para o registro rápido, controle e simulação de contratos de locação.
  - **Portfólio Profissional/Acadêmico:** Como um *case* de estudo prático que demonstra domínio no desenvolvimento Full-Stack e integração entre sistemas.

---

## ✨ Funcionalidades Principais

- 👤 **Gestão de Usuários (CRUD):** Tela inicial com cadastro de clientes. Uma vez logado, o usuário possui uma área de "Meu Perfil" para consultar, atualizar e excluir seus dados permanentemente.
- 🚗 **Dashboard de Pedidos:** Espaço dedicado para a criação rápida de pedidos, definindo prazo em meses e valor previsto.
- 🔒 **Isolamento de Dados:** O sistema identifica o usuário da "sessão" atual e lista apenas os pedidos de aluguel atrelados a ele.
- 📱 **Design Moderno e Responsivo:** Interface limpa estilo SaaS (*Software as a Service*), baseada em *Glassmorphism* leve, variáveis CSS modernas e componentes padronizados.
- ⚙️ **API RESTful:** Back-end robusto em Java com Spring Boot, tratando requisições, erros de conversão (Enums) e CORS de forma profissional.

---

## 🛠 Tecnologias Utilizadas

As seguintes tecnologias foram utilizadas no desenvolvimento do sistema, com foco em separação de responsabilidades (Front e Back).

### 💻 Front-end

- **Linguagens:**
  - JavaScript (ES6+ / Fetch API)
  - HTML5 Semântico
  - CSS3 Moderno
- **Arquitetura:** Single Page Application (SPA) simulada via manipulação de DOM.

### 🖥️ Back-end

- **Linguagem:** Java 17+
- **Framework Principal:** Spring Boot 3
- **Ferramentas e Bibliotecas:**
  - Spring Web (Criação da API REST)
  - Lombok (Redução de código boilerplate/DTOs)
- **Gerenciador de Dependências:** Gradle

---

## 🔧 Instalação e Execução

Esta seção descreve os passos necessários para configurar o ambiente e executar o projeto localmente.

### Pré-requisitos
Antes de iniciar, certifique-se de que o ambiente possua:

- [JDK 17 ou superior](https://adoptium.net/) instalado.
- IDE de sua preferência (IntelliJ IDEA, Eclipse ou VS Code).
- Um navegador web atualizado.

---

### 📦 Instalação de Dependências e Como Executar a Aplicação
1. Clone o repositório para sua máquina local.
2. Abra a pasta principal do projeto na sua IDE (ex: IntelliJ IDEA).
3. O Gradle irá sincronizar e baixar as dependências do Spring Boot automaticamente.
4. Navegue até `src/main/java/com/aluguelcarros` e execute a classe `AluguelcarrosApplication.java`.
5. A API e os arquivos estáticos estarão rodando simultaneamente.
6. Acesse no seu navegador: `http://localhost:8080` (O Spring Boot servirá o `index.html` da pasta `static` automaticamente).

---

## 📂 Estrutura de Pastas

A organização do projeto segue a arquitetura padrão do Spring Boot, onde a API e o Front-end estático convivem no mesmo projeto, facilitando a execução.

```
.
├── aluguelcarros/                    # 📁 Diretório principal do projeto
│   ├── .gradle/                      # 📦 Arquivos internos do Gradle
│   ├── build/                        # 🔨 Arquivos gerados no build
│   ├── gradle/                       # ⚙️ Wrapper do Gradle
│   ├── src/                          # 📂 Código-fonte da aplicação
│   │   ├── main/
│   │   │   ├── java/com/aluguelcarros/ # ☕ Pacotes Java (Back-end)
│   │   │   │   ├── config/           # ⚙️ Configurações
│   │   │   │   ├── controller/       # 🛣️ Controladores REST
│   │   │   │   ├── dto/              # 📦 Objetos de Transferência (DTOs)
│   │   │   │   ├── enum_/            # 🏷️ Enumerações (Status do Pedido)
│   │   │   │   ├── exception/        # ⚠️ Tratamento global de exceções
│   │   │   │   ├── model/            # 🏛️ Entidades de Domínio
│   │   │   │   ├── repository/       # 🗄️ Interfaces de acesso a dados
│   │   │   │   ├── security/         # 🔒 Filtros e configurações de segurança
│   │   │   │   ├── service/          # 🧠 Lógica de negócios
│   │   │   │   ├── view/             # 🖥️ Classes de representação
│   │   │   │   └── AluguelcarrosApplication.java # 🚀 Classe principal do Spring Boot
│   │   │   └── resources/            # 🌐 Arquivos estáticos e configurações
│   │   │       ├── static/           # 🎨 Front-end Vanilla (HTML, CSS, JS)
│   │   │       │   ├── index.html
│   │   │       │   ├── script.js
│   │   │       │   └── style.css
│   │   │       ├── templates/        # 📄 Arquivos de templates
│   │   │       └── application.properties # 🔧 Propriedades de configuração do Spring
│   │   └── test/                     # 🧪 Testes unitários e de integração
```
---

## 👥 User Stories

**UC01 - Cadastrar Usuário**
* Como um usuário, eu desejo me cadastrar previamente no sistema, para que eu possa acessar as funcionalidades da plataforma.

**UC02 - Gerenciar Pedido de Aluguel**
* Como um cliente, eu desejo introduzir, modificar, consultar e cancelar pedidos de aluguel, para gerenciar meus agendamentos de veículos.

**UC03 - Avaliar Pedido**
* Como um agente, eu desejo avaliar e modificar pedidos, para dar o parecer financeiro necessário para a execução do contrato.

**UC04 - Registrar Automóvel**
* Como um administrador, eu desejo registrar a matrícula, ano, marca, modelo e placa de um automóvel, para que ele esteja disponível para locação no sistema.

**UC05 - Vincular Contrato de Crédito**
* Como um banco agente, eu desejo associar um contrato de crédito a um aluguel, para formalizar o financiamento do automóvel quando necessário.

**UC06 - Consultar Dados do Contratante**
* Como um agente, eu desejo consultar o RG, CPF, Nome, Endereço, profissão e rendimentos do contratante, para realizar a análise de crédito.

**US07 - Autenticação de Usuário:** 
* Como um usuário cadastrado, desejo realizar login no sistema para acessar as funcionalidades restritas ao meu perfil.
  
**US08 - Gestão de Rendimentos:** 
* Como um cliente, desejo cadastrar até 3 fontes de rendimentos e informações empregatícias para subsidiar a análise de crédito.

**US09 - Notificação de Alteração:** 
* Como um cliente, desejo ser notificado quando um agente modificar meu pedido de aluguel para que eu possa validar as novas condições.
  
**US10 - Registro de Parecer Financeiro:** 
* Como um agente, desejo emitir um parecer positivo ou negativo sobre um pedido para que o sistema avance para a fase de execução de contrato.
  
**US11 - Definição de Propriedade:** 
* Como um agente, desejo registrar se o veículo será propriedade do cliente, empresa ou banco no contrato, dependendo da modalidade escolhida.
  
**US12 - Visualização de Status:** 
* Como um cliente, desejo visualizar o status atual do meu pedido (em análise, aprovado, aguardando contrato) para acompanhar o processo via internet.

---

## 🎥 Diagramas

### Diagrama de Casos de Uso
<br>
<img width="600px" src="docs/images/Diagram de caso de uso.png"/> 
<br>


### Diagrama de Classes
<br>
<img width="600px" src="docs/images/diagrama_classes.png"/> 
<br>

### Diagrama de Pacotes (Visão Lógica)
<br>
<img width="900px" src="./docs/images/Diagrama de Pacotes.png"/>
<br>

---

## 🔗 Documentações utilizadas

Esta seção reúne as principais documentações técnicas e referências que serviram de apoio durante o desenvolvimento do Sistema de Aluguel de Carros, auxiliando na implementação, organização do projeto e boas práticas.

* 📖 **Framework/Biblioteca (Back-end):**
  * [Documentação Oficial do **Spring Boot**](https://spring.io/projects/spring-boot)
  * [Documentação Oficial do **Project Lombok**](https://projectlombok.org/features/)

* 🎨 **Estilização e Layout (Front-end):**
  * [Documentação Oficial do **CSS (MDN Web Docs)**](https://developer.mozilla.org/pt-BR/docs/Web/CSS)

* 💻 **Linguagem e Ferramentas:**
  * [Documentação Oficial do **JavaScript (MDN Web Docs)**](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)
  * [Documentação Oficial da **Fetch API**](https://developer.mozilla.org/pt-BR/docs/Web/API/Fetch_API)
  * [Documentação Oficial do **Gradle**](https://docs.gradle.org/)

---

## 👥 Autores

| 👤 Nome | 🖼️ Foto | :octocat: GitHub | 💼 LinkedIn | 📤 Gmail |
|---------|----------|-----------------|-------------|-----------|
| Isabella Luiza Dias dos Santos  | <div align="center"><img src="https://github.com/IsabellaLDias/Portfolio-das-Meninas/blob/main/images/1733095978637.jpg?raw=true" width="70px" height="70px"></div> | <div align="center"><a href="https://github.com/IsabellaLDias"><img src="https://joaopauloaramuni.github.io/image/github6.png" width="50px" height="50px"></a></div> | <div align="center"><a href="https://www.linkedin.com/in/isabella-dias-s/"><img src="https://joaopauloaramuni.github.io/image/linkedin2.png" width="50px" height="50px"></a></div> | <div align="center"><a href="isabellamg2017@gmail.com"><img src="https://joaopauloaramuni.github.io/image/gmail3.png" width="50px" height="50px"></a></div> |
| Sofia Vasconcelos Moreira e Silva  | <div align="center"><img src="https://github.com/IsabellaLDias/Portfolio-das-Meninas/blob/main/images/imagemSo.jpeg?raw=true" width="70px" height="70px"></div> | <div align="center"><a href="https://github.com/sofiavasconcelosms"><img src="https://joaopauloaramuni.github.io/image/github6.png" width="50px" height="50px"></a></div> | <div align="center"><a href="https://www.linkedin.com/in/sofia-vasconcelos-a360b7327/"><img src="https://joaopauloaramuni.github.io/image/linkedin2.png" width="50px" height="50px"></a></div> | <div align="center"><a href="sofiavasconcelosmsilva@gmail.com"><img src="https://joaopauloaramuni.github.io/image/gmail3.png" width="50px" height="50px"></a></div> |
| Maria Clara Gomes Silva de Oliveira  | <div align="center"><img src="https://github.com/IsabellaLDias/Portfolio-das-Meninas/blob/main/images/EUEUEUEU.jpg?raw=true" width="70px" height="70px"></div> | <div align="center"><a href="https://github.com/mariaoliveira27"><img src="https://joaopauloaramuni.github.io/image/github6.png" width="50px" height="50px"></a></div> | <div align="center"><a href="https://www.linkedin.com/in/maria-clara-gomes-01b64b16a/"><img src="https://joaopauloaramuni.github.io/image/linkedin2.png" width="50px" height="50px"></a></div> | <div align="center"><a href="mariaclariagomes@gmail.com"><img src="https://joaopauloaramuni.github.io/image/gmail3.png" width="50px" height="50px"></a></div> |

---

## 🤝 Contribuição

1.  Faça um `fork` do projeto.
2.  Crie uma branch para sua feature (`git checkout -b feature/minha-feature`).
3. Commit suas mudanças (`git commit -m 'feat: Adiciona nova funcionalidade X'`). **(Utilize [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/))**
4.  Faça o `push` para a branch (`git push origin feature/minha-feature`).
5.  Abra um **Pull Request (PR)**.

---

## 🙏 Agradecimentos

Gostaria de agradecer aos seguintes canais e pessoas que foram fundamentais para o desenvolvimento deste projeto:

* [**Engenharia de Software PUC Minas**](https://www.instagram.com/engsoftwarepucminas/) - Pelo apoio institucional, estrutura acadêmica e fomento à inovação e boas práticas de engenharia.
* [**Prof. Dr. João Paulo Aramuni**](https://github.com/joaopauloaramuni) - Pelos valiosos ensinamentos sobre **Arquitetura de Software** e **Padrões de Projeto**.

---

## 📄 Licença

Este projeto é distribuído sob a **[Licença MIT](https://github.com/IsabellaLDias/Aluguel-Carros/blob/main/LICENSE)**.
