from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from core.mongodb import get_collection
import datetime

class GatewaySearchView(APIView):
    """
    Public gateway search view for origins/destinations.
    Queries MongoDB 'ports' and 'airports' collections with fuzzy matching.
    Falls back to built-in seed dataset if database is offline.
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        q = request.query_params.get('q', '').lower().strip()
        mode = request.query_params.get('mode', 'OCEAN').upper()
        results = []

        try:
            if mode in ['AIR', 'AIR_EXPRESS', 'EXPRESS_AIR']:
                col = get_collection('airports')
                if col is not None and col.count_documents({}) > 0:
                    query = {'active': True}
                    if q:
                        query['$or'] = [
                            {'iata': {'$regex': q, '$options': 'i'}},
                            {'name': {'$regex': q, '$options': 'i'}},
                            {'city': {'$regex': q, '$options': 'i'}},
                            {'country': {'$regex': q, '$options': 'i'}}
                        ]
                    cursor = col.find(query).limit(15)
                    for item in cursor:
                        results.append({
                            'code': item.get('iata', ''),
                            'name': f"{item.get('name', '')} ({item.get('iata', '')})",
                            'city': item.get('city', ''),
                            'country': item.get('country', ''),
                            'countryCode': item.get('country', ''),
                            'type': 'AIRPORT',
                            'lat': item.get('lat', 0),
                            'lon': item.get('lon', 0),
                            'modes': ['AIR', 'EXPRESS_AIR']
                        })
            else: # OCEAN / ROAD / MULTIMODAL
                col = get_collection('ports')
                if col is not None and col.count_documents({}) > 0:
                    query = {'active': True}
                    if q:
                        query['$or'] = [
                            {'locode': {'$regex': q, '$options': 'i'}},
                            {'name': {'$regex': q, '$options': 'i'}},
                            {'city': {'$regex': q, '$options': 'i'}},
                            {'country': {'$regex': q, '$options': 'i'}}
                        ]
                    cursor = col.find(query).limit(15)
                    for item in cursor:
                        results.append({
                            'code': item.get('locode', ''),
                            'name': item.get('name', ''),
                            'city': item.get('city', ''),
                            'country': item.get('country', ''),
                            'countryCode': item.get('country', ''),
                            'type': 'PORT',
                            'lat': item.get('lat', 0),
                            'lon': item.get('lon', 0),
                            'modes': ['OCEAN']
                        })
        except Exception:
            pass

        # Fallback to seed dataset if no results or DB offline
        if not results:
            from .seed_master import PORTS, AIRPORTS
            if mode in ['AIR', 'AIR_EXPRESS', 'EXPRESS_AIR']:
                for a in AIRPORTS:
                    matches = (not q) or (q in a['iata'].lower() or q in a['name'].lower() or q in a['city'].lower() or q in a['country'].lower())
                    if matches and a.get('active', True):
                        results.append({
                            'code': a['iata'],
                            'name': f"{a['name']} ({a['iata']})",
                            'city': a['city'],
                            'country': a['country'],
                            'countryCode': a['country'],
                            'type': 'AIRPORT',
                            'lat': a['lat'],
                            'lon': a['lon'],
                            'modes': ['AIR', 'EXPRESS_AIR']
                        })
            else:
                for p in PORTS:
                    matches = (not q) or (q in p['locode'].lower() or q in p['name'].lower() or q in p['city'].lower() or q in p['country'].lower())
                    if matches and p.get('active', True):
                        results.append({
                            'code': p['locode'],
                            'name': p['name'],
                            'city': p['city'],
                            'country': p['country'],
                            'countryCode': p['country'],
                            'type': 'PORT',
                            'lat': p['lat'],
                            'lon': p['lon'],
                            'modes': ['OCEAN']
                        })

        return Response(results[:20])


class ContainerTypesView(APIView):
    """
    Returns available container specifications.
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        try:
            col = get_collection('container_types')
            if col is not None and col.count_documents({}) > 0:
                cursor = col.find({'active': True})
                items = []
                for doc in cursor:
                    doc.pop('_id', None)
                    items.append(doc)
                if items:
                    return Response(items)
        except Exception:
            pass

        from .seed_master import CONTAINER_TYPES
        return Response(CONTAINER_TYPES)


class ContactView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        payload = request.data or {}
        payload['created_at'] = datetime.datetime.now(datetime.timezone.utc).isoformat()
        try:
            col = get_collection('contact_messages')
            if col is not None:
                col.insert_one(payload)
        except Exception:
            pass
        return Response({'ok': True, 'message': 'Message received successfully'}, status=status.HTTP_201_CREATED)
