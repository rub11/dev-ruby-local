// ============================================================
// PROJECTS DATA — GLOBAL
// ============================================================
const projectsData = [
    {
        title: "NutriCamille",
        category: "website",
        genero: "saude", // <-- ADICIONADO
        description: "Website profissional desenvolvido para apresentação de serviços de nutrição.",
        image: "img/site-nutri-01.png",
        technologies: ["HTML5", "CSS3", "JavaScript"],
        status: "online",
        url: "https://camille-nutricionista.netlify.app/",
        github: "https://github.com/seu-usuario/nutricamille"
    },
    {
        title: "Fox Secure - Seguros",
        category: "landing",
        genero: "seguros", // <-- ADICIONADO
        description: "Landing page moderna e profissional para uma plataforma de seguros, com categorias de proteção, benefícios, planos, cotação, depoimentos, FAQ e integração com WhatsApp.",
        image: "img/seguros-01.png",
        technologies: ["HTML5", "CSS3", "JavaScript"],
        status: "online",
        url: "https://rub11.github.io/seguros-01/",
        github: "https://github.com/rub11/seguros-01"
    },
    {
        title: "Imobiliária de Alto Padrão",
        category: "landing",
        genero: "imobiliaria", // <-- ADICIONADO
        description: "Landing page sofisticada e responsiva para uma imobiliária de alto padrão, com imóveis em destaque, busca, informações comerciais e contato.",
        image: "img/imobiliaria-01.png",
        technologies: ["HTML5", "CSS3", "JavaScript"],
        status: "online",
        url: "https://rub11.github.io/imobiliaria-01/",
        github: "https://github.com/rub11/imobiliaria-01"
    },
    {
        title: "Adega DEV RUBY",
        category: "ecommerce",
        genero: "adegas", // <-- ADICIONADO
        description: "Cardápio digital moderno para adega, com categorias de produtos, carrinho de pedidos, controle de quantidades e envio do pedido diretamente pelo WhatsApp.",
        image: "img/adega-01.png",
        technologies: ["HTML5", "CSS3", "JavaScript", "WhatsApp"],
        status: "online",
        url: "https://adegas-devruby.netlify.app/",
        github: "https://github.com/rub11/adegas-01"
    },
    {
        title: "Academia Fitness",
        category: "landing",
        genero: "academia", // <-- ADICIONADO
        description: "Landing page moderna e responsiva para academia, com apresentação de planos, modalidades, estrutura, benefícios, depoimentos e chamada para aula experimental.",
        image: "img/academia-01.png",
        technologies: ["HTML5", "CSS3", "JavaScript"],
        status: "online",
        url: "https://rub11.github.io/academia-01-modelo/",
        github: "https://github.com/rub11/academia-01"
    },
    {
        title: "Loja de Tênis",
        category: "e-commerce",
        genero: "moda", // <-- ADICIONADO
        description: "Loja virtual moderna e responsiva para apresentação e venda de tênis, com catálogo de produtos e experiência de navegação intuitiva.",
        image: "img/tenis-01.png",
        technologies: ["HTML5", "CSS3", "JavaScript"],
        status: "online",
        url: "https://rub11.github.io/lojadetenis-01/",
        github: ""
    },
    {
        title: "Curso de programação",
        category: "landing",
        genero: "educacao", // <-- ADICIONADO
        description: "Landing page premium para curso de programação, com apresentação da formação, módulos, tecnologias, projetos práticos, benefícios, depoimentos, oferta, FAQ e chamadas para conversão.",
        image: "img/cursoprogramação-01.png",
        technologies: ["HTML5", "CSS3", "JavaScript"],
        status: "online",
        url: "https://rub11.github.io/curso-programa-o-01/",
        github: ""
    },
    {
        title: "Barbearia Premium",
        category: "landing",
        genero: "barbearia", // <-- ADICIONADO
        description: "Landing page moderna e elegante para barbearia, com apresentação dos serviços, informações sobre o espaço e chamada para agendamento.",
        image: "img/barbearia-01.png",
        technologies: ["HTML5", "CSS3", "JavaScript"],
        status: "online",
        url: "https://rub11.github.io/Barbearia-0-/",
        github: "https://github.com/rub11/Barbearia-0-"
    },
    {
        title: "Loja de Veículos Premium",
        category: "landing",
        genero: "veiculos", // <-- ADICIONADO
        description: "Site moderno e profissional para loja e corretor de veículos, com apresentação do estoque, informações dos veículos e chamada para atendimento e negociação pelo WhatsApp.",
        image: "img/veiculos-01.png",
        technologies: ["HTML5", "CSS3", "JavaScript"],
        status: "online",
        url: "https://rub11.github.io/lojadeveiculos-modelo-dev-ruby/",
        github: "https://github.com/rub11/lojadeveiculos-modelo-dev-ruby/"
    },
    {
        title: "Nova Era Agência",
        category: "landing",
        genero: "agencia", // <-- ADICIONADO
        description: "Landing page premium para agência de marketing digital, com design moderno, animações suaves, apresentação de serviços, cases e foco em conversão de clientes.",
        image: "img/agencia-01.png",
        technologies: ["HTML5", "CSS3", "JavaScript"],
        status: "online",
        url: "https://rub11.github.io/NOVAERA-AGENCIA-01/",
        github: "https://github.com/rub11/NOVAERA-AGENCIA-01"
    },
    {
    title: "Sistema Financeiro Premium",
    category: "landing",
    genero: "financeiro",
    description: "Landing page moderna e sofisticada para apresentação de plataforma financeira, com foco em controle financeiro, organização, análise de dados e gestão inteligente.",
    image: "img/aureum-01.png",
    technologies: ["HTML5", "CSS3", "JavaScript"],
    status: "online",
    url: "https://rub11.github.io/financeiro-modelo-01-devruby/",
    github: "https://github.com/rub11/financeiro-modelo-01-devruby/"
},
{
    title: "Sistema Financeiro Premium",
    category: "landing",
    genero: "financeiro",
    description: "Landing page financeira premium com visual moderno e sofisticado, desenvolvida para apresentar uma plataforma de controle, organização e inteligência financeira.",
    image: "img/financeiro-02.png",
    technologies: ["HTML5", "CSS3", "JavaScript"],
    status: "online",
    url: "https://rub11.github.io/financeiro-02/",
    github: "https://github.com/rub11/financeiro-02/"
},
{
    title: "Orion — Tutor Financeiro",
    category: "landing",
    genero: "financeiro",
    description: "Landing page premium para um tutor financeiro inteligente, criada para apresentar uma solução de organização financeira, planejamento de metas, análises e recomendações personalizadas.",
    image: "img/financeiro-03.png",
    technologies: ["HTML5", "CSS3", "JavaScript"],
    status: "online",
    url: "https://rub11.github.io/dev-rubyy-modelo-financeiro-03/",
    github: "https://github.com/rub11/dev-rubyy-modelo-financeiro-03/"
},


];

// Projeto em destaque (índice do array) — não usado mais, mas mantido
const destaqueIndex = 0;