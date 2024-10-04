import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { readdirSync, readFileSync, writeFileSync, statSync } from "fs";
import Anthropic from "@anthropic-ai/sdk";
import weaviate, { vectorizer, generative, dataType } from "weaviate-client";
import OpenAI from "openai";



const categoriesMapping = {
    CPVIF: {
        description:
            "El marketing de influencia viral es una estrategia innovadora que busca maximizar el alcance y la efectividad de las campañas publicitarias a través de colaboraciones con creadores de contenido en plataformas como TikTok e Instagram Reels. Esta técnica se enfoca en trabajar con influencers de nicho que aún no han monetizado sus cuentas, ofreciendo una forma económica y escalable de adquirir usuarios para startups y empresas. El enfoque incluye la identificación de creadores ideales, la redacción de guiones efectivos y la negociación de precios bajos, todo con el objetivo de generar un crecimiento significativo en ingresos y base de usuarios. Además, se discuten aspectos importantes como las métricas clave en marketing, estrategias de pago a creadores y la optimización de procesos para maximizar resultados mientras se minimiza el tiempo y esfuerzo invertidos.",
        topics: [
            "Marketing de influencia viral",
            "Colaboración con influencers de nicho",
            "Estrategias de adquisición de usuarios",
            "Plataformas clave: TikTok e Instagram Reels",
            "Métricas de marketing: CAC y LTV",
            "Optimización de conversión y retención",
            "Estrategias de pago a creadores de contenido",
            "Cálculo de visitas esperadas y rentabilidad",
            "Uso de la calculadora VIM",
            "Estructuras de guiones preestablecidas",
            "Negociación con creadores de contenido",
            "Trabajo remoto y outsourcing",
            "Automatización de procesos",
            "Construcción de equipos remotos",
            "Maximización de resultados con mínimo esfuerzo",
            "Búsqueda de talento en plataformas como Upwork",
            "Recopilación de bases de datos de influencers",
            "Escalabilidad del trabajo en marketing de influencers",
            "Optimización del tiempo y productividad",
            "Adaptación de estrategias según el tipo de startup y producto",
        ],
    },
    CP_LeftLeftOrganicSocial: {
        description:
            "El marketing digital y el desarrollo personal en el ámbito del tenis se entrelazan en esta categoría. Se exploran estrategias de marketing inbound y el uso efectivo de redes sociales para conectar con el público objetivo. La categoría aborda la mejora del rendimiento en el tenis, tanto física como técnicamente, y cómo combinar este deporte con el desarrollo personal. Además, se discuten técnicas para destacar profesionalmente, desde la creación de contenido hasta la organización de proyectos y la prospección de clientes.",
        topics: [
            "Estrategias de marketing inbound",
            "Uso de screenshots en YouTube y Google",
            "Colaboración con microinfluencers",
            "Diseño de propuestas profesionales",
            "Análisis de videos de partidos de tenis",
            "Mejora del rendimiento físico en tenis",
            "Técnica de saque en tenis",
            "Uso de Instagram para interacción con el público",
            "Definición del público objetivo y buyer persona",
            "Utilización de Notion para organización",
            "Validación de hipótesis sobre el público objetivo",
            "Preferencias de comunicación de los clientes",
            "Factores decisivos en la compra de servicios de tenis",
            "Programa de mentoría: tenis y desarrollo personal",
            "Estrategias para el mercado inmobiliario de Dubai",
            "Creación de contenido para reputación profesional",
            "Importancia de una oferta bien estructurada",
            "Organización de proyectos",
            "Prospección y cierre de clientes",
            "Comunicación a través de Discord",
        ],
    },
    CP_LeftOrganicSocial: {
        description:
            "El marketing de contenidos y el desarrollo de marca personal son temas centrales en esta categoría. Se abordan estrategias para crear contenido atractivo y auténtico en diversas plataformas de redes sociales, con énfasis en la autenticidad y la conexión con el público. Se discuten técnicas para mejorar la presencia en línea, desde la creación de videos hasta la optimización de perfiles. Además, se exploran aspectos del branding, incluyendo la identidad visual, la tipografía y la psicología del color. La monetización, el análisis de métricas y la organización del trabajo también son temas importantes en esta categoría.",
        topics: [
            "Estrategias de creación de contenido para redes sociales",
            "Desarrollo y fortalecimiento de marca personal",
            "Técnicas de engagement y crecimiento de audiencia",
            "Optimización de contenido para plataformas específicas (YouTube, TikTok, Instagram)",
            "Autenticidad y storytelling en la creación de contenido",
            "Análisis de métricas y rendimiento en redes sociales",
            "Branding e identidad visual (colores, tipografía, logotipos)",
            "Monetización de contenido y negocios en línea",
            "Planificación y organización del trabajo creativo",
            "Superación de obstáculos (miedo a la cámara, repetición de ideas)",
            "Marketing de influencia y trabajo con micro-influencers",
            "Estrategias de comunicación efectiva y oratoria",
            "Posicionamiento de marca en el mercado digital",
            "Uso de inteligencia artificial en marketing y recursos humanos",
            "Creación de contenido para nichos específicos",
            "Automatización y gestión de redes sociales",
            "Desarrollo de habilidades de comunicación",
            "Estrategias para aumentar visualizaciones y interacciones",
            "Importancia del propósito y valores en la marca personal",
            "Técnicas de producción de video y contenido audiovisual",
        ],
        titles: ["branding", "que es el branding"],
    },
    CP_OrganicSocial: {
        description:
            "El marketing de influencia en redes sociales como TikTok e Instagram se ha convertido en una estrategia clave para la viralización de contenido y el crecimiento de audiencias. Esta categoría abarca desde la creación de contenido efectivo hasta la optimización para diferentes mercados geográficos, enfocándose en la retención de usuarios y la maximización del tiempo en la plataforma. Se exploran técnicas para aumentar el engagement, la importancia de la ubicación geográfica en el alcance del contenido, y estrategias para fomentar compartidos y likes. Además, se discuten métodos para monetizar la audiencia y convertir espectadores en seguidores leales o clientes, destacando la importancia de la autenticidad y la adaptación a diferentes nichos.",
        topics: [
            "Viralización de contenido en TikTok e Instagram",
            "Estrategias para aumentar el engagement del usuario",
            "Importancia de la ubicación geográfica en el alcance",
            "Técnicas para fomentar compartidos y likes",
            "Optimización de contenido para diferentes regiones",
            "Monetización en plataformas de redes sociales",
            "Estructura efectiva de contenido viral",
            "Uso de hashtags y palabras clave relevantes",
            "Métricas de rendimiento y KPIs en marketing de influencia",
            "Creación de valor para la audiencia",
            "Adaptación del contenido a diferentes nichos",
            "Importancia de la autenticidad en el mensaje",
            "Estrategias para convertir espectadores en seguidores o clientes",
            "Colaboración con otros creadores de contenido",
            "Análisis de la competencia en redes sociales",
            "Desarrollo de una propuesta de valor única",
            "Establecimiento de objetivos claros y medibles",
            "Creación de comunidades en torno a la marca",
            "Importancia del contexto y tiempo del usuario",
            "Adaptación continua de la estrategia de marketing digital",
        ],
        titles: [
            "01. TikTok Keys para empresas y marcas personales - Part 1",
            "02. Métricas Clave - Part 1",
            "03. ¿Por qué IM es un buen canal de distribución? - Part 1",
            "06. Objetivos del Cliente - Part 1",
            "07. OKRs & Análisis - Part 1",
        ],
    },
    CP_Organic_Social_Questions: {
        description:
            "La categoría abarca estrategias de marketing digital y creación de contenido para emprendedores y creadores. Se enfoca en la importancia de desarrollar una marca personal auténtica y crear contenido relevante para el público objetivo. Además, se discuten técnicas para optimizar la presencia en redes sociales y monetizar audiencias. La categoría también incluye temas sobre el aprendizaje de habilidades digitales y la transición hacia carreras en el sector tecnológico. Por último, se abordan estrategias de validación de ideas de negocio y desarrollo de productos mínimos viables (MVP).",
        topics: [
            "Estrategias de marketing digital",
            "Creación de contenido para redes sociales",
            "Desarrollo de marca personal",
            "Optimización de presencia en línea",
            "Monetización de audiencias",
            "Técnicas de storytelling",
            "Análisis de mercado y competencia",
            "Validación de ideas de negocio",
            "Desarrollo de MVP (Producto Mínimo Viable)",
            "Aprendizaje de habilidades digitales",
            "Transición a carreras tecnológicas",
            "Colaboración con influencers",
            "Marketing de afiliados",
            "Creación de comunidades en línea",
            "Estrategias de contenido orgánico vs. pagado",
            "Uso efectivo de plataformas como LinkedIn, Instagram y TikTok",
            "Técnicas de producción de video y audio",
            "Superación de bloqueos creativos",
            "Networking y colaboración entre creadores",
            "Estrategias de crecimiento en redes sociales",
        ],
    },
    ClassesVIF: {
        description:
            "El marketing de influencers y las estrategias de venta son temas centrales en esta categoría. Se exploran técnicas para el crecimiento orgánico en redes sociales y la creación de contenido viral. La categoría aborda la importancia de establecer objetivos personales y profesionales, así como la comunicación efectiva con clientes. También se discuten aspectos del e-commerce, desarrollo de aplicaciones y monetización de ideas.",
        topics: [
            "Marketing de influencers",
            "Estrategias de venta",
            "Crecimiento orgánico en redes sociales",
            "Contenido viral",
            "Objetivos personales y profesionales",
            "Comunicación con clientes",
            "Selección de productos para promoción",
            "Marketing en TikTok",
            "E-commerce y dropshipping",
            "Desarrollo de aplicaciones",
            "Monetización de ideas",
            "Identificación de productos ganadores",
            "Capacitación en ventas",
            "Modelo de ventas tradicional vs. consultivo",
            "Importancia de la confianza en las ventas",
            "Marketing B2B y B2C",
            "Estrategias para emprendedores",
            "Especialización y oferta de valor",
            "Adaptación a las necesidades del cliente",
            "Experiencias personales en emprendimiento",
        ],
    },
    Conoce_Jan: {
        description:
            "La categoría aborda el desarrollo personal y profesional, con énfasis en el emprendimiento y la búsqueda de propósito. Se exploran temas como la proactividad, la persistencia y la importancia de aportar valor a los demás. Se discuten estrategias para el crecimiento en redes sociales, marketing digital y creación de contenido. Además, se analizan aspectos del éxito, la felicidad y el equilibrio entre la vida personal y profesional.",
        topics: [
            "Emprendimiento juvenil",
            "Desarrollo personal y profesional",
            "Propósito de vida y metas personales",
            "Proactividad y persistencia",
            "Creación de contenido y marketing digital",
            "Estrategias de networking y relaciones profesionales",
            "Impacto social y aportación de valor",
            "Equilibrio entre éxito y felicidad",
            "Superación de obstáculos y miedos",
            "Innovación y tecnología en startups",
            "Crecimiento en redes sociales",
            "Educación alternativa y aprendizaje continuo",
            "Liderazgo y trabajo en equipo",
            "Gestión del tiempo y productividad",
            "Mindset y cambio de mentalidad",
            "Experiencias transformadoras",
            "Ética en el trabajo y los negocios",
            "Estrategias de inversión y finanzas personales",
            "Autoconocimiento y reflexión personal",
            "Resolución creativa de problemas",
        ],
        titles: [
            '"Lo único que hice para ser un emprendedor exitoso…” | Jan Konstadinov - Escaló empresas a $1B USD///title - Part 1',
            '"Lo único que hice para ser un emprendedor exitoso…” | Jan Konstadinov - Escaló empresas a $1B USD///title - Part 2',
            "Construyendo en público - Value Not Noise #001 - Part 1",
            "Construyendo en público - Value Not Noise #001 - Part 2",
            "Construyendo en público - Value Not Noise #001 - Part 3",
            "Cómo construir tu vida soñada siendo un joven emprendedor. Jan Kostadinov | Ep 14 - Part 1",
            "Cómo construir tu vida soñada siendo un joven emprendedor. Jan Kostadinov | Ep 14 - Part 2",
            "Cómo construir tu vida soñada siendo un joven emprendedor. Jan Kostadinov | Ep 14 - Part 3",
            "El Genesis 2: Jan ft New Label Experience - Part 1",
            "El Genesis 2: Jan ft New Label Experience - Part 2",
            "El Genesis 2: Jan ft New Label Experience - Part 3",
            "Frameworks Para Escalar Una Startup - Ft Jan Kostadinov - Entrepreguntas #33 - Part 1",
            "I hired a 16 year old... here's why! - Part 1",
            "Jan Kostadinov: LA TRAMPA DEL ÉXITO 🥺 Podcast Mauro Domínguez Experience 4 - Part 1",
            "Jan Kostadinov: LA TRAMPA DEL ÉXITO 🥺 Podcast Mauro Domínguez Experience 4 - Part 2",
            "Rompiendo la MATRIX Aportando VALOR ft. Jan Kostadinov - #013 - Part 1",
            "Rompiendo la MATRIX Aportando VALOR ft. Jan Kostadinov - #013 - Part 2",
            "Rompiendo la MATRIX Aportando VALOR ft. Jan Kostadinov - #013 - Part 3",
            "¿Todavía no encontraste tu propósito de vida? | Charla consciente ft. Jan Kostadinov - Part 1",
            "¿Todavía no encontraste tu propósito de vida? | Charla consciente ft. Jan Kostadinov - Part 2",
        ],
    },
    Edicion_De_Video: {
        description:
            "El curso de edición de video de Gro X es una introducción completa a las técnicas y herramientas necesarias para crear contenido audiovisual atractivo para redes sociales. Se enfoca en la producción de videos cortos para plataformas como Instagram y TikTok, abordando aspectos técnicos como la corrección de color y sonido, así como estrategias para captar la atención del espectador. El curso cubre desde los conceptos básicos de organización de proyectos hasta técnicas avanzadas de edición, incluyendo el uso de efectos visuales y sonoros. Además, se hace hincapié en la importancia de la práctica continua y la adaptación a las nuevas tecnologías para mejorar constantemente las habilidades de edición.",
        topics: [
            "Introducción a la edición de video",
            "Importancia de la edición en la creación de contenido",
            "Enfoque en videos para Instagram y TikTok",
            "Definición de un 'buen video'",
            "Técnicas de montaje rápidas",
            "Corrección de sonido y color",
            "Uso de recursos visuales adicionales",
            "Importancia de los subtítulos",
            "Imágenes generadas por IA en la edición",
            "Adaptación del contenido al público objetivo",
            "Eliminación de silencios innecesarios",
            "Uso de efectos de sonido",
            "Consideraciones para videos sin sonido",
            "Conceptos básicos de edición",
            "Aplicación inmediata de conocimientos",
            "Evolución de técnicas de edición",
            "Organización de proyectos",
            "Sistemas de organización en Premiere",
            "Gestión de recursos en edición",
            "Estrategias para principiantes",
        ],
        titles: [
            "01. ¿Qué es la edición de video? - Part 1",
            "02. Cómo organizar un proyecto - Part 1",
            "03. Cómo setear un proyecto en Adobe Premiere - Part 1",
            "04. Optimización de audio - Part 1",
            "05. Corrección de color básica - Part 1",
            "06. Gradación de color - Part 1",
            "07. Montaje de un video - Part 1",
            "08. Hacé Zooms como un Pro - Part 1",
            "09. Subtítulos - Part 1",
            "10. Inserts - Part 1",
            "11. Exportar para RRSS - Part 1",
        ],
    },
    Community_ClassesSummarized: {
        description:"Esta colección de videos ofrece conocimientos profundos sobre varios aspectos del crecimiento, liderazgo, marketing, creatividad y desarrollo personal. Los videos cubren estrategias prácticas para el crecimiento empresarial, técnicas efectivas de marketing, habilidades de liderazgo y procesos creativos, así como temas de bienestar personal como el sueño y la salud mental. El contenido está diseñado para ayudar a emprendedores, mercadólogos y líderes a mejorar sus habilidades, con un enfoque en aplicaciones del mundo real y consejos de expertos. Ya sea que estés buscando optimizar tus estrategias de marketing, mejorar tus capacidades de liderazgo o explorar formas creativas de resolver problemas, esta colección proporciona conocimientos valiosos y pasos accionables. Los temas son una mezcla de habilidades técnicas, habilidades blandas y estrategias de crecimiento personal, convirtiéndose en un recurso integral para cualquiera que desee avanzar en su vida profesional y personal.",
        titles: [
            "Q&A con Jan Kostadinov | 19/03/2024 - Part 1",
            "GrowthX Mastery [Community Classes] - Personalidad con Lino Pt.1 - Part 1",
            "[Community Classes] Liderazo y Organización con Pedro Nestares - Part 1",
            "[Community Classes] Ventas con Juan Cruz Fernandez - Part 1",
            "[Community Classes] Sueño con Pedro Nestares - Part 1",
            "Cómo Crecer Un Producto De 0 a 1M+, Tus Redes De 0 A 100K Y Aumentar Tus Ingresos 2 - Growth Class - Part 3",
            "Cómo Crecer Un Producto De 0 a 1M+, Tus Redes De 0 A 100K Y Aumentar Tus Ingresos 2 - Growth Class - Part 2",
            "GrowthX Mastery [Community Classes] - Sueños con Pedro - Part 1",
            "GrowthX Mastery [Community Classes] - Creatividad con Abraham - Part 1",
            "GrowthX Mastery [Community Classes] - Personalidad con Lino Pt.2 - Part 2",
        ],
        topics: [
            "Liderazgo efectivo y colaboración en equipo",
            "Marca personal y mantenimiento de la relevancia",
            "Estrategias de SEO y marketing por correo electrónico",
            "Marketing en mercados convencionales y de nicho",
            "Herramientas de crecimiento para la expansión empresarial",
            "Procesos creativos en marketing y diseño",
            "Utilización de influencers y celebridades en marketing",
            "Técnicas de ventas y manejo de objeciones",
            "Construcción de confianza y autenticidad en ventas",
            "Investigación de mercado y análisis competitivo",
            "Creación de contenido para startups y evaluación de productos",
            "Networking en startups y construcción de conexiones valiosas",
            "Manejo de emociones y autoliderazgo",
            "Delegación y gestión de tareas",
            "Hablar en público y mejorar habilidades de oratoria",
            "Retención de usuarios y maximización del compromiso",
            "Chatbots y automatización en e-commerce",
            "Estrategias de monetización para contenido digital",
            "Monetización en YouTube y redes sociales",
            "Logística en dropshipping y e-commerce",
            "Marketing por correo electrónico y mensajes personalizados",
            "Gestión de relaciones con los clientes",
            "Salud del sueño y su impacto en la productividad",
            "Optimización de condiciones y hábitos de sueño",
            "Cronotipos y gestión de la energía",
            "Memoria, estrés y salud mental",
            "Estrategias de crecimiento personal y profesional",
            "Construcción de una comunidad en torno a una marca",
            "Aceleradoras de startups y recaudación de fondos",
            "Programas de afiliados y generación de ingresos",
            "Marketing de productos digitales y optimización",
            "Publicidad creativa y compromiso emocional",
            "Decisiones de marketing basadas en datos",
            "Diseño de productos y experiencia del usuario",
            "Marketing de ciclo de vida y activación de usuarios",
            "Optimización de la retención y tasa de conversión",
            "Procesos de onboarding para la activación de usuarios",
            "Modelos de ingresos y métricas financieras",
            "Autenticidad y vulnerabilidad en el liderazgo",
            "Narración de historias en marketing y ventas",
            "Estrategias de networking para profesionales",
            "Influencia de la nutrición en la calidad del sueño",
            "Técnicas para mejorar la higiene del sueño",
            "Ideación creativa y técnicas de brainstorming",
            "Gestión de marketing de productos",
            "Análisis del comportamiento del usuario con herramientas de datos",
            "Gestión del estrés y su efecto en la memoria",
            "Papel de las rutinas en la productividad personal",
            "Construcción y escalamiento de un negocio digital",
            "Evolución de las tendencias de diseño en tecnología",
        ],
    },
    Expert_Calls: {
        description:
            "La categoría abarca una amplia gama de temas relacionados con el emprendimiento, el desarrollo profesional y las estrategias de negocio en el contexto latinoamericano. Se discuten aspectos como la captación de capital, el marketing digital, la expansión de startups, y la importancia de las habilidades sociales y de liderazgo. También se abordan temas de tecnología, como la seguridad informática y el uso de inteligencia artificial en los negocios. Además, se exploran conceptos de crecimiento personal, networking y la creación de valor en diversos sectores empresariales.",
        topics: [
            "Estrategias de financiamiento para startups",
            "Marketing digital y redes sociales",
            "Desarrollo de habilidades de liderazgo y comunicación",
            "Expansión de negocios en América Latina",
            "Tecnología e innovación en empresas",
            "Crecimiento personal y profesional",
            "Networking y construcción de relaciones profesionales",
            "Modelos de negocio y monetización",
            "Seguridad informática y ciberseguridad",
            "Gestión de equipos y contratación de talento",
            "Análisis de métricas y datos en negocios",
            "Branding y construcción de marca personal",
            "Estrategias de crecimiento para empresas emergentes",
            "Adaptación a mercados locales",
            "Uso de inteligencia artificial en negocios",
            "Optimización de procesos y automatización",
            "Educación y aprendizaje continuo",
            "Desafíos del emprendimiento",
            "Creación de contenido y storytelling",
            "Ética y responsabilidad en los negocios",
        ],
        titles: [
            "Growth Mastery [Expert Call]  - Cesar Cerrudo - Part 1",
            "Growth Mastery [Expert Call]  - Cesar Cerrudo - Part 2",
            "Growth Mastery [Expert Call]  - Mati Carrera - Part 1",
            "Growth Mastery [Expert Call]  - Mati Carrera - Part 2",
            "Growth Mastery [Expert Call] - Alek Matthiessen growth marketing- Part 1",
            "Growth Mastery [Expert Call] - Borja Martel - Part 1",
            "Growth Mastery [Expert Call] - Borja Martel - Part 2",
            "Growth Mastery [Expert Call] - Facu Garreton - Part 1",
            "Growth Mastery [Expert Call] - Facu Garreton - Part 2",
            "Growth Mastery [Expert Call] - Federico Cavagni - Part 1",
            "Growth Mastery [Expert Call] - Federico Cavagni - Part 2",
            "Growth Mastery [Expert Call] - Jan Kostadinov + Cliff Weitzman (Catch Up & Fundraising)- Part 1",
            "Growth Mastery [Expert Call] - Jan Kostadinov + Roy (TradeX Latam Expansion) - Part 1",
            "Growth Mastery [Expert Call] - Juanma Gonzalez - Part 1",
            "Growth Mastery [Expert Call] - Juanma Gonzalez - Part 2",
            "Growth Mastery [Expert Call] - Juanma Gonzalez - Part 3",
            "Growth Mastery [Expert Call] - Matias Woloski - Part 1",
            "Growth Mastery [Expert Call] - Matias Woloski - Part 2",
            "Growth Mastery [Expert Call] - Tomás Braun - Part 1",
        ],
    },
    GrowthMastery: {
        description:
            "El marketing digital es un campo dinámico que abarca diversas estrategias para promover productos y servicios en línea. Se enfoca en la optimización de campañas publicitarias, el uso efectivo de redes sociales y la creación de contenido atractivo. El marketing de influencers y afiliados son componentes clave, junto con técnicas de SEO y SEM. La analítica y la medición de resultados son fundamentales para el éxito en este ámbito.",
        topics: [
            "Marketing de influencers",
            "Optimización de campañas publicitarias",
            "Estrategias de crecimiento en redes sociales",
            "Marketing de afiliados",
            "SEO y SEM",
            "Creación de contenido efectivo",
            "Análisis de métricas y ROI",
            "Email marketing",
            "Automatización de procesos de marketing",
            "Branding y posicionamiento",
            "Estrategias de adquisición de usuarios",
            "Retención de clientes",
            "Growth hacking",
            "Monetización de audiencias",
            "Colaboraciones con creadores de contenido",
            "Optimización de landing pages",
            "Estrategias de pricing",
            "Marketing programático",
            "Personalización de campañas",
            "Estrategias de outreach",
        ],
        titles: [
            "01. Clase Intro y Explicaciones",
            "01. TikTok Insights, Hashtag Planner, Upwork & SEO",
            "02. Cómo estructurar y armar campañas",
            "02. Viral Influencer Marketing",
            "03. Introducción al Marketing de afiliados",
            "03. VIM: Estructura de contenido, mails y guiones",
            "04. Affiliate Marketing",
            "04. Gmass + Magical",
            "05. Ads: Cómo, donde y cuando utilizarlos",
            "05. Ads: Cómo, donde y cuando utilizarlos - Part 2",
            "05. Ads: Cómo, donde y cuando utilizarlos - Part 3",
            "05. Raising Capital - Part 1",
            "05. Raising Capital - Part 2",
            "06. Ads y campañas - Teoría y cuando aplicar - Part 1",
            "06. Ads y campañas - Teoría y cuando aplicar - Part 2",
            "06. Programmatic Ads y Estructura de anuncios - Part 1",
            "06. Programmatic Ads y Estructura de anuncios - Part 2",
            "07. Facebook & Start-ups -Fundraising y Desarrollo - Part 1",
            "07. Facebook & Start-ups -Fundraising y Desarrollo - Part 2",
            "07. SEO & SEM - Part 1",
            "07. SEO & SEM - Part 2",
            "08. Presentación, métricas, Ads y armado de Docs",
            "08. Upwork & GMass - Part 1",
            "08. Upwork & GMass - Part 2",
            "08. Upwork & GMass - Part 3",
            "09. Frame.io, estructura de Ads e Influencers - Part 1",
            "10. SEO & SEM - Part 1",
            "10. SEO & SEM - Part 2",
            "11. Prospección: Inbound & Outbound - Part 1",
            "11. Prospección: Inbound & Outbound - Part 2",
            "12. Ventas B2B & Roleplays - Part 1",
            "12. Ventas B2B & Roleplays - Part 2",
            "12. Ventas B2B & Roleplays - Part 3",
        ],
    },
    Mentalidad: {
        description:
            "El desarrollo personal es un viaje de autodescubrimiento y crecimiento que abarca diversos aspectos de la vida. Este proceso implica la exploración de la mentalidad, el propósito y la conexión con el ser interior, fomentando la autenticidad y la alineación con los valores personales. La categoría enfatiza la importancia de vivir en el presente, practicar la atención plena y desarrollar una conciencia más profunda de uno mismo y del entorno. Además, se abordan temas como la física cuántica, la neuroplasticidad y la relación mente-cuerpo, ofreciendo una perspectiva holística que integra ciencia, espiritualidad y prácticas de desarrollo personal.",
        topics: [
            "Mentalidad y propósito en el desarrollo personal",
            "Coaching holístico y su impacto positivo",
            "Importancia de trabajar desde el ser",
            "Reflexión y escritura como herramientas de crecimiento",
            "Búsqueda de vocación y descubrimiento personal",
            "Aceptación y amor propio",
            "Vivir en el presente y disfrutar el proceso",
            "Motivación y servicio en la formación personal",
            "Consciencia y presencia en la vida diaria",
            "Manejo de expectativas y percepciones",
            "Perdón y liberación de cargas emocionales",
            "Compasión hacia uno mismo y los demás",
            "Física cuántica y potencial humano",
            "Relación mente-cuerpo y emociones",
            "Meditación y cambio cerebral",
            "Neuroplasticidad y creación de nueva mente",
            "Técnicas de relajación y enfoque",
            "Emprendimiento y búsqueda de propósito",
            "Marketing digital y crecimiento de negocios",
            "Visualización y ley de atracción",
        ],
        titles: [
            "GrowthX Academy - Introducción y Mentalidad (19/02/2024)",
            "GrowthX Academy | Mentalidad & Propósito | Clase 2",
            "GrowthX Academy | Mentalidad y Propósito con Dan Scolnik | Clase 3",
            "GrowthX Academy | Mentalidad y Propósito con Dan Scolnik | Clase 4",
        ],
    },
    Mentorias_Master_1: {
        description:
            "El curso abarca una amplia gama de temas relacionados con el crecimiento empresarial y el marketing digital. Se enfoca en estrategias de marketing de influencers, afiliados y redes sociales. También cubre aspectos de desarrollo profesional, networking y técnicas de venta. El contenido incluye consejos prácticos para startups, optimización de campañas publicitarias y análisis de métricas de crecimiento. Además, se abordan temas de finanzas personales, inversión en startups y negociación de compensaciones.",
        topics: [
            "Marketing de influencers",
            "Marketing de afiliados",
            "Estrategias de crecimiento para startups",
            "Optimización de campañas de correo electrónico",
            "Técnicas de venta y negociación",
            "Networking y desarrollo profesional",
            "Análisis de métricas y KPIs",
            "Creación de contenido viral",
            "Estrategias de SEO",
            "Publicidad en redes sociales",
            "Propuestas de valor para clientes",
            "Automatización de procesos de marketing",
            "Generación de leads",
            "Inversión en startups",
            "Negociación de compensaciones y equity",
            "Desarrollo de producto",
            "Estrategias de pricing",
            "Optimización de landing pages",
            "Técnicas de seguimiento en ventas",
            "Planificación financiera personal",
        ],
        titles: [
            "Growth Mastery [1:1] - Abraham Carram Pt.1 - Part 1",
            "Growth Mastery [1:1] - Abraham Carram Pt.2 - Part 1",
            "Growth Mastery [1:1] - Abraham Carram Pt.3 - Part 1",
            "Growth Mastery [1:1] - Agustín Pompeo Pt.1 - Part 1",
            "Growth Mastery [1:1] - Agustín Pompeo Pt.2 - Part 1",
            "Growth Mastery [1:1] - Agustín Reynoso Pt.1 - Part 1",
            "Growth Mastery [1:1] - Agustín Reynoso Pt.2 - Part 1",
            "Growth Mastery [1:1] - Agustín Reynoso Pt.3 - Part 1",
            "Growth Mastery [1:1] - Bauti & Enzo Pt.1 - Part 1",
            "Growth Mastery [1:1] - Bauti & Enzo Pt.2 - Part 1",
            "Growth Mastery [1:1] - Bauti & Enzo Pt.3 - Part 1",
            "Growth Mastery [1:1] - Emiliano Ariel Arias - Part 1",
            "Growth Mastery [1:1] - Francisco Cavanna Pt.1 - Part 1",
            "Growth Mastery [1:1] - Francisco Cavanna Pt.2 - Part 1",
            "Growth Mastery [1:1] - Francisco Cavanna Pt.3 - Part 1",
            "Growth Mastery [1:1] - Francisco Cavanna Pt.4 - Part 1",
            "Growth Mastery [1:1] - Francisco Moya - Part 1",
            "Growth Mastery [1:1] - Ignacio Assis Pt.1 - Part 1",
            "Growth Mastery [1:1] - Ignacio Assis Pt.2 - Part 1",
            "Growth Mastery [1:1] - Ignacio Assis Pt.3 - Part 1",
            "Growth Mastery [1:1] - Ignacio Assis Pt.4 - Part 1",
            "Growth Mastery [1:1] - Lautaro Morandi Pt.1 - Part 1",
            "Growth Mastery [1:1] - Lautaro Morandi Pt.2 - Part 1",
            "Growth Mastery [1:1] - Lautaro Morandi Pt.3 - Part 1",
            "Growth Mastery [1:1] - Lino Pt.1 - Part 1",
            "Growth Mastery [1:1] - Lino Pt.1 - Part 2",
            "Growth Mastery [1:1] - Lino Pt.2 - Part 1",
            "Growth Mastery [1:1] - Lino Pt.3 - Part 1",
            "Growth Mastery [1:1] - Lucas Barral Pt.1 - Part 1",
            "Growth Mastery [1:1] - Lucas Barral Pt.2 - Part 1",
            "Growth Mastery [1:1] - Lucas Barral Pt.3 - Part 1",
            "Growth Mastery [1:1] - Lucas Barral Pt.4 - Part 1",
            "Growth Mastery [1:1] - Matias Blanco - Part 1",
            "Growth Mastery [1:1] - Tomas Hildalgo Pt.1 - Part 1",
            "Growth Mastery [1:1] - Tomas Hildalgo Pt.2 - Part 1",
            "Growth Mastery [1:1] - Tomas Hildalgo Pt.3 - Part 1",
            "Growth Mastery [1:1] - Tomas Papazian Pt.1 - Part 1",
            "Growth Mastery [1:1] - Tomas Papazian Pt.2 - Part 1",
            "Growth Mastery [1:1] - Tomas Papazian Pt.3 - Part 1",
            "Growth Mastery [1:1] - Tomas Papazian Pt.4 - Part 1",
            "Growth Mastery [1:1] - Valentin Echavarria Pt.1 - Part 1",
            "Growth Mastery [1:1] - Valentin Echavarria Pt.2 - Part 1",
            "Growth Mastery [1:1] - Valentin Echavarria Pt.3 - Part 1",
            "Growth Mastery [1:1] - Victor Pt.1 - Part 1",
            "Growth Mastery [1:1] - Victor Pt.2 - Part 1",
            "Growth Mastery [1:1] - Victor Pt.3 - Part 1",
        ],
    },
    Mentorias_Mastery_2: {
        description:
            "La categoría abarca estrategias de crecimiento empresarial y marketing digital, con énfasis en la creación de contenido y monetización en redes sociales. Se discuten técnicas de desarrollo de marca personal, optimización de campañas publicitarias y estrategias de venta. El enfoque incluye la importancia del networking, la adaptación a nuevas tecnologías y la resolución de problemas de alto valor. También se abordan temas de liderazgo, gestión de equipos y equilibrio entre vida personal y profesional en el contexto emprendedor.",
        topics: [
            "Estrategias de crecimiento empresarial",
            "Marketing digital y redes sociales",
            "Desarrollo de marca personal",
            "Monetización de contenido",
            "Optimización de campañas publicitarias",
            "Técnicas de venta y negociación",
            "Networking y relaciones profesionales",
            "Liderazgo y gestión de equipos",
            "Resolución de problemas de alto valor",
            "Creación de contenido viral",
            "Estrategias de pricing y propuestas de valor",
            "Automatización y delegación de tareas",
            "Análisis de métricas y datos",
            "Organización de eventos y retiros",
            "Desarrollo personal y profesional",
            "Estrategias de internacionalización",
            "Innovación en modelos de negocio",
            "Captación y retención de clientes",
            "Financiamiento y gestión de startups",
            "Equilibrio entre vida personal y profesional",
        ],
        titles: [
            "Growth Mastery [1:1] - Agustín Murua - Part 1",
            "Growth Mastery [1:1] - Axel Becker Pt.1 - Part 1",
            "Growth Mastery [1:1] - Axel Becker Pt.1 - Part 2",
            "Growth Mastery [1:1] - Axel Becker Pt.2 - Part 1",
            "Growth Mastery [1:1] - Axel Becker Pt.3 - Part 1",
            "Growth Mastery [1:1] - Emiliano - Part 1",
            "Growth Mastery [1:1] - Franco Zanolin Pt.1 - Part 1",
            "Growth Mastery [1:1] - Franco Zanolin Pt.2 - Part 1",
            "Growth Mastery [1:1] - Gabriel - Part 1",
            "Growth Mastery [1:1] - Ivan Scavuzzo - Part 1",
            "Growth Mastery [1:1] - Ivan Scavuzzo Pt 2 - Part 1",
            "Growth Mastery [1:1] - Joaquin Nahuel Giordano Pt.1 - Part 1",
            "Growth Mastery [1:1] - Joaquin Nahuel Giordano Pt.2 - Part 1",
            "Growth Mastery [1:1] - Juan Cruz Fernandez Pt.1 - Part 1",
            "Growth Mastery [1:1] - Juan Cruz Fernandez Pt.2 - Part 1",
            "Growth Mastery [1:1] - Juan Cruz Fernandez Pt.3 - Part 1",
            "Growth Mastery [1:1] - Juan Moya Pt.1 - Part 1",
            "Growth Mastery [1:1] - Juan Moya Pt.2 - Part 1",
            "Growth Mastery [1:1] - Julian Di Iulio Pt.1 - Part 1",
            "Growth Mastery [1:1] - Julian Di Iulio Pt.2 - Part 1",
            "Growth Mastery [1:1] - Luca Cerrudo Pt.1 - Part 1",
            "Growth Mastery [1:1] - Matias Mounier Pt.1 - Part 1",
            "Growth Mastery [1:1] - Matias Mounier Pt.2 - Part 1",
            "Growth Mastery [1:1] - Matias Mounier Pt.3 - Part 1",
            "Growth Mastery [1:1] - Matias Mounier Pt.4 - Part 1",
            "Growth Mastery [1:1] - Matias Orbe Pt.1 - Part 1",
            "Growth Mastery [1:1] - Matias Orbe Pt.2 - Part 1",
            "Growth Mastery [1:1] - Matias Orbe Pt.3 - Part 1",
            "Growth Mastery [1:1] - Nahuel Saluzzo Pt.1 - Part 1",
            "Growth Mastery [1:1] - Nahuel Saluzzo Pt.1 - Part 2",
            "Growth Mastery [1:1] - Nahuel Saluzzo Pt.2 - Part 1",
            "Growth Mastery [1:1] - Nahuel Saluzzo Pt.3 - Part 1",
            "Growth Mastery [1:1] - Pablo Espinola Pt.2 - Part 1",
            "Growth Mastery [1:1] - Pablo Espínola - Part 1",
            "Growth Mastery [1:1] - Pedro Nestares Pt.1 - Part 1",
            "Growth Mastery [1:1] - Pedro Nestares Pt.2 - Part 1",
            "Growth Mastery [1:1] - Santi y Toto Pt.1 - Part 1",
            "Growth Mastery [1:1] - Santi y Toto Pt.2 - Part 1",
            "Growth Mastery [1:1] - Tomas Buschiazzo - Part 1",
            "Growth X Mastery [1:1] - Luca Cerrudo Pt.2 - Part 1",
            "Growth X Mastery [1:1] - Manuel Casaubon - Part 1",
            "Growth X Mastery [1:1] - Manuel Casaubon Pt.2 - Part 1",
            "Growth X Mastery [1:1] - Santi y Toto Pt.3 - Part 1",
        ],
    },
    Mentorias_mastery_3: {
        description:
            "El emprendimiento y las startups son temas centrales en esta categoría, abordando aspectos cruciales desde la concepción hasta la expansión de nuevos negocios. Se discuten estrategias de financiación, desarrollo de productos, marketing digital y adquisición de usuarios, destacando la importancia de la comunicación efectiva y la confianza en el éxito empresarial. La categoría también explora la monetización de aplicaciones, la colaboración con influencers y la importancia de la mentoría en el mundo de las startups. Además, se abordan temas específicos como la asesoría financiera, la optimización de ventas y la expansión internacional, proporcionando una visión integral del ecosistema emprendedor.",
        topics: [
            "Financiación de startups en etapa inicial",
            "Desarrollo de productos mínimos viables (MVP)",
            "Estrategias de marketing digital para startups",
            "Adquisición y retención de usuarios",
            "Monetización de aplicaciones y plataformas",
            "Colaboración con influencers y creadores de contenido",
            "Pitch y presentación a inversores",
            "Formación de equipos y distribución de acciones",
            "Comunicación efectiva en el emprendimiento",
            "Mentoría y asesoría para startups",
            "Gestión financiera para fundadores jóvenes",
            "Expansión internacional de negocios",
            "Optimización de ventas y conversión",
            "Creación de contenido para redes sociales",
            "Estrategias de crecimiento y escalabilidad",
            "Desarrollo de comunidades de emprendedores",
            "Uso de tecnología para optimizar procesos",
            "Marketing de afiliados e influencer marketing",
            "Personalización de productos y servicios",
            "Análisis de métricas y economía unitaria",
        ],
        titles: [
            "Growth X [1:1] - Bruno Pardiñas N°1 - Part 1",
            "Growth X [1:1] - Bruno Pardiñas N°2 - Part 1",
            "Growth X [1:1] - Bruno Pardiñas N°2 - Part 2",
            "Growth X [1:1] - Juanma e Ivan N°1 - Part 1",
            "Growth X [1:1] - Juanma e Ivan N°2 - Part 1",
            "Growth X [1:1] - Juanma e Ivan N°2 - Part 2",
            "Growth X [1:1] - Tomas Boismene N°1 - Part 1",
        ],
    },
    MiniVIF_Questions: {
        description:
            "El marketing de influencers y las estrategias de venta son los temas centrales de esta categoría. Se enfoca en técnicas prácticas para contactar y trabajar con influencers, así como en estrategias efectivas de comunicación y venta. La categoría abarca desde la búsqueda de clientes potenciales hasta la negociación de contratos y la medición de resultados en campañas. También se discuten temas relacionados con el desarrollo personal y profesional en el campo del marketing digital y las ventas. Además, se exploran aspectos éticos y prácticos del marketing de influencers, incluyendo la creación de contenido auténtico y la optimización de campañas.",
        topics: [
            "Marketing de influencers",
            "Estrategias de venta",
            "Comunicación efectiva",
            "Búsqueda de clientes potenciales",
            "Negociación de contratos",
            "Medición de resultados en campañas",
            "Desarrollo profesional en marketing digital",
            "Ética en marketing de influencers",
            "Creación de contenido auténtico",
            "Optimización de campañas publicitarias",
            "Técnicas de contacto con clientes",
            "Uso de redes sociales para marketing",
            "Personalización de propuestas",
            "Análisis de métricas en marketing digital",
            "Estrategias de pricing en servicios de marketing",
            "Gestión de relaciones con influencers",
            "Automatización en procesos de marketing",
            "Adaptación a diferentes mercados y culturas",
            "Desarrollo de marca personal",
            "Técnicas de networking profesional",
        ],
    },
    Prospect: {
        description:
            "El curso de adquisición de clientes es una guía completa para emprendedores y profesionales que buscan mejorar sus habilidades de prospección y ventas en el ámbito digital. A lo largo de 7-8 clases, el instructor comparte su experiencia en la captación de clientes para servicios de alto valor, enfocándose en estrategias efectivas de prospección, comunicación y seguimiento. El curso aborda temas cruciales como la identificación de clientes ideales, la personalización de servicios, y la transformación de hábitos para alcanzar metas de negocio. Además, se exploran técnicas avanzadas para iniciar diálogos con dueños de negocios, manejar diferentes tipos de prospectos y optimizar el proceso de ventas desde la conexión inicial hasta el cierre.",
        topics: [
            "Introducción a la adquisición de clientes",
            "Importancia de la prospección en negocios digitales",
            "Estrategias para servicios de alto valor",
            "Identificación de clientes ideales",
            "Personalización de servicios",
            "Técnicas de comunicación efectiva",
            "Manejo de diferentes tipos de prospectos",
            "Estrategias de conexión en redes sociales",
            "Transición de prospecto a cliente",
            "Llamadas de descubrimiento y ventas",
            "Seguimiento efectivo en el proceso de ventas",
            "Construcción de confianza y rapport",
            "Manejo de objeciones",
            "Escalamiento de negocios de coaching y agencias",
            "Optimización del tiempo de trabajo",
            "Superación de dificultades en el emprendimiento",
            "Importancia del networking en los negocios",
            "Adaptación de estrategias de venta",
            "Uso de herramientas visuales en ventas",
            "Persistencia y motivación en el emprendimiento",
        ],
        titles: [
            "01. Appointment Setting - Part 1",
            "02. Mensajes de Conexión - Part 1",
            "03. Transición & Pre-Pitch - Part 1",
            "04. Buscando Ineficiencias y Aportando Valor - Part 1",
            "05. Potenciando Seguimiento a Llamada Estratégica - Part 1",
            "06. Ofrecer Llamada de Descubrimiento - Part 1",
            "07. Mi Historia, Conclusiones, Pros y Contras - Part 1",
        ],
    },
    QA: {
        description:
            "La categoría abarca una amplia gama de temas relacionados con el marketing digital, el emprendimiento y el desarrollo profesional en el ámbito de las startups y la tecnología. Se discuten estrategias de crecimiento, técnicas de marketing de influencers, optimización de campañas publicitarias y desarrollo de marca personal. También se abordan temas como la creación de contenido, la monetización de plataformas digitales y la importancia del networking en el mundo empresarial. Además, se exploran aspectos del desarrollo de productos, la gestión de equipos y la toma de decisiones estratégicas en el entorno de las startups.",
        topics: [
            "Marketing de influencers",
            "Estrategias de crecimiento para startups",
            "Desarrollo de marca personal",
            "Optimización de campañas publicitarias",
            "Creación de contenido digital",
            "Networking y relaciones profesionales",
            "Monetización de plataformas digitales",
            "Técnicas de venta y negociación",
            "Análisis de datos y métricas",
            "Desarrollo de productos y MVP",
            "Gestión de equipos en startups",
            "SEO y visibilidad online",
            "Estrategias de email marketing",
            "Programas de afiliados",
            "Adquisición y retención de usuarios",
            "Financiación y relación con inversores",
            "Internacionalización de negocios",
            "Automatización de procesos de marketing",
            "Estrategias de contenido en redes sociales",
            "Desarrollo profesional en el ámbito tecnológico",
        ],
    },
    SeLLing: {
        description:
            "La colección abarca una amplia gama de temas relacionados con el desarrollo profesional y el crecimiento empresarial en el entorno digital actual. Se centra en estrategias avanzadas de marketing, ventas B2B y B2C, y la importancia de la optimización de perfiles en plataformas como LinkedIn para aumentar la visibilidad profesional. También se exploran aspectos cruciales como la adaptación al mercado cambiante, la construcción de relaciones sólidas con clientes y la implementación de tecnología para mejorar los procesos comerciales. Además, se discute la importancia de la comunicación efectiva, la personalización en el marketing y la resiliencia en el emprendimiento. Esta colección es una guía integral para aquellos que buscan destacarse en el competitivo mundo empresarial y tecnológico de hoy.",
        topics: [
            "Optimización de perfiles y visibilidad en LinkedIn",
            "Estrategias de networking y conexiones profesionales",
            "Uso eficaz de herramientas digitales para la búsqueda de empleo",
            "Comunicación eficaz y redacción de correos electrónicos",
            "Técnicas avanzadas de ventas B2B y B2C",
            "Estrategias de marketing digital y SEO",
            "Importancia del valor del producto y presentación efectiva",
            "Desarrollo de relaciones sólidas con clientes",
            "Adaptación y respuesta a cambios en el mercado",
            "Proceso de visa y oportunidades laborales en EE. UU.",
            "Uso de tecnología para mejorar procesos de ventas",
            "Mentoría y asesoría para el crecimiento profesional",
            "Marketing de contenidos y gestión de redes sociales",
            "Gestión y optimización de campañas de marketing",
            "Generación de leads y estrategias de retención",
            "Importancia de testimonios y estudios de caso",
            "Prácticas de liderazgo y gestión de equipos",
            "Desarrollo de habilidades en la industria tecnológica",
            "Preparación y ejecución de un pitch efectivo",
            "Integración de roles en equipos de ventas",
            "Técnicas de negociación y cierre de ventas",
            "Construcción de una marca personal sólida",
            "Desarrollo de productos y MVP en startups",
            "Automatización y personalización en marketing",
            "Estrategias para captar la atención de reclutadores",
            "Importancia de logros en el currículum y perfiles profesionales",
            "Enfoque en tecnología y transformación digital",
            "Presentación visual y diseño de páginas web",
            "Habilidades de comunicación y persuasión",
            "Compromiso con la satisfacción del cliente",
            "Estrategias de crecimiento y expansión internacional",
            "Preparación para entrevistas y comunicación en inglés",
            "Beneficios de la suscripción y contacto constante con clientes",
            "Análisis de datos y métricas para la toma de decisiones",
            "Desafíos en la producción y edición de videos",
            "Importancia del networking y eventos en persona",
            "Marketing de afiliación e influencers",
            "Importancia de la práctica constante y el aprendizaje continuo",
            "Elección de carrera y desarrollo profesional",
            "Innovación y diferenciación en el mercado competitivo",
            "Resiliencia y actitud positiva en el emprendimiento",
            "Diferenciación a través de la atención al cliente",
            "Talleres interactivos y simulaciones de entrevistas",
            "Preparación de números y documentos para cerrar negocios",
            "Enfoque en ventas y beneficios para la empresa",
            "Uso de herramientas como ChatGPT para mejorar currículums",
            "Importancia de conocer a la competencia",
            "Preparación y ajuste de mensajes para la audiencia",
            "Crecimiento en startups y oportunidades laborales",
        ],
        titles: [
            "01. Mastery: Q&A con Mattia - Part 1",
            "01. Mastery: Q&A con Mattia - Part 2",
            "01. Mastery: Q&A con Mattia - Part 3",
            "02.How to sell anything - Mattia Roccoit - Part 1",
            "03. Expert Sales Q&A | Mattia Roccoit - Part 1",
            "03. Expert Sales Q&A | Mattia Roccoit - Part 2",
            '04. "How to Pitch" | Mattia Roccoit - Part 1',
            '04. "How to Pitch" | Mattia Roccoit - Part 2',
            "05. How to Land a Job in the US - Part 1",
            "05. How to Land a Job in the US - Part 2",
        ],
    },
    Ventas: {
        description:
            "El módulo de ventas y cierre de GRX es un programa integral que aborda diversos aspectos cruciales del proceso de ventas. Se enfoca en desarrollar habilidades fundamentales como la toma de notas, la formulación de preguntas efectivas y la práctica mediante ejercicios de 'role play'. El programa hace hincapié en la importancia de superar barreras mentales, lograr resultados rápidos y crear ofertas irresistibles. Además, se centra en la conexión personal con el cliente, la empatía y la comunicación efectiva de los beneficios del producto, todo ello con el objetivo de proporcionar un servicio al cliente de cinco estrellas y transformar la experiencia de compra.",
        topics: [
            "Introducción al módulo de ventas y cierre de GRX",
            "Importancia de tomar notas y hacer preguntas",
            "Práctica y ejercicios de 'role play' en ventas",
            "Superación de barreras mentales en ventas",
            "Creación de ofertas irresistibles",
            "Valor percibido vs costo en ventas",
            "Guía y acompañamiento al cliente durante la venta",
            "Importancia de la conexión personal en ventas",
            "Servicio al cliente de cinco estrellas",
            "Empatía en el proceso de venta",
            "Identificación del 'dolor' del cliente",
            "Venta de beneficios vs características técnicas",
            "Comunicación efectiva de ventajas del producto",
            "Enfoque en beneficios prácticos del producto",
            "Transformación de la experiencia del cliente",
            "Objetivos de excelencia en ventas",
            "Importancia de resultados rápidos y pequeñas victorias",
            "Venta de transformación personal",
            "Experiencias de compra en concesionarias de autos",
            "Presentación del propósito de cada aspecto del producto",
        ],
        titles: [
            "01. Fundamentos de Ventas- Part 1",
            "02. Mindset de Ventas- Part 1",
            "03. Estructura - Part 1",
            "04. Preguntas que venden de Ventas- Part 1",
            "05. Cierre y seguimiento de Ventas- Part 1",
            "06. Exterminar objeciones de Ventas- Part 1",
            "07. Persuadir con estilo de Ventas- Part 1",
        ],
    },

    ClassesOrganicSocialSummarized: {
        description:
            "Estos temas abarcan una amplia gama de estrategias y técnicas relacionadas con el marketing digital y la creación de contenido, enfocándose en la construcción de una marca personal fuerte y auténtica. Destacan la importancia de la creatividad y el storytelling para captar la atención de la audiencia y convertirla en seguidores leales, así como el uso de herramientas digitales, como la inteligencia artificial, para optimizar el contenido y mejorar el rendimiento. Además, se exploran estrategias de monetización y generación de ingresos, enfatizando la necesidad de un enfoque estratégico en la planificación y el desarrollo de objetivos comerciales claros. Finalmente, se subraya la relevancia de la transparencia, la interacción con la audiencia y la gestión de la reputación online para construir relaciones sólidas y una comunidad comprometida",
        topics: [
            "Estrategias de marketing digital y redes sociales",
            "Creación de contenido atractivo y efectivo",
            "Construcción de una marca personal poderosa",
            "Uso de inteligencia artificial en diseño y marketing",
            "Importancia de la autenticidad y transparencia",
            "Fidelización y crecimiento de seguidores",
            "Monetización y generación de ingresos",
            "Planificación estratégica y objetivos comerciales",
            "Diferencias entre contenido en Instagram y TikTok",
            "Impacto de YouTube en la marca personal",
            "Creatividad y storytelling en el contenido",
            "Uso de reels y videos cortos para viralidad",
            "Importancia del branding y propuesta de valor",
            "Métricas de rendimiento y KPIs",
            "Análisis de la competencia y benchmarking",
            "Identificación de la audiencia objetivo",
            "Técnicas de cierre de ventas y propuestas",
            "Construcción de comunidad y networking",
            "Estrategias para mejorar la participación",
            "Gestión de la reputación online",
            "Importancia de la edición de contenido",
            "Uso de herramientas digitales y aplicaciones",
            "Estrategias de interacción con la audiencia",
            "Impacto de la música y viralidad en redes sociales",
            "Importancia del storytelling en marketing",
            "Desarrollo de una estrategia de contenido",
            "Identificación de tendencias y oportunidades",
            "Planificación y desarrollo de un equipo de trabajo",
            "Educación y desarrollo de habilidades",
            "Comunicación efectiva y bidireccional",
            "Uso de listados y técnicas en tres pasos",
            "Importancia del mensaje claro y directo",
            "Creación de contenido relevante y valioso",
            "Reflexión sobre aspiraciones y metas",
            "Uso de hashtags y subtítulos para visibilidad",
            "Adaptabilidad y flexibilidad en la estrategia",
            "Transparencia y autoridad personal en redes sociales",
            "Propuesta de valor única y diferenciación",
            "Construcción de relaciones a través de redes sociales",
            "Importancia del feed y estética visual",
            "Identificación de temas controversiales y tabú",
            "Estrategias de monetización de contenido",
            "Estructura básica de un argumento efectivo",
            "Desarrollo de guiones y narrativas atractivas",
            "Técnicas de engagement y llamada a la acción",
            "Diferenciación entre marca personal y comercial",
            "Uso de recursos gratuitos como lead magnets",
            "Optimización de perfiles y gestión de enlaces",
            "Desarrollo de herramientas para empoderar comunidades",
            "Gestión de leads y compromiso inmediato",
        ],
        titles: [
            "02. Marca Personal: Base teoría e identidad 2",
            "03. Convertite en creador de contenidos",
            "04. Storytelling",
            "05. Principios básicos de las redes Pt 1",
            "06. Best practices en la estructura de contenido",
            "06. Estructura de contenido corto Pt 1",
            "07. Contenido corto Pt 2",
            "08. Best practices del contenido corto Pt 3",
            "08. Contenido corto Pt 3",
            "09.Cómo crear un equipo de producción de contenido",
            "GrowthX Academy | Organic Social | Clase 2 - Part 1",
            "[Organic Social] Clase 1 - Marca Personasl | Bases teóricas, identidad e imágen - Part 1",
            "[Organic Social] Clase 1 - Marca Personasl | Bases teóricas, identidad e imágen - Part 2",
        ],
    },
};

