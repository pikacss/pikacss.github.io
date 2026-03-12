// pika() 是全域函式，不需要匯入

const userColor = getUserPreference()

export const invalidButton = pika({
	backgroundColor: userColor,
})
