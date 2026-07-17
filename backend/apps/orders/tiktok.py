import time
import json
import hashlib
import logging
import requests
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

    event_id = payload.get('event_id', '') or f'{event_name}_{int(time.time() * 1000)}_{id(payload)}'
    properties = payload.get('properties', {})

    context = {
        'user': {},
        'page': {},
    }

    if request:
        context['user_agent'] = request.META.get('HTTP_USER_AGENT', '')
        context['ip'] = request.META.get('REMOTE_ADDR', '')
        try:
            context['page']['url'] = request.build_absolute_uri()
        except Exception:
            pass

        if request.user.is_authenticated:
            user_data = {}
            if request.user.email:
                user_data['email'] = _hash(request.user.email)
            phone = getattr(request.user, 'phone', '') or ''
            if phone:
                user_data['phone'] = _hash(phone)
            if request.user.pk:
                user_data['external_id'] = _hash(str(request.user.pk))
            context['user'] = user_data

    data = {
        'pixel_code': settings.TIKTOK_PIXEL_CODE,
        'event': event_name,
        'event_id': event_id,
        'event_time': int(time.time()),
        'action_source': 'web',
        'context': context,
        'properties': properties,
    }

    test_code = settings.TIKTOK_TEST_EVENT_CODE
    if test_code:
        data['test_event_code'] = test_code

    headers = {
        'Access-Token': token,
        'Content-Type': 'application/json',
    }

    logger.info(f'TikTok payload: {json.dumps(data, indent=2)}')

    try:
        resp = requests.post(TIKTOK_API_URL, json=data, headers=headers, timeout=10)
        status = resp.status_code
        try:
            result = resp.json()
        except Exception:
            result = resp.text

        logger.info(f'TikTok response [{status}]: {json.dumps(result, indent=2) if isinstance(result, dict) else result}')

        return {'status_code': status, 'response': result}
    except requests.RequestException as e:
        logger.error(f'TikTok API error: {e}')
        return None
