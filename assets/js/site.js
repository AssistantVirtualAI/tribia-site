/* Tribia — site vitrine (vanilla JS). */
(function () {
  'use strict';

  /* L'adresse de l'application : une seule constante. */
  var APP_URL = 'https://app.tribia.ai';

  document.documentElement.classList.add('js');
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  /* ---------- Données (miroir de src/domain/plans.ts) ---------- */
  var PLANS = {
    trial:      { id: 'trial', space: 'both', price: 0, seats: 7, humans: 1, energy: 300, channel: 'apps+web' },
    showcase:   { id: 'showcase', space: 'both', price: 0, seats: 2, humans: 1, energy: 20, channel: 'apps+web' },
    essential:  { id: 'essential', space: 'home', price: 7.99, seats: 3, humans: 1, kids: 0, energy: 200, channel: 'apps+web' },
    home:       { id: 'home', space: 'home', price: 14.99, seats: 5, humans: 1, kids: 1, energy: 400, channel: 'apps+web' },
    family:     { id: 'family', space: 'home', price: 24.99, seats: 8, humans: 4, kids: 2, energy: 750, channel: 'apps+web', featured: true },
    family_plus:{ id: 'family_plus', space: 'home', price: 39.99, seats: 12, humans: 6, kids: 4, energy: 1400, channel: 'apps+web' },
    tribe:      { id: 'tribe', space: 'home', price: 59.99, seats: 16, humans: 8, kids: 6, energy: 2200, channel: 'apps+web' },
    solo:       { id: 'solo', space: 'work', price: 49, seats: 7, humans: 1, energy: 2000, channel: 'web', featured: true },
    pme:        { id: 'pme', space: 'work', price: 149, seats: 19, humans: 3, energy: 6500, channel: 'web' },
    enterprise: { id: 'enterprise', space: 'work', price: 399, seats: 37, humans: 10, energy: 17000, channel: 'web' },
    agency:     { id: 'agency', space: 'work', price: 899, seats: 60, humans: 15, energy: 38000, channel: 'web' }
  };
  var PLAN_TXT = {
    trial: { ico: '🎁', fr: ['Essai 14 jours', 'Tout pour essayer ta tribu, Travail ou Maison.'], en: ['14-day trial', 'Everything you need to try your tribe, Work or Home.'] },
    showcase: { ico: '🌙', fr: ['Vitrine', 'Ton monde reste là, tes agents dorment.'], en: ['Showcase', 'Your world stays, your agents nap.'] },
    essential: { ico: '🌱', fr: ['Essentiel', 'Un majordome et 2 agents pour une personne seule.'], en: ['Essential', 'A butler and 2 agents for one person.'] },
    home: { ico: '🏠', fr: ['Maison', 'Un majordome, 4 agents et un tuteur pour un enfant.'], en: ['Home', 'A butler, 4 agents and a tutor for one kid.'] },
    family: { ico: '👨‍👩‍👧', fr: ['Famille', 'Toute la famille, avec tuteurs et contrôle parental.'], en: ['Family', 'The whole family, with tutors and parental controls.'] },
    family_plus: { ico: '👨‍👩‍👧‍👦', fr: ['Famille+', 'Pour les familles nombreuses : 4 enfants, 6 adultes.'], en: ['Family+', 'For big families: 4 kids, 6 adults.'] },
    tribe: { ico: '🏡', fr: ['Grande tribu', 'Famille élargie, garde partagée, grands-parents : tout le monde.'], en: ['Big tribe', 'Extended family, shared custody, grandparents: everyone.'] },
    solo: { ico: '💼', fr: ['Solo', 'Ta première vraie équipe : CEO, superviseur, 5 agents.'], en: ['Solo', 'Your first real team: CEO, supervisor, 5 agents.'] },
    pme: { ico: '🏢', fr: ['PME', 'Trois équipes complètes pour une petite entreprise.'], en: ['SMB', 'Three full teams for a small business.'] },
    enterprise: { ico: '🏛️', fr: ['Entreprise', 'Une organisation entière, six équipes.'], en: ['Enterprise', 'A whole organization, six teams.'] },
    agency: { ico: '🚀', fr: ['Agence', '60 postes en marque blanche pour tes clients.'], en: ['Agency', '60 white-label seats for your clients.'] }
  };
  var SEATS_TXT = {
    trial: { fr: 'postes pour essayer', en: 'seats to try it out' },
    showcase: { fr: 'postes', en: 'seats' },
    essential: { fr: 'Majordome + 2 agents', en: 'Butler + 2 agents' },
    home: { fr: 'Majordome + 4 agents', en: 'Butler + 4 agents' },
    family: { fr: 'Majordome + 7 agents', en: 'Butler + 7 agents' },
    family_plus: { fr: 'Majordome + 11 agents', en: 'Butler + 11 agents' },
    tribe: { fr: 'Majordome + 15 agents', en: 'Butler + 15 agents' },
    solo: { fr: 'CEO + 1 superviseur + 5 agents', en: 'CEO + 1 supervisor + 5 agents' },
    pme: { fr: 'CEO + 3 superviseurs + 15 agents', en: 'CEO + 3 supervisors + 15 agents' },
    enterprise: { fr: 'CEO + 6 superviseurs + 30 agents', en: 'CEO + 6 supervisors + 30 agents' },
    agency: { fr: 'Marque blanche', en: 'White label' }
  };
  var ADDONS = [
    { id: 'extra_agent_work', ico: '👤', price: 9, energy: 150, fr: ['Agent supplémentaire Travail', '+1 poste · +150 énergie'], en: ['Extra Work agent', '+1 seat · +150 energy'] },
    { id: 'extra_agent_home', ico: '🏠', price: 3.99, energy: 50, fr: ['Agent supplémentaire Maison', '+1 poste · +50 énergie'], en: ['Extra Home agent', '+1 seat · +50 energy'] },
    { id: 'ceo_voice', ico: '🎙️', price: 12.99, fr: ['Voix du CEO', 'Rapport vocal quotidien'], en: ['CEO voice', 'Daily spoken report'] },
    { id: 'live_call', ico: '📞', price: 19, fr: ['Appel vocal en direct', '60 minutes'], en: ['Live voice call', '60 minutes'] },
    { id: 'receptionist', ico: '☎️', price: 69, fr: ['Réceptionniste téléphonique AVA', 'Numéro + 200 minutes'], en: ['AVA phone receptionist', 'Number + 200 minutes'] },
    { id: 'social_pack', ico: '📣', price: 14.99, fr: ['Pack Réseaux sociaux', 'Facebook, Instagram, LinkedIn, X'], en: ['Social media pack', 'Facebook, Instagram, LinkedIn, X'] },
    { id: 'memory_2y', ico: '🧠', price: 5, fr: ['Mémoire étendue 2 ans', '+ coffre Loi 25'], en: ['Extended 2-year memory', '+ Law 25 vault'] },
    { id: 'premium_skill', ico: '🏅', price: 7.99, fr: ['Skill Premium vérifiée', 'Par skill'], en: ['Verified premium skill', 'Per skill'] },
    { id: 'season_pass', ico: '👕', price: 4.99, oneTime: true, fr: ['Passe saison cosmétique', 'Uniformes et mascottes, 3 mois'], en: ['Cosmetic season pass', 'Uniforms and mascots, 3 months'] }
  ];
  var RECHARGES = [{ energy: 1000, price: 19 }, { energy: 5000, price: 85 }, { energy: 20000, price: 319 }];
  var TASK_ENERGY = { quick: 1, standard: 5, expert: 20, strategy: 60 };
  var DAILY_CAP_RATIO = 0.15, ROLLOVER_RATIO = 0.25;
  var SIZES = [
    { k: 'quick', fr: ['Rapide', 'Trier un courriel, répondre à une question simple.'], en: ['Quick', 'Sort an email, answer a simple question.'] },
    { k: 'standard', fr: ['Standard', 'Rédiger un courriel, créer une fiche CRM.'], en: ['Standard', 'Draft an email, create a CRM record.'] },
    { k: 'expert', fr: ['Expert', 'Trouver 20 PME qualifiées, analyse détaillée. Coût affiché avant.'], en: ['Expert', 'Find 20 qualified SMBs, in-depth analysis. Cost shown first.'] },
    { k: 'strategy', fr: ['Stratégie', 'Un plan de campagne complet, de A à Z.'], en: ['Strategy', 'A complete campaign plan, A to Z.'] }
  ];
  var VIDEOS = [
    { id: 'presentation', part: 'work', file: 'tribia-presentation', dur: '1:00', fr: ['La présentation', 'Tribia en une minute : la compagnie, la maison, le toc toc.'], en: ['The overview', 'Tribia in one minute: the company, the home, the knock-knock.'] },
    { id: '1', part: 'work', file: 'tribia-1-idee', dur: '1:00', fr: ['L’idée', 'Et si tes agents IA avaient un bureau, un patron… et une vie ?'], en: ['The idea', 'What if your AI agents had an office, a boss… and a life?'] },
    { id: '2', part: 'work', file: 'tribia-2-travail', dur: '1:00', fr: ['Le mode Travail', '5 exemples concrets : ventes, réseaux, CRM, finances, recrutement.'], en: ['Work mode', '5 real examples: sales, social, CRM, finance, hiring.'] },
    { id: '3', part: 'home', file: 'tribia-3-maison', dur: '1:00', fr: ['Maison et famille', 'Majordome, tuteur, repas, budget : chacun sa pièce.'], en: ['Home and family', 'Butler, tutor, meals, budget: everyone has a room.'] },
    { id: '4', part: 'work', file: 'tribia-4-forfaits', dur: '1:00', fr: ['Forfaits et énergie', 'Des postes fixes + de l’énergie = aucune surprise.'], en: ['Plans and energy', 'Fixed seats + energy = no surprises.'] },
    { id: '5', part: 'work', file: 'tribia-5-journee-travail', dur: '1:38', fr: ['Une vraie journée au bureau', 'De 7 h 55 au rapport du soir, minute par minute.'], en: ['A real day at the office', 'From 7:55 a.m. to the evening report, minute by minute.'] },
    { id: '6', part: 'home', file: 'tribia-6-journee-maison', dur: '1:40', fr: ['Une journée à la maison', 'Épicerie, dentiste, devoirs, budget : réglés.'], en: ['A day at home', 'Groceries, dentist, homework, budget: done.'] },
    { id: '7', part: 'home', file: 'tribia-7-tuteur-enfants', dur: '2:30', fr: ['Tutoriel : le tuteur des enfants', 'Missions du parent, photo de la leçon, quiz, étoiles et NIP.'], en: ['Tutorial: the kids’ tutor', 'Parent missions, lesson photo, quiz, stars and PIN.'] },
    { id: '8', part: 'home', file: 'tribia-8-maison-photos', dur: '1:13', fr: ['Tutoriel : une photo, et c’est réglé', 'Frigo, garde-manger, reçus et budget, avis d’école, bris dans la maison.'], en: ['Tutorial: one photo, and it’s handled', 'Fridge, pantry, receipts and budget, school notices, home repairs.'] },
    { id: '9', part: 'home', file: 'tribia-9-maison-famille', dur: '1:58', fr: ['Tutoriel : toute la famille, organisée', 'Mémo vocal, ta semaine, demain matin, anniversaires, garde partagée, tâches, anglais oral.'], en: ['Tutorial: the whole family, organized', 'Voice memo, your week, tomorrow morning, birthdays, shared custody, chores, speaking practice.'] }
  ];
  /* Ordre d'affichage par partie (le premier est mis en vedette) */
  var VORDER = { work: ['presentation', '1', '2', '5', '4'], home: ['7', '8', '9', '3', '6'] };
  /* Flyers : captures de l'app (assets/flyers/<img>[-en].jpg) */
  var FLYERS = {
    work: [
      ['w-ceo', '👑', 'violet', 'Ton CEO comprend avant d’agir', 'Il pose 1 à 3 questions, puis découpe la demande pour son équipe.', 'Your CEO understands first', 'Asks 1 to 3 questions, then splits the request for the team.'],
      ['w-quote', '🧾', 'sun', 'Un devis d’énergie, avant', 'Pour les grosses tâches, tu vois le coût et tu lances… ou pas.', 'An energy quote, upfront', 'For big tasks you see the cost and decide to go… or not.'],
      ['w-live', '📡', 'mint', 'Tu les vois travailler', 'Chaque agent se déplace, travaille et annonce ce qu’il fait, en direct.', 'Watch them work', 'Each agent moves, works and says what they’re doing, live.'],
      ['w-feed', '💻', 'sky', 'Le fil en direct', 'Recherche web, Registre des entreprises, brouillons : tout est tracé.', 'The live feed', 'Web search, business registry, drafts: everything is logged.'],
      ['w-report', '📋', 'coral', 'Le rapport, présenté par ton CEO', 'Chaque agent explique son travail. En PDF ou par courriel.', 'The report, presented by your CEO', 'Each agent explains their work. As a PDF or by email.'],
      ['w-approvals', '✋', 'pink', 'Rien ne part sans ton OK', 'Courriels, publications, rendez-vous : tu approuves d’un clic.', 'Nothing goes out without your OK', 'Emails, posts, bookings: one click to approve.'],
      ['w-calls', '📞', 'violet', 'La réceptionniste AVA', 'Elle répond 24/7, résume l’appel et le CEO crée le suivi.', 'The AVA receptionist', 'Answers 24/7, sums up the call and the CEO creates the follow-up.'],
      ['w-tools', '🔌', 'mint', '38 outils branchés', 'Gmail, Outlook, HubSpot, LinkedIn… et qui a accès à quoi.', '38 connected tools', 'Gmail, Outlook, HubSpot, LinkedIn… and who can use what.'],
      ['w-team', '👥', 'sun', 'Une vraie équipe', 'CEO, superviseurs (1 pour 5 agents), 1:1 et réunions.', 'A real team', 'CEO, supervisors (1 per 5 agents), 1:1s and meetings.']
    ],
    home: [
      ['h-quiz', '📚', 'violet', 'Le tuteur des enfants', 'Missions du parent, quiz, indices sans réponses, étoiles.', 'The kids’ tutor', 'Parent missions, quizzes, hints not answers, stars.'],
      ['h-oral', '🗣️', 'sky', 'Pratique orale', 'L’enfant parle au micro, le tuteur corrige une chose à la fois.', 'Speaking practice', 'The child speaks into the mic, the tutor fixes one thing at a time.'],
      ['h-chores', '🧺', 'mint', 'Tâches ménagères', 'L’enfant coche, tu valides, il gagne des étoiles.', 'Chores', 'The kid checks off, you approve, they earn stars.'],
      ['h-fridge', '🧊', 'sky', 'Photo du frigo', 'Repas de la semaine avec ce que tu as + liste d’épicerie.', 'Fridge photo', 'This week’s meals from what you have + grocery list.'],
      ['h-pantry', '🥫', 'sun', 'Garde-manger anti-gaspillage', 'Ce qui expire bientôt, et un repas pour l’utiliser.', 'Anti-waste pantry', 'What expires soon, and a meal to use it.'],
      ['h-budget', '🧾', 'coral', 'Reçus → budget', 'Photo d’un reçu : classé par catégorie, abonnements oubliés repérés.', 'Receipts → budget', 'Snap a receipt: sorted by category, forgotten subscriptions spotted.'],
      ['h-notice', '🏫', 'violet', 'Avis de l’école', 'Résumé, choses à signer ou payer, dates à ton agenda.', 'School notices', 'Summary, things to sign or pay, dates to your calendar.'],
      ['h-repair', '🔧', 'pink', 'Quelque chose de brisé', 'Sécurité, ce que tu peux faire, 3 pros proches, courriel de soumission.', 'Something broken', 'Safety, what you can do, 3 local pros, quote request email.'],
      ['h-memo', '🎙️', 'mint', 'Mémo vocal à Gaston', 'Parle : rendez-vous, épicerie et anniversaires sont rangés.', 'Voice memo to Gaston', 'Talk: appointments, groceries and birthdays get filed.'],
      ['h-weekly', '📰', 'sun', 'Ta semaine du dimanche', 'Rendez-vous, école, repas, fêtes et budget en une page, lue à voix haute.', 'Your Sunday briefing', 'Appointments, school, meals, birthdays and budget on one page, read aloud.'],
      ['h-morning', '🎒', 'sky', 'Demain matin', 'Sac, lunch et vêtements selon l’école et la météo.', 'Tomorrow morning', 'Bag, lunch and clothes based on school and the weather.'],
      ['h-gifts', '🎂', 'coral', 'Anniversaires et cadeaux', 'Rappel 2 semaines avant + idées dans ton budget.', 'Birthdays and gifts', 'Reminder 2 weeks ahead + ideas within your budget.'],
      ['h-custody', '👨‍👩‍👧', 'violet', 'Garde partagée', 'Qui est où, jours d’échange, quoi apporter, l’autre parent invité.', 'Shared custody', 'Who’s where, handoff days, what to bring, the other parent invited.']
    ]
  };

  /* Planificateur d'énergie : miroir de src/domain/usage.ts */
  var USAGE = [
    ['menu', 'home', '🍽️', 'Menu de la semaine + liste d’épicerie', 'Weekly menu + grocery list', 5, 4, 8],
    ['fridge', 'home', '🧊', 'Photo du frigo → idées de repas', 'Fridge photo → meal ideas', 5, 4, 30],
    ['notice', 'home', '🏫', 'Avis de l’école → résumé + agenda', 'School notice → summary + calendar', 5, 4, 20],
    ['mission', 'home', '📚', 'Mission de devoirs préparée par le tuteur', 'Homework mission prepared by the tutor', 5, 12, 60, 1],
    ['scan', 'home', '📸', 'Leçon du jour scannée par l’enfant', 'Today’s lesson scanned by the kid', 5, 8, 40, 1],
    ['kidq', 'home', '💬', 'Question libre au tuteur (si permise)', 'Free question to the tutor (if allowed)', 1, 20, 200, 1],
    ['kidnote', 'home', '📝', 'Bilan de progrès pour le parent', 'Progress note for the parent', 1, 4, 30, 1],
    ['remind', 'home', '⏰', 'Rappel ou rendez-vous à l’agenda', 'Reminder or calendar appointment', 1, 20, 120],
    ['mail', 'home', '✉️', 'Courriel à rédiger (garderie, prof, proprio)', 'Email to write (daycare, teacher, landlord)', 1, 8, 60],
    ['budget', 'home', '💰', 'Revue du budget du mois', 'Monthly budget review', 20, 1, 4],
    ['quotes', 'home', '🔨', 'Comparer des soumissions (réno, assurance)', 'Compare quotes (reno, insurance)', 20, 0, 6],
    ['party', 'home', '🎂', 'Organiser une fête d’anniversaire', 'Plan a birthday party', 20, 0, 4],
    ['trip', 'home', '✈️', 'Planifier un voyage en famille', 'Plan a family trip', 60, 0, 3],
    ['routine', 'home', '🚶', 'Routine marche / sommeil (suivi quotidien)', 'Walking / sleep routine (daily check-in)', 1, 0, 31],
    ['care', 'home', '👵', 'Coordonner les soins d’un parent âgé', 'Coordinate care for an aging parent', 5, 0, 20],
    ['house', 'home', '🏠', 'Entretien de la maison (rappels + fournisseurs)', 'Home upkeep (reminders + contractors)', 5, 2, 10],
    ['leads', 'work', '🔎', 'Trouver 20 prospects qualifiés', 'Find 20 qualified prospects', 20, 4, 40],
    ['reply', 'work', '📩', 'Répondre à un courriel client', 'Answer a customer email', 1, 200, 2000],
    ['post', 'work', '📣', 'Publication réseaux sociaux', 'Social media post', 5, 12, 90],
    ['invoice', 'work', '🧾', 'Facture + relance de paiement', 'Invoice + payment reminder', 5, 20, 300],
    ['call', 'work', '📞', 'Appel pris par la réceptionniste AVA', 'Call taken by the AVA receptionist', 1, 100, 1500],
    ['crm', 'work', '🗂️', 'Mise à jour du CRM (lot de fiches)', 'CRM update (batch of records)', 5, 8, 100],
    ['cv', 'work', '👥', 'Trier 10 CV', 'Screen 10 résumés', 5, 2, 40],
    ['report', 'work', '📊', 'Rapport hebdomadaire', 'Weekly report', 5, 4, 20],
    ['strategy', 'work', '🧭', 'Analyse stratégique (concurrence, marché)', 'Strategic analysis (competition, market)', 60, 1, 10]
  ].map(function (r) { return { id: r[0], space: r[1], emoji: r[2], fr: r[3], en: r[4], energy: r[5], per: r[6], max: r[7], kid: !!r[8] }; });
  var PRESETS = [
    { id: 'solo', space: 'home', emoji: '🧑', fr: 'Seul·e, agenda chargé', en: 'Solo, busy schedule', kids: 0, counts: { menu: 4, fridge: 4, remind: 20, mail: 8, budget: 1, house: 2 } },
    { id: 'kids1', space: 'home', emoji: '👩‍👦', fr: 'Parent + 1 enfant au primaire', en: 'Parent + 1 kid in grade school', kids: 1, counts: { menu: 4, fridge: 4, notice: 4, mission: 12, scan: 8, kidnote: 4, remind: 20, mail: 6, budget: 1 } },
    { id: 'busy', space: 'home', emoji: '👨‍👩‍👧‍👦', fr: 'Famille occupée, 2 enfants', en: 'Busy family, 2 kids', kids: 2, counts: { menu: 4, fridge: 8, notice: 8, mission: 24, scan: 16, kidq: 30, kidnote: 8, remind: 40, mail: 10, budget: 1, party: 1, house: 2 } },
    { id: 'big', space: 'home', emoji: '🏡', fr: 'Grande famille + grand-parent', en: 'Big family + grandparent', kids: 4, counts: { menu: 4, fridge: 12, notice: 16, mission: 48, scan: 30, kidq: 60, kidnote: 16, remind: 60, mail: 16, budget: 2, party: 2, trip: 1, care: 8, house: 4 } },
    { id: 'freelance', space: 'work', emoji: '🧑‍💻', fr: 'Travailleur autonome', en: 'Freelancer', kids: 0, counts: { leads: 2, reply: 120, post: 8, invoice: 10, report: 4 } },
    { id: 'smb', space: 'work', emoji: '🏪', fr: 'PME de 10 employés', en: '10-employee SMB', kids: 0, counts: { leads: 8, reply: 600, post: 20, invoice: 80, call: 300, crm: 20, cv: 4, report: 4, strategy: 1 } }
  ];
  /* Exemples d'usage à la maison (section #maison) */
  var HOME_USES = [
    ['🧊', 5, 'Photo du frigo', 'Repas de la semaine avec ce que tu as déjà, ce qu’il faut utiliser en premier, et la liste d’épicerie.', 'Fridge photo', 'This week’s meals from what you already have, what to use first, and the grocery list.'],
    ['🏫', 5, 'Avis de l’école', 'Une photo de la feuille : résumé, choses à signer ou à payer, et les dates proposées à ton agenda.', 'School notice', 'Snap the letter: summary, things to sign or pay, and dates proposed for your calendar.'],
    ['📚', 5, 'Devoirs encadrés', 'Tu donnes la mission, le tuteur prépare leçon, quiz, cartes et dictée au bon niveau.', 'Guided homework', 'You set the mission, the tutor prepares the lesson, quiz, flashcards and spelling at the right level.'],
    ['🗓️', 1, 'Agenda familial', 'Dentiste, hockey, rencontre de parents : rappels pour tout le monde, sans oubli.', 'Family calendar', 'Dentist, hockey, parent-teacher night: reminders for everyone, nothing forgotten.'],
    ['💰', 20, 'Budget du mois', 'Le majordome classe les dépenses, repère les abonnements oubliés et propose des économies.', 'Monthly budget', 'The butler sorts expenses, spots forgotten subscriptions and suggests savings.'],
    ['🎂', 20, 'Fête d’anniversaire', 'Invitations, liste des achats, menu, horaire de la journée : tout est prêt.', 'Birthday party', 'Invitations, shopping list, menu, schedule for the day: all set.'],
    ['✈️', 60, 'Voyage en famille', 'Itinéraire jour par jour, budget, liste de bagages par enfant, réservations à approuver.', 'Family trip', 'Day-by-day itinerary, budget, packing list per kid, bookings for you to approve.'],
    ['🔨', 20, 'Rénos et soumissions', 'Compare trois soumissions, repère les écarts et prépare les questions à poser.', 'Renos and quotes', 'Compares three quotes, spots the gaps and prepares the questions to ask.'],
    ['👵', 5, 'Soins d’un parent âgé', 'Rendez-vous, médicaments à renouveler, appels à faire : coordonnés avec la fratrie.', 'Caring for a parent', 'Appointments, prescriptions to renew, calls to make: coordinated with siblings.'],
    ['🏠', 5, 'Entretien de la maison', 'Filtre de fournaise, pneus d’hiver, gouttières : rappels de saison et fournisseurs à contacter.', 'Home upkeep', 'Furnace filter, winter tires, gutters: seasonal reminders and contractors to call.'],
    ['✉️', 1, 'Courriels du quotidien', 'Garderie, propriétaire, prof : brouillons polis en français ou en anglais, envoyés après ton OK.', 'Everyday emails', 'Daycare, landlord, teacher: polite drafts in French or English, sent after your OK.'],
    ['🚶', 1, 'Routines santé', 'Marche, sommeil, eau : un petit suivi chaque jour, sans culpabiliser.', 'Healthy routines', 'Walking, sleep, water: a small daily check-in, guilt-free.']
  ];
  var LIVE = {
    fr: ['{ceo} découpe ta demande en 4 sous-tâches 👑', 'Max cherche 20 PME à Laval 🔎', 'Léa rédige 3 courriels FR/EN ✉️', 'Zoé met à jour les fiches CRM 📊', 'Nora valide le travail de Max ✅', 'Sam apprend une nouvelle skill pendant son temps libre 📚', '{maj} prépare la liste d’épicerie 🛒', 'Le chef planifie les soupers de la semaine 🍳', '{ceo} cogne à ta vitre : « Tu as 2 minutes ? » 👊'],
    en: ['{ceo} splits your request into 4 subtasks 👑', 'Max is finding 20 SMBs in Laval 🔎', 'Léa is drafting 3 FR/EN emails ✉️', 'Zoé is updating CRM records 📊', 'Nora approves Max’s work ✅', 'Sam is learning a new skill in free time 📚', '{maj} is putting together the grocery list 🛒', 'The chef is planning this week’s dinners 🍳', '{ceo} knocks on your screen: “Got 2 minutes?” 👊']
  };
  var T = {
    fr: {
      title: 'Tribia — Ta tribu IA, au bureau et à la maison',
      desc: 'Tribia : des employés IA virtuels que tu vois travailler. Un CEO, des superviseurs et des agents au bureau, un majordome à la maison. Essai gratuit 14 jours. Données hébergées au Canada.',
      perMonth: '/mois', taxes: 'taxes en sus', seats: 'postes', humans: function (n) { return n > 1 ? n + ' comptes humains' : '1 compte humain'; },
      energyMo: 'énergie / mois', web: 'Sur le web', apps: 'Applis + web', kids: function (n) { return n + ' profils enfants avec tuteur, contrôle parental'; },
      start: 'Commencer l’essai', popular: '★ Le plus populaire', free: 'Gratuit', oneTime: 'une fois', perK: function (p) { return p + ' par 1 000'; },
      energy: 'énergie', perMonthEnergy: 'énergie par mois', capDay: 'max par jour (15 %)', rollover: 'report max (25 %)',
      tasksOf: function (k) { return { quick: 'rapides', standard: 'standard', expert: 'expert', strategy: 'stratégie' }[k]; },
      tasksLbl: 'tâches', orLbl: 'Par exemple, chaque mois :', watch: 'Regarder', missing: 'Cette vidéo n’est pas incluse dans cet aperçu. Ouvre le site complet pour la lire.',
      vidOf: function (i, n) { return 'Vidéo ' + i + ' sur ' + n; }, playLbl: function (t) { return 'Lire la vidéo : ' + t; }, menu: 'Menu'
    },
    en: {
      title: 'Tribia — Your AI tribe, at work and at home',
      desc: 'Tribia: virtual AI employees you can watch at work. A CEO, supervisors and agents at the office, a butler at home. 14-day free trial. Data hosted in Canada.',
      perMonth: '/month', taxes: 'taxes extra', seats: 'seats', humans: function (n) { return n > 1 ? n + ' human accounts' : '1 human account'; },
      energyMo: 'energy / month', web: 'On the web', apps: 'Apps + web', kids: function (n) { return n + ' kid profiles with a tutor, parental controls'; },
      start: 'Start the trial', popular: '★ Most popular', free: 'Free', oneTime: 'one-time', perK: function (p) { return p + ' per 1,000'; },
      energy: 'energy', perMonthEnergy: 'energy per month', capDay: 'max per day (15%)', rollover: 'max rollover (25%)',
      tasksOf: function (k) { return { quick: 'quick', standard: 'standard', expert: 'expert', strategy: 'strategy' }[k]; },
      tasksLbl: 'tasks', orLbl: 'For example, each month:', watch: 'Watch', missing: 'This video isn’t included in this preview. Open the full site to play it.',
      vidOf: function (i, n) { return 'Video ' + i + ' of ' + n; }, playLbl: function (t) { return 'Play video: ' + t; }, menu: 'Menu'
    }
  };

  var lang = store('tribia-lang') === 'en' ? 'en' : 'fr';
  var names = { ceo: store('tribia-ceo') || 'Victor', maj: store('tribia-maj') || 'Gaston' };
  var space = 'work', vidIdx = 0;

  function num(n) { return new Intl.NumberFormat(lang === 'fr' ? 'fr-CA' : 'en-CA').format(n); }
  function money(n) {
    var s = new Intl.NumberFormat(lang === 'fr' ? 'fr-CA' : 'en-CA', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 }).format(n);
    return lang === 'fr' ? s + ' $' : '$' + s;
  }
  function appHref(src, plan) { return APP_URL + '/?lang=' + lang + (plan ? '&plan=' + plan : '') + '&utm_source=site&utm_content=' + src; }

  /* ---------- Langue ---------- */
  function applyLang() {
    var t = T[lang];
    document.documentElement.lang = lang;
    document.title = t.title;
    var md = $('meta[name="description"]'); if (md) md.setAttribute('content', t.desc);
    $$('[data-setlang]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-setlang') === lang)); });
    $$('[data-aria-' + lang + ']').forEach(function (el) { el.setAttribute('aria-label', el.getAttribute('data-aria-' + lang)); });
    $$('[data-alt-' + lang + ']').forEach(function (el) { el.setAttribute('alt', el.getAttribute('data-alt-' + lang)); });
    $('.burger').setAttribute('aria-label', t.menu);
    $$('a[data-app]').forEach(function (a) { a.href = appHref(a.getAttribute('data-app'), a.getAttribute('data-plan')); });
    renderPlans(); renderAddons(); renderSizes(); renderPlanner(); renderUses(); renderVideos(); renderFlyers(); tickLive(true);
    /* Une vidéo ouverte est relancée dans la nouvelle langue. */
    if (lb && lb.open) showVideo(vidIdx);
  }
  $$('[data-setlang]').forEach(function (b) {
    b.addEventListener('click', function () { lang = b.getAttribute('data-setlang'); store('tribia-lang', lang); applyLang(); });
  });

  /* ---------- Noms personnalisés ---------- */
  function applyNames() {
    $$('.n-ceo').forEach(function (el) { el.textContent = names.ceo; });
    $$('.n-maj').forEach(function (el) { el.textContent = names.maj; });
  }
  [['nameCeo', 'ceo', 'Victor'], ['nameMaj', 'maj', 'Gaston']].forEach(function (c) {
    var inp = document.getElementById(c[0]); if (!inp) return;
    inp.value = names[c[1]];
    inp.addEventListener('input', function () {
      var v = inp.value.replace(/[<>]/g, '').trim();
      names[c[1]] = v || c[2]; store('tribia-' + c[1], names[c[1]]); applyNames(); tickLive(true);
    });
  });

  /* ---------- Menu mobile + en-tête ---------- */
  var burger = $('.burger'), nav = $('#nav');
  burger.addEventListener('click', function () {
    var open = burger.getAttribute('aria-expanded') !== 'true';
    burger.setAttribute('aria-expanded', String(open)); nav.classList.toggle('open', open);
  });
  $$('#nav a').forEach(function (a) { a.addEventListener('click', function () { burger.setAttribute('aria-expanded', 'false'); nav.classList.remove('open'); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && nav.classList.contains('open')) { burger.setAttribute('aria-expanded', 'false'); nav.classList.remove('open'); burger.focus(); } });
  var top = $('.top');
  window.addEventListener('scroll', function () { top.classList.toggle('scrolled', window.scrollY > 8); }, { passive: true });

  /* ---------- Fil « en direct » ---------- */
  var liveI = 0, liveTimer;
  function tickLive(now) {
    var el = $('#liveTxt'); if (!el) return;
    var list = LIVE[lang];
    var set = function () { el.textContent = list[liveI % list.length].replace('{ceo}', names.ceo).replace('{maj}', names.maj); el.classList.remove('swap'); };
    if (now) { set(); return; }
    el.classList.add('swap'); setTimeout(function () { liveI++; set(); }, 300);
  }
  liveTimer = setInterval(function () { tickLive(false); }, 2800);

  /* ---------- Forfaits ---------- */
  function planCard(p) {
    var t = T[lang], tx = PLAN_TXT[p.id][lang];
    var li = [
      ['🪑', '<b>' + p.seats + ' ' + t.seats + '</b> · ' + esc(SEATS_TXT[p.id][lang])],
      ['🙂', esc(t.humans(p.humans))],
      ['⚡', '<b>' + num(p.energy) + '</b> ' + t.energyMo],
      [p.channel === 'web' ? '🌐' : '📱', p.channel === 'web' ? t.web : t.apps]
    ];
    if (p.kids) li.splice(2, 0, ['🧒', esc(t.kids(p.kids))]);
    return '<article class="plan' + (p.featured ? ' feat' : '') + '">' +
      (p.featured ? '<span class="plan-flag">' + t.popular + '</span>' : '') +
      '<span class="plan-ico" aria-hidden="true">' + PLAN_TXT[p.id].ico + '</span>' +
      '<h3>' + esc(tx[0]) + '</h3><p class="plan-desc">' + esc(tx[1]) + '</p>' +
      '<p class="price"><b>' + money(p.price) + '</b><small>' + t.perMonth + '</small></p>' +
      '<ul>' + li.map(function (r) { return '<li><span aria-hidden="true">' + r[0] + '</span><span>' + r[1] + '</span></li>'; }).join('') + '</ul>' +
      '<a class="btn ' + (p.featured ? 'btn-coral' : 'btn-plain') + '" href="' + appHref('plan', p.id) + '">' + t.start + ' <span class="sr">— ' + esc(tx[0]) + '</span></a></article>';
  }
  function renderPlans() {
    var t = T[lang];
    ['work', 'home'].forEach(function (sp) {
      var box = $('#plans-' + sp); if (!box) return;
      box.innerHTML = Object.keys(PLANS).map(function (k) { return PLANS[k]; }).filter(function (p) { return p.space === sp; }).map(planCard).join('');
      $('#free-' + sp).innerHTML = ['trial', 'showcase'].map(function (id) {
        var p = PLANS[id], tx = PLAN_TXT[id][lang];
        return '<div class="freec"><span class="plan-ico" aria-hidden="true">' + PLAN_TXT[id].ico + '</span><div><b>' + esc(tx[0]) + '</b><p>' + esc(tx[1]) + ' ' +
          p.seats + ' ' + t.seats + ' · ' + esc(t.humans(p.humans)) + ' · ' + num(p.energy) + ' ' + (id === 'showcase' ? t.perMonthEnergy : t.energy) + '</p></div><span class="zero">' + money(0) + '</span></div>';
      }).join('');
    });
  }
  function renderAddons() {
    var t = T[lang];
    ['work', 'home'].forEach(function (sp) {
      var a1 = $('#addons-' + sp); if (!a1) return;
      a1.innerHTML = ADDONS.filter(function (a) { return sp === 'home' ? !/_work$|receptionist|social/.test(a.id) : !/_home$|season/.test(a.id); }).map(function (a) {
        var tx = a[lang];
        return '<div class="addon"><span class="ai" aria-hidden="true">' + a.ico + '</span><b>' + esc(tx[0]) + '</b><small>' + esc(tx[1]) + '</small><span class="ap">' + money(a.price) + (a.oneTime ? ' · ' + t.oneTime : t.perMonth) + '</span></div>';
      }).join('');
      $('#recharges-' + sp).innerHTML = RECHARGES.map(function (r) {
        return '<div class="rech"><b>+' + num(r.energy) + ' ⚡</b><div class="rp">' + money(r.price) + ' <small>· ' + t.oneTime + '</small></div><small>' + t.perK(money(Math.round(r.price / r.energy * 100000) / 100)) + '</small></div>';
      }).join('');
    });
  }

  /* ---------- Énergie ---------- */
  function renderSizes() {
    var max = TASK_ENERGY.strategy;
    $('#sizes').innerHTML = SIZES.map(function (s) {
      var e = TASK_ENERGY[s.k], tx = s[lang];
      return '<div class="size"><p class="size-n">' + e + ' <small aria-hidden="true">⚡</small><span class="sr">' + T[lang].energy + '</span></p><b>' + esc(tx[0]) + '</b><p>' + esc(tx[1]) + '</p><div class="size-bar" aria-hidden="true"><i style="width:' + Math.max(4, e / max * 100) + '%"></i></div></div>';
    }).join('');
  }
  var pl = { space: 'home', preset: 'kids1', kids: 1, counts: {} };
  (function () { var p0 = PRESETS[1]; pl.counts = Object.assign({}, p0.counts); })();
  function plTotal() { return USAGE.reduce(function (s, u) { return s + (u.space === pl.space ? (pl.counts[u.id] || 0) * u.energy : 0); }, 0); }
  function plRecommend(total) {
    var list = Object.keys(PLANS).map(function (k) { return PLANS[k]; }).filter(function (p) { return p.space === pl.space; }).sort(function (a, b) { return a.price - b.price; });
    var need = Math.ceil(total * 1.15), kids = pl.space === 'home' ? pl.kids : 0;
    for (var i = 0; i < list.length; i++) if (list[i].energy >= need && (list[i].kids || 0) >= kids) return { plan: list[i], topUp: 0, list: list, need: need };
    var ok = list.filter(function (p) { return (p.kids || 0) >= kids; }); var big = ok[ok.length - 1] || list[list.length - 1];
    return { plan: big, topUp: Math.max(0, need - big.energy), list: list, need: need };
  }
  function L2(fr, en) { return lang === 'en' ? en : fr; }
  function renderPlanner() {
    var box = $('#planner'); if (!box) return;
    var items = USAGE.filter(function (u) { return u.space === pl.space; });
    box.innerHTML =
      '<div class="pl-l"><div class="pl-head"><h3>' + L2('Planifie ton mois', 'Plan your month') + '</h3>' +
      '<div class="pl-seg" role="group" aria-label="' + L2('Espace', 'Space') + '">' + ['home', 'work'].map(function (sp) { return '<button type="button" data-plsp="' + sp + '" aria-pressed="' + (pl.space === sp) + '">' + (sp === 'home' ? L2('🏠 Maison', '🏠 Home') : L2('💼 Travail', '💼 Work')) + '</button>'; }).join('') + '</div></div>' +
      '<div class="pl-pre">' + PRESETS.filter(function (p) { return p.space === pl.space; }).map(function (p) { return '<button type="button" data-pre="' + p.id + '" aria-pressed="' + (pl.preset === p.id) + '">' + p.emoji + ' ' + esc(p[lang]) + '</button>'; }).join('') + '</div>' +
      (pl.space === 'home' ? '<div class="pl-kids"><span>🧒 ' + L2('Enfants avec un tuteur', 'Kids with a tutor') + '</span><button type="button" data-kid="-1" aria-label="−">−</button><b id="plKids">' + pl.kids + '</b><button type="button" data-kid="1" aria-label="+">+</button></div>' : '') +
      '<div class="pl-rows">' + items.map(function (u) { var n = pl.counts[u.id] || 0;
        return '<div class="pl-row' + (n ? ' on' : '') + '" data-u="' + u.id + '"><span class="pl-e" aria-hidden="true">' + u.emoji + '</span><div class="pl-n"><b>' + esc(u[lang]) + '</b><small>⚡ ' + u.energy + ' ' + L2('chacune', 'each') + '</small></div>' +
          '<div class="pl-c"><button type="button" data-step="-1" aria-label="−">−</button><input type="range" min="0" max="' + u.max + '" value="' + Math.min(n, u.max) + '" aria-label="' + esc(u[lang]) + ' — ' + L2('par mois', 'per month') + '"><button type="button" data-step="1" aria-label="+">+</button><output>' + n + '</output></div><span class="pl-sum">' + num(n * u.energy) + '</span></div>'; }).join('') + '</div>' +
      '<div class="pl-mini" id="plMini" aria-hidden="true"></div><p class="fine">🆓 ' + L2('Gratuit : réunions, 1:1, rapport du soir, indices du tuteur, une session d’apprentissage par jour.', 'Free: meetings, 1:1s, evening report, tutor hints, one learning session per day.') + '</p></div>' +
      '<div class="pl-r" id="plOut"></div>';
    renderPlannerOut();
    $$('[data-plsp]', box).forEach(function (b) { b.addEventListener('click', function () { var sp = b.getAttribute('data-plsp'); if (sp === pl.space) return; pl.space = sp; var p = PRESETS.filter(function (x) { return x.space === sp; })[0]; pl.preset = p.id; pl.kids = p.kids; pl.counts = Object.assign({}, p.counts); renderPlanner(); }); });
    $$('[data-pre]', box).forEach(function (b) { b.addEventListener('click', function () { var p = PRESETS.filter(function (x) { return x.id === b.getAttribute('data-pre'); })[0]; pl.preset = p.id; pl.kids = p.kids; pl.counts = Object.assign({}, p.counts); renderPlanner(); }); });
    $$('[data-kid]', box).forEach(function (b) { b.addEventListener('click', function () { pl.kids = Math.max(0, Math.min(6, pl.kids + +b.getAttribute('data-kid'))); pl.preset = ''; $('#plKids').textContent = pl.kids; $$('[data-pre]', box).forEach(function (x) { x.setAttribute('aria-pressed', 'false'); }); renderPlannerOut(); }); });
    $$('.pl-row', box).forEach(function (row) {
      var id = row.getAttribute('data-u'), u = USAGE.filter(function (x) { return x.id === id; })[0], range = $('input', row);
      var set = function (v) { v = Math.max(0, v); pl.counts[id] = v; pl.preset = ''; range.value = Math.min(v, u.max); $('output', row).textContent = v; $('.pl-sum', row).textContent = num(v * u.energy); row.classList.toggle('on', v > 0); $$('[data-pre]', box).forEach(function (x) { x.setAttribute('aria-pressed', 'false'); }); renderPlannerOut(); };
      range.addEventListener('input', function () { set(+range.value); });
      $$('[data-step]', row).forEach(function (b) { b.addEventListener('click', function () { set((pl.counts[id] || 0) + +b.getAttribute('data-step')); }); });
    });
  }
  function renderPlannerOut() {
    var total = plTotal(), r = plRecommend(total), p = r.plan, fill = Math.min(100, total / p.energy * 100), tx = PLAN_TXT[p.id][lang];
    var mini = $('#plMini'); if (mini) mini.innerHTML = '<b>' + num(total) + ' ⚡</b><span>→ ' + esc(tx[0]) + ' · ' + money(p.price) + '</span><em>' + Math.round(fill) + ' %</em>';
    $('#plOut').innerHTML =
      '<div class="pl-tot"><small>' + L2('Ton mois', 'Your month') + '</small><b>' + num(total) + ' ⚡</b><span>≈ ' + num(Math.ceil(total / 30)) + ' ⚡ ' + L2('par jour', 'per day') + ' · +15 % ' + L2('de marge', 'buffer') + ' = ' + num(r.need) + ' ⚡</span>' +
      '<div class="pl-bat" role="img" aria-label="' + Math.round(fill) + ' %"><div class="pl-cell"><i style="width:' + fill + '%" class="' + (fill > 87 ? 'hot' : '') + '"></i><em>' + Math.round(fill) + ' %</em></div><span class="pl-tip"></span></div>' +
      '<span>' + L2('de l’énergie du forfait ', 'of the ') + esc(tx[0]) + L2('', ' plan’s energy') + ' (' + num(p.energy) + ' ⚡)</span></div>' +
      '<div class="pl-rec"><small>⭐ ' + L2('Forfait recommandé', 'Recommended plan') + '</small><div><b>' + PLAN_TXT[p.id].ico + ' ' + esc(tx[0]) + '</b> <span class="pl-price">' + money(p.price) + '<small>' + T[lang].perMonth + '</small></span></div>' +
      '<p>' + p.seats + ' ' + T[lang].seats + ' · ' + num(p.energy) + ' ⚡' + (pl.space === 'home' ? ' · 🧒 ' + (p.kids || 0) : '') + '</p>' +
      (r.topUp ? '<p>➕ ' + L2('Recharge à prévoir', 'Top-up needed') + ' : ' + num(r.topUp) + ' ⚡ (≈ ' + money(Math.ceil(r.topUp / 1000) * 19) + ')</p>' : '') +
      '<a class="btn btn-coral btn-sm" href="' + appHref('plan', p.id) + '">' + T[lang].start + '</a></div>' +
      '<div class="pl-plans">' + r.list.map(function (q) { var pct = total / q.energy * 100, kidsOk = pl.space !== 'home' || (q.kids || 0) >= pl.kids, ok = pct <= 100 / 1.15 && kidsOk;
        return '<div class="pl-p' + (q.id === p.id ? ' best' : '') + '"><div><b>' + esc(PLAN_TXT[q.id][lang][0]) + '</b><span>' + money(q.price) + '</span></div><div class="pl-pb"><i class="' + (ok ? 'ok' : 'no') + '" style="width:' + Math.min(100, pct) + '%"></i></div><small>' + num(q.energy) + ' ⚡ · ' + (pct > 100 ? L2('pas assez', 'not enough') : Math.round(pct) + ' % ' + L2('utilisé', 'used')) + (!kidsOk ? ' · ' + L2('max ', 'max ') + (q.kids || 0) + ' ' + L2('enfant(s)', 'kid(s)') : '') + '</small></div>'; }).join('') + '</div>';
  }
  function renderUses() {
    var box = $('#uses'); if (!box) return;
    box.innerHTML = HOME_USES.map(function (u) { var fr = lang !== 'en';
      return '<article class="use reveal in"><span class="use-e" aria-hidden="true">' + u[0] + '</span><span class="use-k">⚡ ' + u[1] + '</span><h3>' + esc(fr ? u[2] : u[4]) + '</h3><p>' + esc(fr ? u[3] : u[5]) + '</p></article>'; }).join('');
  }

  /* ---------- Vidéos ---------- */
  /* Version autonome : les affiches sont fournies en base64 par window.TRIBIA_POSTERS. */
  /* Chaque vidéo existe en français et en anglais (suffixe -en). */
  function vfile(v) { return v.file + (lang === 'en' ? '-en' : ''); }
  function poster(v) { var f = vfile(v); return (window.TRIBIA_POSTERS && window.TRIBIA_POSTERS[f]) || 'assets/posters/' + f + '.jpg'; }
  function src(v) { return 'assets/videos/' + vfile(v) + '.mp4'; }
  function vIndex(id) { for (var k = 0; k < VIDEOS.length; k++) if (VIDEOS[k].id === String(id)) return k; return 0; }
  function renderVideos() {
    var t = T[lang];
    ['work', 'home'].forEach(function (pt) {
      var box = $('#vgrid-' + pt); if (!box) return;
      box.innerHTML = VORDER[pt].map(function (id, n) {
        var i = vIndex(id), v = VIDEOS[i], tx = v[lang];
        return '<button type="button" class="vcard' + (n === 0 ? ' feat' : '') + '" data-vi="' + i + '" aria-label="' + esc(t.playLbl(tx[0])) + ' (' + v.dur + ')">' +
          '<span class="vthumb"><img src="' + poster(v) + '" alt="" loading="lazy" width="1280" height="720"><span class="vplay" aria-hidden="true"><span>▶</span></span>' +
          (n > 0 ? '<span class="vnum" aria-hidden="true">' + n + '</span>' : '') + '<span class="vdur" aria-hidden="true">' + v.dur + '</span></span>' +
          '<span class="vmeta"><b>' + esc(tx[0]) + '</b><small>' + esc(tx[1]) + '</small></span></button>';
      }).join('');
      $$('.vcard', box).forEach(function (b) { b.addEventListener('click', function () { openVideo(+b.getAttribute('data-vi'), b); }); });
    });
  }
  function renderFlyers() {
    ['work', 'home'].forEach(function (pt) {
      var box = $('#flyers-' + pt); if (!box) return;
      box.innerHTML = FLYERS[pt].map(function (f) {
        var img = 'assets/flyers/' + f[0] + (lang === 'en' ? '-en' : '') + '.jpg', fr = lang !== 'en';
        return '<figure class="flyer fl-' + f[2] + '"><button type="button" class="fl-img" data-zoom="' + img.replace(/\.jpg$/, '.full.jpg') + '" aria-label="' + esc(fr ? f[3] : f[5]) + '"><img src="' + img + '" alt="" width="1200" height="900" loading="lazy"></button>' +
          '<figcaption><span class="fl-e" aria-hidden="true">' + f[1] + '</span><b>' + esc(fr ? f[3] : f[5]) + '</b><small>' + esc(fr ? f[4] : f[6]) + '</small></figcaption></figure>';
      }).join('');
      $$('[data-zoom]', box).forEach(function (b) { b.addEventListener('click', function () { zoom(b.getAttribute('data-zoom'), b.getAttribute('aria-label')); }); });
    });
  }
  function zoom(src, label) {
    var d = $('#flz');
    if (!d) {
      d = document.createElement('div'); d.id = 'flz'; d.className = 'flz'; d.setAttribute('role', 'dialog'); d.setAttribute('aria-modal', 'true');
      d.innerHTML = '<button type="button" class="flz-x" aria-label="✕">✕</button><img alt=""><p></p>'; document.body.appendChild(d);
      var close = function () { d.classList.remove('on'); }; d.addEventListener('click', close); document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    }
    $('img', d).src = src; $('p', d).textContent = label || ''; d.classList.add('on'); $('.flz-x', d).focus();
  }

  /* ---------- Business ou Maison ---------- */
  var part = (function () { var h = location.hash.replace('#', ''); if (/^(maison|home|maison-idees|videos-home|forfaits-home)$/.test(h)) return 'home'; if (/^(business|videos-work|forfaits-work|fonctions)$/.test(h)) return 'work'; return store('tribia-part') === 'home' ? 'home' : 'work'; })();
  function setPart(p, scrollTo) {
    part = p; try { localStorage.setItem('tribia-part', p); } catch (e) { }
    $$('.zone').forEach(function (el) { el.hidden = el.getAttribute('data-part') !== p; });
    $$('#parts [data-part]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-part') === p)); });
    document.documentElement.setAttribute('data-part', p);
    if (pl.space !== p) { pl.space = p; var pr = PRESETS.filter(function (x) { return x.space === p; })[0]; pl.preset = pr.id; pl.kids = pr.kids; pl.counts = Object.assign({}, pr.counts); renderPlanner(); }
    $$('.zone:not([hidden]) .reveal').forEach(function (el) { el.classList.add('in'); });
    if (scrollTo) { var el = $(scrollTo); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  }
  $$('#parts [data-part]').forEach(function (b) { b.addEventListener('click', function () { setPart(b.getAttribute('data-part'), '#' + (b.getAttribute('data-part') === 'home' ? 'maison' : 'business')); }); });
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]'); if (!a) return;
    var h = a.getAttribute('href');
    var map = { '#business': ['work', '#business'], '#maison': ['home', '#maison'], '#videos': [part, '#videos-' + part], '#forfaits': [part, '#forfaits-' + part], '#fonctions': ['work', '#fonctions'] };
    if (!map[h]) return; e.preventDefault(); setPart(map[h][0], map[h][1]);
    if (history.replaceState) history.replaceState(null, '', map[h][1]);
    var nav = $('#nav'); if (nav && nav.classList.contains('open')) { var bg = $('.burger'); if (bg) bg.click(); }
  });
  var lb = $('#lb'), lbMedia = $('#lbMedia'), lastFocus = null;
  function showVideo(i) {
    vidIdx = (i + VIDEOS.length) % VIDEOS.length;
    var v = VIDEOS[vidIdx], tx = v[lang], t = T[lang];
    $('#lbTitle').textContent = tx[0];
    $('#lbDesc').textContent = t.vidOf(vidIdx + 1, VIDEOS.length) + ' · ' + tx[1];
    lbMedia.innerHTML = '';
    var vid = document.createElement('video');
    vid.controls = true; vid.playsInline = true; vid.preload = 'metadata'; vid.poster = poster(v);
    vid.setAttribute('aria-label', tx[0]);
    var s = document.createElement('source'); s.src = src(v); s.type = 'video/mp4';
    var fail = function () {
      if (lbMedia.querySelector('.lb-miss')) return;
      lbMedia.innerHTML = '<img src="' + poster(v) + '" alt=""><p class="lb-miss" role="status">' + esc(t.missing) + '</p>';
    };
    s.addEventListener('error', fail); vid.addEventListener('error', fail);
    vid.appendChild(s); lbMedia.appendChild(vid);
    var pr = vid.play(); if (pr && pr.catch) pr.catch(function () { });
  }
  function openVideo(i, from) {
    lastFocus = from || document.activeElement;
    showVideo(i);
    if (typeof lb.showModal === 'function') lb.showModal(); else lb.setAttribute('open', '');
    $('#lbClose').focus();
  }
  function closeVideo() { var v = $('video', lbMedia); if (v) v.pause(); lbMedia.innerHTML = ''; if (lb.open) lb.close(); }
  lb.addEventListener('close', function () { var v = $('video', lbMedia); if (v) v.pause(); lbMedia.innerHTML = ''; if (lastFocus && lastFocus.focus) lastFocus.focus(); });
  lb.addEventListener('click', function (e) { if (e.target === lb) closeVideo(); });
  $('#lbClose').addEventListener('click', closeVideo);
  $$('[data-video]').forEach(function (b) { b.addEventListener('click', function () { openVideo(vIndex(b.getAttribute('data-video')), b); }); });
  $('#lbPrev').addEventListener('click', function () { showVideo(vidIdx - 1); });
  $('#lbNext').addEventListener('click', function () { showVideo(vidIdx + 1); });
  lb.addEventListener('keydown', function (e) {
    if (e.target && e.target.tagName === 'VIDEO') return;
    if (e.key === 'ArrowRight') showVideo(vidIdx + 1); else if (e.key === 'ArrowLeft') showVideo(vidIdx - 1);
  });
  $$('[data-play]').forEach(function (b) {
    b.addEventListener('click', function () {
      var id = b.getAttribute('data-play'); var i = 0;
      VIDEOS.forEach(function (v, k) { if (v.id === id) i = k; }); openVideo(i, b);
    });
  });

  /* ---------- Toc toc ---------- */
  var toc = $('#toc'), tocShown = false;
  function dismissed() { try { return sessionStorage.getItem('tribia-toc') === '1'; } catch (e) { return false; } }
  function showToc() {
    if (tocShown || dismissed() || (lb && lb.open)) return;
    tocShown = true; toc.hidden = false;
    if (window.TribiaChars && window.TribiaChars.refresh) window.TribiaChars.refresh();
  }
  function hideToc() { toc.hidden = true; try { sessionStorage.setItem('tribia-toc', '1'); } catch (e) { } }
  $('#tocNo').addEventListener('click', hideToc);
  $('#tocYes').addEventListener('click', hideToc);
  var feat = $('#fonctions');
  if ('IntersectionObserver' in window && feat) {
    new IntersectionObserver(function (es, o) { es.forEach(function (e) { if (e.isIntersecting) { setTimeout(showToc, 1200); o.disconnect(); } }); }, { threshold: 0.15 }).observe(feat);
  }

  /* ---------- Apparition au défilement ---------- */
  if ('IntersectionObserver' in window) {
    var ro = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); ro.unobserve(e.target); } }); }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    $$('.reveal').forEach(function (el) { ro.observe(el); });
  } else { $$('.reveal').forEach(function (el) { el.classList.add('in'); }); }

  applyNames();
  applyLang();
  setPart(part, /^#(maison|business|videos-|forfaits-)/.test(location.hash) ? location.hash : null);
  if (window.TribiaChars) window.TribiaChars.init();
})();
