import api from './api'

function fireBrowserPixel(event, properties = {}) {
  try {
    if (typeof window.ttq !== 'undefined' && window.ttq.track) {
      window.ttq.track(event, properties)
    }
  } catch {
    /* silent */
  }
}

export function sendTikTokEvent(event, properties = {}) {
  try {
    fireBrowserPixel(event, properties)

    const payload = {
      event,
      payload: {
        event_id: `${event}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
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
    contents: [{ content_id: String(content.id), content_name: content.name, content_type: 'product', quantity: 1 }],
    currency: 'PKR',
    value: Number(content.price),
    content_category: content.category_name || '',
  })
}

export function trackAddToCart(item) {
  sendTikTokEvent('AddToCart', {
    contents: [{ content_id: String(item.product || item.id), content_name: item.name, content_type: 'product', quantity: item.quantity }],
    currency: 'PKR',
    value: Number(item.price) * item.quantity,
  })
}

export function trackPurchase(order) {
  sendTikTokEvent('Purchase', {
    contents: (order.items || []).map((i) => ({
      content_id: String(i.product || i.product_name),
      content_name: i.product_name,
      content_type: 'product',
      quantity: i.quantity,
    })),
    currency: 'PKR',
    value: Number(order.total),
    order_id: order.order_id,
  })
}

export function trackTestEvent() {
  sendTikTokEvent('CompletePayment', {
    contents: [{ content_id: 'test_001', content_name: 'Test Product', content_type: 'product', quantity: 1 }],
    currency: 'PKR',
    value: 1000,
  })
}
