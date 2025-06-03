// Nécessite d'avoir un compte EmailJS et de configurer un service/template sur https://dashboard.emailjs.com/

function sendConfirmationMail(to_email, to_name, abonnement, prix, callback) {
    // Remplacez par vos propres valeurs EmailJS
    const service_id = 'YOUR_SERVICE_ID';
    const template_id = 'YOUR_TEMPLATE_ID';
    const user_id = 'YOUR_PUBLIC_KEY';

    const templateParams = {
        to_name: to_name,
        to_email: to_email,
        abonnement: abonnement,
        prix: prix + ' XOF',
        confirmation_link: window.location.origin + '/confirmation.html'
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
    })
    .then(response => {
        if (response.ok) {
            if (callback) callback(true);
        } else {
            if (callback) callback(false);
        }
    })
    .catch(() => {
        if (callback) callback(false);
    });
}
