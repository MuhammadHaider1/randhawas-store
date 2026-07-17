import api from './api'

export function sendTikTokEvent(event, properties = {}) {
  try {
    const payload = {
      event,
      payload: {
        event_id: `${event}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        timestamp: Math.floor(Date.now()),
        properties,
      },
    }
    api.post('/orders/tiktok-event/', payload).catch(() => {})
  } catch {
    /* silent */
  }
}

export function trackViewContent(content) {
  sendTikTokEvent('ViewContent', {
    contents: [{ content_id: content.id, content_name: content.name, content_type: 'product', quantity: 1 }],
    currency: 'PKR',
    value: Number(content.price),
    content_category: content.category_name || '',
  })
}

export function trackAddToCart(item) {
  sendTikTokEvent('AddToCart', {
    contents: [{ content_id: item.product || item.id, content_name: item.name, content_type: 'product', quantity: item.quantity }],
    currency: 'PKR',
    value: Number(item.price) * item.quantity,
  })
}

export function trackPurchase(order) {
  sendTikTokEvent('Purchase', {
    contents: (order.items || []).map((i) => ({
      content_id: i.product || i.product_name,
      content_name: i.product_name,
      content_type: 'product',
      quantity: i.quantity,
    })),
    currency: 'PKR',
    value: Number(order.total),
    order_id: order.order_id,
  })
}
