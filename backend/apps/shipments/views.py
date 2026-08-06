import uuid
from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response

SEED_SHIPMENTS = [
  {
    'tn': 'PORT-58213-IN',
    'from': 'Mumbai, IN',
    'to': 'Dubai, AE',
    'service': 'Ocean Freight',
    'status': 'In Transit',
    'weight': 18400,
    'cost': 384500,
    'date': '2026-07-14',
    'steps': [
      { 'label': 'Booked', 'loc': 'Mumbai, IN', 'ts': 'Jul 14, 09:02', 'done': True },
      { 'label': 'Picked up', 'loc': 'JNPT Port, Mumbai', 'ts': 'Jul 15, 14:20', 'done': True },
      { 'label': 'Departed origin port', 'loc': 'Mumbai, IN', 'ts': 'Jul 16, 22:10', 'done': True },
      { 'label': 'In transit — ocean', 'loc': 'Arabian Sea', 'ts': 'Jul 20, 06:00', 'done': True, 'current': True },
      { 'label': 'Customs clearance', 'loc': 'Dubai, AE', 'ts': 'Est. Aug 01', 'done': False },
      { 'label': 'Out for delivery', 'loc': 'Dubai, AE', 'ts': 'Est. Aug 02', 'done': False },
      { 'label': 'Delivered', 'loc': 'Dubai, AE', 'ts': 'Est. Aug 03', 'done': False },
    ],
  },
  {
    'tn': 'PORT-77410-IN',
    'from': 'Bengaluru, IN',
    'to': 'Singapore, SG',
    'service': 'Air Freight',
    'status': 'Delivered',
    'weight': 84,
    'cost': 48200,
    'date': '2026-06-30',
    'steps': [
      { 'label': 'Booked', 'loc': 'Bengaluru, IN', 'ts': 'Jun 30, 08:11', 'done': True },
      { 'label': 'Picked up', 'loc': 'Kempegowda Intl Cargo', 'ts': 'Jun 30, 15:40', 'done': True },
      { 'label': 'Delivered', 'loc': 'Singapore, SG', 'ts': 'Jul 02, 13:47', 'done': True, 'current': True },
    ],
  }
]

class ShipmentListCreateView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        return Response(SEED_SHIPMENTS)

    def post(self, request):
        payload = request.data
        return Response({
            'shipment_id': f"SHP-{uuid.uuid4().hex[:8].upper()}",
            'reference': payload.get('reference', 'PORT-REQ-2026'),
            'status': 'DRAFT_CREATED',
            'data': payload
        }, status=status.HTTP_201_CREATED)

class TrackingDetailView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, tracking_number):
        tn = tracking_number.strip().upper()
        found = next((s for s in SEED_SHIPMENTS if s['tn'].upper() == tn), None)
        if found:
            return Response(found)
        return Response({'detail': f'Shipment {tracking_number} not found'}, status=status.HTTP_404_NOT_FOUND)

class GenerateQuoteView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, shipment_id):
        run_id = f"RUN-{uuid.uuid4().hex[:8].upper()}"
        return Response({
            'run_id': run_id,
            'shipment_id': shipment_id,
            'status': 'ACCEPTED',
            'message': 'Async Route Agent optimization job started'
        }, status=status.HTTP_202_ACCEPTED)

class AgentRunStatusView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, run_id):
        return Response({
            'run_id': run_id,
            'status': 'COMPLETED',
            'progress': 100,
            'quote_id': 'QT-2026-00934',
            'agent_logs': [
                'Gateway resolved: INNSA -> AEJEA',
                'Route Agent found 3 carrier services',
                'Transit & Cost score calculated'
            ]
        }, status=status.HTTP_200_OK)
