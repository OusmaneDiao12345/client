// Gestion du panier et paiement
const PANIER_KEY = 'senabonnement_panier';

function getPanier() {
    return JSON.parse(localStorage.getItem(PANIER_KEY) || '[]');
}
function setPanier(panier) {
    localStorage.setItem(PANIER_KEY, JSON.stringify(panier));
}

// Modal paiement
function showPaiementModal(item) {
    // Crée le modal si absent
    let modal = document.getElementById('paiement-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'paiement-modal';
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
                <button id="close-paiement-modal" style="position:absolute;top:10px;right:10px;background:none;border:none;font-size:1.3rem;cursor:pointer;">&times;</button>
                <h3 style="margin-bottom:20px;color:#e67e22;">Paiement</h3>
                <div style="margin-bottom:15px;">
                    <strong>${item.nom}</strong><br>
                    <span style="color:#e67e22;font-weight:600;">${item.prix.toLocaleString()} XOF</span>
                </div>
                <form id="paiement-form">
                    <label>Moyen de paiement :</label>
                    <select id="paiement-methode" required style="width:100%;margin:10px 0 20px 0;padding:8px;">
                        <option value="" disabled selected>Choisir</option>
                        <option value="orange">Orange Money</option>
                        <option value="wave">Wave</option>
                        <option value="carte">Carte bancaire</option>
                        <option value="paypal">PayPal</option>
                    </select>
                    <button type="submit" style="width:100%;background:#e67e22;color:#fff;border:none;padding:12px 0;border-radius:5px;font-weight:600;font-size:1rem;cursor:pointer;">Valider le paiement</button>
                </form>
            </div>
        `;
        document.body.appendChild(modal);
    } else {
        modal.style.display = 'flex';
    }
    // Fermer le modal
    modal.querySelector('#close-paiement-modal').onclick = () => {
        modal.style.display = 'none';
    };
    // Validation du paiement
    modal.querySelector('#paiement-form').onsubmit = function(e) {
        e.preventDefault();
        const methode = modal.querySelector('#paiement-methode').value;
        if (!methode) return;
        // Ajoute au panier
        let panier = getPanier();
        // Si déjà dans le panier, incrémente la quantité
        const idx = panier.findIndex(x => x.nom === item.nom && x.prix === item.prix);
        if (idx >= 0) {
            panier[idx].qte += 1;
        } else {
            panier.push({ nom: item.nom, prix: item.prix, qte: 1 });
        }
        setPanier(panier);
        modal.style.display = 'none';
        setTimeout(() => {
            alert('Paiement validé avec ' + (methode === 'orange' ? 'Orange Money' : methode === 'wave' ? 'Wave' : methode === 'carte' ? 'Carte bancaire' : 'PayPal') + '.\nVotre commande est enregistrée !');
        }, 300);
    };
}

// Panier header icon
function updateHeaderCart() {
    let panier = JSON.parse(localStorage.getItem('senabonnement_panier') || '[]');
    let count = panier.reduce((sum, item) => sum + (item.qte || 1), 0);
    let cartIcon = document.querySelector('.header-cart-count');
    if (cartIcon) cartIcon.textContent = count;
}
function triggerPanierUpdate() {
    document.body.dispatchEvent(new Event('panier:updated'));
}
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.btn-primary').forEach(btn => {
        if (btn.textContent.trim().toLowerCase().includes("s'abonner")) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                // Trouve le nom et le prix de l'offre
                const card = btn.closest('.pricing-card');
                if (!card) return;
                const nom = card.querySelector('h3') ? card.querySelector('h3').textContent.trim() : 'Abonnement';
                const prixTxt = card.querySelector('.price') ? card.querySelector('.price').childNodes[0].textContent.trim() : '';
                const prix = parseInt(prixTxt.replace(/[^\d]/g, '')) || 0;
                showPaiementModal({ nom, prix });
            });
        }
    });
    // Ajout icône panier dans le header si absent
    let header = document.querySelector('header .container');
    if (header && !document.querySelector('.header-cart')) {
        let cartDiv = document.createElement('div');
        cartDiv.className = 'header-cart';
        cartDiv.innerHTML = `<i class="fas fa-shopping-cart"></i><span class="header-cart-count">0</span>`;
        cartDiv.onclick = function() {
            window.location.href = 'panier.html';
        };
        header.appendChild(cartDiv);
    }
    updateHeaderCart();
    document.body.addEventListener('panier:updated', updateHeaderCart);
});

// À chaque ajout au panier, déclenche l'événement pour mettre à jour l'icône
function triggerPanierUpdate() {
    document.body.dispatchEvent(new Event('panier:updated'));
}