const ANTHROPIC_API_KEY =
    "";
const WEAVIATE_URL =
    "";
const WEAVIATE_API_KEY = "";
const OPEN_AI_API_KEY =
    "";

const openai = new OpenAI({
    apiKey: OPEN_AI_API_KEY,
});

const anthropic = new Anthropic({
    apiKey: ANTHROPIC_API_KEY,
});

const weaviateClient = await weaviate.connectToWeaviateCloud(WEAVIATE_URL, {
    authCredentials: new weaviate.ApiKey(WEAVIATE_API_KEY),
    headers: {
        "X-OpenAI-Api-Key": OPEN_AI_API_KEY,
    },
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const fiveMinuteDir = join(__dirname, ".", "RagReady");

const jsonFiles = readdirSync(fiveMinuteDir).filter((item) =>
    statSync(join(fiveMinuteDir, item)).isDirectory()
);

// .filter((file) =>
//     file.endsWith(".json")
// );

const categoryDescriptions = {};

// to-do: function that will take in all the video content for a category and use anthropic sonnet to write a 4 sentence desscription of this category and return an array of 10-20 topics discussed in this category. use tool calling to return json reliably. the object should be { description: string, topics: string[] }

const writeDetailedDescriptionOfCategory = async (
    categoryName,
    categoryContent
) => {
    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini", //"claude-3-5-sonnet-20240620",
        // system: "You are an expert at summarizing video content and extracting key topics. Provide a 5-sentence description of the category and list 10-20 topics discussed in this category in Spanish.",
        tool_choice: {
            type: "function",
            function: {
                name: "print_category_details",
            },
        },
        temperature: 0,
        tools: [
            {
                type: "function",
                function: {
                    name: "print_category_details",
                    description:
                        "Prints a JSON object containing a 5-sentence description and an array of 10-20 topics discussed for the given category in Spanish.",
                    parameters: {
                        type: "object",
                        properties: {
                            description: { type: "string" },
                            topics: {
                                type: "array",
                                items: { type: "string" },
                            },
                        },
                        required: ["description", "topics"],
                    },
                },
            },
        ],
        max_tokens: 1024,
        messages: [
            {
                role: "system",
                content:
                    "You are an expert at summarizing video content and extracting key topics. Provide a 5-sentence description of the category and list 10-20 topics discussed in this category in Spanish. ",
            },
            {
                role: "user",
                content: JSON.stringify(categoryContent),
            },
        ],
    });

    // @ts-ignore
    // const result = response.content[0].input;

    const jsonStr =
        response.choices[0].message.tool_calls[0].function.arguments;

    const result = JSON.parse(jsonStr);

    // @ts-ignore

    categoryDescriptions[categoryName] = result;
    return result;
};

