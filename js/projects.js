// ============================================================
// PROJECTS DATA — GLOBAL
// ============================================================
const projectsData = [
    {
        title: "NutriCamille",
        category: "website",
        description: "Website profissional desenvolvido para apresentação de serviços de nutrição.",
        image: "img/site-nutri-01.png",
        technologies: ["HTML5", "CSS3", "JavaScript"],
        status: "online",
        url: "https://camille-nutricionista.netlify.app/",
        github: "https://github.com/seu-usuario/nutricamille"
    },
    {
        title: "Adega DEV RUBY",
        category: "ecommerce",
        description: "Cardápio digital moderno para adega, com categorias de produtos, carrinho de pedidos, controle de quantidades e envio do pedido diretamente pelo WhatsApp.",
        image: "img/adega-01.png",
        technologies: ["HTML5", "CSS3", "JavaScript", "WhatsApp"],
        status: "online",
        url: "https://adegas-devruby.netlify.app/",
        github: "https://github.com/rub11/adegas-01"
    },
    {
        title: "Dashboard Financeiro",
        category: "dashboard",
        description: "Dashboard para controle financeiro, vendas, estoque e indicadores.",
        image: "img/dashboard-01.png",
        technologies: ["HTML5", "CSS3", "JavaScript", "Chart.js"],
        status: "online",
        url: "https://dashboard-financeiro-a.netlify.app/",
        github: "https://github.com/seu-usuario/dashboard-financeiro"
    },
    {
        title: "Fox CRM",
        category: "sistema",
        description: "Sistema simples para gerenciamento de clientes e informações comerciais.",
        image: "https://via.placeholder.com/600x400/1a1a1a/ffffff?text=Fox+CRM",
        technologies: ["HTML5", "CSS3", "JavaScript", "LocalStorage"],
        status: "dev",
        url: "https://seu-link-aqui.com",
        github: "https://github.com/seu-usuario/fox-crm"
    },
    {
        title: "Landing Page Tech",
        category: "landing",
        description: "Landing page moderna para uma startup de tecnologia.",
        image: "https://via.placeholder.com/600x400/1a1a1a/ffffff?text=Landing+Page+Tech",
        technologies: ["HTML5", "CSS3", "JavaScript", "GSAP"],
        status: "online",
        url: "https://seu-link-aqui.com",
        github: "https://github.com/seu-usuario/landing-tech"
    },
    {
        title: "Sistema de Pedidos",
        category: "sistema",
        description: "Sistema de gerenciamento de pedidos com interface intuitiva.",
        image: "https://via.placeholder.com/600x400/1a1a1a/ffffff?text=Sistema+de+Pedidos",
        technologies: ["React", "Node.js", "MongoDB"],
        status: "dev",
        url: "https://seu-link-aqui.com",
        github: "https://github.com/seu-usuario/sistema-pedidos"
    },
    {
        title: "Portfólio Interativo",
        category: "experimento",
        description: "Experimento visual com efeitos 3D e interações imersivas.",
        image: "https://via.placeholder.com/600x400/1a1a1a/ffffff?text=Portf%C3%B3lio+Interativo",
        technologies: ["HTML5", "CSS3", "JavaScript", "Three.js"],
        status: "online",
        url: "https://seu-link-aqui.com",
        github: "https://github.com/seu-usuario/portfolio-interativo"
    }
];

// Projeto em destaque (índice do array)
const destaqueIndex = 0;