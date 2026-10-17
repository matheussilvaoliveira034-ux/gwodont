const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

// Import database helper
const { getDb } = require('../lib/db');

async function seed() {
  console.log('--- Iniciando provisionamento do banco de dados GW Odontologia ---');
  const db = getDb();

  // 1. Provisionar os dois administradores independentes
  const devEmail = process.env.ADMIN_DEV_EMAIL || 'admin@gwodonto.com.br';
  const devPass = process.env.ADMIN_DEV_PASSWORD || 'GwOdonto@2026Dev!';
  const devName = process.env.ADMIN_DEV_NAME || 'Desenvolvedor Técnico';

  const guiladEmail = process.env.ADMIN_GUILAD_EMAIL || 'drguilad@gwodonto.com.br';
  const guiladPass = process.env.ADMIN_GUILAD_PASSWORD || 'DrGuilad@GW2026!';
  const guiladName = process.env.ADMIN_GUILAD_NAME || 'Dr. Guilad Weil';

  const saltRounds = 12;
  const devHash = await bcrypt.hash(devPass, saltRounds);
  const guiladHash = await bcrypt.hash(guiladPass, saltRounds);

  const insertUser = db.prepare(`
    INSERT INTO users (email, password_hash, name, role)
    VALUES (?, ?, ?, 'admin')
    ON CONFLICT(email) DO UPDATE SET
      password_hash = excluded.password_hash,
      name = excluded.name
  `);

  insertUser.run(devEmail, devHash, devName);
  insertUser.run(guiladEmail, guiladHash, guiladName);
  console.log('✓ 2 Usuários administradores independentes provisionados com sucesso:');
  console.log(`  - ${devName} (${devEmail})`);
  console.log(`  - ${guiladName} (${guiladEmail})`);

  // 2. Provisionar Configurações Globais
  const settings = {
    clinic_name: 'GW Odontologia',
    doctor_name: 'Dr. Guilad Weil',
    doctor_title: 'Cirurgião-Dentista | USP',
    formation: 'Universidade de São Paulo (USP) - Mais de 30 anos de atuação clínica',
    address: 'Rua Cristiano Viana, 401, Conjunto 1311',
    building: 'Condomínio Atrium',
    neighborhood: 'Pinheiros',
    city: 'São Paulo',
    state: 'SP',
    cep: '05411-000',
    phone_fixo: '(11) 3081-3789',
    phone_whatsapp: '(11) 97553-2110',
    whatsapp_raw: '5511975532110',
    hours_weekday: 'Segunda a sexta-feira: 8h30 às 18h',
    hours_saturday: 'Sábado: 9h às 12h',
    metro_info: 'Localizado próximo ao Hospital das Clínicas, a poucas quadras da estação Clínicas (Linha 2-Verde) e da estação Oscar Freire (Linha 4-Amarela) do Metrô.',
    access_car_info: 'Travessa da Av. Rebouças e da Rua Teodoro Sampaio. O edifício Condomínio Atrium possui estacionamento rotativo com manobrista.',
    payment_info: 'Atendimento particular com foco em qualidade técnica e tempo dedicado a cada paciente. Facilidade de pagamento com cartões de crédito e débito.',
    languages: 'Atendimento em Português, Inglês e Hebraico (English and Hebrew spoken).',
    disclaimer: 'Atendimento estritamente particular. Não atendemos convênios nem SUS.',
  };

  const insertSetting = db.prepare(`
    INSERT INTO settings (key, value, updated_at)
    VALUES (?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP
  `);

  for (const [k, v] of Object.entries(settings)) {
    insertSetting.run(k, v);
  }
  console.log('✓ Configurações institucionais e de contato salvas.');

  // 3. Páginas e Conteúdos Clínicos Históricos Completos
  const initialPages = [
    {
      slug: '/',
      name: 'Início',
      is_system: 1,
      nav_order: 1,
      in_navbar: 1,
      seo_title: 'GW Odontologia — Dr. Guilad Weil | Dentista em Pinheiros, São Paulo',
      seo_description: 'Consultório odontológico em Pinheiros com o Dr. Guilad Weil, formado pela USP há mais de 30 anos. Atendimento clínico geral, bruxismo, laserterapia e reabilitação funcional.',
      seo_keywords: 'dentista pinheiros, dr guilad weil, odontologia clinica, clinica geral sao paulo, usp, bruxismo, laserterapia',
      content: {
        hero: {
          tag: 'ODONTOLOGIA CLÍNICA & DIAGNÓSTICO EM PINHEIROS',
          title: 'Cuidado odontológico responsável com precisão técnica e mais de 30 anos de experiência',
          subtitle: 'Com formação pela Universidade de São Paulo (USP) e dedicação à odontologia clínica individualizada, o Dr. Guilad Weil oferece diagnóstico criterioso e tratamentos focados na saúde bucal e no bem-estar funcional.',
          cta_primary_text: 'Agendar Consulta pelo WhatsApp',
          cta_secondary_text: 'Ver Tratamentos Confirmados',
          disclaimer: 'Atendimento particular individualizado. Não atendemos convênios nem SUS.',
          badges: [
            'Formado pela USP',
            'Mais de 30 anos de prática clínica',
            'Atendimento em Português, Inglês e Hebraico',
            'Pinheiros · Metrô Clínicas e Oscar Freire'
          ]
        },
        highlights: [
          {
            icon: 'Activity',
            title: 'Diagnóstico Criterioso',
            description: 'Avaliação detalhada com radiografia digital de alta definição e câmera intraoral para identificar a real necessidade de cada paciente sem excessos.'
          },
          {
            icon: 'Shield',
            title: 'Tratamentos Funcionais',
            description: 'Abordagem conservadora que prioriza a preservação biológica da estrutura dental, alívio de dor e recuperação da mastigação.'
          },
          {
            icon: 'Award',
            title: '30+ Anos de Confiança',
            description: 'Atendimento contínuo a famílias, adultos e crianças no bairro de Pinheiros, com postura ética e comunicação transparente.'
          },
          {
            icon: 'Clock',
            title: 'Atendimento Pontual e Dedicado',
            description: 'Consultas com tempo adequado para escuta do histórico, exame minucioso e esclarecimento de todas as dúvidas.'
          }
        ],
        about_doctor: {
          tag: 'SOBRE O PROFISSIONAL',
          title: 'Dr. Guilad Weil — Cirurgião-Dentista formado pela USP',
          paragraphs: [
            'Graduado pela Faculdade de Odontologia da Universidade de São Paulo (USP), o Dr. Guilad Weil atua há mais de três décadas em consultório particular no bairro de Pinheiros.',
            'Sua prática clínica baseia-se em evidências científicas sólidas, diagnósticos conservadores e respeito estrito à individualidade de cada paciente. A clínica não realiza tratamentos invasivos motivados por modismos, concentrando-se na integridade e na longevidade da saúde bucal.',
            'Para procedimentos de alta complexidade que exigem intervenção especializada, como casos avançados de Endodontia e Periodontia cirúrgica, o consultório atua em estreita colaboração com especialistas associados, garantindo segurança técnica e acompanhamento integrado.',
            'Fluente em inglês e hebraico, o Dr. Guilad também é referência no atendimento a diplomatas, executivos e residentes internacionais em São Paulo há vários anos.'
          ],
          credentials: [
            'Graduação em Odontologia — Faculdade de Odontologia da USP',
            'Mais de 30 anos de prática clínica contínua em Pinheiros',
            'Capacitação em Laserterapia (LLLT) para alívio da dor e cicatrização',
            'Habilitação em abordagens modernas para controle do bruxismo (NTI e LIVA)',
            'Radiografia Digital Schick de baixa emissão de radiação',
            'Atendimento multilíngue: Português, Inglês e Hebraico'
          ]
        },
        services_section: {
          tag: 'ÁREAS DE ATUAÇÃO CONFIRMADAS',
          title: 'Tratamentos clínicos executados e coordenados pelo consultório',
          subtitle: 'Conheça os principais cuidados oferecidos, com páginas dedicadas e explicações detalhadas sobre cada procedimento.',
          cards: [
            {
              slug: '/bruxismo',
              title: 'Bruxismo e Dores Orofaciais',
              description: 'Diagnóstico diferencial entre bruxismo do sono e em vigília. Dispositivos NTI (aprovado pelo FDA), método LIVA e acompanhamento muscular individualizado.',
              badge: 'Página Exclusiva',
              icon: 'Moon'
            },
            {
              slug: '/herpes',
              title: 'Herpes Labial e Laserterapia',
              description: 'Aplicação de laser de baixa intensidade (LLLT) para alívio imediato do desconforto, aceleração da cicatrização e controle de recidivas.',
              badge: 'Página Exclusiva',
              icon: 'Zap'
            },
            {
              slug: '/clinica-geral',
              title: 'Clínica Geral e Prevenção',
              description: 'Profilaxia detalhada, remoção de tártaro, restaurações funcionais em resina composta, inlays, onlays e coroas de proteção.',
              badge: 'Odontologia Clínica',
              icon: 'CheckCircle'
            },
            {
              slug: '/tratamento-de-canal',
              title: 'Tratamento de Canal (Endodontia)',
              description: 'Técnicas modernas com radiografia digital para sanar infecções da polpa e preservar o dente natural, em cooperação com especialistas.',
              badge: 'Colaboração com Especialistas',
              icon: 'ShieldAlert'
            },
            {
              slug: '/periodontia',
              title: 'Periodontia e Saúde Gengival',
              description: 'Controle de inflamações gengivais, tratamento de suporte e manutenção dos tecidos de sustentação dos dentes com equipe integrada.',
              badge: 'Saúde dos Tecidos',
              icon: 'Heart'
            },
            {
              slug: '/english',
              title: 'International Dental Care',
              description: 'English-speaking dental care in São Paulo for expats, tourists, and international executives. Clean, modern facility in Pinheiros.',
              badge: 'English Spoken',
              icon: 'Globe'
            }
          ]
        },
        differentials: {
          tag: 'POR QUE ESCOLHER A GW ODONTOLOGIA',
          title: 'Compromisso com a sua saúde e segurança biológica',
          items: [
            {
              title: 'Foco estritamente funcional',
              description: 'Não indicamos procedimentos desnecessários nem prometemos transformações estéticas artificiais. Nosso compromisso é com a integridade mastigatória, ausência de infecções e alívio da dor.'
            },
            {
              title: 'Tecnologia diagnóstica avançada',
              description: 'Uso de sensor radiográfico digital Schick, que reduz significativamente a radiação e permite visualização imediata em tela de alta resolução.'
            },
            {
              title: 'Abordagem cooperativa com especialistas',
              description: 'Nos procedimentos que requerem especialização pontual (como Endodontia e Periodontia complexas), o planejamento é conduzido em conjunto com profissionais de confiança.'
            },
            {
              title: 'Localização privilegiada e acessível',
              description: 'Situado no Condomínio Atrium, em Pinheiros, a curta caminhada das estações Clínicas e Oscar Freire do Metrô, com estacionamento rotativo com manobrista no local.'
            }
          ]
        },
        faq: [
          {
            question: 'O consultório atende convênios ou planos de saúde?',
            answer: 'Não. Os atendimentos na GW Odontologia são estritamente particulares. Isso garante que cada paciente receba o tempo clínico adequado, materiais de primeira linha e um planejamento individualizado sem as restrições impostas por operadoras de saúde.'
          },
          {
            question: 'Qual é a formação e experiência do Dr. Guilad Weil?',
            answer: 'O Dr. Guilad Weil é graduado pela Faculdade de Odontologia da Universidade de São Paulo (USP) e conta com mais de 30 anos de atuação clínica ininterrupta no bairro de Pinheiros.'
          },
          {
            question: 'Como agendar uma consulta inicial?',
            answer: 'O agendamento pode ser realizado facilmente pelo WhatsApp oficial (11) 97553-2110 ou pelo telefone fixo (11) 3081-3789. Nossa equipe fornecerá as orientações e horários disponíveis.'
          },
          {
            question: 'Há opções de estacionamento no local?',
            answer: 'Sim. O consultório fica no Condomínio Atrium (Rua Cristiano Viana, 401, Conjunto 1311), que conta com estacionamento pago com serviço de manobrista no próprio edifício.'
          }
        ]
      }
    },
    {
      slug: '/bruxismo',
      name: 'Bruxismo',
      is_system: 0,
      nav_order: 2,
      in_navbar: 1,
      seo_title: 'Tratamento de Bruxismo em São Paulo — Dr. Guilad Weil | Pinheiros',
      seo_description: 'Avaliação clínica e controle do bruxismo do sono e de vigília com o Dr. Guilad Weil em Pinheiros. Dispositivos NTI aprovado pelo FDA, abordagem LIVA e proteção dental.',
      seo_keywords: 'bruxismo pinheiros, tratamento bruxismo sp, aparelho nti, nti-tss, liva bruxismo vigilia, desgaste dentario, dor de cabeca tensional, dtm, dr guilad weil',
      content: {
        hero: {
          tag: 'LANDING PAGE EXCLUSIVA · BRUXISMO & DORES OROFACIAIS',
          title: 'Diagnóstico criterioso e controle eficaz do bruxismo em Pinheiros',
          subtitle: 'Apertamento e ranger de dentes causam desgastes severos, fraturas de restaurações e dores de cabeça tensionais. Saiba como o Dr. Guilad Weil atua no diagnóstico do bruxismo noturno e diurno.',
          cta_primary_text: 'Falar com o Dr. Guilad pelo WhatsApp',
          cta_secondary_text: 'Ver Opções de Tratamento',
          notice: 'Importante: O bruxismo é uma condição neuromuscular que não possui cura milagrosa; o tratamento visa proteger os dentes, aliviar a dor e restaurar o equilíbrio muscular.'
        },
        understanding_section: {
          tag: 'O QUE É O BRUXISMO',
          title: 'Entenda os mecanismos do apertamento e rangimento dental',
          paragraphs: [
            'O bruxismo é definido como uma atividade repetitiva dos músculos mastigatórios, caracterizada pelo apertamento ou ranger dos dentes e/ou pela contração excessiva da mandíbula.',
            'Clinicamente, divide-se o bruxismo em duas manifestações distintas, com origens e abordagens terapêuticas diferentes:',
            '1. Bruxismo do Sono: Ocorre de forma inconsciente durante a noite. Caracteriza-se predominantemente pelo ranger dos dentes e possui íntima relação com a arquitetura do sono e a fisiologia respiratória.',
            '2. Bruxismo em Vigília: Ocorre durante o dia, enquanto o indivíduo está acordado. Caracteriza-se predominantemente pelo apertamento dental silencioso ou encostamento contínuo dos dentes, fortemente potencializado por períodos de estresse, concentração intensa e sobrecarga emocional.'
          ],
          symptoms: [
            'Desgaste anormal, trincas ou fraturas em dentes e restaurações',
            'Sensibilidade dentinária aumentada (especialmente ao frio e ao toque)',
            'Dores musculares na face, têmporas, pescoço e região cervical',
            'Cefaleias tensionais matinais ou ao final da tarde',
            'Cansaço na mandíbula ao acordar ou ao mastigar',
            'Estalos, estalidos ou limitação de abertura na articulação têmporo-mandibular (ATM)'
          ]
        },
        devices_section: {
          tag: 'ABORDAGENS TERAPÊUTICAS CONFIRMADAS',
          title: 'Dispositivos específicos para cada padrão de bruxismo',
          items: [
            {
              title: 'Aparelho NTI (NTI-tss)',
              badge: 'Aprovado pelo FDA',
              description: 'O NTI (Inibição Nociceptiva Trigeminal - Sistema de Supressão de Tensão) é um dispositivo interoclusal anterior pré-fabricado e adaptado diretamente na boca do paciente em consulta clínica. Por recobrir apenas os dentes anteriores, ele desoclui os molares e pré-molares, impedindo o reflexo de contração de potência máxima dos músculos masseter e temporal. É indicado para prevenção de cefaleias tensionais e proteção noturna contra sobrecargas oclusais.'
            },
            {
              title: 'Metodologia LIVA (DIVA®)',
              badge: 'Bruxismo em Vigília',
              description: 'Voltado especificamente para o bruxismo diurno (em vigília). Utiliza o Dispositivo Interoclusal de Vigília (DIVA®), uma mini placa anatômica discreta posicionada em dentes posteriores que atua como biofeedback tátil em tempo real. O paciente toma consciência imediata do momento em que encosta ou aperta os dentes durante o trabalho ou estudos, permitindo o relaxamento mandibular voluntário e progressivo.'
            },
            {
              title: 'Placas Oclusais Estabilizadoras',
              badge: 'Proteção Estrutural',
              description: 'Placas rígidas de cobertura total confeccionadas sob medida para proteção mecânica das superfícies dentárias contra o atrito severo, prevenindo a perda contínua de esmalte e fratura de próteses em pacientes rangem intensamente durante o sono.'
            },
            {
              title: 'Toxina Botulínica (Contextualizada)',
              badge: 'Casos Específicos',
              description: 'Quando devidamente indicada pelo cirurgião-dentista em quadros de hipertrofia ou espasmo muscular severo dos músculos masseteres refratários a outras abordagens, atua reduzindo temporariamente a força hiperativa de contração mastigatória, sempre combinada com proteção oclusal.'
            }
          ]
        },
        faq: [
          {
            question: 'O bruxismo tem cura definitiva?',
            answer: 'Atualmente, a literatura odontológica mundial confirma que o bruxismo não possui cura definitiva, pois envolve complexos fatores do sistema nervoso central, estresse e regulação do sono. O tratamento odontológico tem como objetivo controlar as forças mastigatórias, proteger os dentes contra desgastes e fraturas, desprogramar a tensão muscular e eliminar as dores de cabeça e na face.'
          },
          {
            question: 'Como saber se tenho bruxismo se durmo sozinho?',
            answer: 'Muitos pacientes descobrem o bruxismo durante a consulta de rotina, quando o Dr. Guilad examina facetas de desgaste nos dentes, recessões gengivais ou trincas no esmalte. Sintomas como acordar com dor na mandíbula ou dor de cabeça na região das têmporas também são fortes indicativos clínicos.'
          },
          {
            question: 'Quanto tempo dura a adaptação do aparelho NTI?',
            answer: 'O aparelho NTI-tss é adaptado e personalizado na boca do paciente no próprio consultório, em uma sessão de aproximadamente 45 minutos. O paciente já sai da consulta utilizando o dispositivo ajustado.'
          },
          {
            question: 'Crianças também podem apresentar bruxismo?',
            answer: 'Sim. O bruxismo infantil é comum durante as fases de transição dentária e desenvolvimento craniofacial. Na maioria dos casos é transitório, mas deve ser avaliado pelo dentista para verificar se há desgaste acentuado, dificuldades respiratórias ou interferências na oclusão.'
          }
        ]
      }
    },
    {
      slug: '/herpes',
      name: 'Herpes Labial',
      is_system: 0,
      nav_order: 3,
      in_navbar: 1,
      seo_title: 'Tratamento de Herpes Labial com Laserterapia — Dr. Guilad Weil | Pinheiros, SP',
      seo_description: 'Aplicação de laser de baixa intensidade (LLLT) para alívio da dor, cicatrização acelerada e aumento do intervalo entre crises de herpes labial com o Dr. Guilad Weil.',
      seo_keywords: 'herpes labial laser, laserterapia herpes sao paulo, tratamento herpes pinheiros, aftas laserterapia, lllt odontologia, dr guilad weil',
      content: {
        hero: {
          tag: 'LANDING PAGE EXCLUSIVA · LASERTERAPIA CLÍNICA',
          title: 'Abordagem clínica da herpes labial com Laserterapia de baixa intensidade',
          subtitle: 'A aplicação da luz laser (LLLT) acelera a cicatrização tecidual, proporciona alívio rápido do desconforto e contribui para aumentar o intervalo entre eventuais crises.',
          cta_primary_text: 'Consultar Disponibilidade pelo WhatsApp',
          cta_secondary_text: 'Como Funciona o Laser',
          notice: 'Informação ética: O vírus HSV-1 permanece latente no organismo e nenhum tratamento erradica o vírus permanentemente. A laserterapia atua no controle biológico do surto ativo e na bioestimulação celular.'
        },
        understanding_section: {
          tag: 'EVOLUÇÃO DO CICLO CLÍNICO',
          title: 'O ciclo do herpes simples labial e o momento ideal de intervenção',
          paragraphs: [
            'O herpes labial é causado pelo vírus herpes simples tipo 1 (HSV-1), que acomete grande parte da população. Após o primeiro contato, o vírus aloja-se nos gânglios neurais sensoriais em estado de latência, sem manifestar sintomas por períodos variáveis.',
            'A reativação pode ser desencadeada por fatores como estresse emocional, exposição solar excessiva, variações hormonais ou queda temporária na imunidade.',
            'O ciclo típico evolui em fases:',
            '• Fase Prodrômica: Sensação de coceira, formigamento, ardor ou calor no lábio antes de qualquer lesão visível.',
            '• Fase Vesicular: Surgimento de pequenas vesículas (bolhas) agrupadas contendo líquido.',
            '• Fase Ulcerativa: Rompimento das vesículas, formando feridas úmidas e dolorosas.',
            '• Fase de Crosta e Cicatrização: Formação de crosta que gradativamente se desprende, regenerando o tecido sem deixar cicatriz permanente.'
          ]
        },
        laser_section: {
          tag: 'A AÇÃO DO LASER (LLLT)',
          title: 'Como a fotobiomodulação atua nas lesões herpéticas e aftas',
          paragraphs: [
            'A Laserterapia de Baixa Intensidade (Low Level Laser Therapy - LLLT) consiste na aplicação focalizada de luz com comprimento de onda terapêutico específico sobre a região afetada.',
            'A radiação luminosa é absorvida pelos fotorreceptores mitocondriais das células (citocromo c oxidase), estimulando a síntese de ATP (energia celular), a microcirculação local e a liberação de mediadores anti-inflamatórios e analgésicos naturais.',
            'Vantagens clínicas comprovadas da abordagem:',
            '• Procedimento totalmente indolor, não invasivo e realizado sem cortes ou agulhas.',
            '• Redução expressiva da dor e da ardência logo após a sessão clínica.',
            '• Encurtamento sensível do tempo de cicatrização da lesão labial.',
            '• Quando aplicada na fase inicial (pródomos), pode abortar a evolução para a formação de bolhas volumosas.',
            '• Estudos clínicos indicam aumento do período de latência, espaçando a recorrência de novos episódios.'
          ],
          indications: [
            'Herpes simples labial recorrente em qualquer fase evolutiva',
            'Úlceras aftosas recorrentes (aftas profundas e dolorosas na boca)',
            'Hipersensibilidade dentinária e exposição radicular',
            'Pós-operatório cirúrgico para bioestimulação tecidual e alívio de dor',
            'Dores musculares e inflamações articulares da ATM'
          ]
        },
        faq: [
          {
            question: 'O laser cura a herpes definitivamente?',
            answer: 'Não. É essencial que o paciente tenha clareza científica: o vírus HSV-1 permanece em latência nos gânglios nervosos do corpo por toda a vida e nenhuma tecnologia médica existente hoje consegue extirpá-lo definitivamente. O que a laserterapia proporciona é a atenuação acentuada dos sintomas locais, aceleração da cicatrização e auxílio no aumento do tempo entre as crises.'
          },
          {
            question: 'A aplicação do laser dói?',
            answer: 'Não. O laser terapêutico de baixa intensidade emite uma energia atérmica ou apenas uma suave sensação de calor superficial. O procedimento é extremamente confortável e dispensa o uso de anestesia.'
          },
          {
            question: 'Em que momento devo procurar o consultório?',
            answer: 'O momento de maior eficácia é a fase inicial de formigamento ou ardor (fase prodrômica), antes do rompimento das bolhas. Contudo, a aplicação também é bastante benéfica nas fases em que as feridas já estão formadas, diminuindo a dor e acelerando a reparação epitelial.'
          },
          {
            question: 'A laserterapia também serve para aftas?',
            answer: 'Sim. As úlceras aftosas recorrentes respondem de forma excelente à laserterapia, com alívio imediato da queimação que atrapalha a alimentação e fala, permitindo recuperação muito mais rápida da mucosa oral.'
          }
        ]
      }
    },
    {
      slug: '/clinica-geral',
      name: 'Clínica Geral',
      is_system: 0,
      nav_order: 4,
      in_navbar: 1,
      seo_title: 'Clínica Geral e Prevenção Odontológica em Pinheiros — Dr. Guilad Weil',
      seo_description: 'Atendimento de clínica geral, profilaxia, restaurações funcionais e check-up digital com radiografia Schick em Pinheiros com o Dr. Guilad Weil (USP).',
      seo_keywords: 'clinica geral pinheiros, dentista clinico geral sp, profilaxia dental, restauracao resina composta, radiografia digital schick, dr guilad weil',
      content: {
        hero: {
          tag: 'ODONTOLOGIA CLÍNICA CONSERVADORA',
          title: 'Clínica geral com foco na prevenção, integridade e função dental',
          subtitle: 'Cuidados odontológicos fundamentais para preservar a dentição natural ao longo da vida, com diagnóstico rigoroso e sem tratamentos invasivos desnecessários.',
          cta_primary_text: 'Agendar Check-up pelo WhatsApp',
          cta_secondary_text: 'Procedimentos Realizados'
        },
        procedures: [
          {
            title: 'Exame Clínico e Diagnóstico por Imagem Digital',
            description: 'Inspeção clínica minuciosa combinada com Radiografia Digital Schick (que utiliza doses mínimas de radiação e gera imagens de altíssima definição instantaneamente) e câmera intraoral para diagnóstico precoce de cáries e perdas ósseas.'
          },
          {
            title: 'Profilaxia e Raspagem Preventiva',
            description: 'Limpeza profissional detalhada para remoção de placa bacteriana calcificada (tártaro) acima e ligeiramente abaixo da margem gengival, polimento coronário e orientações personalizadas de higiene interdental.'
          },
          {
            title: 'Restaurações Funcionais em Resina Composta',
            description: 'Remoção minimamente invasiva do tecido cariado ou substituição de restaurações fraturadas, utilizando resinas compostas microhíbridas que restabelecem com exatidão a anatomia oclusal e a capacidade mastigatória.'
          },
          {
            title: 'Inlays, Onlays e Coroas Protetoras',
            description: 'Reconstrução de dentes com perda estrutural substancial decorrente de cáries extensas, tratamentos endodônticos prévios ou fraturas mecânicas, devolvendo rigidez e proteção contra novas fraturas.'
          },
          {
            title: 'Atendimento Odontológico Familiar',
            description: 'Abordagem paciente, didática e acolhedora para adultos e crianças, estabelecendo uma relação de confiança de longo prazo com as famílias atendidas em Pinheiros.'
          }
        ],
        faq: [
          {
            question: 'Qual a periodicidade recomendada para consultas de rotina?',
            answer: 'Para a maioria dos pacientes adultos e infantis, o intervalo ideal é semestral (a cada 6 meses). Pacientes com histórico de alta atividade de cárie ou bruxismo severo podem se beneficiar de retornos quadrimestrais.'
          },
          {
            question: 'Qual a vantagem da radiografia digital em relação ao filme convencional?',
            answer: 'A radiografia digital reduz a exposição do paciente à radiação em até 80-90% em comparação com as películas químicas antigas. Além disso, a imagem digital permite ampliação na tela, facilitando a identificação precoce de lesões interproximais.'
          }
        ]
      }
    },
    {
      slug: '/tratamento-de-canal',
      name: 'Tratamento de Canal',
      is_system: 0,
      nav_order: 5,
      in_navbar: 1,
      seo_title: 'Tratamento de Canal em Pinheiros — Dr. Guilad Weil | Endodontia Moderna',
      seo_description: 'Endodontia moderna com radiografia digital de alta definição e cooperação com especialistas em Pinheiros. Alívio da dor e preservação do dente natural.',
      seo_keywords: 'tratamento de canal pinheiros, endodontia sp, dor de dente canal, radiografia digital endodontia, dr guilad weil',
      content: {
        hero: {
          tag: 'ENDODONTIA MODERNA E CONSERVADORA',
          title: 'Tratamento de canal preciso e seguro para salvar o dente natural',
          subtitle: 'A intervenção endodôntica remove a infecção no interior do dente, cessa a dor aguda e viabiliza a manutenção da raiz na arcada. Atuação com tecnologia digital e colaboração com especialistas dedicados.',
          cta_primary_text: 'Avaliar Dor de Canal pelo WhatsApp',
          cta_secondary_text: 'Como é Feito o Procedimento'
        },
        explanation_section: {
          tag: 'QUANDO É NECESSÁRIO',
          title: 'A anatomia do canal radicular e as indicações clínicas',
          paragraphs: [
            'No interior de cada dente existe a polpa dentária, composta por vasos sanguíneos e feixes nervosos. Quando uma cárie profunda atinge essa câmara ou quando ocorre um trauma mecânico/fratura, bactérias penetram no canal, causando pulpite (inflamação aguda dolorosa) ou necrose pulpar com formação de lesões periapicais no osso.',
            'O tratamento de canal consiste na remoção criteriosa desse tecido comprometido, desinfecção química e mecânica dos condutos radiculares com instrumentos rotatórios de precisão e posterior obturação tridimensional com material biológico e selador biocompatível.',
            'Na GW Odontologia, utilizamos radiografia digital Schick para medição e mapeamento do comprimento dos canais, assegurando exatidão milimétrica.',
            'Para anatomias radiculares complexas, canais curvos atípicos ou retratamentos delicados, o Dr. Guilad coordena o atendimento em conjunto com especialistas em Endodontia, assegurando o melhor prognóstico para o caso.'
          ]
        },
        faq: [
          {
            question: 'O tratamento de canal dói?',
            answer: 'Não. Com os anestésicos modernos de longa duração e a instrumentação computadorizada atual, o procedimento de canal é inteiramente indolor durante a consulta. O objetivo principal do tratamento é justamente eliminar a dor aguda provocada pela infecção do nervo.'
          },
          {
            question: 'O procedimento pode ser realizado em sessão única?',
            answer: 'Em diversos casos de polpa viva ou infecções não complicadas, o tratamento pode ser concluído em uma única sessão de 60 a 90 minutos. Em situações com exsudato inflamatório ativo ou abscesso periapical, pode ser necessária a aplicação de medicação intracanal prévia e finalização na sessão subsequente.'
          },
          {
            question: 'Um dente com canal tratado fica mais frágil?',
            answer: 'O dente perde a hidratação natural da polpa e, frequentemente, já perdeu boa parte de sua estrutura coronária pela cárie que motivou o procedimento. Por esse motivo, é essencial realizar uma restauração protetora adequada ou coroa logo após o término do canal para garantir sua longevidade mastigatória.'
          }
        ]
      }
    },
    {
      slug: '/periodontia',
      name: 'Periodontia',
      is_system: 0,
      nav_order: 6,
      in_navbar: 1,
      seo_title: 'Periodontia e Saúde Gengival em Pinheiros — GW Odontologia',
      seo_description: 'Prevenção e controle de gengivite e periodontite em Pinheiros. Diagnóstico precoce, profilaxia subgengival e colaboração multidisciplinar com especialistas.',
      seo_keywords: 'periodontia pinheiros, saude gengival sp, tratamento gengivite, sangramento gengival, dr guilad weil',
      content: {
        hero: {
          tag: 'SAÚDE DOS TECIDOS DE SUSTENTAÇÃO',
          title: 'Cuidado periodontal para preservar a base e fixação dos seus dentes',
          subtitle: 'A gengiva, o ligamento periodontal e o osso alveolar formam o suporte de cada dente. A GW Odontologia oferece acompanhamento preventivo e atua em parceria com especialistas periodontistas.',
          cta_primary_text: 'Agendar Avaliação Gengival',
          cta_secondary_text: 'Sinais de Alerta'
        },
        details_section: {
          tag: 'DIAGNÓSTICO E TERAPIA',
          title: 'Da gengivite à periodontite: a importância do controle bacteriano',
          paragraphs: [
            'A gengivite é o estágio inicial da doença periodontal, caracterizada por gengivas avermelhadas, inchadas e que sangram com facilidade durante a escovação ou passagem do fio dental. Se não tratada, a infecção progride para a periodontite, na qual o tártaro subgengival destrói as fibras de sustentação e o osso ao redor das raízes.',
            'O controle baseia-se na raspagem e alisamento radicular minucioso, descontaminação dos sítios periodontais e programa rigoroso de manutenção periódica.',
            'Casos avançados com bolsas periodontais profundas, necessidade de cirurgias de acesso ou enxertos teciduais são conduzidos em cooperação integrada com especialistas em Periodontia.'
          ],
          signs: [
            'Sangramento durante a escovação ou uso de fio dental',
            'Gengivas inchadas, sensíveis ou de coloração vermelho-escura',
            'Retração gengival (aparência de dentes mais longos)',
            'Mau hálito constante de origem bucal',
            'Mobilidade dental ou afastamento espontâneo entre os dentes'
          ]
        },
        faq: [
          {
            question: 'O sangramento na gengiva é normal?',
            answer: 'Não. Gengiva saudável não sangra. O sangramento ao escovar ou passar fio dental é o primeiro sintoma biológico de que há placa bacteriana acumulada e inflamação ativa que necessita de intervenção clínica.'
          },
          {
            question: 'Como funciona a colaboração com os especialistas associados?',
            answer: 'O Dr. Guilad realiza o exame diagnóstico completo e o plano inicial de tratamento. Se o caso envolver complexidade cirúrgica periodontal ou regeneração óssea, o paciente é atendido em conjunto com um periodontista de referência associado à clínica, garantindo a melhor conduta especializada.'
          }
        ]
      }
    },
    {
      slug: '/contato',
      name: 'Contato',
      is_system: 1,
      nav_order: 7,
      in_navbar: 1,
      seo_title: 'Localização e Contato — GW Odontologia | Pinheiros, São Paulo',
      seo_description: 'Endereço, telefones, WhatsApp e orientações de localização do consultório do Dr. Guilad Weil em Pinheiros. Rua Cristiano Viana 401, Condomínio Atrium.',
      seo_keywords: 'contato gw odontologia, dentista pinheiros telefone, rua cristiano viana 401, metro clinicas, metro oscar freire, dr guilad weil whatsapp',
      content: {
        hero: {
          tag: 'LOCALIZAÇÃO & ATENDIMENTO',
          title: 'Entre em contato e planeje sua visita ao nosso consultório',
          subtitle: 'Atendimento com horário previamente marcado para garantir atenção exclusiva, pontualidade e dedicação total ao seu cuidado bucal.',
          cta_primary_text: 'Falar pelo WhatsApp',
          cta_secondary_text: 'Ligar para o Telefone Fixo'
        },
        contact_info: {
          address: 'Rua Cristiano Viana, 401, Conjunto 1311',
          building: 'Condomínio Atrium',
          neighborhood: 'Pinheiros',
          city: 'São Paulo',
          state: 'SP',
          cep: '05411-000',
          phone_fixo: '(11) 3081-3789',
          phone_whatsapp: '(11) 97553-2110',
          whatsapp_raw: '5511975532110',
          hours_weekday: 'Segunda a sexta-feira: 8h30 às 18h',
          hours_saturday: 'Sábado: 9h às 12h'
        },
        location_details: [
          {
            title: 'Transporte Público / Metrô',
            description: 'Situado próximo ao Complexo Hospital das Clínicas. Fica a cerca de 10 minutos a pé tanto da Estação Clínicas (Linha 2-Verde) quanto da Estação Oscar Freire (Linha 4-Amarela).'
          },
          {
            title: 'Acesso de Carro',
            description: 'A Rua Cristiano Viana é uma via transversal com fácil acesso pelas avenidas Rebouças, Doutor Arnaldo e pela Rua Teodoro Sampaio.'
          },
          {
            title: 'Estacionamento no Edifício',
            description: 'O Condomínio Atrium dispõe de estacionamento rotativo com serviço de manobrista no próprio local para maior comodidade.'
          }
        ],
        faq: [
          {
            question: 'É necessário agendamento prévio?',
            answer: 'Sim. Todas as consultas são agendadas com antecedência para garantir pontualidade e dedicação de tempo integral a cada paciente.'
          },
          {
            question: 'Quais as formas de pagamento aceitas?',
            answer: 'Aceitamos cartões de débito, crédito e transferências bancárias com facilidades de parcelamento para tratamentos clínicos.'
          }
        ]
      }
    },
    {
      slug: '/english',
      name: 'English',
      is_system: 0,
      nav_order: 8,
      in_navbar: 1,
      seo_title: 'English-Speaking Dentist in São Paulo — Dr. Guilad Weil | Pinheiros',
      seo_description: 'USP-trained English-speaking dentist in São Paulo with 30+ years of clinical practice. Family dentistry, bruxism, laser treatment and root canals in Pinheiros.',
      seo_keywords: 'english speaking dentist sao paulo, dentist pinheiros expat, dental care sao paulo, dr guilad weil english',
      content: {
        hero: {
          tag: 'INTERNATIONAL PATIENTS & EXPATS',
          title: 'Experienced, English-speaking clinical dental care in São Paulo',
          subtitle: 'Choosing the right healthcare professional in a foreign country requires trust and clear communication. Dr. Guilad Weil offers over 30 years of evidence-based dentistry in a clean, modern clinic in Pinheiros.',
          cta_primary_text: 'Chat in English on WhatsApp',
          cta_secondary_text: 'View Dental Services',
          notice: 'Private clinical practice. Transparent communication with no language barrier.'
        },
        welcome_section: {
          tag: 'HELLO AND WELCOME',
          title: 'Comprehensive general dentistry with clear, fluent communication',
          paragraphs: [
            'Whether you are an expat working and living in São Paulo, a diplomat, or a traveler in need of reliable dental care, you can rest assured you are in good hands.',
            'Dr. Guilad Weil is a graduate of the University of São Paulo (USP) School of Dentistry and has been practicing family clinical dentistry for over 35 years.',
            'Our office provides honest, thorough and conservative care focused on long-term oral health, avoiding overtreatment or unnecessary cosmetic fads.',
            'We also offer collaborative care with dedicated specialists in Endodontics and Periodontics for more complex requirements.'
          ],
          services_list: [
            'Comprehensive clinical evaluations & oral health check-ups',
            'Schick high-resolution low-radiation digital radiography',
            'Professional hygiene, prophylaxis and periodontal maintenance',
            'Functional tooth-colored composite restorations',
            'Bruxism diagnosis and management (NTI-tss device & daytime awake bruxism care)',
            'Low Level Laser Therapy (LLLT) for cold sores and oral ulcer relief',
            'Modern root canal treatment (Endodontics) in partnership with specialists',
            'Protective crowns, inlays and onlays'
          ]
        },
        location_section: {
          tag: 'LOCATION & ACCESS',
          title: 'Conveniently located in the Pinheiros district',
          paragraphs: [
            'Our clinic is located in Condomínio Atrium, right in Pinheiros — an accessible, safe central neighborhood in São Paulo.',
            'Address: Rua Cristiano Viana, 401, Suite 1311, Pinheiros, São Paulo, SP, 05411-000.',
            'Near the Hospital das Clínicas complex, within a 10-minute walk from both Clínicas Metro Station (Green Line) and Oscar Freire Metro Station (Yellow Line).',
            'Paid parking with valet service is available on-site within the building.'
          ]
        },
        faq: [
          {
            question: 'Can I conduct my entire appointment and inquiries in English?',
            answer: 'Yes, absolutely. Dr. Guilad speaks fluent English (and Hebrew) and has been caring for international patients, diplomats and expatriates throughout his entire 30+ year career.'
          },
          {
            question: 'Do you accept international insurance directly?',
            answer: 'We operate as a private fee-for-service clinic. We provide detailed receipts and medical statements in English with procedure codes so you can claim reimbursement from your international health insurance provider.'
          },
          {
            question: 'How do I schedule an appointment?',
            answer: 'You can easily message our clinic on WhatsApp at +55 11 97553-2110 or call +55 11 3081-3789 to find a convenient consultation time.'
          }
        ]
      }
    }
  ];

  const insertPage = db.prepare(`
    INSERT INTO pages (slug, name, is_published, is_system, nav_order, in_navbar, created_at, updated_at)
    VALUES (?, ?, 1, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    ON CONFLICT(slug) DO UPDATE SET
      name = excluded.name,
      is_system = excluded.is_system,
      nav_order = excluded.nav_order,
      in_navbar = excluded.in_navbar,
      updated_at = CURRENT_TIMESTAMP
  `);

  const insertVersion = db.prepare(`
    INSERT INTO page_versions (page_id, version_type, seo_title, seo_description, seo_keywords, content_json, updated_at, updated_by)
    VALUES (?, 'published', ?, ?, ?, ?, CURRENT_TIMESTAMP, 'sistema')
    ON CONFLICT(page_id, version_type) DO UPDATE SET
      seo_title = excluded.seo_title,
      seo_description = excluded.seo_description,
      seo_keywords = excluded.seo_keywords,
      content_json = excluded.content_json,
      updated_at = CURRENT_TIMESTAMP
  `);

  for (const page of initialPages) {
    insertPage.run(page.slug, page.name, page.is_system, page.nav_order, page.in_navbar);
    const saved = db.prepare('SELECT id FROM pages WHERE slug = ?').get(page.slug);
    insertVersion.run(saved.id, page.seo_title, page.seo_description, page.seo_keywords, JSON.stringify(page.content));
    console.log(`✓ Página provisionada e publicada: ${page.name} (${page.slug})`);
  }

  console.log('\n--- Provisionamento do banco de dados concluído com êxito! ---');
}

seed().catch(err => {
  console.error('Erro no provisionamento do banco de dados:', err);
  process.exit(1);
});
