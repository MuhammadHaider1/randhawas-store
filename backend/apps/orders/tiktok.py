import requests
import json
import hashlib
import logging
from django.conf import settings

logger = logging.getLogger(__name__)

TIKTOK_API_URL = 'https://business-api.tiktok.com/open_api/v1.3/event/track/'


def _hash(val):
    if not val:
        return None
    return hashlib.sha256(val.strip().lower().encode()).hexdigest()


def send_tiktok_event(event_name, payload, request=None):
    token = settings.TIKTOK_ACCESS_TOKEN
    if not token:
        logger.warning('TikTok access token not configured')
        return None

    pixel_code = settings.TIKTOK_PIXEL_CODE

    context = {
        'user_agent': request.META.get('HTTP_USER_AGENT', '') if request else '',
        'ip': request.META.get('REMOTE_ADDR', '') if request else '',
        'page': {
            'url': request.build_absolute_uri() if request else '',
        },
    }

    if request and request.user.is_authenticated:
        user = request.user
        context['user'] = {
            'email': _hash(user.email),
            'phone': _hash(getattr(user, 'phone', '')),
            'external_id': _hash(str(user.id)),
        }

    data = {
        'pixel_code': pixel_code,
        'event': event_name,
        'event_id': payload.get('event_id', ''),
        'timestamp': payload.get('timestamp', ''),
        'context': context,
        'properties': payload.get('properties', {}),
    }

    test_code = settings.TIKTOK_TEST_EVENT_CODE
    if test_code:
        data['test_event_code'] = test_code

    headers = {
        'Access-Token': token,
        'Content-Type': 'application/json',
    }

    try:
        resp = requests.post(TIKTOK_API_URL, json=data, headers=headers, timeout=10)
        resp.raise_for_status()
        result = resp.json()
        logger.info(f'TikTok event {event_name} sent: {result}')
        return result
    except requests.RequestException as e:
        logger.error(f'TikTok API error: {e}')
        return None
