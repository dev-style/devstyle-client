export const GA_MEASUREMENT_ID = 'G-56ZB7XCQHC' // Remplacez par votre ID de mesure

// Fonction pour envoyer des pages vues
export const pageview = (url) => {
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: url,
  })
}

// Fonction pour envoyer des événements
export const event = ({ action, category, label, value }) => {
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  })
}