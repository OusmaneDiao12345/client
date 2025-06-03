// Utilisateur courant (stocké dans localStorage)
const AUTH_KEY = 'senabonnement_user';

function getUser() {
    return JSON.parse(localStorage.getItem(AUTH_KEY) || 'null');
}
function setUser(user) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
}
function logoutUser() {
    localStorage.removeItem(AUTH_KEY);
}

// Affiche le modal de connexion/inscription
function showAuthModal() {
    let modal = document.getElementById('auth-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'auth-modal';
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100vw';
        modal.style.height = '100vh';
        modal.style.background = 'rgba(0,0,0,0.5)';
        modal.style.display = 'flex';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';
        modal.style.zIndex = '99999';
        modal.innerHTML = `
            <div style="background:#fff;padding:30px 25px;border-radius:10px;max-width:350px;width:100%;box-shadow:0 5px 20px #0002;position:relative;">
                <button id="close-auth-modal" style="position:absolute;top:10px;right:10px;background:none;border:none;font-size:1.3rem;cursor:pointer;">&times;</button>
                <h3 style="margin-bottom:20px;color:#e67e22;">Connexion / Inscription</h3>
                <form id="auth-form">
                    <input type="text" id="auth-nom" placeholder="Nom complet" required style="width:100%;margin-bottom:10px;padding:8px;">
                    <input type="email" id="auth-email" placeholder="Email" required style="width:100%;margin-bottom:10px;padding:8px;">
                    <input type="password" id="auth-mdp" placeholder="Mot de passe" required style="width:100%;margin-bottom:10px;padding:8px;">
                    <button type="submit" style="width:100%;background:#e67e22;color:#fff;border:none;padding:12px 0;border-radius:5px;font-weight:600;font-size:1rem;cursor:pointer;">Se connecter / S'inscrire</button>
                </form>
            </div>
        `;
        document.body.appendChild(modal);
    } else {
        modal.style.display = 'flex';
    }
    modal.querySelector('#close-auth-modal').onclick = () => {
        modal.style.display = 'none';
    };
    modal.querySelector('#auth-form').onsubmit = function(e) {
        e.preventDefault();
        const nom = modal.querySelector('#auth-nom').value.trim();
        const email = modal.querySelector('#auth-email').value.trim();
        const mdp = modal.querySelector('#auth-mdp').value.trim();
        if (!nom || !email || !mdp) return;
        const user = { nom, email };
        setUser(user);
        modal.style.display = 'none';
        updateLoginBtn();
        alert('Bienvenue ' + nom + ' ! Vous êtes connecté.');
        sendAdminLoginMail(user); // Envoi du mail à l'admin
    };
}

// Envoi un mail à l'admin lors d'une connexion/inscription
function sendAdminLoginMail(user) {
    // Nécessite un compte EmailJS et un template configuré
    const service_id = 'YOUR_SERVICE_ID';
    const template_id = 'YOUR_TEMPLATE_ID';
    const user_id = 'YOUR_PUBLIC_KEY';

    const templateParams = {
        admin_email: 'ousmoneebah12@gmail.com',
        user_name: user.nom,
        user_email: user.email,
        login_date: new Date().toLocaleString()
    };

    fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            service_id,
            template_id,
            user_id,
            template_params: templateParams
        })
    });
}

// Met à jour le bouton Connexion/Profil
function updateLoginBtn() {
    const user = getUser();
    document.querySelectorAll('.btn-login').forEach(btn => {
        if (user) {
            btn.innerHTML = `<i class="fas fa-user"></i> ${user.nom.split(' ')[0]} <span style="font-size:0.9em;cursor:pointer;" id="logout-link">(Déconnexion)</span>`;
            btn.onclick = function(e) {
                e.preventDefault();
                if (confirm('Se déconnecter ?')) {
                    logoutUser();
                    updateLoginBtn();
                }
            };
            // Déconnexion sur clic du lien
            const logoutSpan = btn.querySelector('#logout-link');
            if (logoutSpan) {
                logoutSpan.onclick = function(ev) {
                    ev.stopPropagation();
                    logoutUser();
                    updateLoginBtn();
                };
            }
        } else {
            btn.innerHTML = `<i class="fas fa-user"></i> Connexion`;
            btn.onclick = function(e) {
                e.preventDefault();
                showAuthModal();
            };
        }
    });
}

// Bloque la commande si non connecté (à utiliser dans le JS paiement)
function requireAuthBeforeOrder(callback) {
    const user = getUser();
    if (!user) {
        showAuthModal();
        alert('Vous devez être connecté pour valider une commande.');
        return false;
    }
    if (typeof callback === 'function') callback(user);
    return true;
}

// Initialisation sur toutes les pages
document.addEventListener('DOMContentLoaded', updateLoginBtn);