async function createCollection(category) {
    // each COLLECTION is a "category" of videos
    // each OBJECT is a "video"
    // every "video" has a title, url, topics array, and segments array

    await weaviateClient.collections.delete(category);

    const collection = await weaviateClient.collections.create({
        name: category,
        properties: [
            {
                name: "title",
                dataType: dataType.TEXT,
            },
            {
                name: "url",
                dataType: dataType.TEXT,
            },
            {
                name: "topics",
                dataType: dataType.TEXT_ARRAY,
            },
            {
                name: "segments",
                dataType: dataType.OBJECT_ARRAY,
                nestedProperties: [
                    {
                        name: "time",
                        dataType: dataType.TEXT,
                    },
                    {
                        name: "text",
                        dataType: dataType.TEXT,
                    },
                ],
            },
        ],
        vectorizers: vectorizer.text2VecOpenAI(),
        generative: generative.openAI(),
    });

    console.log(`collection ${collection.name} created!`);
}

const processVideo = async (video, isSequential = false) => {
    const maxRetries = 5;
    let delay = 1000;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            const response = await openai.chat.completions.create({
                // model: "claude-3-5-sonnet-20240620",
                model: "gpt-4o-mini",
                // system: "You are an expert at extracting topics from a video. Extract 10-20 topics discussed in a video. Respond in Spanish",
                tool_choice: {
                    type: "function",
                    function: {
                        name: "print_topics",
                    },
                },
                temperature: 0,
                tools: [
                    {
                        type: "function",
                        function: {
                            name: "print_topics",
                            description:
                                "Prints an array of 10-20 topics discussed in a video in Spanish.",
                            parameters: {
                                type: "object",
                                properties: {
                                    topics: {
                                        type: "array",
                                        items: { type: "string" },
                                    },
                                },
                                required: ["topics"],
                            },
                        },
                    },
                ],
                max_tokens: 512,
                messages: [
                    {
                        role: "system",
                        content:
                            "You are an expert at extracting topics from a video. Extract 10-20 topics discussed in a video. Respond in Spanish.",
                    },
                    {
                        role: "user",
                        content: JSON.stringify(video),
                    },
                ],
            });

            console.log("response", JSON.stringify(response));

            const jsonStr =
                response.choices[0].message.tool_calls[0].function.arguments;

            const json = JSON.parse(jsonStr);

            // @ts-ignore
            const topics = json.topics;
            console.log("topics", topics);

            return { ...video, topics };
        } catch (error) {
            console.error(`Attempt ${attempt + 1} failed: ${error.message}`);
            if (attempt === maxRetries - 1) {
                if (isSequential) throw error;
                console.log(
                    "Switching to sequential processing for this video."
                );
                return await processVideo(video, true);
            }
            await new Promise((resolve) => setTimeout(resolve, delay));
            delay *= 2;
        }
    }
};

