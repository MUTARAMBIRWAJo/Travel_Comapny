const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seedCMS() {
  try {
    console.log('Starting CMS seed for We-Of-You Travel Company...\n');

    // 1. SEED GLOBAL SETTINGS
    console.log('Seeding global settings...');
    const globalSettings = [
      {
        key: 'brand_name',
        value_en: 'We-Of-You Travel Company',
        value_rw: 'We-Of-You Travel Company',
        value_fr: 'We-Of-You Travel Company',
        type: 'text'
      },
      {
        key: 'tagline',
        value_en: 'Your Trusted Travel Partner from Rwanda to the World',
        value_rw: 'Umufatanyabikorwa Wizewe mu Rugendo Rwawe uvuye mu Rwanda ujya ku Isi Yose',
        value_fr: 'Votre partenaire de voyage de confiance du Rwanda vers le monde',
        type: 'text'
      },
      {
        key: 'primary_phone',
        value_en: '+250 XXX XXX XXX',
        value_rw: '+250 XXX XXX XXX',
        value_fr: '+250 XXX XXX XXX',
        type: 'text'
      },
      {
        key: 'whatsapp_number',
        value_en: '+250 XXX XXX XXX',
        value_rw: '+250 XXX XXX XXX',
        value_fr: '+250 XXX XXX XXX',
        type: 'text'
      },
      {
        key: 'email',
        value_en: 'info@weofyoutravel.com',
        value_rw: 'info@weofyoutravel.com',
        value_fr: 'info@weofyoutravel.com',
        type: 'text'
      },
      {
        key: 'office_address',
        value_en: 'Kigali, Rwanda',
        value_rw: 'Kigali, Rwanda',
        value_fr: 'Kigali, Rwanda',
        type: 'text'
      },
      {
        key: 'working_hours',
        value_en: 'Monday – Saturday, 8:00 AM – 6:00 PM',
        value_rw: 'Kuwa mbere – Kuwa gatandatu, 8:00 – 18:00',
        value_fr: 'Lundi – Samedi, 8h00 – 18h00',
        type: 'text'
      },
      {
        key: 'footer_text',
        value_en: 'Proudly serving travelers from Rwanda to the world. Licensed travel service provider.',
        value_rw: 'Twibarira kugufasha Abanyarwanda na benshi kunyura isi. Dufite lisansi zo gutanga serivisi z\'ingendo.',
        value_fr: 'Fiers de servir les voyageurs rwandais vers le monde. Fournisseur de services de voyage agréé.',
        type: 'text'
      }
    ];

    for (const setting of globalSettings) {
      const { error } = await supabase.from('cms_global_settings').upsert(
        { ...setting, updated_at: new Date() },
        { onConflict: 'key' }
      );
      if (error) console.error('Error seeding global setting:', error);
    }
    console.log('✓ Global settings seeded\n');

    // 2. SEED PAGES
    console.log('Seeding pages...');
    const pages = [
      {
        page_key: 'home',
        title_en: 'Home',
        title_rw: 'Ahabanza',
        title_fr: 'Accueil',
        slug: 'home',
        status: 'published'
      },
      {
        page_key: 'services',
        title_en: 'Our Services',
        title_rw: 'Serivisi Dutanga',
        title_fr: 'Nos Services',
        slug: 'services',
        status: 'published'
      },
      {
        page_key: 'about',
        title_en: 'About Us',
        title_rw: 'Uko Ari Untu',
        title_fr: 'À Propos',
        slug: 'about',
        status: 'published'
      },
      {
        page_key: 'contact',
        title_en: 'Contact',
        title_rw: 'Twandikire',
        title_fr: 'Contactez-nous',
        slug: 'contact',
        status: 'published'
      },
      {
        page_key: 'faq',
        title_en: 'Frequently Asked Questions',
        title_rw: 'Ibibazo Bikunze Kubazwa',
        title_fr: 'Questions Fréquentes',
        slug: 'faq',
        status: 'published'
      }
    ];

    const { data: pageData, error: pageError } = await supabase
      .from('cms_pages')
      .upsert(pages, { onConflict: 'page_key' });
    if (pageError) console.error('Error seeding pages:', pageError);
    console.log('✓ Pages seeded\n');

    // 3. SEED SERVICES
    console.log('Seeding services...');
    const services = [
      {
        title_en: 'International Flight Booking',
        title_rw: 'Gutegura Amatike y\'Indege Mpuzamahanga',
        title_fr: 'Réservation de vols internationaux',
        slug: 'international-flight-booking',
        short_description_en: 'Find the best routes and fares from Kigali to destinations worldwide',
        short_description_rw: 'Reba inzira nziza n\'imyandiko yitoroshye kuva Kigali',
        short_description_fr: 'Trouvez les meilleurs itinéraires et tarifs depuis Kigali',
        full_description_en: 'We help you find the best routes and fares from Kigali to destinations worldwide, including flexible options for transit visas and preferred airlines.',
        full_description_rw: 'Dufasha kubona inzira nziza kandi imyandiko yiza kuva Kigali n\'ingendo zibiri zitoroshye.',
        full_description_fr: 'Nous vous aidons à trouver les meilleurs itinéraires et tarifs depuis Kigali vers le monde entier.',
        icon: 'Plane',
        status: 'active',
        order_index: 1
      },
      {
        title_en: 'Visa Assistance',
        title_rw: 'Gufasha Gusaba Visa',
        title_fr: 'Assistance pour les visas',
        slug: 'visa-assistance',
        short_description_en: 'Expert guidance for visa applications to any destination',
        short_description_rw: 'Ubuyobozi bwiza bw\'isimu nzira zo gusaba visa',
        short_description_fr: 'Assistance d\'experts pour les demandes de visa',
        full_description_en: 'From simple tourist visas to complex Schengen, UK, and US applications, our team guides you step by step to reduce errors and delays.',
        full_description_rw: 'Kuva kuri visa y\'iyisitorero kugera ku Schengen, UK n\'US, umurwanwa wacu akurikirana neza.',
        full_description_fr: 'De simples visas touristiques aux demandes complexes Schengen, UK et US, notre équipe vous guide étape par étape.',
        icon: 'Passport',
        status: 'active',
        order_index: 2
      },
      {
        title_en: 'Corporate & NGO Travel',
        title_rw: 'Ingendo z\'Amatsinda n\'Ibigo',
        title_fr: 'Voyages d\'entreprise et d\'ONG',
        slug: 'corporate-travel',
        short_description_en: 'Professional travel management for businesses and organizations',
        short_description_rw: 'Ubuyobozi bwiza bw\'ingendo z\'amatsinda',
        short_description_fr: 'Gestion professionnelle des voyages d\'entreprise',
        full_description_en: 'We manage business travel for companies, NGOs, and government-related organizations with policy compliance and cost control.',
        full_description_rw: 'Dufasha amatsinda, ibigo n\'ayo gucuruza leta mu ngendo zabo zijyanye n\'akazi.',
        full_description_fr: 'Nous gérons les voyages d\'affaires pour les entreprises, les ONG et les organisations gouvernementales.',
        icon: 'Briefcase',
        status: 'active',
        order_index: 3
      },
      {
        title_en: 'Holiday & Group Packages',
        title_rw: 'Paki z\'Amahoro n\'Amatsinda',
        title_fr: 'Forfaits vacances et groupes',
        slug: 'group-packages',
        short_description_en: 'Customized travel packages for families and communities',
        short_description_rw: 'Paki z\'ingendo zihendutse kumurire n\'amatsinda',
        short_description_fr: 'Forfaits de voyage personnalisés pour les familles',
        full_description_en: 'Customized travel packages for families, communities, churches, and associations, planned around Rwandan holidays and travel seasons.',
        full_description_rw: 'Paki zihendutse kumurire, amatsinda, ibisabwisigize n\'ayo guhuza abantu, ziteganyagihe ku masibuko a Rwanda.',
        full_description_fr: 'Forfaits personnalisés pour les familles, communautés, églises et associations, planifiés autour des vacances rwandaises.',
        icon: 'Users',
        status: 'active',
        order_index: 4
      }
    ];

    const { error: serviceError } = await supabase.from('cms_services').insert(services);
    if (serviceError) console.error('Error seeding services:', serviceError);
    console.log('✓ Services seeded\n');

    // 4. SEED DESTINATIONS
    console.log('Seeding destinations...');
    const destinations = [
      {
        name_en: 'France',
        name_rw: 'Ubufaransa',
        name_fr: 'France',
        visa_info_en: 'Schengen visa required. Processing: 5-15 days',
        visa_info_rw: 'Hakenewe visa ya Schengen. Ibyo bisoza: 5-15 amasaha',
        visa_info_fr: 'Visa Schengen requis. Délai: 5-15 jours',
        cultural_tips_en: 'Learn basic French phrases. Respect dining etiquette. Tipping is not mandatory.',
        cultural_tips_rw: 'Menya amagambo y\'Igifaransa. Guhanga neza mumasomo. Kuha ubwenge ntibisabwa.',
        cultural_tips_fr: 'Apprenez des phrases de base en français. Respectez l\'étiquette des repas.',
        flight_routes: 'Via Brussels, Paris, or Amsterdam from Kigali',
        safety_notes_en: 'Safe for travelers. Use public transport. Avoid isolated areas at night.',
        safety_notes_rw: 'Harinzira neza. Gukoresheni imodoka y\'abandi. Wera aho hasigaye gitare.',
        safety_notes_fr: 'Sûr pour les voyageurs. Utilisez les transports publics.',
        food_notes_en: 'Try local cheese, wine, and pastries. Cuisine is world-famous.',
        food_notes_rw: 'Ryamka isi n\'inzira. Ibyo bidya bikira icyiza kuri isi.',
        food_notes_fr: 'Essayez le fromage local, le vin et les pâtisseries.',
        status: 'active',
        order_index: 1
      },
      {
        name_en: 'Turkey',
        name_rw: 'Ubuturukiya',
        name_fr: 'Turquie',
        visa_info_en: 'E-Visa available. Processing: Instant online',
        visa_info_rw: 'E-Visa ihari. Ibyo bisoza: Bigeze inyanya',
        visa_info_fr: 'E-Visa disponible. Traitement: Instantané en ligne',
        cultural_tips_en: 'Halal food widely available. Remove shoes when entering homes. Haggle in markets.',
        cultural_tips_rw: 'Ibyo bidya bitanzi biri habanza. Hosura isapato mu nzu. Gubikinana ku masoko.',
        cultural_tips_fr: 'Nourriture halal largement disponible. Ôtez vos chaussures en entrant chez quelqu\'un.',
        flight_routes: 'Via Addis Ababa or Doha from Kigali',
        safety_notes_en: 'Generally safe. Use official taxis. Avoid political discussions.',
        safety_notes_rw: 'Arinzira neza. Gukoresheni taxi y\'abasirikare. Wera ibibazo bya politiki.',
        safety_notes_fr: 'Généralement sûr. Utilisez les taxis officiels.',
        food_notes_en: 'Kebab, baklava, Turkish tea. Istanbul street food is exceptional.',
        food_notes_rw: 'Kebab, baklava, icyayi cy\'Ubuturukiya. Ibyo bidya bya Istanbul bir\'icyiza.',
        food_notes_fr: 'Kebab, baklava, thé turc. La cuisine de rue à Istanbul est exceptionnelle.',
        status: 'active',
        order_index: 2
      },
      {
        name_en: 'Maldives',
        name_rw: 'Umaldive',
        name_fr: 'Maldives',
        visa_info_en: 'Visa on arrival for Rwandans. 30 days free',
        visa_info_rw: 'Visa kugaruka mu mahoro. Imisiyike 30 isigure',
        visa_info_fr: 'Visa à l\'arrivée pour les Rwandais. 30 jours gratuits',
        cultural_tips_en: 'Respect Islamic customs. Alcohol only in resorts. Dress modestly.',
        cultural_tips_rw: 'Guhanga amasezerano y\'Imisiyike. Inyamazumuzu-ubwenge mu mashumi. Gakinga neza.',
        cultural_tips_fr: 'Respectez les coutumes islamiques. L\'alcool uniquement dans les stations.',
        flight_routes: 'Via Doha, Dubai, or Addis Ababa from Kigali',
        safety_notes_en: 'Very safe. Resort security excellent. Water sports are regulated.',
        safety_notes_rw: 'Arinzira neza cyane. Umutekano w\'ubwoto wari munini. Imikino y\'amazi isimbuye.',
        safety_notes_fr: 'Très sûr. La sécurité des stations est excellente.',
        food_notes_en: 'Fresh seafood, rice, coconut. Tuna is a staple. Resort dining is diverse.',
        food_notes_rw: 'Inyamigé z\'amazi, rizii, coconuti. Inyama yikeri ni ikintu cyangwa. Ibyo bidya bya ubwoto byiruza neza.',
        food_notes_fr: 'Fruits de mer frais, riz, noix de coco. Le thon est une base.',
        status: 'active',
        order_index: 3
      }
    ];

    const { error: destError } = await supabase.from('cms_destinations').insert(destinations);
    if (destError) console.error('Error seeding destinations:', destError);
    console.log('✓ Destinations seeded\n');

    // 5. SEED TESTIMONIALS
    console.log('Seeding testimonials...');
    const testimonials = [
      {
        customer_name: 'Jean Paul M.',
        customer_title: 'Business Traveler',
        customer_location: 'Kigali',
        message_en: 'The visa process was well explained and stress-free. I felt supported from start to finish.',
        message_rw: 'Inzira ya visa yabonekaga neza kandi nari habana ubwanzi. Nkurikiriwe mwiza kuva gutangira.',
        message_fr: 'Le processus de visa était bien expliqué et sans stress. J\'ai senti du soutien du début à la fin.',
        is_featured: true,
        status: 'active',
        order_index: 1
      },
      {
        customer_name: 'Aline U.',
        customer_title: 'Corporate Travel Manager',
        customer_location: 'Kigali',
        message_en: 'They handled our company travel professionally and respected our budget constraints.',
        message_rw: 'Bafashije ingendo z\'ikigo c\'ikayi mu nzira nziza kandi bahagaze imigabire yacu.',
        message_fr: 'Ils ont géré les voyages de notre entreprise de manière professionnelle et ont respecté notre budget.',
        is_featured: true,
        status: 'active',
        order_index: 2
      },
      {
        customer_name: 'David K.',
        customer_title: 'International Student',
        customer_location: 'Butare',
        message_en: 'Excellent support for my study visa. Clear documentation guidance made the process smooth.',
        message_rw: 'Gufasha neza iyi visa yo kwiga. Imigabire yakagaragara yagushushanya inzira.',
        message_fr: 'Excellent soutien pour mon visa étudiant. L\'orientation documentaire claire a rendu le processus facile.',
        is_featured: false,
        status: 'active',
        order_index: 3
      }
    ];

    const { error: testError } = await supabase.from('cms_testimonials').insert(testimonials);
    if (testError) console.error('Error seeding testimonials:', testError);
    console.log('✓ Testimonials seeded\n');

    // 6. SEED PACKAGES
    console.log('Seeding packages...');
    const packages = [
      {
        title_en: 'Dubai Holiday Package',
        title_rw: 'Paki y\'Amahoro Ajya Dubai',
        title_fr: 'Forfait vacances à Dubaï',
        duration: '5 Days / 4 Nights',
        includes_en: 'Flights, 4-star hotel, airport transfers, city tour, shopping time',
        includes_rw: 'Indege, ubwoto, inyamakungu, iyisitorero ry\'umujyi, igihe cyo kuguza',
        includes_fr: 'Vols, hôtel 4 étoiles, transferts aéroport, visite de la ville',
        price_rwf: 3500000,
        price_usd: 2500,
        status: 'active',
        order_index: 1
      },
      {
        title_en: 'Student Study Visa Support',
        title_rw: 'Gufasha Gusaba Visa yo Kwiga',
        title_fr: 'Support pour visa étudiant',
        duration: 'Flexible',
        includes_en: 'Visa guidance, document preparation, acceptance letter arrangement, travel booking',
        includes_rw: 'Ubuyobozi bw\'icyumbo, kutekereza inyandiko, gutegura ibaruwa, gutegura ingendo',
        includes_fr: 'Orientation visa, préparation des documents, arrangement de lettres d\'acceptation',
        price_rwf: 450000,
        price_usd: 300,
        status: 'active',
        order_index: 2
      },
      {
        title_en: 'European Grand Tour',
        title_rw: 'Urugendo Runini rw\'Uburayi',
        title_fr: 'Grand Tour Européen',
        duration: '10 Days / 9 Nights',
        includes_en: 'Flights, multi-country Schengen visa, hotels, guided tours, travel insurance',
        includes_rw: 'Indege, visa ya Schengen, ubwoto, iyisitorero ry\'abayobozi, ubwishingizi',
        includes_fr: 'Vols, visa Schengen multi-pays, hôtels, visites guidées, assurance voyage',
        price_rwf: 7500000,
        price_usd: 5000,
        status: 'active',
        order_index: 3
      }
    ];

    const { error: pkgError } = await supabase.from('cms_packages').insert(packages);
    if (pkgError) console.error('Error seeding packages:', pkgError);
    console.log('✓ Packages seeded\n');

    // 7. SEED FAQs
    console.log('Seeding FAQs...');
    const faqs = [
      {
        question_en: 'Do you guarantee visa approval?',
        question_rw: 'Ese mwemeza kubona visa?',
        question_fr: 'Garantissez-vous l\'obtention du visa ?',
        answer_en: 'No, but we ensure correct documentation and professional guidance to maximize your chances.',
        answer_rw: 'Oya, ariko tugufasha gutegura dosiye neza kandi tubayobora neza kugira ubwenge bwo kubona visa.',
        answer_fr: 'Non, mais nous assurons une bonne préparation du dossier et une guidance professionnelle.',
        category: 'Visa',
        status: 'active',
        order_index: 1
      },
      {
        question_en: 'Can I pay using Mobile Money?',
        question_rw: 'Ese nshobora kubikora ukoresheje Imari ya Simu?',
        question_fr: 'Puis-je payer par mobile money ?',
        answer_en: 'Yes. We accept MTN Mobile Money, Airtel Money, and bank transfers in RWF and USD.',
        answer_rw: 'Yego. Dwerekeza MTN Mobile Money, Airtel Money, n\'iyiko ry\'imari.',
        answer_fr: 'Oui. Nous acceptons MTN Mobile Money, Airtel Money et virements bancaires.',
        category: 'Payments',
        status: 'active',
        order_index: 2
      },
      {
        question_en: 'What payment plans are available?',
        question_rw: 'Ni ihe myaka y\'imari ihari?',
        question_fr: 'Quels plans de paiement sont disponibles ?',
        answer_en: 'We offer flexible payment plans. Full upfront, 50/50 split, or installments over 3 months.',
        answer_rw: 'Dufasha imigabire itandukanye. Yose ahamburo, igice 50/50, cyangwa mu mahinda atarimwe.',
        answer_fr: 'Nous proposons des plans de paiement flexibles. Totalité à l\'avance, 50/50 ou versements.',
        category: 'Payments',
        status: 'active',
        order_index: 3
      },
      {
        question_en: 'How long does visa processing take?',
        question_rw: 'Ibyo visa bisoza icyahe cyitoroshye?',
        question_fr: 'Combien de temps prend le traitement du visa ?',
        answer_en: 'Processing times vary by country. Tourist visas: 3-7 days. Work/Study: 2-4 weeks. We provide estimates.',
        answer_rw: 'Ibyo bisoza bitegekanye ku gihugu. Visa y\'iyisitorero: 3-7 amasaha. Kwiga: 2-4 imibare. Tubika imigabire.',
        answer_fr: 'Les délais varient selon le pays. Visas touristiques: 3-7 jours. Travail/Études: 2-4 semaines.',
        category: 'Visa',
        status: 'active',
        order_index: 4
      }
    ];

    const { error: faqError } = await supabase.from('cms_faqs').insert(faqs);
    if (faqError) console.error('Error seeding FAQs:', faqError);
    console.log('✓ FAQs seeded\n');

    console.log('✅ CMS seed completed successfully!');
    console.log('All pages, services, destinations, testimonials, packages, and FAQs are ready.');
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seedCMS();
