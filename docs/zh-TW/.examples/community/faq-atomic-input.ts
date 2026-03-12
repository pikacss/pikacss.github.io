// pika() 是全域函式，不需要匯入

const btn = pika({
	color: 'white',
	backgroundColor: 'blue',
})

const link = pika({
	color: 'white',
	textDecoration: 'underline',
})

// btn 與 link 共用同一個 atomic class：color: white