const processJSONs = async () => {
    console.log("jsonFiles", jsonFiles);
    // Assuming jsonFiles is now an array of folder names
    for (const folder of jsonFiles) {
        const categoryName = folder.replace("5", "Small");

        const namesToDo = [
            "CP_OrganicSocial",
            "Mentorias_Mastery_2",
            "Mentorias_mastery_3",
            "MiniVIF_Questions",
            "Prospect",
            "SeLLing",
            "Ventas",
            "Mentorias_Master_1",
            "Mentalidad",
            "GrowthMastery",
            "Expert_Calls",
            "Edicion_De_Video",
            "CP_Organic_Social_Questions",
            "CP_LeftOrganicSocial",
            "CP_LeftLeftOrganicSocial",
            "Conoce_Jan",
            "ClassesVIF",
            "ClassesOrganicSocialSummarized",
            "Community_ClassesSummarized",
            // after you add a collection **ADD FOLDER/COLLECTION NAME HERE**
        ];

        // if category name not in namestodo list, skip
        if (namesToDo.includes(categoryName)) continue;

        const folderPath = join(fiveMinuteDir, folder);
        const files = readdirSync(folderPath).filter((file) =>
            file.endsWith(".json")
        );

        console.log("folderPath", folderPath);
        console.log("files", files);

        let allTopics = [];

        const fileContent = [];

        // try to create collection if it hasn't already been created
        try {
            await createCollection(categoryName);
        } catch (error) {
            console.log(error);
        }

        for (const file of files) {
            const filePath = join(folderPath, file);
            console.log("filePath", filePath);
            let jsonContent = JSON.parse(readFileSync(filePath, "utf-8"));

            try {
                // Try concurrent processing first
                const topicPromises = jsonContent.map((video) =>
                    processVideo(video)
                );
                const processedVideos = await Promise.all(topicPromises);

                console.log("processedVideos", processedVideos);

                fileContent.push(processedVideos);

                allTopics = fileContent.concat(
                    processedVideos.map((video) => video.topics)
                );
            } catch (error) {
                console.error(
                    `Concurrent processing failed for ${file}. Switching to sequential processing.`
                );
                // If concurrent processing fails, switch to sequential
                for (const video of jsonContent) {
                    try {
                        const processedVideo = await processVideo(video, true);
                        fileContent.push(processedVideo);
                        allTopics = allTopics.concat(processedVideo.topics);
                    } catch (error) {
                        console.error(
                            `Failed to process video: ${error.message}`
                        );
                        // You might want to add the original video without topics or handle this error differently
                        // fileContent.push(video);
                    }
                }
            }
        }

        console.log("fileContent", fileContent);

        const importPromises = fileContent.map((videoContent) =>
            importData(categoryName, videoContent)
        );
        await Promise.all(importPromises);

        // const detailedDescription = await writeDetailedDescriptionOfCategory(
        //     categoryName,
        //     fileContent
        // );
    }
};

