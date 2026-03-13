const promoCardClass = pika({
	padding: '1rem',
	borderRadius: '0.75rem',
	backgroundColor: 'white',
	boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)',
	hover: {
		boxShadow: '0 14px 36px rgba(15, 23, 42, 0.12)',
	},
})

document.querySelector('#promo-card')?.setAttribute('class', promoCardClass)
