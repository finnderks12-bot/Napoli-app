// 1. DATA: Ingeplande uren door de baas in het werkschema
const roosterData = [
    { id: 1, naam: "Giovanni", functie: "Stadion Beveiliging", uren: 5.5, tijd: "18:00 - 23:30" },
    { id: 2, naam: "Matteo", functie: "Ticketverkoop", uren: 4.5, tijd: "16:30 - 21:00" },
    { id: 3, naam: "Mark (Jij)", functie: "Napoli Store", uren: 7.0, tijd: "15:00 - 22:00" },
    { id: 4, naam: "Francesca", functie: "Horeca VIP Lounge", uren: 6.0, tijd: "17:00 - 23:00" }
];

// Telt automatisch de ingeplande uren van Mark (Jij) op voor de salariscalculator
const GEPLANDE_UREN = roosterData.find(item => item.naam.includes("Mark")).uren;

let huidigeRol = localStorage.getItem('napoli_rol') || 'medewerker';
let huidigeTaal = localStorage.getItem('napoli_taal') || 'nl';
let aanvragen = JSON.parse(localStorage.getItem('napoli_aanvragen')) || [];

// 2. TALEN WOORDENBOEK: Elke taal die gekozen kan worden in de instellingen
const vertalingen = {
    nl: {
        appTitle: "Napoli Personeel", menuSchedule: "📅 Werkschema", menuSalary: "💰 Salaris", menuLeave: "✈️ Vrij vragen", menuSettings: "⚙️ Instellingen",
        titleSchedule: "📅 Werkschema Vandaag", titleSalary: "💰 Salaris Calculator", titleLeavePage: "✈️ Vrij Vragen", titleOverview: "📊 Status Aanvragen", titleSettingsPage: "⚙️ Instellingen",
        calcInfo: `Jouw baas heeft **${GEPLANDE_UREN} uur** voor jou ingepland.`, labelWage: "Mijn Uurloon (€):", labelName: "Jouw Naam:", labelDate: "Datum:", labelReason: "Reden van aanvraag:",
        btnSubmitLeave: "Aanvraag Verzenden", labelLang: "Kies een taal:", titleManagerMode: "Beheerdersmodus", managerDesc: "Schakel de Baas-modus in om aanvragen te keuren.",
        btnToManager: "💼 Switch naar Manager", btnToEmployee: "👤 Switch naar Medewerker", statusPending: "In afwachting", statusApproved: "Goedgekeurd", statusRejected: "Afgewezen",
        promptReason: "Voer de reden in voor deze beslissing (voor de medewerker):", alertSuccess: "Aanvraag succesvol verzonden naar je baas!", noRequests: "Geen lopende aanvragen.", totalText: "Totaal: € "
    },
    en: {
        appTitle: "Napoli Staff", menuSchedule: "📅 Schedule", menuSalary: "💰 Salary", menuLeave: "✈️ Leave Request", menuSettings: "⚙️ Settings",
        titleSchedule: "📅 Today's Schedule", titleSalary: "💰 Salary Calculator", titleLeavePage: "✈️ Request Leave", titleOverview: "📊 Request Status", titleSettingsPage: "⚙️ Settings",
        calcInfo: `Your manager scheduled **${GEPLANDE_UREN} hours** for you.`, labelWage: "My Hourly Wage (€):", labelName: "Your Name:", labelDate: "Date:", labelReason: "Reason for request:",
        btnSubmitLeave: "Submit Request", labelLang: "Choose language:", titleManagerMode: "Manager Mode", managerDesc: "Switch to manager mode to review requests.",
        btnToManager: "💼 Switch to Manager", btnToEmployee: "👤 Switch to Employee", statusPending: "Pending", statusApproved: "Approved", statusRejected: "Rejected",
        promptReason: "Enter the reason for this decision (for the employee):", alertSuccess: "Request successfully submitted!", noRequests: "No active requests.", totalText: "Total: € "
    },
    it: {
        appTitle: "Napoli Personale", menuSchedule: "📅 Turni Lavoro", menuSalary: "💰 Stipendio", menuLeave: "✈️ Richiedi Ferie", menuSettings: "⚙️ Impostazioni",
        titleSchedule: "📅 Turni di Oggi", titleSalary: "💰 Calcolo Stipendio", titleLeavePage: "✈️ Richiedi Ferie", titleOverview: "📊 Stato Richieste", titleSettingsPage: "⚙️ Impostazioni",
        calcInfo: `Il tuo capo ha programmato **${GEPLANDE_UREN} ore** per te.`, labelWage: "La mia tariffa oraria (€):", labelName: "Il tuo nome:", labelDate: "Data:", labelReason: "Motivo della richiesta:",
        btnSubmitLeave: "Invia Richiesta", labelLang: "Scegli una lingua:", titleManagerMode: "Modalità Manager", managerDesc: "Attiva la modalità manager per approvare le richieste.",
        btnToManager: "💼 Passa a Manager", btnToEmployee: "👤 Passa a Dipendente", statusPending: "In attesa", statusApproved: "Approvato", statusRejected: "Rifiutato",
        promptReason: "Inserisci il motivo di questa decisione:", alertSuccess: "Richiesta inviata con successo!", noRequests: "Nessuna richiesta presente.", totalText: "Totale: € "
    },
    es: {
        appTitle: "Napoli Personal", menuSchedule: "📅 Horario", menuSalary: "💰 Salario", menuLeave: "✈️ Solicitar Libre", menuSettings: "⚙️ Ajustes",
        titleSchedule: "📅 Horario de Hoy", titleSalary: "💰 Calculadora de Salario", titleLeavePage: "✈️ Solicitar Libre", titleOverview: "📊 Estado de Solicitudes", titleSettingsPage: "⚙️ Ajustes",
        calcInfo: `Tu jefe ha programado **${GEPLANDE_UREN} horas** para ti.`, labelWage: "Mi salario por hora (€):", labelName: "Tu nombre:", labelDate: "Fecha:", labelReason: "Motivo de la solicitud:",
        btnSubmitLeave: "Enviar Solicitud", labelLang: "Elige un idioma:", titleManagerMode: "Modo Administrador", managerDesc: "Activa el modo administrador para revisar solicitudes.",
        btnToManager: "💼 Cambiar a Manager", btnToEmployee: "👤 Cambiar a Empleado", statusPending: "Pendiente", statusApproved: "Aprobado", statusRejected: "Rechazado",
        promptReason: "Introduce el motivo de esta decisión:", alertSuccess: "¡Solicitud enviada con éxito!", noRequests: "No hay solicitudes.", totalText: "Total: € "
    },
    fr: {
        appTitle: "Napoli Personnel", menuSchedule: "📅 Planning", menuSalary: "💰 Salaire", menuLeave: "✈️ Demande de Congé", menuSettings: "⚙️ Paramètres",
        titleSchedule: "📅 Planning d'Aujourd'hui", titleSalary: "💰 Calculateur de Salaire", titleLeavePage: "✈️ Demander un Congé", titleOverview: "📊 Statut des Demandes", titleSettingsPage: "⚙️ Paramètres",
        calcInfo: `Votre manager a planifié **${GEPLANDE_UREN} heures** pour vous.`, labelWage: "Mon taux horaire (€):", labelName: "Votre nom:", labelDate: "Date:", labelReason: "Motif de la demande:",
        btnSubmitLeave: "Envoyer la Demande", labelLang: "Choisir une langue:", titleManagerMode: "Mode Manager", managerDesc: "Activez le mode manager voor valideren de demandes.",
        btnToManager: "💼 Passer en Manager", btnToEmployee: "👤 Passer en Employé", statusPending: "En attente", statusApproved: "Approuvé", statusRejected: "Refusé",
        promptReason: "Entrez le motif de cette decision:", alertSuccess: "Demande envoyée avec succès!", noRequests: "Aucune demande en cours.", totalText: "Total: € "
    },
    de: {
        appTitle: "Napoli Personal", menuSchedule: "📅 Dienstplan", menuSalary: "💰 Gehalt", menuLeave: "✈️ Frei Beantragen", menuSettings: "⚙️ Einstellungen",
        titleSchedule: "📅 Dienstplan Heute", titleSalary: "💰 Gehaltsrechner", titleLeavePage: "✈️ Frei Beantragen", titleOverview: "📊 Status der Anträge", titleSettingsPage: "⚙️ Einstellungen",
        calcInfo: `Ihr Chef hat **${GEPLANDE_UREN} Stunden** für Sie eingeplant.`, labelWage: "Mein Stundenlohn (€):", labelName: "Ihr Name:", labelDate: "Datum:", labelReason: "Grund für den Antrag:",
        btnSubmitLeave: "Antrag Absenden", labelLang: "Sprache wählen:", titleManagerMode: "Manager-Modus", managerDesc: "Schalten Sie in den Manager-Modus, um Anträge zu prüfen.",
        btnToManager: "💼 Zum Manager wechseln", btnToEmployee: "👤 Zum Mitarbeiter wechseln", statusPending: "Ausstehend", statusApproved: "Genehmigt", statusRejected: "Abgelehnt",
        promptReason: "Geben Sie den Grund voor diese Entscheidung ein:", alertSuccess: "Antrag erfolgreich gesendet!", noRequests: "Keine aktuellen Anträge.", totalText: "Gesamt: € "
    }
};