// await processJSONs();

// console.log(categoryDescriptions);

// // save categoryDescriptions to a file
// writeFileSync(
//     join(__dirname, "categoryDescriptions.json"),
//     JSON.stringify(categoryDescriptions, null, 2)
// );

async function importData(category, videos) {
    const collection = weaviateClient.collections.get(category);

    const result = await collection.data.insertMany(videos);
    console.log("We just bulk inserted for", category);
}

async function getRelevantCategories(query) {
    const response = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20240620",
        system: "You are an expert at categorizing queries. Given a user query, determine relevant categories to search for information.",
        tool_choice: {
            type: "tool",

            name: "print_categories",
        },
        temperature: 0,
        tools: [
            {
                name: "print_categories",
                description:
                    "Prints an array of relevant category names for the given query. Available categories:\n" +
                    JSON.stringify(categoriesMapping, null, 2),
                input_schema: {
                    type: "object",
                    properties: {
                        categories: {
                            type: "array",
                            items: { type: "string" },
                        },
                    },
                    required: ["categories"],
                },
            },
        ],
        max_tokens: 400,
        messages: [
            // {
            //     role: "system",
            //     content:
            //         "You are an expert at categorizing queries. Given a user query, determine relevant categories to search for information.",
            // },
            {
                role: "user",
                content: query,
            },
        ],
    });

    // @ts-ignore
    const categories = response.content[0].input.categories;

    // const jsonStr =
    //     response.choices[0].message.tool_calls[0].function.arguments;

    // const json = JSON.parse(jsonStr);

    // // @ts-ignore
    // const categories = json.categories;

    // console.log("Relevant categories:", categories);

    return categories;
    // return ["QA"] //categories;
}

