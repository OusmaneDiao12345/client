// Exemple de structure du panier (à stocker dans localStorage)
const PANIER_KEY = 'senabonnement_panier';

// Récupère le panier depuis le localStorage
function getPanier() {
    return JSON.parse(localStorage.getItem(PANIER_KEY) || '[]');
}

// Sauvegarde le panier dans le localStorage
function setPanier(panier) {
    localStorage.setItem(PANIER_KEY, JSON.stringify(panier));
}

// Met à jour l'affichage du panier
function renderPanier() {
    const container = document.querySelector('.panier-container');
    const panier = getPanier();
    container.innerHTML = `
        <h2 class="panier-title">Votre Panier</h2>
        <div class="panier-items">
            ${panier.length === 0 ? `<div class="panier-empty">Votre panier est vide.</div>` : panier.map((item, idx) => `
                <div class="panier-item" data-index="${idx}">
                    <div class="panier-item-info">
                        <span class="panier-item-name">${item.nom}</span>
                        <span class="panier-item-price">${item.prix.toLocaleString()} XOF</span>
                    </div>
                    <div class="panier-item-qty">
                        <button class="panier-qty-moins">-</button>
                        <span>${item.qte}</span>
                        <button class="panier-qty-plus">+</button>
                    </div>
                    <button class="panier-item-remove">Supprimer</button>
                </div>
            `).join('')}
        </div>
        <div class="panier-total">
            Total : ${panier.reduce((sum, item) => sum + item.prix * item.qte, 0).toLocaleString()} XOF
        </div>
        <div class="panier-actions">
            <button class="panier-btn" ${panier.length === 0 ? 'disabled' : ''}>Valider la commande</button>
        </div>
    `;

    // Gestion des boutons quantité et suppression
    container.querySelectorAll('.panier-qty-moins').forEach(btn => {
        btn.addEventListener('click', function() {
            const idx = this.closest('.panier-item').dataset.index;
            let panier = getPanier();
            if (panier[idx].qte > 1) {
                panier[idx].qte--;
                setPanier(panier);
                renderPanier();
            }
        });
    });
    container.querySelectorAll('.panier-qty-plus').forEach(btn => {
        btn.addEventListener('click', function() {
            const idx = this.closest('.panier-item').dataset.index;
            let panier = getPanier();
            panier[idx].qte++;
            setPanier(panier);
            renderPanier();
        });
    });
    container.querySelectorAll('.panier-item-remove').forEach(btn => {
        btn.addEventListener('click', function() {
            const idx = this.closest('.panier-item').dataset.index;
            let panier = getPanier();
            panier.splice(idx, 1);
            setPanier(panier);
            renderPanier();
        });
    });
    // Validation commande
    const validerBtn = container.querySelector('.panier-btn');
    if (validerBtn) {
        validerBtn.addEventListener('click', function() {
            alert('Merci pour votre commande ! Nous vous contacterons rapidement.');
            setPanier([]);
            renderPanier();
        });
    }
}

// Initialisation à l'ouverture de la page
document.addEventListener('DOMContentLoaded', function() {
    // Ajoute le conteneur si absent
    if (!document.querySelector('.panier-container')) {
        const div = document.createElement('div');
        div.className = 'panier-container';
        document.body.insertBefore(div, document.body.querySelector('script'));
    }
    renderPanier();
});