// 3. INITIALISATIE: Luistert naar de gekozen taal uit de Instellingen
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('language-select').value = huidigeTaal;
    document.getElementById('language-select').addEventListener('change', (e) => {
        huidigeTaal = e.target.value;
        localStorage.setItem('napoli_taal', huidigeTaal);
        vertaalUI();
    });
    vertaalUI();
});

function toggleMenu() {
    document.getElementById('sidebar').classList.toggle('open');
    document.getElementById('sidebar-overlay').classList.toggle('active');
}

function switchPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    toggleMenu();
}

function vertaalUI() {
    const t = vertalingen[huidigeTaal] || vertalingen['en'];
    document.getElementById('app-title').textContent = t.appTitle;
    document.getElementById('menu-schedule').textContent = t.menuSchedule;
    document.getElementById('menu-salary').textContent = t.menuSalary;
    document.getElementById('menu-leave').textContent = t.menuLeave;
    document.getElementById('menu-settings').textContent = t.menuSettings;
    document.getElementById('title-schedule').textContent = t.titleSchedule;
    document.getElementById('title-salary').textContent = t.titleSalary;
    document.getElementById('title-leave-page').textContent = t.titleLeavePage;
    document.getElementById('title-overview').textContent = t.titleOverview;
    document.getElementById('title-settings-page').textContent = t.titleSettingsPage;
    document.getElementById('calc-info').innerHTML = t.calcInfo;
    document.getElementById('label-wage').textContent = t.labelWage;
    document.getElementById('label-name').textContent = t.labelName;
    document.getElementById('label-date').textContent = t.labelDate;
    document.getElementById('label-reason').textContent = t.labelReason;
    document.getElementById('btn-submit-leave').textContent = t.btnSubmitLeave;
    document.getElementById('label-lang').textContent = t.labelLang;
    document.getElementById('title-manager-mode').textContent = t.titleManagerMode;
    document.getElementById('manager-desc').textContent = t.managerDesc;
    laadRooster();
    berekenAutomatischSalaris();
    laadOverzicht();
    updateRolUI();
}