const searchCollection = async (query, category) => {
    try {
        const collection = weaviateClient.collections.get(category);

        const result = await collection.query.nearText(query, {
            limit: 3,
            returnMetadata: ["distance"],
        });

        return result.objects;
    } catch (error) {
        console.error(`Error searching collection ${category}:`, error.message);
        return [];
    }
};

const runQuery = async () => {
    // const query = "que es el LinkedIn Sales Navigator";
    const query =
        "";

    const relevantCategories = await getRelevantCategories(query);

    console.log(relevantCategories);

    const relevantVideos = await Promise.all(
        relevantCategories.map((category) =>
            searchCollection(query, category).catch((error) => {
                console.error(`Failed to search ${category}:`, error.message);
                return [];
            })
        )
    );

    console.log(JSON.stringify(relevantVideos, null, 2));

    const messages = [
        {
            role: "user",
            content: `<relevant video context>
${JSON.stringify(relevantVideos)}
</relevant video context>

<user query>
${query}
</user query>

<important>
IMPORANT: You MUST cite your sources (video name, timestamp range, video url) - only use one video no more than twice - make sure to use others if you need to 
</important>`,
        },
    ];

    // give the relevant videos as context in an anthropic request
    const result = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20240620",
        system: `<task>
Given relevant videos as context, use the context to answer the user's query and site the sources of your answer in the format. The answer should be long, well thought out response:

<answer>
<video name>
<relevant_video_timestamp_range(s)>
<video_url>

Do not actually include these tags in your response.
</task>

<example_output>
Lorem ipsum...
Video name
0:00:00.000 - 0:01:23:456
https://youtube.com/watch?v=A1B2C3
</example_output>

<important>
IMPORANT: You MUST cite your sources (video name, timestamp range, video url)
Note: If the video content you are referencing only has one segment or you are referencing the last segment in a video, the timestamp range should end with "end of video" only give answers in spanish. 
</important>`,
        temperature: 0,
        max_tokens: 3048,
        // @ts-ignore
        messages: messages,
    });

    // @ts-ignore
    const answer = result.content[0].text;

    console.log(answer);
};

runQuery();
