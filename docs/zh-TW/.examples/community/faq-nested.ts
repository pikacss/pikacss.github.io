// pika() 是全域函式，不需要匯入

const btn = pika({
	'color': 'black',
	// 偽類別 selector
	'&:hover': {
		color: 'blue',
	},
	// Media query
	'@media (max-width: 768px)': {
		fontSize: '14px',
	},
})