function laadRooster() {const container = document.getElementById('schedule-container');container.innerHTML = '';roosterData.forEach(item => {container.innerHTML += <div class="card"><h3>${item.naam}</h3><p><strong>${item.functie}</strong></p><p>${item.tijd} (${item.uren} uur)</p></div>;});}function berekenAutomatischSalaris() {const t = vertalingen[huidigeTaal];const uurloon = parseFloat(document.getElementById('hourly-wage').value) || 0;const totaal = (GEPLANDE_UREN * uurloon).toFixed(2);document.getElementById('salary-result').textContent = ${t.totalText}${totaal};}function vraagVerlofAan(event) {event.preventDefault();const t = vertalingen[huidigeTaal];const naam = document.getElementById('employee-name').value;const datum = document.getElementById('leave-date').value;const reden = document.getElementById('leave-reason').value;const nieuweAanvraag = { id: Date.now(), naam: naam, datum: datum, reden: reden, status: 'pending', managerReden: '' };aanvragen.push(nieuweAanvraag);localStorage.setItem('napoli_aanvragen', JSON.stringify(aanvragen));alert(t.alertSuccess);document.getElementById('leave-form').reset();laadOverzicht();}function laadOverzicht() {const container = document.getElementById('overview-container');container.innerHTML = '';const t = vertalingen[huidigeTaal];if (!aanvragen || aanvragen.length === 0) {container.innerHTML = <p style="text-align:center; color:#888; padding:10px;">${t.noRequests}</p>;return;}aanvragen.forEach(a => {let badgeClass = 'status-pending';let statusText = t.statusPending;if (a.status === 'approved') { badgeClass = 'status-approved'; statusText = t.statusApproved; }if (a.status === 'rejected') { badgeClass = 'status-rejected'; statusText = t.statusRejected; }let managerKnoppen = '';if (huidigeRol === 'manager' && a.status === 'pending') {managerKnoppen = <div class="card-actions"><button style="background-color:#28a745;" onclick="beoordeelAanvraag(${a.id}, 'approved')">✓ Goedkeuren met reden</button><button style="background-color:#dc3545;" onclick="beoordeelAanvraag(${a.id}, 'rejected')">✕ Weiger met reden</button></div>;}let redenHtml = a.managerReden ? <p style="margin-top:5px; font-style:italic; color:#333;"><strong>Reden baas:</strong> ${a.managerReden}</p> : '';container.innerHTML += <div class="card"><button style="background-color:#6c757d; width:auto; padding:3px 8px; font-size:11px; position:absolute; top:10px; right:10px;" onclick="verwijderAanvraag(${a.id})">🗑️</button><h3>${a.naam}</h3><p><strong>Datum:</strong> ${a.datum}</p><p><strong>Reden medewerker:</strong> ${a.reden}</p><span class="status-badge ${badgeClass}">${statusText}</span>${redenHtml}${managerKnoppen}</div>;});}function beoordeelAanvraag(id, status) {const t = vertalingen[huidigeTaal];const reden = prompt(t.promptReason) || "";aanvragen = aanvragen.map(a => a.id === id ? { ...a, status: status, managerReden: reden } : a);localStorage.setItem('napoli_aanvragen', JSON.stringify(aanvragen));laadOverzicht();}function verwijderAanvraag(id) {aanvragen = aanvragen.filter(a => a.id !== id);localStorage.setItem('napoli_aanvragen', JSON.stringify(aanvragen));laadOverzicht();}function toggleRol() {huidigeRol = huidigeRol === 'medewerker' ? 'manager' : 'medewerker';localStorage.setItem('napoli_rol', huidigeRol);updateRolUI();laadOverzicht();}function updateRolUI() {const t = vertalingen[huidigeTaal];const btn = document.getElementById('btn-toggle-role');if (btn) {btn.textContent = huidigeRol === 'medewerker' ? t.btnToManager : t.btnToEmployee;btn.style.backgroundColor = huidigeRol === 'medewerker' ? '#6c757d' : '#fd7e14';}}